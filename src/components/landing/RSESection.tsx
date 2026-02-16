import { Droplets, Leaf, Award, TreePine, FileCheck, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const rsePoints = [
  {
    icon: Droplets,
    value: "97%",
    label: "d'eau économisée",
    detail: "6L par véhicule vs 200L en station classique. Sur 800 membres, c'est 155 000 litres préservés par an.",
  },
  {
    icon: Leaf,
    value: "0",
    label: "produit chimique",
    detail: "Vapeur haute pression à 190°C uniquement. Aucun détergent, aucun solvant, aucun risque pour vos espaces verts.",
  },
  {
    icon: TrendingDown,
    value: "0",
    label: "rejet polluant",
    detail: "Pas de ruissellement, pas de pollution des nappes phréatiques. Conformité totale avec la loi sur l'eau.",
  },
  {
    icon: TreePine,
    value: "0",
    label: "impact sur votre green",
    detail: "Aucun produit chimique ne touche votre sol. Le container est autonome et étanche — zéro empreinte.",
  },
];

const rseArguments = [
  {
    icon: Award,
    title: "Valorisez votre démarche RSE",
    description:
      "Affichez des chiffres concrets dans votre rapport RSE : litres d'eau économisés, produits chimiques évités, empreinte carbone réduite. Des KPIs mesurables, pas du greenwashing.",
  },
  {
    icon: FileCheck,
    title: "Conformité réglementaire",
    description:
      "La réglementation sur les rejets d'eaux usées se durcit. Les stations de lavage classiques sont soumises à des normes ICPE strictes. La vapeur élimine ce risque — aucune autorisation préfectorale nécessaire.",
  },
];

export function RSESection() {
  return (
    <section className="py-20 sm:py-28 bg-green-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Engagement RSE"
          title={
            <>
              Un partenariat qui renforce
              <br />
              votre image responsable
            </>
          }
          description="Les golfs sont des acteurs majeurs de la biodiversité locale. The Green Valet est aligné avec cette mission — des chiffres concrets pour votre rapport RSE."
          dark
        />

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {rsePoints.map((point) => (
            <div key={point.label} className="text-center">
              <div className="h-12 w-12 mx-auto rounded-xl bg-green-800/50 flex items-center justify-center">
                <point.icon className="text-green-300" size={24} />
              </div>
              <p className="mt-4 text-4xl sm:text-5xl font-bold text-white">
                {point.value}
              </p>
              <p className="mt-2 text-base font-medium text-green-300">
                {point.label}
              </p>
              <p className="mt-2 text-sm text-green-200/80 leading-relaxed">
                {point.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {rseArguments.map((arg) => (
            <Card
              key={arg.title}
              className="bg-green-800/30 border-green-700/30 p-8"
            >
              <CardContent className="p-0">
                <div className="h-12 w-12 rounded-lg bg-green-700/40 flex items-center justify-center">
                  <arg.icon className="text-green-300" size={24} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {arg.title}
                </h3>
                <p className="mt-3 text-green-200/70 leading-relaxed">
                  {arg.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
