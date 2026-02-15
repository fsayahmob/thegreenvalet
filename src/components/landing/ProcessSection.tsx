import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";

const steps = [
  {
    number: "01",
    image: "/images/step-install.jpg",
    imageAlt: "Livraison du container par grue sur le parking du golf",
    title: "On se rencontre",
    description:
      "Visite de votre golf, validation de l'emplacement idéal, présentation du concept à votre direction.",
  },
  {
    number: "02",
    image: "/images/step-operator.jpg",
    imageAlt: "Opérateur en polo vert nettoyant une berline à la vapeur",
    title: "On installe en 48h",
    description:
      "Le container est livré, branché et opérationnel. Un bardage bois naturel qui s'intègre à votre environnement.",
  },
  {
    number: "03",
    image: "/images/step-result.jpg",
    imageAlt: "Client satisfait récupérant ses clés devant sa voiture impeccable",
    title: "Vos membres en profitent",
    description:
      "Un opérateur professionnel assure le service. Vos membres réservent, jouent, et retrouvent leur voiture impeccable.",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="py-20 sm:py-28 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Comment ça marche"
          title="3 étapes. Aucune contrainte pour vous."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-[7.5rem] left-[calc(50%+3rem)] right-[calc(-50%+3rem)] h-px bg-green-300" />
              )}

              <div className="flex flex-col items-center text-center">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-6">
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <Badge
                    className="absolute top-3 left-3 h-8 w-8 rounded-full p-0 flex items-center justify-center text-xs font-bold text-white bg-gold-500 shadow-lg"
                  >
                    {step.number}
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold text-charcoal-900">
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
