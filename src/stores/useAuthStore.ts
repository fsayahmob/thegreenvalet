"use client";

import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserRole } from "@/lib/types";

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
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle setting user + role
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
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
      // Page will redirect to Google, then back — onAuthStateChanged handles the rest
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur de connexion Google";
      set({
        loading: false,
        error: "Erreur de connexion Google. Réessayez.",
      });
      console.error("[auth] signInWithGoogle error:", message);
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, role: null, displayName: null });
    } catch {
      set({ error: "Erreur lors de la déconnexion" });
    }
  },

  clearError: () => set({ error: null }),

  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch role from Firestore /users/{uid}
        // Cloud Function onUserCreate may not have run yet — retry once
        const fetchRole = async (
          attempt: number,
        ): Promise<{ role: UserRole | null; displayName: string | null }> => {
          try {
            console.log(`[auth] fetchRole attempt=${attempt} uid=${firebaseUser.uid}`);
            await firebaseUser.getIdToken();
            console.log("[auth] getIdToken OK");
            const userDoc = await getDoc(
              doc(db, "users", firebaseUser.uid),
            );
            const data = userDoc.data();
            console.log("[auth] userDoc exists:", userDoc.exists(), "data:", JSON.stringify(data));
            if (!data && attempt < 2) {
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
            console.error("[auth] fetchRole error:", err);
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
        console.log("[auth] final role:", result.role, "displayName:", result.displayName);
        set({
          user: firebaseUser,
          role: result.role,
          displayName: result.displayName,
          loading: false,
          error: null,
        });
      } else {
        set({
          user: null,
          role: null,
          displayName: null,
          loading: false,
        });
      }
    });
    return unsubscribe;
  },
}));
