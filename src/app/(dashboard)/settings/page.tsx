"use client";

import { useState } from "react";
import {
  Database,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  setDoc,
  doc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/stores/useAuthStore";
import { COLLECTIONS, SLA } from "@/lib/config";
import { SEED_TEMPLATES, SEED_LEADS } from "@/lib/seed-data";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const [promoting, setPromoting] = useState(false);
  const [promoted, setPromoted] = useState(false);
  const [promoteError, setPromoteError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{
    templates: number;
    leads: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Template content seed state
  const [seedingContent, setSeedingContent] = useState(false);
  const [contentResult, setContentResult] = useState<number | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  async function handleSeed() {
    setSeeding(true);
    setError(null);
    setSeedResult(null);

    try {
      const createdBy = user?.uid ?? "admin";
      let templatesCreated = 0;
      let leadsCreated = 0;

      // 1. Seed templates (skip if already seeded)
      const existingTemplates = await getDocs(
        query(collection(db, COLLECTIONS.TEMPLATES)),
      );
      if (existingTemplates.size === 0) {
        for (const tpl of SEED_TEMPLATES) {
          await addDoc(collection(db, COLLECTIONS.TEMPLATES), {
            type: tpl.type,
            name: tpl.name,
            description: tpl.description,
            entityType: tpl.entityType,
            mergeFields: tpl.mergeFields,
            content: tpl.content ?? "",
            isActive: true,
            isPublic: tpl.isPublic,
            version: 1,
            fileUrl: "",
            fileName: "",
            createdBy,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          templatesCreated++;
        }
      }

      // 2. Seed leads (skip if already seeded)
      const existingLeads = await getDocs(
        query(
          collection(db, COLLECTIONS.LEADS),
          where("email", "in", SEED_LEADS.map((l) => l.email)),
        ),
      );
      if (existingLeads.size === 0) {
        for (const lead of SEED_LEADS) {
          const slaDeadline = new Date();
          slaDeadline.setHours(
            slaDeadline.getHours() +
              (lead.type === "partner" ? SLA.PARTNER_HOURS : SLA.OPERATOR_HOURS),
          );

          await addDoc(collection(db, COLLECTIONS.LEADS), {
            ...lead,
            slaDeadline: Timestamp.fromDate(slaDeadline),
            slaBreached: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          leadsCreated++;
        }
      }

      setSeedResult({ templates: templatesCreated, leads: leadsCreated });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du seed");
    } finally {
      setSeeding(false);
    }
  }

  async function handleSeedContent() {
    setSeedingContent(true);
    setContentError(null);
    setContentResult(null);

    try {
      let updated = 0;
      const templatesWithContent = SEED_TEMPLATES.filter((t) => t.content);

      for (const tpl of templatesWithContent) {
        // Find existing template by type
        const snap = await getDocs(
          query(
            collection(db, COLLECTIONS.TEMPLATES),
            where("type", "==", tpl.type),
            where("isActive", "==", true),
          ),
        );
        for (const d of snap.docs) {
          await updateDoc(doc(db, COLLECTIONS.TEMPLATES, d.id), {
            content: tpl.content,
            updatedAt: serverTimestamp(),
          });
          updated++;
        }
      }

      setContentResult(updated);
    } catch (err) {
      setContentError(err instanceof Error ? err.message : "Erreur lors du seed contenu");
    } finally {
      setSeedingContent(false);
    }
  }

  async function handlePromoteAdmin() {
    if (!user) return;
    setPromoting(true);
    setPromoteError(null);
    try {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName ?? user.email,
        role: "admin",
        createdAt: serverTimestamp(),
      }, { merge: true });
      setPromoted(true);
      // Reload page to pick up new role
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setPromoteError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setPromoting(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal-900">Paramètres</h1>
        <p className="mt-1 text-sm text-charcoal-500">
          Configuration et initialisation de la plateforme.
        </p>
      </div>

      {/* Admin Setup — shown only when user is NOT admin */}
      {role !== "admin" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 max-w-lg mb-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-amber-100 p-2.5">
              <ShieldCheck size={20} className="text-amber-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-charcoal-900">
                Configuration administrateur
              </h2>
              <p className="mt-1 text-sm text-charcoal-600">
                Votre compte n&apos;a pas le r&ocirc;le admin. Cliquez ci-dessous pour activer
                l&apos;acc&egrave;s complet (documents, partenaires, op&eacute;rateurs, etc.).
              </p>
              <p className="mt-1 text-xs text-charcoal-500">
                Connect&eacute; : {user?.email} &middot; R&ocirc;le actuel : {role ?? "aucun"}
              </p>

              <Button
                className="mt-4"
                onClick={handlePromoteAdmin}
                disabled={promoting || promoted}
              >
                {promoting ? (
                  <><Loader2 size={16} className="animate-spin" /> Activation...</>
                ) : promoted ? (
                  <><CheckCircle2 size={16} /> Admin activ&eacute; — rechargement...</>
                ) : (
                  <><ShieldCheck size={16} /> Activer le r&ocirc;le admin</>
                )}
              </Button>

              {promoteError && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                  <AlertTriangle size={14} className="mt-0.5 text-red-600 shrink-0" />
                  <p className="text-sm text-red-800">{promoteError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Seed Data Section */}
      <div className="rounded-xl border border-border bg-white p-6 max-w-lg">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-green-50 p-2.5">
            <Database size={20} className="text-green-700" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-charcoal-900">
              Initialiser les données
            </h2>
            <p className="mt-1 text-sm text-charcoal-500">
              Crée les 6 templates de base (Convention, CGV, CGU, Specs,
              Plaquette, Fiche Métier) et 2 leads de test. Cette action est
              idempotente — elle ne crée rien si les données existent déjà.
            </p>

            <Button
              className="mt-4"
              onClick={handleSeed}
              disabled={seeding}
            >
              {seeding ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Initialisation…
                </>
              ) : (
                <>
                  <Database size={16} /> Lancer le seed
                </>
              )}
            </Button>

            {seedResult && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
                <CheckCircle2
                  size={16}
                  className="mt-0.5 text-green-600 shrink-0"
                />
                <p className="text-sm text-green-800">
                  {seedResult.templates > 0 || seedResult.leads > 0
                    ? `${seedResult.templates} template${seedResult.templates > 1 ? "s" : ""} et ${seedResult.leads} lead${seedResult.leads > 1 ? "s" : ""} créés avec succès.`
                    : "Les données existent déjà — rien à créer."}
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <AlertTriangle
                  size={16}
                  className="mt-0.5 text-red-600 shrink-0"
                />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seed Template Content Section */}
      <div className="rounded-xl border border-border bg-white p-6 max-w-lg mt-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-blue-50 p-2.5">
            <FileText size={20} className="text-blue-700" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-charcoal-900">
              Seed contenu templates
            </h2>
            <p className="mt-1 text-sm text-charcoal-500">
              Écrit le contenu HTML (Convention + CGV) dans les templates
              existants en Firestore. Nécessaire pour la génération de documents.
            </p>

            <Button
              className="mt-4"
              variant="outline"
              onClick={handleSeedContent}
              disabled={seedingContent}
            >
              {seedingContent ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Écriture…
                </>
              ) : (
                <>
                  <FileText size={16} /> Écrire le contenu
                </>
              )}
            </Button>

            {contentResult !== null && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
                <CheckCircle2
                  size={16}
                  className="mt-0.5 text-green-600 shrink-0"
                />
                <p className="text-sm text-green-800">
                  {contentResult > 0
                    ? `${contentResult} template${contentResult > 1 ? "s" : ""} mis à jour avec le contenu HTML.`
                    : "Aucun template trouvé à mettre à jour. Lancez d'abord le seed initial."}
                </p>
              </div>
            )}

            {contentError && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                <AlertTriangle
                  size={16}
                  className="mt-0.5 text-red-600 shrink-0"
                />
                <p className="text-sm text-red-800">{contentError}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
