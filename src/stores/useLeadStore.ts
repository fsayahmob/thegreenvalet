"use client";

import { useMemo } from "react";
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
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS, SLA, LEAD_TRANSITIONS } from "@/lib/config";
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
  _unsubscribe: Unsubscribe | null;

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

// SLA deadlines: 24h for golf partners, 48h for operators
function computeSlaDeadline(type: LeadType): Date {
  const deadline = new Date();
  deadline.setHours(deadline.getHours() + (type === "partner" ? SLA.PARTNER_HOURS : SLA.OPERATOR_HOURS));
  return deadline;
}

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  loading: true,
  error: null,
  filters: {},
  _unsubscribe: null,

  subscribe: () => {
    // Guard: prevent duplicate listeners
    const existing = get()._unsubscribe;
    if (existing) return existing;

    set({ loading: true });
    const q = query(
      collection(db, COLLECTIONS.LEADS),
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

    const wrappedUnsub = () => {
      unsubscribe();
      set({ _unsubscribe: null });
    };
    set({ _unsubscribe: wrappedUnsub });
    return wrappedUnsub;
  },

  createLead: async (data) => {
    try {
      set({ error: null });
      const slaDeadline = computeSlaDeadline(data.type);
      const ref = await addDoc(collection(db, COLLECTIONS.LEADS), {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, createdAt: _ca, ...rest } = data as Record<string, unknown>;
      await updateDoc(doc(db, COLLECTIONS.LEADS, id), {
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
      await deleteDoc(doc(db, COLLECTIONS.LEADS, id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression";
      set({ error: message });
      throw err;
    }
  },

  updateStatus: async (id, status, notes) => {
    // Validate transition — require entity to be loaded
    const lead = get().leads.find((l) => l.id === id);
    if (!lead) {
      const msg = "Lead introuvable — impossible de valider la transition.";
      set({ error: msg });
      throw new Error(msg);
    }
    const allowed = LEAD_TRANSITIONS[lead.status] ?? [];
    if (!allowed.includes(status)) {
      const msg = `Transition invalide : ${lead.status} → ${status}`;
      set({ error: msg });
      throw new Error(msg);
    }

    const updates: Record<string, unknown> = { status, updatedAt: serverTimestamp() };
    if (status === "qualified" && notes) {
      updates.qualificationNotes = notes;
      updates.qualificationDate = serverTimestamp();
    }
    try {
      set({ error: null });
      await updateDoc(doc(db, COLLECTIONS.LEADS, id), updates);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors du changement de statut";
      set({ error: message });
      throw err;
    }
  },

  convertLead: async (id, entityId) => {
    try {
      set({ error: null });
      await updateDoc(doc(db, COLLECTIONS.LEADS, id), {
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
      await updateDoc(doc(db, COLLECTIONS.LEADS, id), {
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
  const leads = useLeadStore((s) => s.leads);
  const filters = useLeadStore((s) => s.filters);
  return useMemo(() =>
    leads.filter((lead) => {
      if (filters.type && lead.type !== filters.type) return false;
      if (filters.status && lead.status !== filters.status) return false;
      return true;
    }),
  [leads, filters]);
}

export function useBreachedLeads() {
  const leads = useLeadStore((s) => s.leads);
  return useMemo(
    () => leads.filter((lead) => lead.slaBreached && lead.status === "new"),
    [leads],
  );
}

export function useLeadCounts() {
  const leads = useLeadStore((s) => s.leads);
  return useMemo(() => ({
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    converted: leads.filter((l) => l.status === "converted").length,
    rejected: leads.filter((l) => l.status === "rejected").length,
    breached: leads.filter((l) => l.slaBreached && l.status === "new").length,
  }), [leads]);
}
