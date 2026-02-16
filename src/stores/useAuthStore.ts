"use client";

import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import type { UserRole } from "@/lib/types";

// Debug logger that persists across page reloads (signInWithRedirect clears console)
function authLog(message: string, data?: unknown) {
  const entry = `[${new Date().toISOString()}] ${message}${data !== undefined ? " " + JSON.stringify(data) : ""}`;
  console.log("[auth]", message, data ?? "");
  try {
    const prev = localStorage.getItem("__auth_debug") ?? "";
    const lines = prev.split("\n").slice(-30); // keep last 30 lines
    lines.push(entry);
    localStorage.setItem("__auth_debug", lines.join("\n"));
  } catch {
    // localStorage unavailable (SSR)
  }
}

interface AuthState {
  user: User | null;
  role: UserRole | null;
  displayName: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  initAuth: () => () => void; // returns unsubscribe fn
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  displayName: null,
  loading: true,
  error: null,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur de connexion";
      set({
        loading: false,
        error: message.includes("invalid-credential")
          ? "Email ou mot de passe incorrect"
          : message.includes("too-many-requests")
            ? "Trop de tentatives. Réessayez plus tard."
            : "Erreur de connexion. Vérifiez vos identifiants.",
      });
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      authLog("signInWithGoogle: starting popup");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(getFirebaseAuth(), provider);
      authLog("signInWithGoogle: popup success", result.user.email);
      // onAuthStateChanged will handle setting user + role
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur de connexion Google";
      set({
        loading: false,
        error: "Erreur de connexion Google. Réessayez.",
      });
      authLog("signInWithGoogle error", message);
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(getFirebaseAuth());
      set({ user: null, role: null, displayName: null });
    } catch {
      set({ error: "Erreur lors de la déconnexion" });
    }
  },

  clearError: () => set({ error: null }),

  initAuth: () => {
    authLog("initAuth: subscribing to onAuthStateChanged");
    const unsubscribe = onAuthStateChanged(
      getFirebaseAuth(),
      async (firebaseUser) => {
        if (firebaseUser) {
          authLog("onAuthStateChanged: user present", {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          });

          const fetchRole = async (
            attempt: number,
          ): Promise<{
            role: UserRole | null;
            displayName: string | null;
          }> => {
            try {
              authLog(`fetchRole attempt=${attempt}`, firebaseUser.uid);
              const token = await firebaseUser.getIdToken(true);
              authLog("getIdToken OK", { tokenLength: token.length });

              const firestore = getFirebaseDb();
              authLog("getFirebaseDb OK", { type: typeof firestore });

              const docRef = doc(firestore, "users", firebaseUser.uid);
              authLog("doc ref created", docRef.path);

              const userDoc = await getDoc(docRef);
              authLog("getDoc completed", {
                exists: userDoc.exists(),
                data: userDoc.data(),
              });

              const data = userDoc.data();
              if (!data && attempt < 2) {
                authLog("no data, retrying in 2s");
                await new Promise((r) => setTimeout(r, 2000));
                return fetchRole(attempt + 1);
              }
              return {
                role: (data?.role as UserRole) ?? null,
                displayName:
                  data?.displayName ??
                  firebaseUser.displayName ??
                  firebaseUser.email,
              };
            } catch (err) {
              const errMsg =
                err instanceof Error
                  ? `${err.message} | ${err.stack}`
                  : String(err);
              authLog(`fetchRole ERROR attempt=${attempt}`, errMsg);
              if (attempt < 2) {
                await new Promise((r) => setTimeout(r, 2000));
                return fetchRole(attempt + 1);
              }
              return {
                role: null,
                displayName:
                  firebaseUser.displayName ?? firebaseUser.email,
              };
            }
          };

          const result = await fetchRole(0);
          authLog("final result", result);
          set({
            user: firebaseUser,
            role: result.role,
            displayName: result.displayName,
            loading: false,
            error: null,
          });
        } else {
          authLog("onAuthStateChanged: no user (signed out)");
          set({
            user: null,
            role: null,
            displayName: null,
            loading: false,
          });
        }
      },
    );
    return unsubscribe;
  },
}));
