"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Mail, User } from "lucide-react";
import Link from "next/link";
import { usePartnerStore } from "@/stores/usePartnerStore";
import { useDocumentStore, useEntityDocuments } from "@/stores/useDocumentStore";
import { useTemplateStore } from "@/stores/useTemplateStore";
import { useYousignStore } from "@/stores/useYousignStore";
import { ENTITY_STATUS_CONFIG } from "@/lib/config";
import { PARTNER_PIPELINE } from "@/lib/types";
import type { GolfEligibility } from "@/lib/types";
import { isStageDocumentsComplete, getStageDocCounts } from "@/lib/pipeline-helpers";
import { buildMergeContext } from "@/lib/merge-engine";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PipelineTimeline } from "@/components/shared/PipelineTimeline";
import { StageDocumentChecklist } from "@/components/shared/StageDocumentChecklist";
import { EntityInfoForm } from "@/components/shared/EntityInfoForm";
import { DocumentGenerator } from "@/components/shared/DocumentGenerator";

// ─── Eligibility display ──────────────────────────────

const ELIGIBILITY_LABELS: { key: keyof GolfEligibility; label: string; blocking: boolean }[] = [
  { key: "triphase", label: "Triphasé 400V disponible", blocking: true },
  { key: "waterAccess", label: "Point d'eau DN15 accessible", blocking: true },
  { key: "surfaceAvailable", label: "Surface ~30m² disponible", blocking: true },
  { key: "truckAccess", label: "Accès camion livraison", blocking: true },
  { key: "pluCompatible", label: "Zone PLU constructible", blocking: true },
  { key: "outsideCoastalBand", label: "Hors bande 100m littoral", blocking: true },
  { key: "abfZone", label: "Périmètre ABF / site classé", blocking: false },
  { key: "directionApproval", label: "Direction golf favorable", blocking: true },
];

function EligibilityChecklist({ eligibility, onUpdate }: { eligibility: GolfEligibility; onUpdate: (e: GolfEligibility) => void }) {
  return (
    <div className="space-y-2">
      {ELIGIBILITY_LABELS.map(({ key, label, blocking }) => {
        const val = eligibility[key];
        return (
          <label key={key} className="flex items-center gap-3 py-1.5 group cursor-pointer">
            <input
              type="checkbox"
              checked={val === true}
              onChange={(e) => onUpdate({ ...eligibility, [key]: e.target.checked })}
              className="h-4 w-4 rounded border-charcoal-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-charcoal-700 flex-1">{label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${blocking ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
              {blocking ? "bloquant" : "info"}
            </span>
          </label>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────

type TabKey = "pipeline" | "documents" | "eligibility" | "info";

export default function PartnerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const partners = usePartnerStore((s) => s.partners);
  const loading = usePartnerStore((s) => s.loading);
  const advanceStage = usePartnerStore((s) => s.advanceStage);
  const updatePartner = usePartnerStore((s) => s.updatePartner);
  const updateEligibility = usePartnerStore((s) => s.updateEligibility);
  const [activeTab, setActiveTab] = useState<TabKey>("documents");
  const [generatorOpen, setGeneratorOpen] = useState(false);

  const entityDocs = useEntityDocuments("partner", id);
  const templates = useTemplateStore((s) => s.templates);
  const conventionTemplate = templates.find((t) => t.type === "convention" && t.isActive);

  useEffect(() => {
    const u1 = usePartnerStore.getState().subscribe();
    const u2 = useDocumentStore.getState().subscribe();
    const u3 = useTemplateStore.getState().subscribe();
    const u4 = useYousignStore.getState().subscribe("partner", id);
    return () => { u1(); u2(); u3(); u4(); };
  }, [id]);

  const partner = partners.find((p) => p.id === id);

  if (loading) {
    return (
      <div className="space-y-4 animate-slide-up">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-4 w-32" />
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="skeleton h-16 rounded-lg" />
          <div className="skeleton h-16 rounded-lg" />
          <div className="skeleton h-16 rounded-lg" />
        </div>
        <div className="skeleton h-64 rounded-xl mt-6" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="py-24 text-center">
        <p className="text-charcoal-500">Partenaire introuvable.</p>
        <Link href="/partners" className="mt-2 text-sm text-green-700 underline">Retour</Link>
      </div>
    );
  }

  const statusCfg = ENTITY_STATUS_CONFIG[partner.status];
  const tabs: { key: TabKey; label: string }[] = [
    { key: "pipeline", label: "Pipeline" },
    { key: "documents", label: "Documents" },
    { key: "eligibility", label: "Éligibilité" },
    { key: "info", label: "Informations" },
  ];

  // Auto-advance helper: when a doc is approved, check if stage is complete
  function handleDocApproved(stageKey: string) {
    if (!partner) return;
    const stage = PARTNER_PIPELINE.find((s) => s.key === stageKey);
    if (!stage) return;
    const progress = partner.pipelineProgress.find((p) => p.stageKey === stageKey);
    if (progress?.status !== "in_progress") return;
    if (isStageDocumentsComplete(stage, entityDocs)) {
      advanceStage(partner.id, stageKey);
    }
  }

  // Build partner data for EntityInfoForm
  const partnerData: Record<string, string> = {
    name: partner.name,
    siret: partner.siret,
    address: partner.address,
    city: partner.city,
    contactName: partner.contactName,
    contactEmail: partner.contactEmail,
    contactPhone: partner.contactPhone,
    contactRole: partner.contactRole,
  };

  return (
    <div>
      {/* Back + Header */}
      <Link href="/partners" className="inline-flex items-center gap-1 text-sm text-charcoal-500 hover:text-charcoal-700 mb-4">
        <ArrowLeft size={16} /> Partenaires
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">{partner.name}</h1>
          <p className="mt-1 text-sm text-charcoal-500 flex items-center gap-1">
            <MapPin size={14} /> {partner.city} &middot; SIRET {partner.siret || "—"}
          </p>
        </div>
        {statusCfg && <StatusBadge label={statusCfg.label} color={statusCfg.color} />}
      </div>

      {/* Contact card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-white p-4">
          <User size={18} className="text-charcoal-400" />
          <div>
            <p className="text-sm font-medium text-charcoal-900">{partner.contactName}</p>
            <p className="text-xs text-charcoal-500">{partner.contactRole || "Contact principal"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-white p-4">
          <Mail size={18} className="text-charcoal-400" />
          <p className="text-sm text-charcoal-700">{partner.contactEmail}</p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-white p-4">
          <Phone size={18} className="text-charcoal-400" />
          <p className="text-sm text-charcoal-700">{partner.contactPhone || "—"}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-green-600 text-green-900"
                : "border-transparent text-charcoal-500 hover:text-charcoal-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "pipeline" && (
        <div className="rounded-xl border border-border bg-white p-6">
          <PipelineTimeline
            stages={PARTNER_PIPELINE}
            progress={partner.pipelineProgress}
            stageDocCounts={getStageDocCounts(PARTNER_PIPELINE, entityDocs)}
            onStageClick={(stageKey, status) => {
              if (status === "in_progress" || status === "waiting_external") {
                advanceStage(partner.id, stageKey);
              }
            }}
          />
        </div>
      )}

      {activeTab === "documents" && (
        <div className="space-y-3">
          {PARTNER_PIPELINE.map((stage) => {
            const progress = partner.pipelineProgress.find((p) => p.stageKey === stage.key);
            const stageStatus = progress?.status ?? "locked";
            return (
              <StageDocumentChecklist
                key={stage.key}
                stage={stage}
                stageStatus={stageStatus}
                entityType="partner"
                entityId={partner.id}
                documents={entityDocs}
                defaultOpen={stageStatus === "in_progress"}
                generatableDocTypes={stage.key === "convention_signed" ? ["convention"] : undefined}
                onGenerateDocument={(docType) => {
                  if (docType === "convention" && conventionTemplate) {
                    setGeneratorOpen(true);
                  } else {
                    handleDocApproved(stage.key);
                  }
                }}
              />
            );
          })}
        </div>
      )}

      {/* Document Generator */}
      {conventionTemplate && partner && (
        <DocumentGenerator
          open={generatorOpen}
          onClose={() => setGeneratorOpen(false)}
          template={conventionTemplate}
          entityType="partner"
          entityId={partner.id}
          context={buildMergeContext("partner", partner as unknown as Record<string, unknown>)}
          onGenerated={() => handleDocApproved("convention_signed")}
          requiresSignature
        />
      )}

      {activeTab === "eligibility" && (
        <div className="rounded-xl border border-border bg-white p-6">
          <EligibilityChecklist
            eligibility={partner.eligibility}
            onUpdate={(e) => updateEligibility(partner.id, e)}
          />
        </div>
      )}

      {activeTab === "info" && (
        <div className="rounded-xl border border-border bg-white p-6">
          <EntityInfoForm
            entityType="partner"
            data={partnerData}
            onSave={async (data) => {
              await updatePartner(partner.id, data);
            }}
          />
          <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-charcoal-500">Lead source</p>
              <p className="font-medium text-charcoal-900">{partner.leadId ? `Lead #${partner.leadId.slice(0, 8)}` : "Création manuelle"}</p>
            </div>
            <div>
              <p className="text-charcoal-500">Créé le</p>
              <p className="font-medium text-charcoal-900">{new Date(partner.createdAt).toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
