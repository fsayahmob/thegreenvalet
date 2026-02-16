"use client";

import { useState, useMemo } from "react";
import { FileCheck, AlertCircle, Printer, Save } from "lucide-react";
import { SlideOver } from "./SlideOver";
import { Button } from "@/components/ui/button";
import { useDocumentStore } from "@/stores/useDocumentStore";
import { mergeTemplate, resolveFieldValue } from "@/lib/merge-engine";
import type { DocumentTemplate, EntityType, MergeFieldDefinition } from "@/lib/types";

// ─── Field input ─────────────────────────────────────

function MergeFieldInput({
  field,
  value,
  autoValue,
  onChange,
}: {
  field: MergeFieldDefinition;
  value: string;
  autoValue: string;
  onChange: (val: string) => void;
}) {
  const isAuto = !!autoValue;
  const displayValue = isAuto ? autoValue : value;

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 min-w-0">
        <label className="text-xs font-medium text-charcoal-500 block mb-1">
          {field.label}
          {field.required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {isAuto ? (
          <p className="text-sm text-charcoal-900 bg-charcoal-50 rounded-lg px-3 py-1.5 truncate">
            {displayValue || "—"}
          </p>
        ) : (
          <input
            type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.label}
            className="w-full rounded-lg border border-border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        )}
      </div>
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded mt-5 shrink-0 ${
          isAuto ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
        }`}
      >
        {isAuto ? "auto" : "manuel"}
      </span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────

interface DocumentGeneratorProps {
  open: boolean;
  onClose: () => void;
  template: DocumentTemplate;
  entityType: EntityType;
  entityId: string;
  context: Record<string, unknown>;
  onGenerated?: () => void;
}

export function DocumentGenerator({
  open,
  onClose,
  template,
  entityType,
  entityId,
  context,
  onGenerated,
}: DocumentGeneratorProps) {
  const uploadDocument = useDocumentStore((s) => s.uploadDocument);
  const [manualValues, setManualValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Resolve auto values from context
  const autoValues = useMemo(() => {
    const map: Record<string, string> = {};
    for (const field of template.mergeFields) {
      const resolved = resolveFieldValue(field.source, context);
      if (resolved) map[field.key] = resolved;
    }
    return map;
  }, [template.mergeFields, context]);

  // Build full merge context with manual overrides
  const fullContext = useMemo(() => {
    const ctx = { ...context };
    // Inject manual values under a flat namespace accessible by the merge engine
    for (const field of template.mergeFields) {
      if (!autoValues[field.key] && manualValues[field.key]) {
        // Build the source path and inject
        const parts = field.source.split(".");
        if (parts.length === 2) {
          const [ns, key] = parts;
          if (!ctx[ns] || typeof ctx[ns] !== "object") {
            ctx[ns] = {};
          }
          (ctx[ns] as Record<string, unknown>)[key] = manualValues[field.key];
        }
      }
    }
    return ctx;
  }, [context, manualValues, autoValues, template.mergeFields]);

  // Merge
  const merged = useMemo(() => {
    if (!template.content) return { html: "", missingFields: [] as string[] };
    return mergeTemplate(template.content, template.mergeFields, fullContext);
  }, [template, fullContext]);

  const hasMissing = merged.missingFields.length > 0;

  async function handleGenerate() {
    if (!template.content) return;
    setSaving(true);
    try {
      // Create an HTML blob as a file
      const blob = new Blob([merged.html], { type: "text/html" });
      const fileName = `${template.type}_${entityId.slice(0, 8)}_${Date.now()}.html`;
      const file = new File([blob], fileName, { type: "text/html" });

      // Upload via document store — this stores file + creates Firestore entry
      await uploadDocument(file, entityType, entityId, template.type);

      onGenerated?.();
      onClose();
    } catch {
      // Error handled by store
    } finally {
      setSaving(false);
    }
  }

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={`Générer : ${template.name}`}
      subtitle={template.description}
      wide
    >
      {!template.content ? (
        <div className="py-12 text-center">
          <AlertCircle size={32} className="mx-auto text-amber-400 mb-3" />
          <p className="text-charcoal-500">Ce template n&apos;a pas de contenu HTML configuré.</p>
          <p className="text-sm text-charcoal-400 mt-1">Utilisez le bouton &laquo; Seed contenu templates &raquo; dans les paramètres.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Toggle */}
          <div className="flex gap-2 border-b border-border pb-3">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                !showPreview ? "bg-green-50 text-green-900" : "text-charcoal-500 hover:text-charcoal-700"
              }`}
              onClick={() => setShowPreview(false)}
            >
              Champs
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                showPreview ? "bg-green-50 text-green-900" : "text-charcoal-500 hover:text-charcoal-700"
              }`}
              onClick={() => setShowPreview(true)}
            >
              Aperçu
            </button>
          </div>

          {!showPreview ? (
            /* ─── Fields panel ─── */
            <div className="space-y-1 divide-y divide-border/30">
              {template.mergeFields.map((field) => (
                <MergeFieldInput
                  key={field.key}
                  field={field}
                  value={manualValues[field.key] ?? ""}
                  autoValue={autoValues[field.key] ?? ""}
                  onChange={(val) =>
                    setManualValues((prev) => ({ ...prev, [field.key]: val }))
                  }
                />
              ))}
            </div>
          ) : (
            /* ─── Preview panel ─── */
            <div className="rounded-xl border border-border bg-white overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-charcoal-50 border-b border-border">
                <span className="text-xs font-medium text-charcoal-500">Aperçu du document</span>
                <button
                  onClick={() => {
                    const w = window.open("", "_blank");
                    if (w) {
                      w.document.write(merged.html);
                      w.document.close();
                      w.print();
                    }
                  }}
                  className="flex items-center gap-1 text-xs text-charcoal-500 hover:text-charcoal-700 transition-colors"
                >
                  <Printer size={12} /> Imprimer
                </button>
              </div>
              <div
                className="p-6 prose prose-sm max-w-none overflow-auto max-h-[60vh]"
                dangerouslySetInnerHTML={{ __html: merged.html }}
              />
            </div>
          )}

          {/* Missing fields warning */}
          {hasMissing && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
              <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Champs manquants</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  {merged.missingFields.map((k) => {
                    const f = template.mergeFields.find((mf) => mf.key === k);
                    return f?.label ?? k;
                  }).join(", ")}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={saving || hasMissing}
              className="gap-1.5"
            >
              {saving ? (
                <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <>
                  <FileCheck size={16} />
                  <Save size={14} />
                </>
              )}
              {saving ? "Génération…" : "Générer le document"}
            </Button>
          </div>
        </div>
      )}
    </SlideOver>
  );
}
