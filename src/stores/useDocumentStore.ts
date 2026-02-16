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
  where,
  type Unsubscribe,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  type UploadTask,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/config";
import type { AppDocument, DocumentStatus, EntityType } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────

function ts(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date();
}

function tsOrNull(val: unknown): Date | null {
  if (!val) return null;
  return ts(val);
}

function docToAppDocument(id: string, d: Record<string, unknown>): AppDocument {
  return {
    id,
    entityType: (d.entityType as EntityType) ?? "partner",
    entityId: (d.entityId as string) ?? "",
    type: (d.type as string) ?? "",
    fileName: (d.fileName as string) ?? "",
    fileUrl: (d.fileUrl as string) ?? "",
    status: (d.status as DocumentStatus) ?? "uploaded",
    expiresAt: tsOrNull(d.expiresAt),
    validatedBy: (d.validatedBy as string) ?? null,
    validatedAt: tsOrNull(d.validatedAt),
    rejectionReason: (d.rejectionReason as string) ?? null,
    yousignRequestId: d.yousignRequestId as string | undefined,
    createdAt: ts(d.createdAt),
    updatedAt: ts(d.updatedAt),
  };
}

// ─── Store ────────────────────────────────────────────

interface DocumentFilters {
  entityType?: EntityType;
  entityId?: string;
  status?: DocumentStatus;
  docType?: string;
}

interface UploadProgress {
  docId: string;
  progress: number; // 0-100
  task: UploadTask;
}

interface DocumentState {
  documents: AppDocument[];
  loading: boolean;
  error: string | null;
  filters: DocumentFilters;
  uploads: UploadProgress[];
  _unsubscribe: Unsubscribe | null;

  subscribe: (entityType?: EntityType, entityId?: string) => Unsubscribe;
  uploadDocument: (
    file: File,
    entityType: EntityType,
    entityId: string,
    docType: string,
    expiresAt?: Date,
  ) => Promise<string>;
  approveDocument: (id: string, validatedBy: string) => Promise<void>;
  rejectDocument: (id: string, reason: string) => Promise<void>;
  setFilters: (filters: DocumentFilters) => void;
  clearError: () => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  loading: true,
  error: null,
  filters: {},
  uploads: [],
  _unsubscribe: null,

  subscribe: (entityType, entityId) => {
    const existing = get()._unsubscribe;
    if (existing) return existing;

    set({ loading: true });
    let q = query(collection(db, COLLECTIONS.DOCUMENTS), orderBy("createdAt", "desc"));
    if (entityType && entityId) {
      q = query(
        collection(db, COLLECTIONS.DOCUMENTS),
        where("entityType", "==", entityType),
        where("entityId", "==", entityId),
        orderBy("createdAt", "desc"),
      );
    }

    const unsubscribe = onSnapshot(q,
      (snap) => set({
        documents: snap.docs.map((d) => docToAppDocument(d.id, d.data() as Record<string, unknown>)),
        loading: false,
        error: null,
      }),
      (err) => set({ loading: false, error: err.message }),
    );

    const wrappedUnsub = () => { unsubscribe(); set({ _unsubscribe: null }); };
    set({ _unsubscribe: wrappedUnsub });
    return wrappedUnsub;
  },

  uploadDocument: async (file, entityType, entityId, docType, expiresAt) => {
    try {
      set({ error: null });

      // 1. Create Firestore metadata first
      const docRef = await addDoc(collection(db, COLLECTIONS.DOCUMENTS), {
        entityType,
        entityId,
        type: docType,
        fileName: file.name,
        fileUrl: "", // Will be updated after upload
        status: "uploaded",
        expiresAt: expiresAt ? Timestamp.fromDate(expiresAt) : null,
        validatedBy: null,
        validatedAt: null,
        rejectionReason: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 2. Upload file to Storage
      const storagePath = `documents/${entityType}/${entityId}/${docRef.id}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Track upload progress
      const uploadEntry: UploadProgress = { docId: docRef.id, progress: 0, task: uploadTask };
      set({ uploads: [...get().uploads, uploadEntry] });

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            set({
              uploads: get().uploads.map((u) =>
                u.docId === docRef.id ? { ...u, progress } : u,
              ),
            });
          },
          (err) => {
            set({
              uploads: get().uploads.filter((u) => u.docId !== docRef.id),
              error: err.message,
            });
            reject(err);
          },
          async () => {
            // Upload complete — get URL and update Firestore
            const fileUrl = await getDownloadURL(storageRef);
            await updateDoc(doc(db, COLLECTIONS.DOCUMENTS, docRef.id), {
              fileUrl,
              updatedAt: serverTimestamp(),
            });
            set({ uploads: get().uploads.filter((u) => u.docId !== docRef.id) });
            resolve(docRef.id);
          },
        );
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur upload document";
      set({ error: msg });
      throw err;
    }
  },

  approveDocument: async (id, validatedBy) => {
    try {
      set({ error: null });
      await updateDoc(doc(db, COLLECTIONS.DOCUMENTS, id), {
        status: "approved",
        validatedBy,
        validatedAt: serverTimestamp(),
        rejectionReason: null,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erreur approbation" });
      throw err;
    }
  },

  rejectDocument: async (id, reason) => {
    try {
      set({ error: null });
      await updateDoc(doc(db, COLLECTIONS.DOCUMENTS, id), {
        status: "rejected",
        rejectionReason: reason,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erreur rejet" });
      throw err;
    }
  },

  setFilters: (filters) => set({ filters }),
  clearError: () => set({ error: null }),
}));

// ─── Selectors ────────────────────────────────────────

export function useFilteredDocuments() {
  return useDocumentStore((s) => {
    const { documents, filters } = s;
    return documents.filter((doc) => {
      if (filters.entityType && doc.entityType !== filters.entityType) return false;
      if (filters.entityId && doc.entityId !== filters.entityId) return false;
      if (filters.status && doc.status !== filters.status) return false;
      if (filters.docType && doc.type !== filters.docType) return false;
      return true;
    });
  });
}

export function usePendingReviewCount() {
  return useDocumentStore((s) =>
    s.documents.filter((d) => d.status === "uploaded").length,
  );
}

export function useExpiringDocuments(daysAhead = 30) {
  return useDocumentStore((s) => {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + daysAhead);
    return s.documents.filter(
      (d) => d.status === "approved" && d.expiresAt && d.expiresAt <= threshold,
    );
  });
}
