"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Calculator,
  Users,
  ParkingCircle,
  ChevronRight,
  ChevronLeft,
  Send,
  CheckCircle,
  Loader2,
  Droplets,
  Leaf,
  TrendingUp,
  Euro,
} from "lucide-react";
import { httpsCallable } from "firebase/functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";
import { functions } from "@/lib/firebase";

/* ─── Data ─── */

const regions = [
  "Auvergne-Rhône-Alpes",
  "Bourgogne-Franche-Comté",
  "Bretagne",
  "Centre-Val de Loire",
  "Corse",
  "Grand Est",
  "Hauts-de-France",
  "Île-de-France",
  "Normandie",
  "Nouvelle-Aquitaine",
  "Occitanie",
  "Pays de la Loire",
  "Provence-Alpes-Côte d'Azur",
];

const courseTypes = [
  { value: "9", label: "9 trous", factor: 0.7 },
  { value: "18", label: "18 trous", factor: 1.0 },
  { value: "27", label: "27 trous", factor: 1.2 },
  { value: "36", label: "36 trous", factor: 1.4 },
];

const serviceOptions = [
  "Restaurant / Club-house",
  "Pro-shop",
  "Practice / Driving range",
  "Hôtel / Spa",
  "Académie / Cours",
];

/* ─── Animated counter hook ─── */

function useAnimatedCounter(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return value;
}

/* ─── Types ─── */

interface SimData {
  region: string;
  courseType: string;
  membres: number;
  greenFees: number;
  joursOuverture: number;
  placesParking: number;
  moisSaison: number;
  services: string[];
  golfName: string;
  contactName: string;
  email: string;
  phone: string;
}

/* ─── Calculator ─── */

function calculateResults(data: SimData) {
  const courseFactor =
    courseTypes.find((c) => c.value === data.courseType)?.factor ?? 1;
  const servicePremium = 1 + data.services.length * 0.04;
  const penetrationRate = 0.18 * courseFactor * servicePremium;
  const monthlyFreq = 1.4;
  const avgTicket = 45;
  const golfShare = 0.10;

  const totalPool = data.membres + data.greenFees * 4;
  const monthlyWashes = Math.round(totalPool * penetrationRate * monthlyFreq);
  const monthlyRevenue = Math.round(monthlyWashes * avgTicket * golfShare);
  const annualRevenue = Math.round(
    monthlyRevenue * data.moisSaison +
      monthlyRevenue * 0.25 * (12 - data.moisSaison)
  );
  const waterSaved = Math.round(monthlyWashes * 12 * 194);
  const chemicalsAvoided = monthlyWashes * 12;

  return { monthlyWashes, annualRevenue, waterSaved, chemicalsAvoided };
}

/* ─── Slider component ─── */

function SimSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-charcoal-700">{label}</label>
        <span className="text-2xl font-bold text-green-900 tabular-nums">
          {value.toLocaleString("fr-FR")}
          {unit && (
            <span className="text-sm font-normal text-muted-foreground ml-1">
              {unit}
            </span>
          )}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-green-700"
        style={{
          background: `linear-gradient(to right, #15803d ${pct}%, #e5e7eb ${pct}%)`,
        }}
      />
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>{min.toLocaleString("fr-FR")}</span>
        <span>{max.toLocaleString("fr-FR")}</span>
      </div>
    </div>
  );
}

/* ─── Result card ─── */

function ResultCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof Euro;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="text-center p-6 rounded-2xl bg-white border border-border shadow-sm">
      <div
        className={`h-12 w-12 mx-auto rounded-xl ${color} flex items-center justify-center`}
      >
        <Icon className="text-white" size={24} />
      </div>
      <p className="mt-4 text-3xl sm:text-4xl font-bold text-charcoal-900 tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

/* ─── Main component ─── */

export function SimulateurSection() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SimData>({
    region: "",
    courseType: "18",
    membres: 400,
    greenFees: 60,
    joursOuverture: 6,
    placesParking: 150,
    moisSaison: 8,
    services: [],
    golfName: "",
    contactName: "",
    email: "",
    phone: "",
  });

  const update = useCallback(
    (partial: Partial<SimData>) => setData((d) => ({ ...d, ...partial })),
    []
  );

  const results = calculateResults(data);
  const animatedRevenue = useAnimatedCounter(
    step === 4 ? results.annualRevenue : 0
  );
  const animatedWashes = useAnimatedCounter(
    step === 4 ? results.monthlyWashes : 0
  );
  const animatedWater = useAnimatedCounter(
    step === 4 ? results.waterSaved : 0
  );

  function toggleService(s: string) {
    update({
      services: data.services.includes(s)
        ? data.services.filter((x) => x !== s)
        : [...data.services, s],
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      golfName: data.golfName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      city: data.region,
      message: `[Simulateur] ${data.courseType} trous · ${data.membres} membres · ${data.greenFees} GF/sem · ${data.placesParking} places · ${data.joursOuverture}j/sem · ${data.moisSaison} mois saison · Services: ${data.services.join(", ") || "aucun"} · Commission estimée: ${results.annualRevenue}€/an (10%)`,
    };

    try {
      const submitContactForm = httpsCallable(functions, "submitContactForm");
      await submitContactForm(payload);
      setSubmitted(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  const canNext =
    (step === 1 && data.region !== "") ||
    step === 2 ||
    step === 3;

  return (
    <section id="simulator" className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Simulateur"
          title={
            <>
              Estimez la commission
              <br />
              de <span className="text-green-800">votre golf</span>
            </>
          }
          description="Répondez en 60 secondes. Recevez votre estimation personnalisée."
        />

        {/* Progress bar */}
        <div className="mt-12 mb-10">
          <div className="flex items-center justify-between mb-2">
            {[
              { n: 1, icon: Calculator, label: "Votre golf" },
              { n: 2, icon: Users, label: "Vos membres" },
              { n: 3, icon: ParkingCircle, label: "Activité" },
              { n: 4, icon: TrendingUp, label: "Résultats" },
            ].map((s) => (
              <div
                key={s.n}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  step >= s.n ? "text-green-800" : "text-muted-foreground"
                }`}
              >
                <s.icon size={14} />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="h-1.5 rounded-full bg-gray-200">
            <div
              className="h-1.5 rounded-full bg-green-700 transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 sm:p-10 shadow-sm min-h-[420px]">
          {/* ─── Step 1 ─── */}
          {step === 1 && (
            <div className="space-y-8">
              <h3 className="text-xl font-semibold text-charcoal-900">
                Décrivez votre golf
              </h3>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Région
                </label>
                <select
                  value={data.region}
                  onChange={(e) => update({ region: e.target.value })}
                  className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
                >
                  <option value="">Sélectionnez votre région</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-3">
                  Type de parcours
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {courseTypes.map((ct) => (
                    <button
                      key={ct.value}
                      type="button"
                      onClick={() => update({ courseType: ct.value })}
                      className={`rounded-xl border-2 p-4 text-center transition-all ${
                        data.courseType === ct.value
                          ? "border-green-700 bg-green-50 text-green-900 shadow-sm"
                          : "border-border bg-white text-charcoal-600 hover:border-charcoal-300"
                      }`}
                    >
                      <span className="text-2xl font-bold block">
                        {ct.value}
                      </span>
                      <span className="text-xs">trous</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 2 ─── */}
          {step === 2 && (
            <div className="space-y-10">
              <h3 className="text-xl font-semibold text-charcoal-900">
                Vos membres & visiteurs
              </h3>

              <SimSlider
                label="Nombre d'adhérents"
                value={data.membres}
                min={50}
                max={2000}
                step={10}
                onChange={(v) => update({ membres: v })}
              />

              <SimSlider
                label="Green-fees visiteurs / semaine"
                value={data.greenFees}
                min={0}
                max={300}
                step={5}
                onChange={(v) => update({ greenFees: v })}
              />

              <SimSlider
                label="Jours d'ouverture / semaine"
                value={data.joursOuverture}
                min={4}
                max={7}
                step={1}
                unit="jours"
                onChange={(v) => update({ joursOuverture: v })}
              />
            </div>
          )}

          {/* ─── Step 3 ─── */}
          {step === 3 && (
            <div className="space-y-10">
              <h3 className="text-xl font-semibold text-charcoal-900">
                Votre infrastructure & activité
              </h3>

              <SimSlider
                label="Places de parking"
                value={data.placesParking}
                min={30}
                max={500}
                step={5}
                onChange={(v) => update({ placesParking: v })}
              />

              <SimSlider
                label="Mois de pleine saison"
                value={data.moisSaison}
                min={3}
                max={12}
                step={1}
                unit="mois"
                onChange={(v) => update({ moisSaison: v })}
              />

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-3">
                  Services existants
                </label>
                <div className="flex flex-wrap gap-2">
                  {serviceOptions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleService(s)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        data.services.includes(s)
                          ? "bg-green-700 text-white shadow-sm"
                          : "bg-gray-100 text-charcoal-600 hover:bg-gray-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 4: Results ─── */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-green-700">
                  Votre commission estimée
                </p>
                <p className="mt-2 text-5xl sm:text-6xl font-bold text-green-900 tabular-nums">
                  {animatedRevenue.toLocaleString("fr-FR")}€
                  <span className="text-lg font-normal text-muted-foreground">
                    /an
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  de commission estimée pour votre golf
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Commission de 10 % sur chaque lavage — 0 € d&apos;investissement
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <ResultCard
                  icon={TrendingUp}
                  value={`${animatedWashes}`}
                  label="lavages / mois"
                  color="bg-green-700"
                />
                <ResultCard
                  icon={Droplets}
                  value={`${(animatedWater / 1000).toFixed(0)}k L`}
                  label="d'eau économisés / an"
                  color="bg-blue-600"
                />
                <ResultCard
                  icon={Leaf}
                  value="0"
                  label="produit chimique"
                  color="bg-emerald-600"
                />
              </div>

              <div className="border-t border-border pt-8">
                {submitted ? (
                  <div className="text-center py-6">
                    <CheckCircle
                      className="mx-auto text-green-600"
                      size={48}
                    />
                    <h3 className="mt-4 text-xl font-semibold text-green-900">
                      Demande envoyée !
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Nous revenons vers vous dans les 24 heures avec votre
                      étude personnalisée.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-center font-semibold text-charcoal-900">
                      Recevez votre étude personnalisée
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        name="golfName"
                        placeholder="Nom du golf"
                        required
                        className="h-12"
                        value={data.golfName}
                        onChange={(e) =>
                          update({ golfName: e.target.value })
                        }
                      />
                      <Input
                        name="contactName"
                        placeholder="Votre nom"
                        required
                        className="h-12"
                        value={data.contactName}
                        onChange={(e) =>
                          update({ contactName: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        className="h-12"
                        value={data.email}
                        onChange={(e) => update({ email: e.target.value })}
                      />
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="Téléphone"
                        required
                        className="h-12"
                        value={data.phone}
                        onChange={(e) => update({ phone: e.target.value })}
                      />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                      {loading
                        ? "Envoi en cours…"
                        : "Recevoir mon étude gratuite"}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      Sans engagement. On vous rappelle sous 24h.
                    </p>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ─── Navigation ─── */}
          {step < 4 && (
            <div className="mt-10 flex items-center justify-between">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                >
                  <ChevronLeft size={16} />
                  Retour
                </Button>
              ) : (
                <div />
              )}
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
                {step === 3 ? "Voir mes résultats" : "Continuer"}
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          * Estimation basée sur les données moyennes des golfs français.
          Résultats réels variables selon le contexte local.
        </p>
      </div>
    </section>
  );
}
