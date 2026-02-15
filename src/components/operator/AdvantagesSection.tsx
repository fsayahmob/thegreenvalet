import { Clock, Euro, Wrench, GraduationCap, MapPin, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const advantages = [
  {
    icon: Clock,
    title: "Liberté totale",
    description:
      "Vous choisissez vos jours, vos horaires et les golfs sur lesquels vous intervenez. Vous êtes votre propre patron.",
  },
  {
    icon: Euro,
    title: "Revenus attractifs",
    description:
      "Commission sur chaque lavage réalisé. Plus vous travaillez, plus vous gagnez. Pas de plafond.",
  },
  {
    icon: Wrench,
    title: "Équipement fourni",
    description:
      "Nettoyeur vapeur professionnel, produits, consommables : tout est dans le container. Zéro investissement de votre part.",
  },
  {
    icon: GraduationCap,
    title: "Formation incluse",
    description:
      "Formation complète au lavage vapeur, aux techniques de detailing et aux standards qualité The Green Valet.",
  },
  {
    icon: MapPin,
    title: "Cadre exceptionnel",
    description:
      "Travaillez en plein air, dans les plus beaux golfs de votre région. Loin des garages et stations bruyantes.",
  },
  {
    icon: TrendingUp,
    title: "Activité en croissance",
    description:
      "Un marché inexploité avec 350 golfs en France. Soyez parmi les premiers opérateurs du réseau.",
  },
];

export function AdvantagesSection() {
  return (
    <section id="advantages" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Pourquoi nous rejoindre"
          title={
            <>
              Un métier qui a du sens.
              <br />
              Une activité qui rapporte.
            </>
          }
        />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((adv) => (
            <Card key={adv.title} className="p-8">
              <CardContent className="p-0">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <adv.icon className="text-green-700" size={24} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-charcoal-900">
                  {adv.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {adv.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
