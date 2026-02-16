"use client";

import { useEffect } from "react";
import { Users } from "lucide-react";
import { useOperatorStore } from "@/stores/useOperatorStore";
import { ENTITY_STATUS_CONFIG } from "@/lib/config";
import { OPERATOR_PIPELINE } from "@/lib/types";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Operator } from "@/lib/types";

function getStageName(key: string): string {
  return OPERATOR_PIPELINE.find((s) => s.key === key)?.name ?? key;
}

function getCompletedStages(op: Operator): number {
  return op.pipelineProgress.filter((p) => p.status === "completed").length;
}

const columns: Column<Operator>[] = [
  {
    key: "name",
    header: "Opérateur",
    sortable: true,
    render: (o) => (
      <div>
        <p className="text-sm font-medium text-charcoal-900">{o.firstName} {o.lastName}</p>
        <p className="text-xs text-charcoal-500">{o.email}</p>
      </div>
    ),
  },
  {
    key: "phone",
    header: "Téléphone",
    render: (o) => <span className="text-sm text-charcoal-700">{o.phone || "—"}</span>,
  },
  {
    key: "status",
    header: "Statut",
    render: (o) => {
      const cfg = ENTITY_STATUS_CONFIG[o.status];
      return cfg ? <StatusBadge label={cfg.label} color={cfg.color} /> : null;
    },
  },
  {
    key: "pipeline",
    header: "Pipeline",
    render: (o) => {
      const completed = getCompletedStages(o);
      const total = OPERATOR_PIPELINE.length;
      const pct = Math.round((completed / total) * 100);
      return (
        <div className="min-w-[120px]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-charcoal-600">{getStageName(o.currentStageKey)}</span>
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
    key: "sites",
    header: "Sites",
    render: (o) => (
      <span className="text-sm text-charcoal-700">{o.assignedSites.length} site{o.assignedSites.length > 1 ? "s" : ""}</span>
    ),
  },
  {
    key: "created",
    header: "Créé le",
    sortable: true,
    render: (o) => (
      <span className="text-xs text-charcoal-500">
        {new Date(o.createdAt).toLocaleDateString("fr-FR")}
      </span>
    ),
  },
];

export default function OperatorsPage() {
  const { operators, loading, subscribe } = useOperatorStore();

  useEffect(() => {
    const unsub = subscribe();
    return unsub;
  }, [subscribe]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Opérateurs</h1>
          <p className="mt-1 text-sm text-charcoal-500">
            {operators.length} laveur{operators.length > 1 ? "s" : ""} dans le réseau.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={operators}
        keyExtractor={(o) => o.id}
        onRowClick={(o) => {
          window.location.href = `/operators/${o.id}`;
        }}
        loading={loading}
        emptyState={
          <EmptyState
            icon={Users}
            title="Aucun opérateur"
            description="Les opérateurs apparaîtront ici quand vous convertirez des leads laveurs."
          />
        }
      />
    </div>
  );
}
