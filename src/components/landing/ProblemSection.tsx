import { AlertTriangle, Droplets, ParkingCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

const problems = [
  {
    icon: AlertTriangle,
    title: "Aucun service de lavage sur site",
    description:
      "Vos membres quittent le club pour aller au car wash en ville. Perte de temps, mauvaise expérience, image dégradée.",
  },
  {
    icon: Droplets,
    title: "200 litres gaspillés par lavage",
    description:
      "Les stations classiques consomment 200L d'eau par véhicule. Incompatible avec l'image RSE de votre club.",
  },
  {
    icon: ParkingCircle,
    title: "Un parking sous-exploité",
    description:
      "Vos places de parking n'apportent aucune valeur ajoutée à l'expérience de vos membres.",
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="py-20 sm:py-28 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Le constat"
          title={
            <>
              350 golfs en France.
              <br />
              <span className="text-green-800">
                Aucun service de lavage sur site.
              </span>
            </>
          }
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem) => (
            <Card key={problem.title} className="p-8">
              <CardContent className="p-0">
                <div className="h-12 w-12 rounded-lg bg-red-50 flex items-center justify-center">
                  <problem.icon className="text-red-500" size={24} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-charcoal-900">
                  {problem.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
