"use client";

import { useState } from "react";
import {
  Check,
  XCircle,
  Upload,
  Eye,
  ChevronDown,
  ChevronRight,
  FileText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentUploader } from "./DocumentUploader";
import { StatusBadge } from "./StatusBadge";
import { useDocumentStore } from "@/stores/useDocumentStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { getStageDocumentStatus, isStageDocumentsComplete } from "@/lib/pipeline-helpers";
import type { PipelineStage, PipelineStageStatus, AppDocument, EntityType } from "@/lib/types";
import type { StageDocStatus } from "@/lib/pipeline-helpers";
import type { StatusColor } from "@/lib/config";

// ─── Status helpers ───────────────────────────────────

function docStatusColor(status: StageDocStatus["status"]): StatusColor {
  switch (status) {
    case "approved": return "green";
    case "uploaded":
    case "under_review": return "amber";
    case "rejected": return "red";
    case "expired": return "red";
    default: return "gray";
  }
}

function docStatusLabel(status: StageDocStatus["status"]): string {
  switch (status) {
    case "approved": return "Approuvé";
    case "uploaded": return "Uploadé";
    case "under_review": return "En revue";
    case "rejected": return "Rejeté";
    case "expired": return "Expiré";
    default: return "Manquant";
  }
}

// ─── Doc Row ──────────────────────────────────────────

function DocRow({
  docStatus,
  entityType,
  entityId,
  onGenerate,
  isGeneratable,
}: {
  docStatus: StageDocStatus;
  entityType: EntityType;
  entityId: string;
  onGenerate?: () => void;
  isGeneratable: boolean;
}) {
  const [showUpload, setShowUpload] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const uid = useAuthStore((s) => s.user?.uid);
  const approveDocument = useDocumentStore((s) => s.approveDocument);
  const rejectDocument = useDocumentStore((s) => s.rejectDocument);
  const uploadDocument = useDocumentStore((s) => s.uploadDocument);

  const isMissing = docStatus.status === "missing";
  const isRejected = docStatus.status === "rejected";
  const isPending = docStatus.status === "uploaded" || docStatus.status === "under_review";
  const isApproved = docStatus.status === "approved";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 py-2">
        {/* Status dot */}
        <span
          className={`h-2.5 w-2.5 rounded-full shrink-0 ${
            isApproved ? "bg-green-500" :
            isPending ? "bg-amber-500" :
            isRejected ? "bg-red-500" :
            "bg-charcoal-300"
          }`}
        />

        {/* Label */}
        <span className="flex-1 text-sm text-charcoal-700">
          {docStatus.label}
          {docStatus.required && <span className="text-red-400 ml-0.5">*</span>}
        </span>

        {/* Status badge */}
        {!isMissing && (
          <StatusBadge
            label={docStatusLabel(docStatus.status)}
            color={docStatusColor(docStatus.status)}
            pulse={false}
          />
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {/* View */}
          {docStatus.document?.fileUrl && (
            <a
              href={docStatus.document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100 transition-colors duration-150"
              title="Voir le fichier"
            >
              <Eye size={15} />
            </a>
          )}

          {/* Approve / Reject (for pending docs) */}
          {isPending && uid && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-green-700 hover:bg-green-50"
                onClick={() => approveDocument(docStatus.document!.id, uid)}
              >
                <Check size={14} /> Approuver
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-red-600 hover:bg-red-50"
                onClick={() => setShowReject(!showReject)}
              >
                <XCircle size={14} />
              </Button>
            </>
          )}

          {/* Upload button (for missing or rejected) */}
          {(isMissing || isRejected) && !isGeneratable && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2"
              onClick={() => setShowUpload(!showUpload)}
            >
              <Upload size={14} /> {isRejected ? "Re-uploader" : "Uploader"}
            </Button>
          )}

          {/* Generate button (for convention/cgv) */}
          {(isMissing || isRejected) && isGeneratable && onGenerate && (
            <Button
              size="sm"
              className="h-7 px-2"
              onClick={onGenerate}
            >
              <Sparkles size={14} /> Générer
            </Button>
          )}
        </div>
      </div>

      {/* Rejection reason display */}
      {isRejected && docStatus.document?.rejectionReason && (
        <p className="ml-5 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-1.5">
          Motif : {docStatus.document.rejectionReason}
        </p>
      )}

      {/* Reject input */}
      {showReject && (
        <div className="ml-5 flex items-center gap-2">
          <input
            type="text"
            placeholder="Motif du rejet…"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="flex-1 rounded-lg border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            size="sm"
            variant="destructive"
            className="h-7"
            disabled={!rejectReason.trim()}
            onClick={async () => {
              if (docStatus.document) {
                await rejectDocument(docStatus.document.id, rejectReason.trim());
                setRejectReason("");
                setShowReject(false);
              }
            }}
          >
            Rejeter
          </Button>
        </div>
      )}

      {/* Upload area */}
      {showUpload && (
        <div className="ml-5">
          <DocumentUploader
            label="Glissez le fichier ou cliquez pour sélectionner"
            onUpload={async (file) => {
              await uploadDocument(file, entityType, entityId, docStatus.type);
              setShowUpload(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────

interface StageDocumentChecklistProps {
  stage: PipelineStage;
  stageStatus: PipelineStageStatus;
  entityType: "partner" | "operator";
  entityId: string;
  documents: AppDocument[];
  defaultOpen?: boolean;
  onGenerateDocument?: (docType: string) => void;
  generatableDocTypes?: string[];
}

export function StageDocumentChecklist({
  stage,
  stageStatus,
  entityType,
  entityId,
  documents,
  defaultOpen = false,
  onGenerateDocument,
  generatableDocTypes,
}: StageDocumentChecklistProps) {
  const [open, setOpen] = useState(defaultOpen);

  const docStatuses = getStageDocumentStatus(stage, documents, entityType);
  const isComplete = isStageDocumentsComplete(stage, documents);
  const hasDocTypes = docStatuses.length > 0;
  const approvedCount = docStatuses.filter((d) => d.status === "approved").length;
  const isLocked = stageStatus === "locked";

  if (!hasDocTypes) return null;

  const stageStatusColor: StatusColor =
    stageStatus === "completed" ? "green" :
    stageStatus === "in_progress" ? "blue" :
    stageStatus === "waiting_external" ? "amber" :
    "gray";

  const stageStatusLabel =
    stageStatus === "completed" ? "Terminé" :
    stageStatus === "in_progress" ? "En cours" :
    stageStatus === "waiting_external" ? "En attente" :
    stageStatus === "skipped" ? "Passé" :
    "Verrouillé";

  return (
    <div className={`rounded-xl border border-border bg-white transition-opacity duration-200 ${isLocked ? "opacity-50" : ""}`}>
      {/* Header */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-charcoal-50/50 transition-colors duration-150 rounded-xl"
        onClick={() => !isLocked && setOpen(!open)}
        disabled={isLocked}
      >
        {open ? <ChevronDown size={16} className="text-charcoal-400" /> : <ChevronRight size={16} className="text-charcoal-400" />}
        <FileText size={16} className="text-charcoal-500" />
        <span className="flex-1 text-sm font-medium text-charcoal-900">{stage.name}</span>

        {/* Doc count pill */}
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          isComplete ? "bg-green-100 text-green-700" : "bg-charcoal-100 text-charcoal-500"
        }`}>
          {approvedCount}/{docStatuses.filter((d) => d.required).length} docs
        </span>

        <StatusBadge label={stageStatusLabel} color={stageStatusColor} pulse={false} />
      </button>

      {/* Content */}
      {open && !isLocked && (
        <div className="px-4 pb-4 border-t border-border/50">
          <div className="divide-y divide-border/30 mt-2">
            {docStatuses.map((ds) => (
              <DocRow
                key={ds.type}
                docStatus={ds}
                entityType={entityType}
                entityId={entityId}
                isGeneratable={generatableDocTypes ? generatableDocTypes.includes(ds.type) : (stage.requiresYousign === true && ds.required)}
                onGenerate={onGenerateDocument ? () => onGenerateDocument(ds.type) : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
