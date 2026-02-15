import { CalendarCheck, Flag, Car } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const steps = [
  {
    icon: CalendarCheck,
    number: "01",
    title: "Réservez en ligne",
    description:
      "Choisissez votre golf, votre formule et votre créneau. En 30 secondes, c'est fait.",
  },
  {
    icon: Flag,
    number: "02",
    title: "Jouez tranquille",
    description:
      "Déposez vos clés à l'accueil ou au container. Pendant votre parcours, on s'occupe de tout.",
  },
  {
    icon: Car,
    number: "03",
    title: "Récupérez votre voiture",
    description:
      "À votre retour, votre véhicule est impeccable. Payez en ligne, pas de file d'attente.",
  },
];

export function ClientProcess() {
  return (
    <section id="how" className="py-20 sm:py-28 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Comment ça marche"
          title="Aussi simple que de jouer un trou"
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] right-[calc(-50%+3rem)] h-px bg-green-300" />
              )}

              <div className="flex flex-col items-center text-center">
                <div className="relative h-16 w-16 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm">
                  <step.icon className="text-green-700" size={28} />
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gold-500 flex items-center justify-center text-xs font-bold text-white">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-semibold text-charcoal-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed max-w-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
