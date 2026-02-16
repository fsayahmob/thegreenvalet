"use client";

import { useEffect, useState } from "react";
import {
  FileStack,
  Plus,
  Globe,
  Lock,
  ToggleLeft,
  ToggleRight,
  History,
  Download,
} from "lucide-react";
import { useTemplateStore } from "@/stores/useTemplateStore";
import { useAuthStore } from "@/stores/useAuthStore";
import type { DocumentTemplate, TemplateType, EntityType } from "@/lib/types";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { SlideOver } from "@/components/shared/SlideOver";
import { DocumentUploader } from "@/components/shared/DocumentUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { StatusColor } from "@/lib/config";

// ─── Config ───────────────────────────────────────────

const TEMPLATE_TYPE_LABELS: Record<TemplateType, string> = {
  convention: "Convention",
  cgv: "CGV",
  cgu: "CGU",
  plaquette: "Plaquette",
  fiche_metier: "Fiche métier",
  specs: "Specs techniques",
};

const ENTITY_TYPE_LABELS: Record<EntityType | "all", string> = {
  partner: "Partenaires",
  operator: "Opérateurs",
  site: "Sites",
  all: "Tous",
};

// ─── Columns ──────────────────────────────────────────

const columns: Column<DocumentTemplate>[] = [
  {
    key: "name",
    header: "Template",
    sortable: true,
    sortValue: (t) => t.name,
    render: (t) => (
      <div>
        <p className="text-sm font-medium text-charcoal-900">{t.name}</p>
        <p className="text-xs text-charcoal-500">{t.description.slice(0, 60)}{t.description.length > 60 ? "…" : ""}</p>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    render: (t) => (
      <span className="text-sm text-charcoal-700">{TEMPLATE_TYPE_LABELS[t.type] ?? t.type}</span>
    ),
  },
  {
    key: "entity",
    header: "Cible",
    render: (t) => (
      <span className="text-sm text-charcoal-600">{ENTITY_TYPE_LABELS[t.entityType] ?? t.entityType}</span>
    ),
  },
  {
    key: "version",
    header: "Version",
    render: (t) => (
      <span className="inline-flex items-center gap-1 text-xs font-mono bg-charcoal-100 px-2 py-0.5 rounded">
        v{t.version}
      </span>
    ),
  },
  {
    key: "status",
    header: "Statut",
    render: (t) => {
      const label = t.isActive ? "Actif" : "Archivé";
      const color: StatusColor = t.isActive ? "green" : "gray";
      return (
        <div className="flex items-center gap-2">
          <StatusBadge label={label} color={color} />
          {t.isPublic && (
            <span className="inline-flex items-center gap-1 text-xs text-blue-600">
              <Globe size={12} /> Public
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "date",
    header: "Créé le",
    sortable: true,
    sortValue: (t) => new Date(t.createdAt).getTime(),
    render: (t) => (
      <span className="text-xs text-charcoal-500">
        {new Date(t.createdAt).toLocaleDateString("fr-FR")}
      </span>
    ),
  },
];

// ─── Create Template Dialog ───────────────────────────

function CreateTemplateForm({ onClose }: { onClose: () => void }) {
  const { createTemplate } = useTemplateStore();
  const { user } = useAuthStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TemplateType>("convention");
  const [entityType, setEntityType] = useState<EntityType | "all">("partner");
  const [isPublic, setIsPublic] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!name || !file) {
      setError("Le nom et le fichier sont obligatoires.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createTemplate(file, {
        type,
        name,
        description,
        entityType,
        mergeFields: [],
        isActive: true,
        isPublic,
        createdBy: user?.uid ?? "admin",
      });
      // H5: Reset form state before closing
      setName(""); setDescription(""); setType("convention");
      setEntityType("partner"); setIsPublic(false); setFile(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur création");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Nom</label>
        <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Convention d'occupation temporaire" />
      </div>
      <div>
        <label className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Description</label>
        <Textarea className="mt-1" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Template de convention pour les golfs partenaires…" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Type</label>
          <select
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
            value={type}
            onChange={(e) => setType(e.target.value as TemplateType)}
          >
            {Object.entries(TEMPLATE_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Cible</label>
          <select
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value as EntityType | "all")}
          >
            {Object.entries(ENTITY_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="h-4 w-4 rounded border-charcoal-300" />
        <span className="text-sm text-charcoal-700">Visible publiquement (site vitrine)</span>
      </label>

      <div>
        <label className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider mb-2 block">Fichier</label>
        <DocumentUploader
          accept=".pdf,.docx"
          maxSizeMB={20}
          label="Glissez le template ici"
          onUpload={async (f) => { setFile(f); }}
        />
        {file && <p className="text-xs text-green-600 mt-1">Fichier sélectionné : {file.name}</p>}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button className="w-full" onClick={handleSubmit} disabled={loading}>
        {loading ? "Création en cours…" : "Créer le template"}
      </Button>
    </div>
  );
}

// ─── Template Detail ──────────────────────────────────

function TemplateDetail({ template }: { template: DocumentTemplate }) {
  const { toggleActive, togglePublic } = useTemplateStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <StatusBadge label={template.isActive ? "Actif" : "Archivé"} color={template.isActive ? "green" : "gray"} />
        <span className="text-xs font-mono bg-charcoal-100 px-2 py-0.5 rounded">v{template.version}</span>
        {template.isPublic && <span className="text-xs text-blue-600 flex items-center gap-1"><Globe size={12} /> Public</span>}
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-charcoal-500">Type</p>
          <p className="font-medium text-charcoal-900">{TEMPLATE_TYPE_LABELS[template.type]}</p>
        </div>
        <div>
          <p className="text-charcoal-500">Cible</p>
          <p className="font-medium text-charcoal-900">{ENTITY_TYPE_LABELS[template.entityType]}</p>
        </div>
        <div>
          <p className="text-charcoal-500">Description</p>
          <p className="font-medium text-charcoal-900">{template.description || "—"}</p>
        </div>
        <div>
          <p className="text-charcoal-500">Fichier</p>
          <p className="font-medium text-charcoal-900">{template.fileName}</p>
        </div>
        {template.changelog && (
          <div>
            <p className="text-charcoal-500">Changelog</p>
            <p className="font-medium text-charcoal-900">{template.changelog}</p>
          </div>
        )}
        {template.mergeFields.length > 0 && (
          <div>
            <p className="text-charcoal-500 mb-1">Merge fields ({template.mergeFields.length})</p>
            <div className="space-y-1">
              {template.mergeFields.map((f) => (
                <div key={f.key} className="flex items-center gap-2 text-xs">
                  <span className="font-mono bg-charcoal-100 px-1.5 py-0.5 rounded">{`{{${f.key}}}`}</span>
                  <span className="text-charcoal-500">{f.label}</span>
                  {f.required && <span className="text-red-500 text-[10px]">requis</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2 border-t border-border">
        {template.fileUrl && (
          <a
            href={template.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors"
          >
            <Download size={16} /> Télécharger
          </a>
        )}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => toggleActive(template.id)}
        >
          {template.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          {template.isActive ? "Archiver" : "Réactiver"}
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => togglePublic(template.id)}
        >
          {template.isPublic ? <Lock size={16} /> : <Globe size={16} />}
          {template.isPublic ? "Rendre privé" : "Rendre public"}
        </Button>
      </div>

      {/* Meta */}
      <div className="pt-2 border-t border-border text-xs text-charcoal-400 space-y-1">
        <p>Créé le {new Date(template.createdAt).toLocaleString("fr-FR")}</p>
        <p>Par {template.createdBy}</p>
        {template.previousVersionId && (
          <p className="flex items-center gap-1"><History size={12} /> Version précédente : {template.previousVersionId.slice(0, 12)}…</p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────

export default function TemplatesPage() {
  const templates = useTemplateStore((s) => s.templates);
  const loading = useTemplateStore((s) => s.loading);
  const [selected, setSelected] = useState<DocumentTemplate | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [filterType, setFilterType] = useState<TemplateType | "all">("all");

  useEffect(() => {
    const unsub = useTemplateStore.getState().subscribe();
    return unsub;
  }, []);

  const filtered = filterType === "all"
    ? templates
    : templates.filter((t) => t.type === filterType);

  const activeTemplate = selected
    ? templates.find((t) => t.id === selected.id) ?? selected
    : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Templates</h1>
          <p className="mt-1 text-sm text-charcoal-500">
            Conventions, CGV, documents commerciaux et fiches techniques.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Nouveau template
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <Button
          variant={filterType === "all" ? "default" : "secondary"}
          size="sm"
          onClick={() => setFilterType("all")}
        >
          Tous
        </Button>
        {(Object.keys(TEMPLATE_TYPE_LABELS) as TemplateType[]).map((type) => (
          <Button
            key={type}
            variant={filterType === type ? "default" : "secondary"}
            size="sm"
            onClick={() => setFilterType(type)}
          >
            {TEMPLATE_TYPE_LABELS[type]}
          </Button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(t) => t.id}
        onRowClick={(t) => setSelected(t)}
        loading={loading}
        searchable
        searchPlaceholder="Rechercher un template…"
        searchKeys={(t) => `${t.name} ${t.description}`}
        emptyState={
          <EmptyState
            icon={FileStack}
            title="Aucun template"
            description="Créez votre premier template pour commencer."
            action={
              <Button onClick={() => setShowCreate(true)}>
                <Plus size={16} /> Créer un template
              </Button>
            }
          />
        }
      />

      {/* Detail drawer */}
      <SlideOver
        open={!!activeTemplate}
        onClose={() => setSelected(null)}
        title={activeTemplate?.name ?? ""}
        subtitle={activeTemplate ? `v${activeTemplate.version} — ${TEMPLATE_TYPE_LABELS[activeTemplate.type]}` : undefined}
      >
        {activeTemplate && <TemplateDetail template={activeTemplate} />}
      </SlideOver>

      {/* Create drawer */}
      <SlideOver
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Nouveau template"
        subtitle="Uploadez un fichier et configurez les métadonnées"
      >
        <CreateTemplateForm onClose={() => setShowCreate(false)} />
      </SlideOver>
    </div>
  );
}
