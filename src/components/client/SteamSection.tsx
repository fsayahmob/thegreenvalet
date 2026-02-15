import {
  Thermometer,
  ShieldCheck,
  Paintbrush,
  Wind,
  Bug,
  Timer,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const benefits = [
  {
    icon: Thermometer,
    title: "190°C de puissance pure",
    description:
      "La vapeur haute pression dissout la saleté au niveau moléculaire. Pas frottée, pas déplacée — éliminée.",
  },
  {
    icon: Paintbrush,
    title: "Rénovation, pas juste nettoyage",
    description:
      "La vapeur réhydrate le cuir, corrige les micro-rayures, restaure les plastiques. Votre voiture rajeunit à chaque passage.",
  },
  {
    icon: ShieldCheck,
    title: "Zéro risque pour votre peinture",
    description:
      "Sans contact abrasif, sans brosses, sans rouleaux. Aucune micro-rayure contrairement aux stations automatiques.",
  },
  {
    icon: Bug,
    title: "Assainissement profond",
    description:
      "99,99% des bactéries et acariens éliminés. Moisissures HVAC, allergènes, odeurs neutralisés à la source — pas masqués.",
  },
  {
    icon: Wind,
    title: "Jusqu'aux moindres recoins",
    description:
      "Grilles de ventilation, joints de portières, coutures du cuir, intérieur des jantes : la vapeur accède là où rien d'autre ne va.",
  },
  {
    icon: Timer,
    title: "30 minutes, résultat showroom",
    description:
      "Un lavage extérieur complet en 30 min. La vapeur s'évapore instantanément — pas de temps de séchage.",
  },
];

export function SteamSection() {
  return (
    <section className="py-20 sm:py-28 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="La technologie vapeur"
          title={
            <>
              Votre voiture ne sera plus jamais
              <br />
              <span className="text-green-800">
                &ldquo;juste lavée&rdquo;
              </span>
            </>
          }
          description="La vapeur à 190°C ne nettoie pas votre véhicule — elle le rénove. Un soin professionnel qui lui redonne l'éclat du premier jour."
        />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="p-8">
              <CardContent className="p-0">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <benefit.icon className="text-green-700" size={24} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-charcoal-900">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
