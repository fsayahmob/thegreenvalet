"use client";

import { create } from "zustand";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/config";
import type { Site } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────

function ts(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date();
}

function docToSite(id: string, d: Record<string, unknown>): Site {
  return {
    id,
    partnerId: (d.partnerId as string) ?? "",
    name: (d.name as string) ?? "",
    address: (d.address as string) ?? "",
    surfaceM2: d.surfaceM2 as number | undefined,
    assignedOperatorId: (d.assignedOperatorId as string) ?? null,
    isActive: (d.isActive as boolean) ?? false,
    coordinates: d.coordinates as { lat: number; lng: number } | undefined,
    createdAt: ts(d.createdAt),
  };
}

// ─── Store ────────────────────────────────────────────

interface SiteState {
  sites: Site[];
  loading: boolean;
  error: string | null;

  subscribe: () => Unsubscribe;
  createSite: (data: Omit<Site, "id" | "createdAt">) => Promise<string>;
  updateSite: (id: string, data: Partial<Site>) => Promise<void>;
  assignOperator: (siteId: string, operatorId: string | null) => Promise<void>;
  clearError: () => void;
}

export const useSiteStore = create<SiteState>((set, get) => ({
  sites: [],
  loading: true,
  error: null,

  subscribe: () => {
    set({ loading: true });
    const q = query(collection(db, COLLECTIONS.SITES), orderBy("createdAt", "desc"));
    return onSnapshot(q,
      (snap) => set({ sites: snap.docs.map((d) => docToSite(d.id, d.data() as Record<string, unknown>)), loading: false, error: null }),
      (err) => set({ loading: false, error: err.message }),
    );
  },

  createSite: async (data) => {
    try {
      set({ error: null });
      const ref = await addDoc(collection(db, COLLECTIONS.SITES), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return ref.id;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erreur création site" });
      throw err;
    }
  },

  updateSite: async (id, data) => {
    try {
      set({ error: null });
      const { id: _, createdAt: __, ...rest } = data as Record<string, unknown>;
      await updateDoc(doc(db, COLLECTIONS.SITES, id), rest);
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erreur mise à jour site" });
      throw err;
    }
  },

  assignOperator: async (siteId, operatorId) => {
    await get().updateSite(siteId, { assignedOperatorId: operatorId } as Partial<Site>);
  },

  clearError: () => set({ error: null }),
}));
