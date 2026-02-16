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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/config";
import type { DocumentTemplate, TemplateType, EntityType, MergeFieldDefinition } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────

function ts(val: unknown): Date {
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return new Date();
}

function docToTemplate(id: string, d: Record<string, unknown>): DocumentTemplate {
  return {
    id,
    type: (d.type as TemplateType) ?? "convention",
    name: (d.name as string) ?? "",
    version: (d.version as number) ?? 1,
    description: (d.description as string) ?? "",
    entityType: (d.entityType as EntityType | "all") ?? "all",
    fileUrl: (d.fileUrl as string) ?? "",
    fileName: (d.fileName as string) ?? "",
    mergeFields: (d.mergeFields as MergeFieldDefinition[]) ?? [],
    yousignTemplateId: d.yousignTemplateId as string | undefined,
    signerRoles: d.signerRoles as string[] | undefined,
    isActive: (d.isActive as boolean) ?? true,
    isPublic: (d.isPublic as boolean) ?? false,
    previousVersionId: d.previousVersionId as string | undefined,
    changelog: d.changelog as string | undefined,
    createdBy: (d.createdBy as string) ?? "",
    createdAt: ts(d.createdAt),
    updatedAt: ts(d.updatedAt),
  };
}

// ─── Store ────────────────────────────────────────────

interface TemplateState {
  templates: DocumentTemplate[];
  loading: boolean;
  error: string | null;
  _unsubscribe: Unsubscribe | null;

  subscribe: () => Unsubscribe;
  createTemplate: (
    file: File,
    data: Omit<DocumentTemplate, "id" | "createdAt" | "updatedAt" | "fileUrl" | "fileName" | "version">,
  ) => Promise<string>;
  updateTemplate: (id: string, data: Partial<DocumentTemplate>) => Promise<void>;
  createNewVersion: (
    templateId: string,
    file: File,
    changelog: string,
    createdBy: string,
  ) => Promise<string>;
  toggleActive: (id: string) => Promise<void>;
  togglePublic: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  loading: true,
  error: null,
  _unsubscribe: null,

  subscribe: () => {
    const existing = get()._unsubscribe;
    if (existing) return existing;

    set({ loading: true });
    const q = query(collection(db, COLLECTIONS.TEMPLATES), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q,
      (snap) => set({
        templates: snap.docs.map((d) => docToTemplate(d.id, d.data() as Record<string, unknown>)),
        loading: false,
        error: null,
      }),
      (err) => set({ loading: false, error: err.message }),
    );

    const wrappedUnsub = () => { unsubscribe(); set({ _unsubscribe: null }); };
    set({ _unsubscribe: wrappedUnsub });
    return wrappedUnsub;
  },

  createTemplate: async (file, data) => {
    try {
      set({ error: null });

      // Upload file
      const storagePath = `templates/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on("state_changed", null, reject, () => resolve());
      });

      const fileUrl = await getDownloadURL(storageRef);

      const docRef = await addDoc(collection(db, COLLECTIONS.TEMPLATES), {
        ...data,
        fileUrl,
        fileName: file.name,
        version: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur création template";
      set({ error: msg });
      throw err;
    }
  },

  updateTemplate: async (id, data) => {
    try {
      set({ error: null });
      const { id: _, createdAt: __, ...rest } = data as Record<string, unknown>;
      await updateDoc(doc(db, COLLECTIONS.TEMPLATES, id), {
        ...rest,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erreur mise à jour template" });
      throw err;
    }
  },

  createNewVersion: async (templateId, file, changelog, createdBy) => {
    try {
      set({ error: null });
      const template = get().templates.find((t) => t.id === templateId);
      if (!template) throw new Error("Template introuvable");

      // Deactivate old version
      await updateDoc(doc(db, COLLECTIONS.TEMPLATES, templateId), {
        isActive: false,
        updatedAt: serverTimestamp(),
      });

      // Upload new file
      const storagePath = `templates/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);
      await new Promise<void>((resolve, reject) => {
        uploadTask.on("state_changed", null, reject, () => resolve());
      });
      const fileUrl = await getDownloadURL(storageRef);

      // Create new version
      const newRef = await addDoc(collection(db, COLLECTIONS.TEMPLATES), {
        type: template.type,
        name: template.name,
        description: template.description,
        entityType: template.entityType,
        mergeFields: template.mergeFields,
        fileUrl,
        fileName: file.name,
        version: template.version + 1,
        isActive: true,
        isPublic: template.isPublic,
        previousVersionId: templateId,
        changelog,
        createdBy,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return newRef.id;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur nouvelle version";
      set({ error: msg });
      throw err;
    }
  },

  toggleActive: async (id) => {
    const template = get().templates.find((t) => t.id === id);
    if (!template) return;
    await get().updateTemplate(id, { isActive: !template.isActive } as Partial<DocumentTemplate>);
  },

  togglePublic: async (id) => {
    const template = get().templates.find((t) => t.id === id);
    if (!template) return;
    await get().updateTemplate(id, { isPublic: !template.isPublic } as Partial<DocumentTemplate>);
  },

  clearError: () => set({ error: null }),
}));
