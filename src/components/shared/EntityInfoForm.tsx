"use client";

import { useState } from "react";
import { Pencil, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Types ────────────────────────────────────────────

interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "email" | "tel";
  placeholder?: string;
}

const PARTNER_FIELDS: FieldDef[] = [
  { key: "name", label: "Nom du golf" },
  { key: "siret", label: "SIRET", placeholder: "123 456 789 00012" },
  { key: "address", label: "Adresse" },
  { key: "city", label: "Ville" },
  { key: "contactName", label: "Nom du contact" },
  { key: "contactEmail", label: "Email du contact", type: "email" },
  { key: "contactPhone", label: "Téléphone du contact", type: "tel" },
  { key: "contactRole", label: "Fonction du contact" },
];

const OPERATOR_FIELDS: FieldDef[] = [
  { key: "firstName", label: "Prénom" },
  { key: "lastName", label: "Nom" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Téléphone", type: "tel" },
  { key: "siret", label: "SIRET", placeholder: "123 456 789 00012" },
  { key: "address", label: "Adresse" },
];

// ─── Component ────────────────────────────────────────

interface EntityInfoFormProps {
  entityType: "partner" | "operator";
  data: Record<string, string>;
  onSave: (data: Record<string, string>) => Promise<void>;
}

export function EntityInfoForm({ entityType, data, onSave }: EntityInfoFormProps) {
  const fields = entityType === "partner" ? PARTNER_FIELDS : OPERATOR_FIELDS;
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit() {
    const initial: Record<string, string> = {};
    for (const field of fields) {
      initial[field.key] = data[field.key] ?? "";
    }
    setFormData(initial);
    setEditing(true);
    setError(null);
  }

  function cancel() {
    setEditing(false);
    setError(null);
  }

  async function save() {
    // Validate
    const siret = formData.siret?.replace(/\s/g, "");
    if (siret && siret.length > 0 && siret.length !== 14 && !/^\d{14}$/.test(siret)) {
      setError("Le SIRET doit contenir 14 chiffres.");
      return;
    }
    const email = formData.email ?? formData.contactEmail;
    if (email && email.length > 0 && !email.includes("@")) {
      setError("L'adresse email n'est pas valide.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(formData);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-charcoal-900">Informations</h3>
        {!editing ? (
          <Button size="sm" variant="outline" onClick={startEdit}>
            <Pencil size={14} /> Modifier
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={cancel} disabled={saving}>
              <X size={14} /> Annuler
            </Button>
            <Button size="sm" onClick={save} disabled={saving}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Enregistrer
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Fields grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-medium text-charcoal-500 mb-1">
              {field.label}
            </label>
            {editing ? (
              <Input
                type={field.type ?? "text"}
                value={formData[field.key] ?? ""}
                placeholder={field.placeholder ?? field.label}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
              />
            ) : (
              <p className="text-sm text-charcoal-900 py-2">
                {data[field.key] || <span className="text-charcoal-400 italic">Non renseigné</span>}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
