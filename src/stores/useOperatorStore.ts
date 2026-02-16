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
import { COLLECTIONS, OPERATOR_STATUS_TRANSITIONS } from "@/lib/config";
import type { Operator, OperatorStatus, PipelineProgress } from "@/lib/types";
import { OPERATOR_PIPELINE } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────

function ts(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date();
}

function docToOperator(id: string, d: Record<string, unknown>): Operator {
  return {
    id,
    userId: (d.userId as string) ?? "",
    firstName: (d.firstName as string) ?? "",
    lastName: (d.lastName as string) ?? "",
    siret: (d.siret as string) ?? "",
    email: (d.email as string) ?? "",
    phone: (d.phone as string) ?? "",
    status: (d.status as OperatorStatus) ?? "prospect",
    currentStageKey: (d.currentStageKey as string) ?? "pre_qualification",
    pipelineProgress: (d.pipelineProgress as PipelineProgress[]) ?? [],
    assignedSites: (d.assignedSites as string[]) ?? [],
    leadId: d.leadId as string | undefined,
    createdAt: ts(d.createdAt),
    updatedAt: ts(d.updatedAt),
  };
}

/** Build initial pipeline progress from OPERATOR_PIPELINE */
export function initOperatorPipeline(): PipelineProgress[] {
  return OPERATOR_PIPELINE.map((stage, idx) => ({
    stageKey: stage.key,
    status: idx === 0 ? "in_progress" : "locked",
    ...(idx === 0 ? { startedAt: new Date() } : {}),
  }));
}

// ─── Store ────────────────────────────────────────────

interface OperatorState {
  operators: Operator[];
  loading: boolean;
  error: string | null;
  _unsubscribe: Unsubscribe | null;

  subscribe: () => Unsubscribe;
  createOperator: (data: Omit<Operator, "id" | "createdAt" | "updatedAt" | "pipelineProgress" | "currentStageKey" | "assignedSites">) => Promise<string>;
  updateOperator: (id: string, data: Partial<Operator>) => Promise<void>;
  updateStatus: (id: string, status: OperatorStatus) => Promise<void>;
  advanceStage: (id: string, stageKey: string, notes?: string) => Promise<void>;
  assignSite: (id: string, siteId: string) => Promise<void>;
  unassignSite: (id: string, siteId: string) => Promise<void>;
  clearError: () => void;
}

export const useOperatorStore = create<OperatorState>((set, get) => ({
  operators: [],
  loading: true,
  error: null,
  _unsubscribe: null,

  subscribe: () => {
    const existing = get()._unsubscribe;
    if (existing) return existing;

    set({ loading: true });
    const q = query(collection(db, COLLECTIONS.OPERATORS), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q,
      (snap) => set({ operators: snap.docs.map((d) => docToOperator(d.id, d.data() as Record<string, unknown>)), loading: false, error: null }),
      (err) => set({ loading: false, error: err.message }),
    );

    const wrappedUnsub = () => { unsubscribe(); set({ _unsubscribe: null }); };
    set({ _unsubscribe: wrappedUnsub });
    return wrappedUnsub;
  },

  createOperator: async (data) => {
    try {
      set({ error: null });
      const pipeline = initOperatorPipeline();
      const ref = await addDoc(collection(db, COLLECTIONS.OPERATORS), {
        ...data,
        currentStageKey: "pre_qualification",
        pipelineProgress: pipeline,
        assignedSites: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return ref.id;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur création opérateur";
      set({ error: msg });
      throw err;
    }
  },

  updateOperator: async (id, data) => {
    try {
      set({ error: null });
      const { id: _, createdAt: __, ...rest } = data as Record<string, unknown>;
      await updateDoc(doc(db, COLLECTIONS.OPERATORS, id), { ...rest, updatedAt: serverTimestamp() });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erreur mise à jour" });
      throw err;
    }
  },

  updateStatus: async (id, status) => {
    const operator = get().operators.find((o) => o.id === id);
    if (operator) {
      const allowed = OPERATOR_STATUS_TRANSITIONS[operator.status] ?? [];
      if (!allowed.includes(status)) {
        const msg = `Transition invalide : ${operator.status} → ${status}`;
        set({ error: msg });
        throw new Error(msg);
      }
    }
    await get().updateOperator(id, { status } as Partial<Operator>);
  },

  advanceStage: async (id, stageKey, notes) => {
    const operator = get().operators.find((o) => o.id === id);
    if (!operator) return;

    const updated = operator.pipelineProgress.map((p) => {
      if (p.stageKey === stageKey) {
        return { ...p, status: "completed" as const, completedAt: new Date(), notes };
      }
      return p;
    });

    // Unlock next stage
    const completedStage = OPERATOR_PIPELINE.find((s) => s.key === stageKey);
    if (completedStage) {
      const nextStages = OPERATOR_PIPELINE.filter((s) => s.order === completedStage.order + 1);
      for (const next of nextStages) {
        const prog = updated.find((p) => p.stageKey === next.key);
        if (prog && prog.status === "locked") {
          prog.status = "in_progress";
          prog.startedAt = new Date();
        }
      }
    }

    const firstInProgress = updated.find((p) => p.status === "in_progress");
    const newStageKey = firstInProgress?.stageKey ?? stageKey;

    await get().updateOperator(id, { pipelineProgress: updated, currentStageKey: newStageKey } as Partial<Operator>);
  },

  assignSite: async (id, siteId) => {
    const operator = get().operators.find((o) => o.id === id);
    if (!operator) return;
    const sites = [...new Set([...operator.assignedSites, siteId])];
    await get().updateOperator(id, { assignedSites: sites } as Partial<Operator>);
  },

  unassignSite: async (id, siteId) => {
    const operator = get().operators.find((o) => o.id === id);
    if (!operator) return;
    const sites = operator.assignedSites.filter((s) => s !== siteId);
    await get().updateOperator(id, { assignedSites: sites } as Partial<Operator>);
  },

  clearError: () => set({ error: null }),
}));
