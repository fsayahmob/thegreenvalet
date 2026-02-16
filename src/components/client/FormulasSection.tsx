import { Sparkles, Star, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { AppPromo } from "./AppPromo";

const formulas = [
  {
    icon: Sparkles,
    name: "Essentielle",
    image: "/images/formule-essentielle.jpg",
    price: "À partir de 29€",
    duration: "~30 min",
    description: "Lavage extérieur complet à la vapeur haute pression",
    features: [
      "Carrosserie complète à 190°C",
      "Jantes, pneus & passages de roue",
      "Vitres, rétroviseurs & joints",
      "Séchage microfibre premium",
    ],
    highlight: false,
  },
  {
    icon: Star,
    name: "Intégrale",
    image: "/images/formule-integrale.jpg",
    price: "À partir de 49€",
    duration: "~50 min",
    description: "Extérieur + intérieur : résultat showroom",
    features: [
      "Tout Essentielle +",
      "Aspiration intérieur complet",
      "Tableau de bord, plastiques & ciel de toit",
      "Tapis, moquettes & coffre",
      "Assainissement vapeur de l'habitacle",
    ],
    highlight: true,
  },
  {
    icon: Crown,
    name: "Prestige",
    image: "/images/formule-prestige.jpg",
    price: "À partir de 79€",
    duration: "~1h30",
    description: "Rénovation complète pour les plus exigeants",
    features: [
      "Tout Intégrale +",
      "Traitement cuir — réhydratation & protection",
      "Polish carrosserie — correction micro-rayures",
      "Traitement anti-pluie vitres",
      "Protection céramique express",
    ],
    highlight: false,
  },
];

const sizes = [
  { label: "S", example: "Clio, 208, Polo" },
  { label: "M", example: "Golf, 308, Classe C" },
  { label: "L", example: "Tiguan, 3008, GLC" },
  { label: "XL", example: "Range Rover, GLE" },
];

export function FormulasSection() {
  return (
    <section id="formulas" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Nos formules"
          title="La bonne formule pour votre véhicule"
          description="3 niveaux de soin. Le prix final s'adapte à la taille de votre véhicule."
        />

        {/* Vehicle size indicator */}
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          {sizes.map((size) => (
            <Badge key={size.label} variant="muted" className="gap-1.5">
              <span className="font-bold">{size.label}</span>
              <span className="text-charcoal-500">{size.example}</span>
            </Badge>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {formulas.map((formula) => (
            <Card
              key={formula.name}
              className={`relative p-8 ${
                formula.highlight
                  ? "border-green-600 bg-green-50 shadow-lg ring-1 ring-green-600"
                  : ""
              }`}
            >
              {formula.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white">
                  La plus populaire
                </Badge>
              )}

              <div className="relative -mx-8 -mt-8 mb-6 aspect-[4/3] overflow-hidden rounded-t-xl">
                <Image
                  src={formula.image}
                  alt={`Formule ${formula.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <formula.icon className="text-green-700" size={24} />
              </div>

              <h3 className="mt-5 text-2xl font-bold text-charcoal-900">
                {formula.name}
              </h3>
              <p className="mt-1 text-muted-foreground">
                {formula.description}
              </p>

              <p className="mt-6 text-2xl font-bold text-green-900">
                {formula.price}
              </p>
              <p className="text-xs text-muted-foreground">
                {formula.duration} &middot; tarif selon taille véhicule
              </p>

              <ul className="mt-6 space-y-3">
                {formula.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-charcoal-700"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={formula.highlight ? "default" : "secondary"}
                className="mt-8 w-full"
                asChild
              >
                <Link href="#book">Réserver cette formule</Link>
              </Button>
            </Card>
          ))}
        </div>

        <AppPromo />
      </div>
    </section>
  );
}
