"use client";

import { useEffect } from "react";
import { MapPin, Check, X } from "lucide-react";
import { useSiteStore } from "@/stores/useSiteStore";
import { usePartnerStore } from "@/stores/usePartnerStore";
import { useOperatorStore } from "@/stores/useOperatorStore";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Site } from "@/lib/types";

export default function SitesPage() {
  const sites = useSiteStore((s) => s.sites);
  const sitesLoading = useSiteStore((s) => s.loading);
  const partners = usePartnerStore((s) => s.partners);
  const operators = useOperatorStore((s) => s.operators);

  useEffect(() => {
    const u1 = useSiteStore.getState().subscribe();
    const u2 = usePartnerStore.getState().subscribe();
    const u3 = useOperatorStore.getState().subscribe();
    return () => { u1(); u2(); u3(); };
  }, []);

  function getPartnerName(partnerId: string): string {
    return partners.find((p) => p.id === partnerId)?.name ?? "—";
  }

  function getOperatorName(operatorId: string | null): string {
    if (!operatorId) return "Non assigné";
    const op = operators.find((o) => o.id === operatorId);
    return op ? `${op.firstName} ${op.lastName}` : "—";
  }

  const columns: Column<Site>[] = [
    {
      key: "name",
      header: "Site",
      sortable: true,
      render: (s) => (
        <div>
          <p className="text-sm font-medium text-charcoal-900">{s.name}</p>
          <p className="text-xs text-charcoal-500">{s.address}</p>
        </div>
      ),
    },
    {
      key: "partner",
      header: "Golf",
      render: (s) => <span className="text-sm text-charcoal-700">{getPartnerName(s.partnerId)}</span>,
    },
    {
      key: "operator",
      header: "Opérateur",
      render: (s) => (
        <span className={`text-sm ${s.assignedOperatorId ? "text-charcoal-700" : "text-charcoal-400 italic"}`}>
          {getOperatorName(s.assignedOperatorId)}
        </span>
      ),
    },
    {
      key: "surface",
      header: "Surface",
      render: (s) => <span className="text-sm text-charcoal-700">{s.surfaceM2 ? `${s.surfaceM2} m²` : "—"}</span>,
    },
    {
      key: "active",
      header: "Actif",
      render: (s) => (
        s.isActive
          ? <StatusBadge label="Actif" color="green" icon={<Check size={12} />} />
          : <StatusBadge label="Inactif" color="gray" icon={<X size={12} />} />
      ),
    },
    {
      key: "created",
      header: "Créé le",
      sortable: true,
      render: (s) => (
        <span className="text-xs text-charcoal-500">
          {new Date(s.createdAt).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Sites</h1>
          <p className="mt-1 text-sm text-charcoal-500">
            {sites.length} site{sites.length > 1 ? "s" : ""} &middot;{" "}
            {sites.filter((s) => s.isActive).length} actif{sites.filter((s) => s.isActive).length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={sites}
        keyExtractor={(s) => s.id}
        loading={sitesLoading}
        searchable
        searchPlaceholder="Rechercher un site…"
        searchKeys={(s) => `${s.name} ${s.address}`}
        emptyState={
          <EmptyState
            icon={MapPin}
            title="Aucun site"
            description="Les sites sont créés quand un partenaire golf termine son onboarding."
          />
        }
      />
    </div>
  );
}
