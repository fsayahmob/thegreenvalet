"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { usePartnerStore } from "@/stores/usePartnerStore";
import { ENTITY_STATUS_CONFIG } from "@/lib/config";
import { PARTNER_PIPELINE } from "@/lib/types";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Partner } from "@/lib/types";

function getStageName(key: string): string {
  return PARTNER_PIPELINE.find((s) => s.key === key)?.name ?? key;
}

function getCompletedStages(partner: Partner): number {
  return partner.pipelineProgress.filter((p) => p.status === "completed").length;
}

const columns: Column<Partner>[] = [
  {
    key: "name",
    header: "Golf",
    sortable: true,
    sortValue: (p) => p.name,
    render: (p) => (
      <div>
        <p className="text-sm font-medium text-charcoal-900">{p.name}</p>
        <p className="text-xs text-charcoal-500">{p.city}</p>
      </div>
    ),
  },
  {
    key: "contact",
    header: "Contact",
    render: (p) => (
      <div>
        <p className="text-sm text-charcoal-700">{p.contactName}</p>
        <p className="text-xs text-charcoal-500">{p.contactEmail}</p>
      </div>
    ),
  },
  {
    key: "status",
    header: "Statut",
    render: (p) => {
      const cfg = ENTITY_STATUS_CONFIG[p.status];
      return cfg ? <StatusBadge label={cfg.label} color={cfg.color} /> : null;
    },
  },
  {
    key: "pipeline",
    header: "Pipeline",
    render: (p) => {
      const completed = getCompletedStages(p);
      const total = PARTNER_PIPELINE.length;
      const pct = Math.round((completed / total) * 100);
      return (
        <div className="min-w-[120px]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-charcoal-600">{getStageName(p.currentStageKey)}</span>
            <span className="text-charcoal-400">{completed}/{total}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-charcoal-100">
            <div className="h-1.5 rounded-full bg-green-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      );
    },
  },
  {
    key: "created",
    header: "Créé le",
    sortable: true,
    sortValue: (p) => new Date(p.createdAt).getTime(),
    render: (p) => (
      <span className="text-xs text-charcoal-500">
        {new Date(p.createdAt).toLocaleDateString("fr-FR")}
      </span>
    ),
  },
];

export default function PartnersPage() {
  const { partners, loading, subscribe } = usePartnerStore();
  const router = useRouter();

  useEffect(() => {
    const unsub = subscribe();
    return unsub;
  }, [subscribe]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Partenaires</h1>
          <p className="mt-1 text-sm text-charcoal-500">
            {partners.length} golf{partners.length > 1 ? "s" : ""} dans le réseau.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={partners}
        keyExtractor={(p) => p.id}
        onRowClick={(p) => router.push(`/partners/${p.id}`)}
        loading={loading}
        emptyState={
          <EmptyState
            icon={Building2}
            title="Aucun partenaire"
            description="Les partenaires apparaîtront ici quand vous convertirez des leads golf."
          />
        }
      />
    </div>
  );
}
