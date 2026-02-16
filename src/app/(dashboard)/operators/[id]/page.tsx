"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { useOperatorStore } from "@/stores/useOperatorStore";
import { useDocumentStore, useEntityDocuments } from "@/stores/useDocumentStore";
import { useTemplateStore } from "@/stores/useTemplateStore";
import { useYousignStore } from "@/stores/useYousignStore";
import { ENTITY_STATUS_CONFIG } from "@/lib/config";
import { OPERATOR_PIPELINE } from "@/lib/types";
import { isStageDocumentsComplete, getStageDocCounts } from "@/lib/pipeline-helpers";
import { buildMergeContext } from "@/lib/merge-engine";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PipelineTimeline } from "@/components/shared/PipelineTimeline";
import { StageDocumentChecklist } from "@/components/shared/StageDocumentChecklist";
import { EntityInfoForm } from "@/components/shared/EntityInfoForm";
import { DocumentGenerator } from "@/components/shared/DocumentGenerator";

type TabKey = "pipeline" | "documents" | "info";

export default function OperatorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const operators = useOperatorStore((s) => s.operators);
  const loading = useOperatorStore((s) => s.loading);
  const advanceStage = useOperatorStore((s) => s.advanceStage);
  const updateOperator = useOperatorStore((s) => s.updateOperator);
  const [activeTab, setActiveTab] = useState<TabKey>("documents");
  const [generatorOpen, setGeneratorOpen] = useState(false);

  const entityDocs = useEntityDocuments("operator", id);
  const templates = useTemplateStore((s) => s.templates);
  const cgvTemplate = templates.find((t) => t.type === "cgv" && t.isActive);
  const charteTemplate = templates.find((t) => t.type === "charte_qualite" && t.isActive);
  const dechargeTemplate = templates.find((t) => t.type === "decharge_auto" && t.isActive);
  const [charteGeneratorOpen, setCharteGeneratorOpen] = useState(false);
  const [dechargeGeneratorOpen, setDechargeGeneratorOpen] = useState(false);

  useEffect(() => {
    const u1 = useOperatorStore.getState().subscribe();
    const u2 = useDocumentStore.getState().subscribe();
    const u3 = useTemplateStore.getState().subscribe();
    const u4 = useYousignStore.getState().subscribe("operator", id);
    return () => { u1(); u2(); u3(); u4(); };
  }, [id]);

  const operator = operators.find((o) => o.id === id);

  if (loading) {
    return (
      <div className="space-y-4 animate-slide-up">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-4 w-32" />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="skeleton h-16 rounded-lg" />
          <div className="skeleton h-16 rounded-lg" />
        </div>
        <div className="skeleton h-64 rounded-xl mt-6" />
      </div>
    );
  }

  if (!operator) {
    return (
      <div className="py-24 text-center">
        <p className="text-charcoal-500">Opérateur introuvable.</p>
        <Link href="/operators" className="mt-2 text-sm text-green-700 underline">Retour</Link>
      </div>
    );
  }

  const statusCfg = ENTITY_STATUS_CONFIG[operator.status];
  const tabs: { key: TabKey; label: string }[] = [
    { key: "pipeline", label: "Pipeline" },
    { key: "documents", label: "Documents" },
    { key: "info", label: "Informations" },
  ];

  function handleDocApproved(stageKey: string) {
    if (!operator) return;
    const stage = OPERATOR_PIPELINE.find((s) => s.key === stageKey);
    if (!stage) return;
    const progress = operator.pipelineProgress.find((p) => p.stageKey === stageKey);
    if (progress?.status !== "in_progress") return;
    if (isStageDocumentsComplete(stage, entityDocs)) {
      advanceStage(operator.id, stageKey);
    }
  }

  const operatorData: Record<string, string> = {
    firstName: operator.firstName,
    lastName: operator.lastName,
    email: operator.email,
    phone: operator.phone,
    siret: operator.siret,
    address: operator.address,
  };

  return (
    <div>
      <Link href="/operators" className="inline-flex items-center gap-1 text-sm text-charcoal-500 hover:text-charcoal-700 mb-4">
        <ArrowLeft size={16} /> Opérateurs
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">
            {operator.firstName} {operator.lastName}
          </h1>
          <p className="mt-1 text-sm text-charcoal-500">
            SIRET {operator.siret || "—"} &middot; {operator.assignedSites.length} site(s) assigné(s)
          </p>
        </div>
        {statusCfg && <StatusBadge label={statusCfg.label} color={statusCfg.color} />}
      </div>

      {/* Contact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-white p-4">
          <Mail size={18} className="text-charcoal-400" />
          <p className="text-sm text-charcoal-700">{operator.email}</p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-white p-4">
          <Phone size={18} className="text-charcoal-400" />
          <p className="text-sm text-charcoal-700">{operator.phone || "—"}</p>
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
            stages={OPERATOR_PIPELINE}
            progress={operator.pipelineProgress}
            stageDocCounts={getStageDocCounts(OPERATOR_PIPELINE, entityDocs)}
            onStageClick={(stageKey, status) => {
              if (status === "in_progress" || status === "waiting_external") {
                advanceStage(operator.id, stageKey);
              }
            }}
          />
        </div>
      )}

      {activeTab === "documents" && (
        <div className="space-y-3">
          {OPERATOR_PIPELINE.map((stage) => {
            const progress = operator.pipelineProgress.find((p) => p.stageKey === stage.key);
            const stageStatus = progress?.status ?? "locked";
            return (
              <StageDocumentChecklist
                key={stage.key}
                stage={stage}
                stageStatus={stageStatus}
                entityType="operator"
                entityId={operator.id}
                documents={entityDocs}
                defaultOpen={stageStatus === "in_progress"}
                generatableDocTypes={
                  stage.key === "charte_decharge" ? ["charte_qualite", "decharge_auto"] :
                  stage.key === "cgv_signed" ? ["cgv"] : undefined
                }
                onGenerateDocument={(docType) => {
                  if (docType === "charte_qualite" && charteTemplate) {
                    setCharteGeneratorOpen(true);
                  } else if (docType === "decharge_auto" && dechargeTemplate) {
                    setDechargeGeneratorOpen(true);
                  } else if (docType === "cgv" && cgvTemplate) {
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

      {/* Document Generators */}
      {cgvTemplate && operator && (
        <DocumentGenerator
          open={generatorOpen}
          onClose={() => setGeneratorOpen(false)}
          template={cgvTemplate}
          entityType="operator"
          entityId={operator.id}
          context={buildMergeContext("operator", operator as unknown as Record<string, unknown>)}
          onGenerated={() => handleDocApproved("cgv_signed")}
          requiresSignature
        />
      )}
      {charteTemplate && operator && (
        <DocumentGenerator
          open={charteGeneratorOpen}
          onClose={() => setCharteGeneratorOpen(false)}
          template={charteTemplate}
          entityType="operator"
          entityId={operator.id}
          context={buildMergeContext("operator", operator as unknown as Record<string, unknown>)}
          onGenerated={() => handleDocApproved("charte_decharge")}
          requiresSignature
        />
      )}
      {dechargeTemplate && operator && (
        <DocumentGenerator
          open={dechargeGeneratorOpen}
          onClose={() => setDechargeGeneratorOpen(false)}
          template={dechargeTemplate}
          entityType="operator"
          entityId={operator.id}
          context={buildMergeContext("operator", operator as unknown as Record<string, unknown>)}
          onGenerated={() => handleDocApproved("charte_decharge")}
          requiresSignature
        />
      )}

      {activeTab === "info" && (
        <div className="rounded-xl border border-border bg-white p-6">
          <EntityInfoForm
            entityType="operator"
            data={operatorData}
            onSave={async (data) => {
              await updateOperator(operator.id, data);
            }}
          />
          <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-charcoal-500">Lead source</p>
              <p className="font-medium text-charcoal-900">{operator.leadId ? `Lead #${operator.leadId.slice(0, 8)}` : "Création manuelle"}</p>
            </div>
            <div>
              <p className="text-charcoal-500">Sites assignés</p>
              <p className="font-medium text-charcoal-900">{operator.assignedSites.length || "Aucun"}</p>
            </div>
            <div>
              <p className="text-charcoal-500">Créé le</p>
              <p className="font-medium text-charcoal-900">{new Date(operator.createdAt).toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
