"use client";

import { useMemo } from "react";
import { create } from "zustand";
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/config";
import type { YousignRequest, YousignStatus, EntityType } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────

function ts(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date();
}

function tsOrUndef(val: unknown): Date | undefined {
  if (!val) return undefined;
  return ts(val);
}

function docToYousignRequest(id: string, d: Record<string, unknown>): YousignRequest {
  return {
    id,
    entityType: (d.entityType as EntityType) ?? "partner",
    entityId: (d.entityId as string) ?? "",
    templateId: (d.templateId as string) ?? "",
    templateVersion: (d.templateVersion as number) ?? 1,
    yousignRequestId: (d.yousignRequestId as string) ?? "",
    yousignStatus: (d.yousignStatus as YousignStatus) ?? "draft",
    signerEmails: (d.signerEmails as string[]) ?? [],
    activatedAt: tsOrUndef(d.activatedAt),
    completedAt: tsOrUndef(d.completedAt),
    signedDocumentUrl: d.signedDocumentUrl as string | undefined,
    signedDocumentId: d.signedDocumentId as string | undefined,
    createdBy: (d.createdBy as string) ?? "",
    createdAt: ts(d.createdAt),
    updatedAt: ts(d.updatedAt),
  };
}

// ─── Store ────────────────────────────────────────────

interface YousignState {
  requests: YousignRequest[];
  loading: boolean;
  error: string | null;
  sending: boolean;
  _unsubscribe: Unsubscribe | null;

  subscribe: (entityType?: EntityType, entityId?: string) => Unsubscribe;
  sendToSignature: (
    documentId: string,
    entityType: EntityType,
    entityId: string,
    signers: Array<{ firstName: string; lastName: string; email: string }>,
  ) => Promise<string>;
  clearError: () => void;
}

export const useYousignStore = create<YousignState>((set, get) => ({
  requests: [],
  loading: true,
  error: null,
  sending: false,
  _unsubscribe: null,

  subscribe: (entityType, entityId) => {
    const existing = get()._unsubscribe;
    if (existing) return existing;

    set({ loading: true });
    let q = query(
      collection(db, COLLECTIONS.YOUSIGN_REQUESTS),
      orderBy("createdAt", "desc"),
    );
    if (entityType && entityId) {
      q = query(
        collection(db, COLLECTIONS.YOUSIGN_REQUESTS),
        where("entityType", "==", entityType),
        where("entityId", "==", entityId),
        orderBy("createdAt", "desc"),
      );
    }

    const unsubscribe = onSnapshot(q,
      (snap) => set({
        requests: snap.docs.map((d) =>
          docToYousignRequest(d.id, d.data() as Record<string, unknown>),
        ),
        loading: false,
        error: null,
      }),
      (err) => set({ loading: false, error: err.message }),
    );

    const wrappedUnsub = () => { unsubscribe(); set({ _unsubscribe: null }); };
    set({ _unsubscribe: wrappedUnsub });
    return wrappedUnsub;
  },

  sendToSignature: async (documentId, entityType, entityId, signers) => {
    set({ sending: true, error: null });
    try {
      const callable = httpsCallable<
        { documentId: string; entityType: string; entityId: string; signers: typeof signers },
        { success: boolean; yousignRequestId: string }
      >(functions, "sendToYousign");

      const result = await callable({ documentId, entityType, entityId, signers });
      set({ sending: false });
      return result.data.yousignRequestId;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur envoi signature";
      set({ sending: false, error: msg });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

// ─── Selectors ────────────────────────────────────────

export function useEntityYousignRequests(entityType: EntityType, entityId: string) {
  const requests = useYousignStore((s) => s.requests);
  return useMemo(
    () => requests.filter((r) => r.entityType === entityType && r.entityId === entityId),
    [requests, entityType, entityId],
  );
}

export function useDocumentYousignRequest(yousignRequestId: string | undefined) {
  const requests = useYousignStore((s) => s.requests);
  return useMemo(
    () => yousignRequestId ? requests.find((r) => r.yousignRequestId === yousignRequestId) : undefined,
    [requests, yousignRequestId],
  );
}
