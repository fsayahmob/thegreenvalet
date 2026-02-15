import Image from "next/image";
import { SectionHeader } from "@/components/ui/section-header";

const pillars = [
  {
    image: "/images/icon-investment.png",
    imageAlt: "Icône zéro investissement — main avec clé",
    title: "Zéro investissement",
    description:
      "On installe, on opère, on gère. Vous mettez à disposition un emplacement parking. Aucun coût, aucun risque.",
  },
  {
    image: "/images/icon-premium.png",
    imageAlt: "Icône service premium — voiture brillante",
    title: "Service premium pour vos membres",
    description:
      "Pendant que vos membres jouent, leur voiture est nettoyée à la vapeur. Prête au retour. Un service conciergerie digne des meilleurs clubs.",
  },
  {
    image: "/images/icon-eco.png",
    imageAlt: "Icône éco-responsable — feuille et goutte d'eau",
    title: "Image éco-responsable",
    description:
      "6 litres d'eau par véhicule. Zéro produit chimique. Zéro rejet polluant. Votre golf devient une référence en développement durable.",
  },
];

export function SolutionSection() {
  return (
    <section id="concept" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="La solution"
          title={
            <>
              On s&apos;occupe de tout.
              <br />
              Vous récoltez les bénéfices.
            </>
          }
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="text-center px-6 py-8">
              <div className="h-20 w-20 mx-auto">
                <Image
                  src={pillar.image}
                  alt={pillar.imageAlt}
                  width={80}
                  height={80}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-charcoal-900">
                {pillar.title}
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
