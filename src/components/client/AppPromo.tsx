import { Camera, Smartphone } from "lucide-react";

const appFeatures = [
  "Détection automatique du véhicule",
  "Recommandation personnalisée par IA",
  "Réservation en un tap",
  "Suivi en temps réel du lavage",
];

function StoreBadge({ store, icon }: { store: string; icon: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3 rounded-xl bg-white/10 pl-4 pr-5 py-3 hover:bg-white/15 transition-colors cursor-default">
      {icon}
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] text-charcoal-400">Bientôt sur</span>
        <span className="text-sm font-semibold text-white">{store}</span>
      </span>
    </span>
  );
}

function PhoneMockup() {
  return (
    <div className="relative w-56 sm:w-64">
      <div className="rounded-[2rem] border-4 border-charcoal-700 bg-charcoal-800 p-2 shadow-2xl">
        <div className="rounded-[1.5rem] bg-gradient-to-br from-green-900 to-charcoal-900 aspect-[9/16] flex flex-col items-center justify-center p-6">
          <div className="h-14 w-14 rounded-2xl bg-green-600/30 flex items-center justify-center">
            <Camera className="text-green-400" size={28} />
          </div>
          <p className="mt-4 text-sm font-semibold text-white text-center">
            Scannez votre véhicule
          </p>
          <p className="mt-1 text-xs text-charcoal-400 text-center">
            L&apos;IA fait le reste
          </p>
          <div className="mt-6 w-full space-y-2">
            <div className="h-2 w-full rounded-full bg-green-600/20">
              <div className="h-2 w-3/4 rounded-full bg-green-500" />
            </div>
            <p className="text-[10px] text-charcoal-500 text-center">
              Analyse en cours…
            </p>
          </div>
          <div className="mt-4 w-full rounded-lg bg-green-600/20 p-3">
            <p className="text-[10px] text-green-400 font-semibold">
              Recommandation
            </p>
            <p className="text-xs text-white font-bold mt-0.5">
              Formule Intégrale
            </p>
            <p className="text-[10px] text-charcoal-400 mt-0.5">
              SUV · Salissures modérées
            </p>
          </div>
        </div>
      </div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-charcoal-900" />
    </div>
  );
}

export function AppPromo() {
  return (
    <div className="mt-16 overflow-hidden rounded-2xl bg-charcoal-900">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left — text */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <span className="inline-flex items-center gap-2 text-green-400 text-sm font-semibold uppercase tracking-widest">
            <Smartphone size={16} />
            Bientôt disponible
          </span>
          <h3 className="mt-4 text-2xl sm:text-3xl font-bold text-white leading-tight">
            L&apos;app qui choisit
            <br />
            pour vous.
          </h3>
          <p className="mt-4 text-charcoal-400 leading-relaxed max-w-md">
            Prenez votre véhicule en photo. Notre IA détecte le modèle, analyse
            l&apos;état de la carrosserie et vous recommande la formule idéale —
            en quelques secondes.
          </p>

          <ul className="mt-6 space-y-2">
            {appFeatures.map((feat) => (
              <li
                key={feat}
                className="flex items-center gap-2 text-sm text-charcoal-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                {feat}
              </li>
            ))}
          </ul>

          {/* Store badges */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <StoreBadge
              store="App Store"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-7 w-7 text-white"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              }
            />
            <StoreBadge
              store="Google Play"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-7 w-7 text-white"
                >
                  <path d="M3.18 23.77L14.1 12.87 3.18.23c-.2-.19-.13-.5.13-.56l.18-.02c.15 0 .29.06.4.16l12.25 10.87c.34.3.34.82 0 1.12L3.89 22.93c-.11.1-.25.16-.4.16l-.18-.02c-.26-.06-.33-.37-.13-.56v.26z" />
                  <path
                    d="M3.18 23.77l.01-.01L14.97 12l-1.87-1.87L3.18.23c-.08-.08-.1-.18-.1-.28l-.02.18c0 .11.04.22.12.3L13.1 12 3.18 23.47c-.08.08-.12.19-.12.3l.02.18c0-.1.02-.1.1-.18z"
                    opacity=".2"
                  />
                </svg>
              }
            />
          </div>
        </div>

        {/* Right — phone mockup */}
        <div className="relative flex items-end justify-center bg-gradient-to-t from-green-900/30 to-transparent p-8 pt-12">
          <PhoneMockup />
        </div>
      </div>
    </div>
  );
}
