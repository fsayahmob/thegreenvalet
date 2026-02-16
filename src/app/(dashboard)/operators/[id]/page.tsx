"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { useOperatorStore } from "@/stores/useOperatorStore";
import { ENTITY_STATUS_CONFIG } from "@/lib/config";
import { OPERATOR_PIPELINE } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PipelineTimeline } from "@/components/shared/PipelineTimeline";

export default function OperatorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { operators, loading, subscribe, advanceStage } = useOperatorStore();
  const [activeTab, setActiveTab] = useState<"pipeline" | "info">("pipeline");

  useEffect(() => {
    const unsub = subscribe();
    return unsub;
  }, [subscribe]);

  const operator = operators.find((o) => o.id === id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
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
  const tabs = [
    { key: "pipeline" as const, label: "Pipeline" },
    { key: "info" as const, label: "Informations" },
  ];

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

      <div className="rounded-xl border border-border bg-white p-6">
        {activeTab === "pipeline" && (
          <PipelineTimeline
            stages={OPERATOR_PIPELINE}
            progress={operator.pipelineProgress}
            onStageClick={(stageKey, status) => {
              if (status === "in_progress" || status === "waiting_external") {
                advanceStage(operator.id, stageKey);
              }
            }}
          />
        )}

        {activeTab === "info" && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-charcoal-500">Email</p>
              <p className="font-medium text-charcoal-900">{operator.email}</p>
            </div>
            <div>
              <p className="text-charcoal-500">Téléphone</p>
              <p className="font-medium text-charcoal-900">{operator.phone || "—"}</p>
            </div>
            <div>
              <p className="text-charcoal-500">SIRET</p>
              <p className="font-medium text-charcoal-900">{operator.siret || "—"}</p>
            </div>
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
        )}
      </div>
    </div>
  );
}
