"use client";

import { useEffect, useState } from "react";
import {
  Inbox,
  Phone,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertTriangle,
  Clock,
  Building2,
  Users,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useLeadStore,
  useFilteredLeads,
  useLeadCounts,
  useBreachedLeads,
} from "@/stores/useLeadStore";
import { usePartnerStore, initPartnerPipeline } from "@/stores/usePartnerStore";
import { useOperatorStore, initOperatorPipeline } from "@/stores/useOperatorStore";
import { LEAD_STATUS_CONFIG, LEAD_TRANSITIONS } from "@/lib/config";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { SlideOver } from "@/components/shared/SlideOver";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { Lead, LeadStatus, LeadType } from "@/lib/types";

// ─── SLA helpers ──────────────────────────────────────

function getSlaInfo(lead: Lead) {
  if (lead.status !== "new") return null;
  const now = new Date();
  const deadline = new Date(lead.slaDeadline);
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

  if (diffMs < 0) return { label: `SLA dépassé (${Math.abs(diffHours)}h)`, breached: true };
  if (diffHours <= 4) return { label: `${diffHours}h restantes`, breached: false, urgent: true };
  return { label: `${diffHours}h restantes`, breached: false, urgent: false };
}

// ─── Columns ──────────────────────────────────────────

const columns: Column<Lead>[] = [
  {
    key: "type",
    header: "Type",
    render: (l) => (
      <div className="flex items-center gap-2">
        {l.type === "partner" ? <Building2 size={16} className="text-charcoal-400" /> : <Users size={16} className="text-charcoal-400" />}
        <span className="text-sm font-medium">{l.type === "partner" ? "Golf" : "Laveur"}</span>
      </div>
    ),
  },
  {
    key: "contact",
    header: "Contact",
    sortable: true,
    render: (l) => (
      <div>
        <p className="text-sm font-medium text-charcoal-900">{l.firstName} {l.lastName}</p>
        <p className="text-xs text-charcoal-500">{l.email}</p>
      </div>
    ),
  },
  {
    key: "source",
    header: "Source",
    render: (l) => <span className="text-sm text-charcoal-600">{l.golfName ?? l.city}</span>,
  },
  {
    key: "status",
    header: "Statut",
    render: (l) => {
      const cfg = LEAD_STATUS_CONFIG[l.status];
      return cfg ? <StatusBadge label={cfg.label} color={cfg.color} /> : null;
    },
  },
  {
    key: "sla",
    header: "SLA",
    render: (l) => {
      const sla = getSlaInfo(l);
      if (!sla) return <span className="text-xs text-charcoal-400">—</span>;
      return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${sla.breached ? "text-red-600" : sla.urgent ? "text-amber-600" : "text-charcoal-500"}`}>
          {sla.breached ? <AlertTriangle size={12} /> : <Clock size={12} />}
          {sla.label}
        </span>
      );
    },
  },
  {
    key: "date",
    header: "Date",
    sortable: true,
    render: (l) => (
      <span className="text-xs text-charcoal-500">
        {new Date(l.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
      </span>
    ),
  },
];

// ─── Lead Detail Panel ────────────────────────────────

function LeadDetail({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const { updateStatus, convertLead, rejectLead } = useLeadStore();
  const { createPartner } = usePartnerStore();
  const { createOperator } = useOperatorStore();
  const [notes, setNotes] = useState(lead.qualificationNotes ?? "");
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [showConvert, setShowConvert] = useState(false);
  const [converting, setConverting] = useState(false);

  const allowed = LEAD_TRANSITIONS[lead.status] ?? [];

  async function handleConvert() {
    setConverting(true);
    try {
      let entityId: string;
      if (lead.type === "partner") {
        entityId = await createPartner({
          userId: null,
          name: lead.golfName ?? `${lead.firstName} ${lead.lastName}`,
          siret: "",
          address: "",
          city: lead.city,
          contactName: `${lead.firstName} ${lead.lastName}`,
          contactEmail: lead.email,
          contactPhone: lead.phone,
          contactRole: "",
          status: "onboarding",
          eligibility: {
            triphase: null, waterAccess: null, surfaceAvailable: null,
            truckAccess: null, pluCompatible: null, outsideCoastalBand: null,
            abfZone: null, directionApproval: null,
          },
          leadId: lead.id,
        });
      } else {
        entityId = await createOperator({
          userId: "",
          firstName: lead.firstName,
          lastName: lead.lastName,
          siret: "",
          email: lead.email,
          phone: lead.phone,
          status: "onboarding",
          leadId: lead.id,
        });
      }
      await convertLead(lead.id, entityId);
      setShowConvert(false);
      onClose();
    } catch {
      // error handled by stores
    } finally {
      setConverting(false);
    }
  }

  async function handleReject() {
    await rejectLead(lead.id, rejectReason);
    setShowReject(false);
    onClose();
  }

  const statusCfg = LEAD_STATUS_CONFIG[lead.status];

  return (
    <>
      <div className="space-y-6">
        {/* Status + Type */}
        <div className="flex items-center gap-2">
          {statusCfg && <StatusBadge label={statusCfg.label} color={statusCfg.color} />}
          <span className="text-xs text-charcoal-400">
            {lead.type === "partner" ? "Lead Golf" : "Lead Laveur"}
          </span>
        </div>

        {/* Contact info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-charcoal-400" />
            <span className="text-sm">{lead.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-charcoal-400" />
            <span className="text-sm">{lead.phone || "—"}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-charcoal-400" />
            <span className="text-sm">{lead.city}</span>
          </div>
          {lead.golfName && (
            <div className="flex items-center gap-3">
              <Building2 size={16} className="text-charcoal-400" />
              <span className="text-sm font-medium">{lead.golfName}</span>
            </div>
          )}
        </div>

        {/* Type-specific fields */}
        {lead.type === "operator" && (
          <div className="rounded-lg bg-charcoal-50 p-4 space-y-2">
            <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Profil candidat</p>
            <p className="text-sm"><span className="text-charcoal-500">Statut :</span> {lead.currentStatus || "—"}</p>
            <p className="text-sm"><span className="text-charcoal-500">Motivation :</span> {lead.motivation || "—"}</p>
          </div>
        )}

        {/* SLA */}
        {lead.status === "new" && (() => {
          const sla = getSlaInfo(lead);
          if (!sla) return null;
          return (
            <div className={`rounded-lg p-3 text-sm ${sla.breached ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>
              {sla.breached ? <AlertTriangle size={14} className="inline mr-1" /> : <Clock size={14} className="inline mr-1" />}
              {sla.label}
            </div>
          );
        })()}

        {/* Qualification notes */}
        {(lead.status === "contacted" || lead.status === "qualified") && (
          <div>
            <label className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
              Notes de qualification
            </label>
            <Textarea
              className="mt-2"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Résumé de l'échange, éligibilité, prochaines étapes…"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-2 pt-2 border-t border-border">
          {allowed.includes("contacted") && (
            <Button className="w-full" onClick={() => updateStatus(lead.id, "contacted")}>
              <Phone size={16} /> Marquer comme contacté
            </Button>
          )}
          {allowed.includes("qualified") && (
            <Button className="w-full" onClick={() => updateStatus(lead.id, "qualified", notes)}>
              <CheckCircle2 size={16} /> Qualifier ce lead
            </Button>
          )}
          {allowed.includes("converted") && (
            <Button className="w-full" onClick={() => setShowConvert(true)}>
              <ArrowRight size={16} /> Convertir en {lead.type === "partner" ? "partenaire" : "opérateur"}
            </Button>
          )}
          {allowed.includes("rejected") && (
            <Button variant="outline" className="w-full" onClick={() => setShowReject(true)}>
              <XCircle size={16} /> Rejeter
            </Button>
          )}
        </div>

        {/* Meta */}
        <div className="pt-2 border-t border-border text-xs text-charcoal-400 space-y-1">
          <p>Créé le {new Date(lead.createdAt).toLocaleString("fr-FR")}</p>
          <p>Mis à jour le {new Date(lead.updatedAt).toLocaleString("fr-FR")}</p>
          {lead.convertedEntityId && (
            <p className="text-green-600">
              Converti → <span className="font-mono">{lead.convertedEntityId.slice(0, 12)}…</span>
            </p>
          )}
          {lead.rejectionReason && (
            <p className="text-red-600">Motif de rejet : {lead.rejectionReason}</p>
          )}
        </div>
      </div>

      {/* Convert dialog */}
      <ConfirmDialog
        open={showConvert}
        onClose={() => setShowConvert(false)}
        onConfirm={handleConvert}
        title={`Convertir en ${lead.type === "partner" ? "partenaire" : "opérateur"}`}
        description={`Cela va créer un ${lead.type === "partner" ? "partenaire" : "opérateur"} avec les données de ce lead et initialiser son pipeline d'onboarding.`}
        confirmLabel="Convertir"
        loading={converting}
      />

      {/* Reject dialog */}
      <ConfirmDialog
        open={showReject}
        onClose={() => setShowReject(false)}
        onConfirm={handleReject}
        title="Rejeter ce lead"
        confirmLabel="Rejeter"
        confirmVariant="destructive"
      >
        <Textarea
          rows={2}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Motif du rejet…"
        />
      </ConfirmDialog>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────

export default function LeadsPage() {
  const { loading, error, filters, setFilters, subscribe } = useLeadStore();
  const leads = useFilteredLeads();
  const counts = useLeadCounts();
  const breached = useBreachedLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    const unsub = subscribe();
    return unsub;
  }, [subscribe]);

  // Keep selectedLead synced with store data
  const activeLead = selectedLead
    ? leads.find((l) => l.id === selectedLead.id) ?? selectedLead
    : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal-900">Leads</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Demandes entrantes des golfs et candidats laveurs.
        </p>
      </div>

      {/* SLA Alert */}
      {breached.length > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <AlertTriangle size={18} className="mt-0.5 text-red-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              {breached.length} lead{breached.length > 1 ? "s" : ""} en dépassement SLA
            </p>
            <p className="text-xs text-red-600 mt-0.5">
              Temps de réponse dépassé — action immédiate requise.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {[
          { label: "Total", value: counts.total },
          { label: "Nouveaux", value: counts.new },
          { label: "Contactés", value: counts.contacted },
          { label: "Qualifiés", value: counts.qualified },
          { label: "Convertis", value: counts.converted },
          { label: "Rejetés", value: counts.rejected },
          { label: "SLA dépassé", value: counts.breached, danger: true },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-white p-4">
            <p className="text-sm text-charcoal-500">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.danger ? "text-red-600" : "text-charcoal-900"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-charcoal-500 mr-1">Filtrer :</span>
        <Button variant={!filters.type ? "default" : "secondary"} size="sm" onClick={() => setFilters({ ...filters, type: undefined })}>Tous</Button>
        <Button variant={filters.type === "partner" ? "default" : "secondary"} size="sm" onClick={() => setFilters({ ...filters, type: "partner" })}>
          <Building2 size={14} /> Golfs
        </Button>
        <Button variant={filters.type === "operator" ? "default" : "secondary"} size="sm" onClick={() => setFilters({ ...filters, type: "operator" })}>
          <Users size={14} /> Laveurs
        </Button>
        <span className="mx-2 h-4 w-px bg-border" />
        <Button variant={!filters.status ? "default" : "secondary"} size="sm" onClick={() => setFilters({ ...filters, status: undefined })}>Tous statuts</Button>
        {(["new", "contacted", "qualified"] as const).map((status) => (
          <Button
            key={status}
            variant={filters.status === status ? "default" : "secondary"}
            size="sm"
            onClick={() => setFilters({ ...filters, status })}
          >
            {LEAD_STATUS_CONFIG[status].label}
          </Button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={leads}
        keyExtractor={(l) => l.id}
        onRowClick={(l) => setSelectedLead(l)}
        loading={loading}
        emptyState={
          <EmptyState
            icon={Inbox}
            title="Aucun lead pour le moment"
            description="Les demandes arriveront quand les formulaires du site seront connectés."
          />
        }
      />

      {/* Detail drawer */}
      <SlideOver
        open={!!activeLead}
        onClose={() => setSelectedLead(null)}
        title={activeLead ? `${activeLead.firstName} ${activeLead.lastName}` : ""}
        subtitle={activeLead?.golfName || activeLead?.city}
      >
        {activeLead && <LeadDetail lead={activeLead} onClose={() => setSelectedLead(null)} />}
      </SlideOver>
    </div>
  );
}
