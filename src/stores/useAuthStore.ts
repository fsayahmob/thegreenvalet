"use client";

import { create } from "zustand";
import {
  signInWithEmailAndPassword,
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
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const data = userDoc.data();
          set({
            user: firebaseUser,
            role: (data?.role as UserRole) ?? null,
            displayName:
              data?.displayName ?? firebaseUser.displayName ?? firebaseUser.email,
            loading: false,
            error: null,
          });
        } catch {
          // User doc might not exist yet — default to null role
          set({
            user: firebaseUser,
            role: null,
            displayName: firebaseUser.displayName ?? firebaseUser.email,
            loading: false,
          });
        }
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
