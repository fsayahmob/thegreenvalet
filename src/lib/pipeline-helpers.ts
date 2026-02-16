import type {
  PipelineStage,
  PipelineProgress,
  AppDocument,
  DocumentStatus,
} from "./types";
import {
  PARTNER_DOCUMENT_TYPES,
  OPERATOR_DOCUMENT_TYPES,
} from "./types";

// ─── Types ────────────────────────────────────────────

export interface StageDocStatus {
  type: string;
  label: string;
  required: boolean;
  hasExpiry: boolean;
  status: "missing" | DocumentStatus;
  document?: AppDocument;
}

// ─── Functions ────────────────────────────────────────

/**
 * For a given pipeline stage, return the status of each required + optional document.
 */
export function getStageDocumentStatus(
  stage: PipelineStage,
  entityDocuments: AppDocument[],
  entityType: "partner" | "operator",
): StageDocStatus[] {
  const allDocTypes = entityType === "partner" ? PARTNER_DOCUMENT_TYPES : OPERATOR_DOCUMENT_TYPES;
  const docTypeMap = new Map(allDocTypes.map((d) => [d.type as string, d]));

  const requiredTypes = stage.requiredDocTypes ?? [];
  const optionalTypes = stage.optionalDocTypes ?? [];
  const stageDocTypes = [...requiredTypes, ...optionalTypes];

  return stageDocTypes.map((type) => {
    const config = docTypeMap.get(type);
    // Find the most recent document of this type (prefer approved > uploaded > rejected)
    const docs = entityDocuments
      .filter((d) => d.type === type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const approved = docs.find((d) => d.status === "approved");
    const pending = docs.find((d) => d.status === "uploaded" || d.status === "under_review");
    const bestDoc = approved ?? pending ?? docs[0];

    return {
      type,
      label: config?.label ?? type,
      required: requiredTypes.includes(type),
      hasExpiry: config?.hasExpiry ?? false,
      status: bestDoc ? bestDoc.status : ("missing" as const),
      document: bestDoc,
    };
  });
}

/**
 * Check if all required documents for a stage are approved.
 */
export function isStageDocumentsComplete(
  stage: PipelineStage,
  entityDocuments: AppDocument[],
): boolean {
  const requiredTypes = stage.requiredDocTypes ?? [];
  if (requiredTypes.length === 0) return true;

  return requiredTypes.every((type) =>
    entityDocuments.some((d) => d.type === type && d.status === "approved"),
  );
}

/**
 * Get the overall pipeline completion percentage.
 */
export function getPipelineCompletionPercent(
  pipelineProgress: PipelineProgress[],
): number {
  if (pipelineProgress.length === 0) return 0;
  const completed = pipelineProgress.filter((p) => p.status === "completed" || p.status === "skipped").length;
  return Math.round((completed / pipelineProgress.length) * 100);
}

/**
 * Get document counts per stage for pipeline timeline display.
 */
export function getStageDocCounts(
  stages: PipelineStage[],
  entityDocuments: AppDocument[],
): Record<string, { approved: number; total: number }> {
  const result: Record<string, { approved: number; total: number }> = {};

  for (const stage of stages) {
    const required = stage.requiredDocTypes ?? [];
    if (required.length === 0) continue;

    const approved = required.filter((type) =>
      entityDocuments.some((d) => d.type === type && d.status === "approved"),
    ).length;

    result[stage.key] = { approved, total: required.length };
  }

  return result;
}
