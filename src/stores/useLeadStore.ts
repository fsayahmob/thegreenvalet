"use client";

import { create } from "zustand";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Lead, LeadStatus, LeadType, LeadSource } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────

function timestampToDate(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date();
}

function docToLead(id: string, data: Record<string, unknown>): Lead {
  return {
    id,
    type: data.type as LeadType,
    source: data.source as LeadSource,
    status: data.status as LeadStatus,
    firstName: (data.firstName as string) ?? "",
    lastName: (data.lastName as string) ?? "",
    email: (data.email as string) ?? "",
    phone: (data.phone as string) ?? "",
    city: (data.city as string) ?? "",
    golfName: data.golfName as string | undefined,
    currentStatus: data.currentStatus as string | undefined,
    motivation: data.motivation as string | undefined,
    slaDeadline: timestampToDate(data.slaDeadline),
    slaBreached: (data.slaBreached as boolean) ?? false,
    qualificationNotes: data.qualificationNotes as string | undefined,
    qualificationDate: data.qualificationDate
      ? timestampToDate(data.qualificationDate)
      : undefined,
    qualifiedBy: data.qualifiedBy as string | undefined,
    convertedEntityId: data.convertedEntityId as string | undefined,
    rejectionReason: data.rejectionReason as string | undefined,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
}

// ─── Store ────────────────────────────────────────────

interface LeadFilters {
  type?: LeadType;
  status?: LeadStatus;
}

interface LeadState {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  filters: LeadFilters;

  // Realtime subscription
  subscribe: () => Unsubscribe;

  // CRUD
  createLead: (data: Omit<Lead, "id" | "createdAt" | "updatedAt" | "slaDeadline" | "slaBreached">) => Promise<string>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;

  // Status transitions
  updateStatus: (id: string, status: LeadStatus, notes?: string) => Promise<void>;
  convertLead: (id: string, entityId: string) => Promise<void>;
  rejectLead: (id: string, reason: string) => Promise<void>;

  // Filters
  setFilters: (filters: LeadFilters) => void;
  clearError: () => void;
}

const LEADS_COLLECTION = "leads";

// SLA deadlines: 24h for golf partners, 48h for operators
function computeSlaDeadline(type: LeadType): Date {
  const deadline = new Date();
  deadline.setHours(deadline.getHours() + (type === "partner" ? 24 : 48));
  return deadline;
}

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  loading: true,
  error: null,
  filters: {},

  subscribe: () => {
    set({ loading: true });
    const q = query(
      collection(db, LEADS_COLLECTION),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const leads = snapshot.docs.map((d) =>
          docToLead(d.id, d.data() as Record<string, unknown>),
        );
        set({ leads, loading: false, error: null });
      },
      (err) => {
        set({ loading: false, error: err.message });
      },
    );
    return unsubscribe;
  },

  createLead: async (data) => {
    try {
      set({ error: null });
      const slaDeadline = computeSlaDeadline(data.type);
      const ref = await addDoc(collection(db, LEADS_COLLECTION), {
        ...data,
        slaDeadline: Timestamp.fromDate(slaDeadline),
        slaBreached: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return ref.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la création du lead";
      set({ error: message });
      throw err;
    }
  },

  updateLead: async (id, data) => {
    try {
      set({ error: null });
      const { id: _, createdAt: __, ...rest } = data as Record<string, unknown>;
      await updateDoc(doc(db, LEADS_COLLECTION, id), {
        ...rest,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la mise à jour";
      set({ error: message });
      throw err;
    }
  },

  deleteLead: async (id) => {
    try {
      set({ error: null });
      await deleteDoc(doc(db, LEADS_COLLECTION, id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression";
      set({ error: message });
      throw err;
    }
  },

  updateStatus: async (id, status, notes) => {
    const updates: Record<string, unknown> = { status, updatedAt: serverTimestamp() };
    if (status === "contacted") {
      // First contact — stop SLA clock
    }
    if (status === "qualified" && notes) {
      updates.qualificationNotes = notes;
      updates.qualificationDate = serverTimestamp();
    }
    try {
      set({ error: null });
      await updateDoc(doc(db, LEADS_COLLECTION, id), updates);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors du changement de statut";
      set({ error: message });
      throw err;
    }
  },

  convertLead: async (id, entityId) => {
    try {
      set({ error: null });
      await updateDoc(doc(db, LEADS_COLLECTION, id), {
        status: "converted",
        convertedEntityId: entityId,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la conversion";
      set({ error: message });
      throw err;
    }
  },

  rejectLead: async (id, reason) => {
    try {
      set({ error: null });
      await updateDoc(doc(db, LEADS_COLLECTION, id), {
        status: "rejected",
        rejectionReason: reason,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors du rejet";
      set({ error: message });
      throw err;
    }
  },

  setFilters: (filters) => set({ filters }),
  clearError: () => set({ error: null }),
}));

// ─── Selectors ────────────────────────────────────────

export function useFilteredLeads() {
  return useLeadStore((s) => {
    const { leads, filters } = s;
    return leads.filter((lead) => {
      if (filters.type && lead.type !== filters.type) return false;
      if (filters.status && lead.status !== filters.status) return false;
      return true;
    });
  });
}

export function useBreachedLeads() {
  return useLeadStore((s) =>
    s.leads.filter((lead) => lead.slaBreached && lead.status === "new"),
  );
}

export function useLeadCounts() {
  return useLeadStore((s) => ({
    total: s.leads.length,
    new: s.leads.filter((l) => l.status === "new").length,
    contacted: s.leads.filter((l) => l.status === "contacted").length,
    qualified: s.leads.filter((l) => l.status === "qualified").length,
    converted: s.leads.filter((l) => l.status === "converted").length,
    rejected: s.leads.filter((l) => l.status === "rejected").length,
    breached: s.leads.filter((l) => l.slaBreached && l.status === "new").length,
  }));
}
