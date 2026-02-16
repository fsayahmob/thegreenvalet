import Image from "next/image";
import { Send, BookOpen, Rocket } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const steps = [
  {
    icon: Send,
    number: "01",
    title: "Candidatez",
    image: null,
    description:
      "Remplissez le formulaire en 2 minutes. On vous rappelle sous 48h pour un premier échange.",
  },
  {
    icon: BookOpen,
    number: "02",
    title: "Formez-vous",
    image: "/images/step-formation.jpg",
    description:
      "2 jours de formation pratique : techniques vapeur, detailing, standards qualité, relation client.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Lancez-vous",
    image: "/images/formation-interieur.jpg",
    description:
      "Choisissez vos golfs, planifiez vos créneaux et commencez à générer des revenus dès la première semaine.",
  },
];

export function OperatorProcess() {
  return (
    <section className="py-20 sm:py-28 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Le parcours"
          title="De la candidature au premier lavage"
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] right-[calc(-50%+3rem)] h-px bg-green-300" />
              )}

              <div className="flex flex-col items-center text-center">
                {step.image && (
                  <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden rounded-xl">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}

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
