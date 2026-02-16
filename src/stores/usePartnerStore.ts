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
import { COLLECTIONS, PARTNER_STATUS_TRANSITIONS } from "@/lib/config";
import type { Partner, PartnerStatus, PipelineProgress, GolfEligibility } from "@/lib/types";
import { PARTNER_PIPELINE } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────

function ts(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date();
}

function docToPartner(id: string, d: Record<string, unknown>): Partner {
  return {
    id,
    userId: (d.userId as string) ?? null,
    name: (d.name as string) ?? "",
    siret: (d.siret as string) ?? "",
    address: (d.address as string) ?? "",
    city: (d.city as string) ?? "",
    contactName: (d.contactName as string) ?? "",
    contactEmail: (d.contactEmail as string) ?? "",
    contactPhone: (d.contactPhone as string) ?? "",
    contactRole: (d.contactRole as string) ?? "",
    status: (d.status as PartnerStatus) ?? "prospect",
    currentStageKey: (d.currentStageKey as string) ?? "pre_qualification",
    pipelineProgress: (d.pipelineProgress as PipelineProgress[]) ?? [],
    eligibility: (d.eligibility as GolfEligibility) ?? {
      triphase: null, waterAccess: null, surfaceAvailable: null,
      truckAccess: null, pluCompatible: null, outsideCoastalBand: null,
      abfZone: null, directionApproval: null,
    },
    leadId: d.leadId as string | undefined,
    createdAt: ts(d.createdAt),
    updatedAt: ts(d.updatedAt),
  };
}

/** Build initial pipeline progress from PARTNER_PIPELINE */
export function initPartnerPipeline(): PipelineProgress[] {
  return PARTNER_PIPELINE.map((stage, idx) => ({
    stageKey: stage.key,
    status: idx === 0 ? "in_progress" : "locked",
    ...(idx === 0 ? { startedAt: new Date() } : {}),
  }));
}

// ─── Store ────────────────────────────────────────────

interface PartnerState {
  partners: Partner[];
  loading: boolean;
  error: string | null;
  _unsubscribe: Unsubscribe | null;

  subscribe: () => Unsubscribe;
  createPartner: (data: Omit<Partner, "id" | "createdAt" | "updatedAt" | "pipelineProgress" | "currentStageKey">) => Promise<string>;
  updatePartner: (id: string, data: Partial<Partner>) => Promise<void>;
  updateStatus: (id: string, status: PartnerStatus) => Promise<void>;
  advanceStage: (id: string, stageKey: string, notes?: string) => Promise<void>;
  updateEligibility: (id: string, eligibility: GolfEligibility) => Promise<void>;
  clearError: () => void;
}

export const usePartnerStore = create<PartnerState>((set, get) => ({
  partners: [],
  loading: true,
  error: null,
  _unsubscribe: null,

  subscribe: () => {
    const existing = get()._unsubscribe;
    if (existing) return existing;

    set({ loading: true });
    const q = query(collection(db, COLLECTIONS.PARTNERS), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q,
      (snap) => set({ partners: snap.docs.map((d) => docToPartner(d.id, d.data() as Record<string, unknown>)), loading: false, error: null }),
      (err) => set({ loading: false, error: err.message }),
    );

    const wrappedUnsub = () => { unsubscribe(); set({ _unsubscribe: null }); };
    set({ _unsubscribe: wrappedUnsub });
    return wrappedUnsub;
  },

  createPartner: async (data) => {
    try {
      set({ error: null });
      const pipeline = initPartnerPipeline();
      const ref = await addDoc(collection(db, COLLECTIONS.PARTNERS), {
        ...data,
        currentStageKey: "pre_qualification",
        pipelineProgress: pipeline,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return ref.id;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur création partenaire";
      set({ error: msg });
      throw err;
    }
  },

  updatePartner: async (id, data) => {
    try {
      set({ error: null });
      const { id: _, createdAt: __, ...rest } = data as Record<string, unknown>;
      await updateDoc(doc(db, COLLECTIONS.PARTNERS, id), { ...rest, updatedAt: serverTimestamp() });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erreur mise à jour" });
      throw err;
    }
  },

  updateStatus: async (id, status) => {
    // Validate transition — require entity to be loaded
    const partner = get().partners.find((p) => p.id === id);
    if (!partner) {
      const msg = "Partenaire introuvable — impossible de valider la transition.";
      set({ error: msg });
      throw new Error(msg);
    }
    const allowed = PARTNER_STATUS_TRANSITIONS[partner.status] ?? [];
    if (!allowed.includes(status)) {
      const msg = `Transition invalide : ${partner.status} → ${status}`;
      set({ error: msg });
      throw new Error(msg);
    }
    await get().updatePartner(id, { status } as Partial<Partner>);
  },

  advanceStage: async (id, stageKey, notes) => {
    const partner = get().partners.find((p) => p.id === id);
    if (!partner) return;

    // Prevent stage skip — stage must be in_progress
    const currentProgress = partner.pipelineProgress.find((p) => p.stageKey === stageKey);
    if (!currentProgress || currentProgress.status !== "in_progress") {
      const msg = `Impossible d'avancer l'étape "${stageKey}" — elle n'est pas en cours.`;
      set({ error: msg });
      throw new Error(msg);
    }

    const updated = partner.pipelineProgress.map((p) => {
      if (p.stageKey === stageKey) {
        return { ...p, status: "completed" as const, completedAt: new Date(), notes };
      }
      return p;
    });

    // Unlock next stage(s)
    const completedStage = PARTNER_PIPELINE.find((s) => s.key === stageKey);
    if (completedStage) {
      const nextStages = PARTNER_PIPELINE.filter((s) => s.order === completedStage.order + 1);
      for (const next of nextStages) {
        const prog = updated.find((p) => p.stageKey === next.key);
        if (prog && prog.status === "locked") {
          prog.status = "in_progress";
          prog.startedAt = new Date();
        }
      }
      // Also unlock parallel stages if current allows it
      if (completedStage.canRunParallel) {
        const parallelStages = PARTNER_PIPELINE.filter((s) => s.canRunParallel && s.order > completedStage.order);
        for (const ps of parallelStages) {
          const prog = updated.find((p) => p.stageKey === ps.key);
          if (prog && prog.status === "locked") {
            prog.status = "in_progress";
            prog.startedAt = new Date();
          }
        }
      }
    }

    // Find new current stage
    const firstInProgress = updated.find((p) => p.status === "in_progress");
    const newStageKey = firstInProgress?.stageKey ?? stageKey;

    await get().updatePartner(id, { pipelineProgress: updated, currentStageKey: newStageKey } as Partial<Partner>);
  },

  updateEligibility: async (id, eligibility) => {
    await get().updatePartner(id, { eligibility } as Partial<Partner>);
  },

  clearError: () => set({ error: null }),
}));
