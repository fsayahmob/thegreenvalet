"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Filter,
  Plus,
} from "lucide-react";
import { useDocumentStore, useFilteredDocuments, usePendingReviewCount, useExpiringDocuments } from "@/stores/useDocumentStore";
import { usePartnerStore } from "@/stores/usePartnerStore";
import { useOperatorStore } from "@/stores/useOperatorStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { DOCUMENT_STATUS_CONFIG } from "@/lib/config";
import { PARTNER_DOCUMENT_TYPES, OPERATOR_DOCUMENT_TYPES, PARTNER_PIPELINE, OPERATOR_PIPELINE } from "@/lib/types";
import type { AppDocument, DocumentStatus, EntityType } from "@/lib/types";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { SlideOver } from "@/components/shared/SlideOver";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DocumentUploader } from "@/components/shared/DocumentUploader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// ─── Helpers ──────────────────────────────────────────

const ALL_DOC_TYPES = [...PARTNER_DOCUMENT_TYPES, ...OPERATOR_DOCUMENT_TYPES];

function getDocTypeLabel(type: string): string {
  return ALL_DOC_TYPES.find((d) => d.type === type)?.label ?? type;
}

// ─── Columns ──────────────────────────────────────────

function makeColumns(
  getEntityName: (entityType: EntityType, entityId: string) => string,
): Column<AppDocument>[] {
  return [
    {
      key: "type",
      header: "Document",
      render: (d) => (
        <div>
          <p className="text-sm font-medium text-charcoal-900">{getDocTypeLabel(d.type)}</p>
          <p className="text-xs text-charcoal-500">{d.fileName}</p>
        </div>
      ),
    },
    {
      key: "entity",
      header: "Entité",
      render: (d) => (
        <div>
          <p className="text-sm text-charcoal-700">{getEntityName(d.entityType, d.entityId)}</p>
          <p className="text-xs text-charcoal-400 capitalize">{d.entityType === "partner" ? "Partenaire" : "Opérateur"}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (d) => {
        const cfg = DOCUMENT_STATUS_CONFIG[d.status];
        return cfg ? <StatusBadge label={cfg.label} color={cfg.color} /> : null;
      },
    },
    {
      key: "expires",
      header: "Expiration",
      sortable: true,
      sortValue: (d) => d.expiresAt ? new Date(d.expiresAt).getTime() : Infinity,
      render: (d) => {
        if (!d.expiresAt) return <span className="text-xs text-charcoal-400">—</span>;
        const isExpiring = d.expiresAt <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const isExpired = d.expiresAt <= new Date();
        return (
          <span className={`text-xs font-medium ${isExpired ? "text-red-600" : isExpiring ? "text-amber-600" : "text-charcoal-500"}`}>
            {isExpired && <AlertTriangle size={12} className="inline mr-1" />}
            {new Date(d.expiresAt).toLocaleDateString("fr-FR")}
          </span>
        );
      },
    },
    {
      key: "date",
      header: "Uploadé le",
      sortable: true,
      sortValue: (d) => new Date(d.createdAt).getTime(),
      render: (d) => (
        <span className="text-xs text-charcoal-500">
          {new Date(d.createdAt).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
  ];
}

// ─── Document Detail ──────────────────────────────────

function DocumentDetail({
  document: doc,
  entityName,
  onClose,
  onApproved,
}: {
  document: AppDocument;
  entityName: string;
  onClose: () => void;
  onApproved?: (doc: AppDocument) => void;
}) {
  const { approveDocument, rejectDocument } = useDocumentStore();
  const { user } = useAuthStore();
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  const statusCfg = DOCUMENT_STATUS_CONFIG[doc.status];

  async function handleApprove() {
    setLoading(true);
    try {
      await approveDocument(doc.id, user?.uid ?? "admin");
      onApproved?.(doc);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    setLoading(true);
    try {
      await rejectDocument(doc.id, rejectReason);
      setShowReject(false);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Status */}
        <div className="flex items-center gap-2">
          {statusCfg && <StatusBadge label={statusCfg.label} color={statusCfg.color} />}
          <span className="text-xs text-charcoal-400 capitalize">
            {doc.entityType === "partner" ? "Partenaire" : "Opérateur"}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-charcoal-500">Type de document</p>
            <p className="font-medium text-charcoal-900">{getDocTypeLabel(doc.type)}</p>
          </div>
          <div>
            <p className="text-charcoal-500">Entité</p>
            <p className="font-medium text-charcoal-900">{entityName}</p>
          </div>
          <div>
            <p className="text-charcoal-500">Fichier</p>
            <p className="font-medium text-charcoal-900">{doc.fileName}</p>
          </div>
          {doc.expiresAt && (
            <div>
              <p className="text-charcoal-500">Date d&apos;expiration</p>
              <p className="font-medium text-charcoal-900">
                {new Date(doc.expiresAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          )}
          {doc.validatedBy && (
            <div>
              <p className="text-charcoal-500">Validé par</p>
              <p className="font-medium text-charcoal-900">
                {doc.validatedBy} le {doc.validatedAt ? new Date(doc.validatedAt).toLocaleDateString("fr-FR") : "—"}
              </p>
            </div>
          )}
          {doc.rejectionReason && (
            <div>
              <p className="text-charcoal-500">Motif de rejet</p>
              <p className="font-medium text-red-600">{doc.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Preview link */}
        {doc.fileUrl && (
          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors"
          >
            <Eye size={16} /> Voir le document
          </a>
        )}

        {/* Actions */}
        {doc.status === "uploaded" && (
          <div className="space-y-2 pt-2 border-t border-border">
            <Button className="w-full" onClick={handleApprove} disabled={loading}>
              <CheckCircle2 size={16} /> Approuver
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setShowReject(true)} disabled={loading}>
              <XCircle size={16} /> Rejeter
            </Button>
          </div>
        )}

        {/* Meta */}
        <div className="pt-2 border-t border-border text-xs text-charcoal-400 space-y-1">
          <p>Uploadé le {new Date(doc.createdAt).toLocaleString("fr-FR")}</p>
          <p>ID : {doc.id}</p>
        </div>
      </div>

      <ConfirmDialog
        open={showReject}
        onClose={() => setShowReject(false)}
        onConfirm={handleReject}
        title="Rejeter ce document"
        confirmLabel="Rejeter"
        confirmVariant="destructive"
        loading={loading}
      >
        <Textarea
          rows={2}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Motif du rejet (obligatoire)…"
        />
      </ConfirmDialog>
    </>
  );
}

// ─── Upload Document Form ─────────────────────────────

function UploadDocumentForm({
  partners,
  operators,
  onClose,
}: {
  partners: { id: string; name: string }[];
  operators: { id: string; firstName: string; lastName: string }[];
  onClose: () => void;
}) {
  const { uploadDocument } = useDocumentStore();
  const [entityType, setEntityType] = useState<EntityType>("partner");
  const [entityId, setEntityId] = useState("");
  const [docType, setDocType] = useState("");
  const [error, setError] = useState<string | null>(null);

  const docTypes = entityType === "partner" ? PARTNER_DOCUMENT_TYPES : OPERATOR_DOCUMENT_TYPES;
  const entities = entityType === "partner"
    ? partners.map((p) => ({ id: p.id, label: p.name }))
    : operators.map((o) => ({ id: o.id, label: `${o.firstName} ${o.lastName}` }));

  return (
    <div className="space-y-4">
      {/* Entity Type */}
      <div>
        <label className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Type d&apos;entité</label>
        <div className="mt-1 flex gap-2">
          <Button
            variant={entityType === "partner" ? "default" : "secondary"}
            size="sm"
            onClick={() => { setEntityType("partner"); setEntityId(""); setDocType(""); }}
          >
            Partenaire
          </Button>
          <Button
            variant={entityType === "operator" ? "default" : "secondary"}
            size="sm"
            onClick={() => { setEntityType("operator"); setEntityId(""); setDocType(""); }}
          >
            Opérateur
          </Button>
        </div>
      </div>

      {/* Entity Select */}
      <div>
        <label className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
          {entityType === "partner" ? "Partenaire" : "Opérateur"}
        </label>
        <select
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
          value={entityId}
          onChange={(e) => setEntityId(e.target.value)}
        >
          <option value="">— Sélectionner —</option>
          {entities.map((e) => (
            <option key={e.id} value={e.id}>{e.label}</option>
          ))}
        </select>
        {entities.length === 0 && (
          <p className="text-xs text-charcoal-400 mt-1">
            Aucun {entityType === "partner" ? "partenaire" : "opérateur"} disponible.
          </p>
        )}
      </div>

      {/* Doc Type Select */}
      <div>
        <label className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Type de document</label>
        <select
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
        >
          <option value="">— Sélectionner —</option>
          {docTypes.map((d) => (
            <option key={d.type} value={d.type}>{d.label}{d.required ? " *" : ""}</option>
          ))}
        </select>
      </div>

      {/* Uploader */}
      <div>
        <label className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-2 block">Fichier</label>
        <DocumentUploader
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          maxSizeMB={10}
          label="Glissez le document ici"
          onUpload={async (file) => {
            if (!entityId) {
              setError("Veuillez sélectionner une entité.");
              return;
            }
            if (!docType) {
              setError("Veuillez sélectionner un type de document.");
              return;
            }
            setError(null);
            await uploadDocument(file, entityType, entityId, docType);
            onClose();
          }}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────

export default function DocumentsPage() {
  const loading = useDocumentStore((s) => s.loading);
  const filters = useDocumentStore((s) => s.filters);
  const setFilters = useDocumentStore((s) => s.setFilters);
  const allDocuments = useDocumentStore((s) => s.documents);
  const documents = useFilteredDocuments();
  const pendingCount = usePendingReviewCount();
  const expiringDocs = useExpiringDocuments();
  const partners = usePartnerStore((s) => s.partners);
  const advancePartnerStage = usePartnerStore((s) => s.advanceStage);
  const operators = useOperatorStore((s) => s.operators);
  const advanceOperatorStage = useOperatorStore((s) => s.advanceStage);
  const [selected, setSelected] = useState<AppDocument | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const u1 = useDocumentStore.getState().subscribe();
    const u2 = usePartnerStore.getState().subscribe();
    const u3 = useOperatorStore.getState().subscribe();
    return () => { u1(); u2(); u3(); };
  }, []);

  // H1: Auto-advance pipeline when document approval completes all required docs for a stage
  async function handleDocApproved(doc: AppDocument) {
    const pipeline = doc.entityType === "partner" ? PARTNER_PIPELINE : OPERATOR_PIPELINE;
    const advanceStage = doc.entityType === "partner" ? advancePartnerStage : advanceOperatorStage;
    const entity = doc.entityType === "partner"
      ? partners.find((p) => p.id === doc.entityId)
      : operators.find((o) => o.id === doc.entityId);
    if (!entity) return;

    // Find which pipeline stage requires this doc type
    const stage = pipeline.find((s) => s.requiredDocTypes.includes(doc.type));
    if (!stage) return;

    // Check if stage is in_progress
    const progress = entity.pipelineProgress.find((p) => p.stageKey === stage.key);
    if (!progress || progress.status !== "in_progress") return;

    // Check if ALL required docs for this stage are now approved
    const entityDocs = allDocuments.filter(
      (d) => d.entityType === doc.entityType && d.entityId === doc.entityId && d.status === "approved",
    );
    const allRequired = stage.requiredDocTypes.every((type) =>
      type === doc.type || entityDocs.some((ed) => ed.type === type),
    );
    if (allRequired) {
      try {
        await advanceStage(entity.id, stage.key, "Auto-avancé après approbation des documents requis");
      } catch {
        // Silent fail — pipeline advancement is best-effort
      }
    }
  }

  function getEntityName(entityType: EntityType, entityId: string): string {
    if (entityType === "partner") {
      return partners.find((p) => p.id === entityId)?.name ?? `Partenaire #${entityId.slice(0, 8)}`;
    }
    if (entityType === "operator") {
      const op = operators.find((o) => o.id === entityId);
      return op ? `${op.firstName} ${op.lastName}` : `Opérateur #${entityId.slice(0, 8)}`;
    }
    return entityId.slice(0, 12);
  }

  const columns = makeColumns(getEntityName);

  const activeDoc = selected
    ? documents.find((d) => d.id === selected.id) ?? selected
    : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Documents</h1>
          <p className="mt-1 text-sm text-charcoal-500">
            Centre de gestion documentaire — review, approbation et suivi des expirations.
          </p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Plus size={16} /> Upload document
        </Button>
      </div>

      {/* Alerts */}
      {(pendingCount > 0 || expiringDocs.length > 0) && (
        <div className="mb-6 space-y-3">
          {pendingCount > 0 && (
            <div className="flex items-start gap-3 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
              <Clock size={18} className="mt-0.5 text-blue-600 shrink-0" />
              <p className="text-sm text-blue-800">
                <span className="font-semibold">{pendingCount}</span> document{pendingCount > 1 ? "s" : ""} en attente de review.
              </p>
            </div>
          )}
          {expiringDocs.length > 0 && (
            <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
              <AlertTriangle size={18} className="mt-0.5 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800">
                <span className="font-semibold">{expiringDocs.length}</span> document{expiringDocs.length > 1 ? "s" : ""} expirent dans les 30 jours.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {(["uploaded", "under_review", "approved", "rejected", "expired"] as DocumentStatus[]).map((status) => {
          const cfg = DOCUMENT_STATUS_CONFIG[status];
          const count = documents.filter((d) => d.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilters({ ...filters, status: filters.status === status ? undefined : status })}
              className={`rounded-xl border p-4 text-left transition-colors ${
                filters.status === status ? "border-green-500 bg-green-50" : "border-border bg-white hover:bg-charcoal-50"
              }`}
            >
              <p className="text-xs text-charcoal-500">{cfg.label}</p>
              <p className="mt-1 text-xl font-bold text-charcoal-900">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-charcoal-400" />
        <Button
          variant={!filters.entityType ? "default" : "secondary"}
          size="sm"
          onClick={() => setFilters({ ...filters, entityType: undefined })}
        >
          Tous
        </Button>
        <Button
          variant={filters.entityType === "partner" ? "default" : "secondary"}
          size="sm"
          onClick={() => setFilters({ ...filters, entityType: "partner" })}
        >
          Partenaires
        </Button>
        <Button
          variant={filters.entityType === "operator" ? "default" : "secondary"}
          size="sm"
          onClick={() => setFilters({ ...filters, entityType: "operator" })}
        >
          Opérateurs
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={documents}
        keyExtractor={(d) => d.id}
        onRowClick={(d) => setSelected(d)}
        loading={loading}
        searchable
        searchPlaceholder="Rechercher un document…"
        searchKeys={(d) => `${d.type} ${d.fileName} ${d.entityType}`}
        emptyState={
          <EmptyState
            icon={FileText}
            title="Aucun document"
            description="Les documents apparaîtront ici quand des fichiers seront uploadés."
          />
        }
      />

      {/* Detail drawer */}
      <SlideOver
        open={!!activeDoc}
        onClose={() => setSelected(null)}
        title={activeDoc ? getDocTypeLabel(activeDoc.type) : ""}
        subtitle={activeDoc ? activeDoc.fileName : undefined}
      >
        {activeDoc && (
          <DocumentDetail
            document={activeDoc}
            entityName={getEntityName(activeDoc.entityType, activeDoc.entityId)}
            onClose={() => setSelected(null)}
            onApproved={handleDocApproved}
          />
        )}
      </SlideOver>

      {/* Upload drawer */}
      <SlideOver
        open={showUpload}
        onClose={() => setShowUpload(false)}
        title="Upload document"
        subtitle="Associer un fichier à un partenaire ou opérateur"
      >
        <UploadDocumentForm
          partners={partners}
          operators={operators}
          onClose={() => setShowUpload(false)}
        />
      </SlideOver>
    </div>
  );
}
