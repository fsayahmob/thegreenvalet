"use client";

import { useState, useMemo, useRef } from "react";
import { FileCheck, AlertCircle, Printer, Save, Send, CheckCircle2, PenTool, Plus, Trash2 } from "lucide-react";
import { SlideOver } from "./SlideOver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocumentStore } from "@/stores/useDocumentStore";
import { useYousignStore } from "@/stores/useYousignStore";
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

// ─── Signer Form ─────────────────────────────────────

interface SignerEntry {
  firstName: string;
  lastName: string;
  email: string;
}

function SignerFormPanel({
  signers,
  onChange,
  onSend,
  sending,
  error,
}: {
  signers: SignerEntry[];
  onChange: (signers: SignerEntry[]) => void;
  onSend: () => void;
  sending: boolean;
  error: string | null;
}) {
  function updateSigner(idx: number, field: keyof SignerEntry, value: string) {
    const updated = [...signers];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange(updated);
  }

  function addSigner() {
    if (signers.length >= 5) return;
    onChange([...signers, { firstName: "", lastName: "", email: "" }]);
  }

  function removeSigner(idx: number) {
    if (signers.length <= 1) return;
    onChange(signers.filter((_, i) => i !== idx));
  }

  const isValid = signers.every((s) => s.firstName && s.lastName && s.email.includes("@"));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-charcoal-700">
        <PenTool size={16} />
        Signataires
      </div>

      {signers.map((signer, idx) => (
        <div key={idx} className="rounded-lg border border-border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-charcoal-500">Signataire {idx + 1}</span>
            {signers.length > 1 && (
              <button onClick={() => removeSigner(idx)} className="text-red-400 hover:text-red-600">
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Pr&eacute;nom"
              value={signer.firstName}
              onChange={(e) => updateSigner(idx, "firstName", e.target.value)}
            />
            <Input
              placeholder="Nom"
              value={signer.lastName}
              onChange={(e) => updateSigner(idx, "lastName", e.target.value)}
            />
          </div>
          <Input
            type="email"
            placeholder="Email"
            value={signer.email}
            onChange={(e) => updateSigner(idx, "email", e.target.value)}
          />
        </div>
      ))}

      {signers.length < 5 && (
        <button
          onClick={addSigner}
          className="flex items-center gap-1 text-sm text-charcoal-500 hover:text-charcoal-700 transition-colors"
        >
          <Plus size={14} /> Ajouter un signataire
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button
          onClick={onSend}
          disabled={sending || !isValid}
          className="gap-1.5"
        >
          {sending ? (
            <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <Send size={16} />
          )}
          {sending ? "Envoi en cours..." : "Envoyer \u00e0 signature"}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────

type Step = "fields" | "preview" | "signers" | "sending" | "sent";

interface DocumentGeneratorProps {
  open: boolean;
  onClose: () => void;
  template: DocumentTemplate;
  entityType: EntityType;
  entityId: string;
  context: Record<string, unknown>;
  onGenerated?: () => void;
  requiresSignature?: boolean;
}

export function DocumentGenerator({
  open,
  onClose,
  template,
  entityType,
  entityId,
  context,
  onGenerated,
  requiresSignature = false,
}: DocumentGeneratorProps) {
  const uploadDocument = useDocumentStore((s) => s.uploadDocument);
  const sendToSignature = useYousignStore((s) => s.sendToSignature);
  const [manualValues, setManualValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<Step>("fields");
  const [generatedDocId, setGeneratedDocId] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Default signer pre-filled from context
  const defaultSigner = useMemo((): SignerEntry => {
    if (entityType === "partner") {
      const partner = context.partner as Record<string, unknown> | undefined;
      return {
        firstName: ((partner?.contactName as string) ?? "").split(" ")[0] ?? "",
        lastName: ((partner?.contactName as string) ?? "").split(" ").slice(1).join(" ") ?? "",
        email: (partner?.contactEmail as string) ?? "",
      };
    }
    const operator = context.operator as Record<string, unknown> | undefined;
    return {
      firstName: (operator?.firstName as string) ?? "",
      lastName: (operator?.lastName as string) ?? "",
      email: (operator?.email as string) ?? "",
    };
  }, [context, entityType]);

  const [signers, setSigners] = useState<SignerEntry[]>([defaultSigner]);

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
    for (const field of template.mergeFields) {
      if (!autoValues[field.key] && manualValues[field.key]) {
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

  async function handleGeneratePdf() {
    if (!template.content) return;
    setSaving(true);
    try {
      // Dynamic import of html2pdf.js (client-only library)
      const html2pdf = (await import("html2pdf.js")).default;

      // Create a temporary container for PDF rendering
      const container = document.createElement("div");
      container.innerHTML = merged.html;
      container.style.width = "210mm";
      container.style.padding = "20mm";
      container.style.fontFamily = "Arial, sans-serif";
      container.style.fontSize = "11pt";
      container.style.lineHeight = "1.5";
      document.body.appendChild(container);

      const pdfBlob: Blob = await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `${template.type}_${entityId.slice(0, 8)}.pdf`,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(container)
        .outputPdf("blob");

      document.body.removeChild(container);

      const fileName = `${template.type}_${entityId.slice(0, 8)}_${Date.now()}.pdf`;
      const file = new File([pdfBlob], fileName, { type: "application/pdf" });

      // Upload via document store
      const docId = await uploadDocument(file, entityType, entityId, template.type);
      setGeneratedDocId(docId);

      if (requiresSignature) {
        // Move to signer step
        setStep("signers");
      } else {
        onGenerated?.();
        onClose();
      }
    } catch {
      // Error handled by store
    } finally {
      setSaving(false);
    }
  }

  async function handleSendToSignature() {
    if (!generatedDocId) return;
    setStep("sending");
    setSignError(null);
    try {
      await sendToSignature(generatedDocId, entityType, entityId, signers);
      setStep("sent");
      onGenerated?.();
    } catch (err) {
      setSignError(err instanceof Error ? err.message : "Erreur lors de l\u2019envoi \u00e0 signature.");
      setStep("signers");
    }
  }

  function handleClose() {
    setStep("fields");
    setGeneratedDocId(null);
    setSignError(null);
    setManualValues({});
    setSigners([defaultSigner]);
    onClose();
  }

  const stepLabel =
    step === "fields" ? "Champs" :
    step === "preview" ? "Aper\u00e7u" :
    step === "signers" ? "Signataires" :
    step === "sending" ? "Envoi..." :
    "Envoy\u00e9";

  return (
    <SlideOver
      open={open}
      onClose={handleClose}
      title={`G\u00e9n\u00e9rer : ${template.name}`}
      subtitle={step === "sent" ? "Document envoy\u00e9 \u00e0 signature" : template.description}
      wide
    >
      {!template.content ? (
        <div className="py-12 text-center">
          <AlertCircle size={32} className="mx-auto text-amber-400 mb-3" />
          <p className="text-charcoal-500">Ce template n&apos;a pas de contenu HTML configur&eacute;.</p>
          <p className="text-sm text-charcoal-400 mt-1">Utilisez le bouton &laquo; Seed contenu templates &raquo; dans les param&egrave;tres.</p>
        </div>
      ) : step === "sent" ? (
        /* ─── Success state ─── */
        <div className="py-12 text-center space-y-3">
          <CheckCircle2 size={48} className="mx-auto text-green-500" />
          <h3 className="text-lg font-semibold text-charcoal-900">Document envoy&eacute; &agrave; signature</h3>
          <p className="text-sm text-charcoal-500">
            Les signataires recevront un email de Yousign avec le lien de signature.
          </p>
          <Button onClick={handleClose} className="mt-4">Fermer</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Step tabs */}
          <div className="flex gap-2 border-b border-border pb-3">
            {(["fields", "preview", ...(requiresSignature ? ["signers"] : [])] as Step[]).map((s) => (
              <button
                key={s}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  step === s ? "bg-green-50 text-green-900" : "text-charcoal-500 hover:text-charcoal-700"
                }`}
                onClick={() => {
                  if (s === "signers" && !generatedDocId) return; // Can't go to signers without generating first
                  setStep(s);
                }}
                disabled={s === "signers" && !generatedDocId}
              >
                {s === "fields" ? "Champs" : s === "preview" ? "Aper\u00e7u" : "Signataires"}
              </button>
            ))}
            <span className="ml-auto text-xs text-charcoal-400 self-center">{stepLabel}</span>
          </div>

          {step === "fields" && (
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
          )}

          {step === "preview" && (
            /* ─── Preview panel ─── */
            <div className="rounded-xl border border-border bg-white overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-charcoal-50 border-b border-border">
                <span className="text-xs font-medium text-charcoal-500">Aper&ccedil;u du document</span>
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
                ref={previewRef}
                className="p-6 prose prose-sm max-w-none overflow-auto max-h-[60vh]"
                dangerouslySetInnerHTML={{ __html: merged.html }}
              />
            </div>
          )}

          {step === "signers" && (
            /* ─── Signers panel ─── */
            <SignerFormPanel
              signers={signers}
              onChange={setSigners}
              onSend={handleSendToSignature}
              sending={false}
              error={signError}
            />
          )}

          {step === "sending" && (
            <div className="py-12 text-center space-y-3">
              <span className="inline-block animate-spin h-8 w-8 border-3 border-green-200 border-t-green-600 rounded-full" />
              <p className="text-sm text-charcoal-500">Envoi &agrave; Yousign en cours...</p>
            </div>
          )}

          {/* Missing fields warning */}
          {(step === "fields" || step === "preview") && hasMissing && (
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

          {/* Actions (only for fields/preview steps) */}
          {(step === "fields" || step === "preview") && (
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button
                onClick={handleGeneratePdf}
                disabled={saving || hasMissing}
                className="gap-1.5"
              >
                {saving ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                ) : requiresSignature ? (
                  <>
                    <FileCheck size={16} />
                    <PenTool size={14} />
                  </>
                ) : (
                  <>
                    <FileCheck size={16} />
                    <Save size={14} />
                  </>
                )}
                {saving ? "G\u00e9n\u00e9ration PDF..." : requiresSignature ? "G\u00e9n\u00e9rer & signer" : "G\u00e9n\u00e9rer le document"}
              </Button>
            </div>
          )}
        </div>
      )}
    </SlideOver>
  );
}
