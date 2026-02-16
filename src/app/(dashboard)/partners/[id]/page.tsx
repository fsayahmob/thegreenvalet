"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Mail, User } from "lucide-react";
import Link from "next/link";
import { usePartnerStore } from "@/stores/usePartnerStore";
import { ENTITY_STATUS_CONFIG } from "@/lib/config";
import { PARTNER_PIPELINE } from "@/lib/types";
import type { GolfEligibility } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PipelineTimeline } from "@/components/shared/PipelineTimeline";

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

export default function PartnerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const partners = usePartnerStore((s) => s.partners);
  const loading = usePartnerStore((s) => s.loading);
  const advanceStage = usePartnerStore((s) => s.advanceStage);
  const updateEligibility = usePartnerStore((s) => s.updateEligibility);
  const [activeTab, setActiveTab] = useState<"pipeline" | "eligibility" | "info">("pipeline");

  useEffect(() => {
    const unsub = usePartnerStore.getState().subscribe();
    return unsub;
  }, []);

  const partner = partners.find((p) => p.id === id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
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
  const tabs = [
    { key: "pipeline" as const, label: "Pipeline" },
    { key: "eligibility" as const, label: "Éligibilité" },
    { key: "info" as const, label: "Informations" },
  ];

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
      <div className="rounded-xl border border-border bg-white p-6">
        {activeTab === "pipeline" && (
          <PipelineTimeline
            stages={PARTNER_PIPELINE}
            progress={partner.pipelineProgress}
            onStageClick={(stageKey, status) => {
              if (status === "in_progress" || status === "waiting_external") {
                advanceStage(partner.id, stageKey);
              }
            }}
          />
        )}

        {activeTab === "eligibility" && (
          <EligibilityChecklist
            eligibility={partner.eligibility}
            onUpdate={(e) => updateEligibility(partner.id, e)}
          />
        )}

        {activeTab === "info" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-charcoal-500">Adresse</p>
                <p className="font-medium text-charcoal-900">{partner.address || "—"}</p>
              </div>
              <div>
                <p className="text-charcoal-500">SIRET</p>
                <p className="font-medium text-charcoal-900">{partner.siret || "—"}</p>
              </div>
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
    </div>
  );
}
