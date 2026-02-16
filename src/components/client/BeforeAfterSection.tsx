import Image from "next/image";
import { SectionHeader } from "@/components/ui/section-header";

const comparisons = [
  {
    image: "/images/avant-apres-carrosserie.jpg",
    alt: "Avant / après carrosserie — lavage vapeur",
    caption: "Carrosserie : poussière, traces d'eau et micro-rayures vs. finition miroir",
  },
  {
    image: "/images/avant-apres-jantes.jpg",
    alt: "Avant / après jantes — lavage vapeur",
    caption: "Jantes : poussière de frein incrustée vs. aluminium éclatant",
  },
];

export function BeforeAfterSection() {
  return (
    <section className="py-20 sm:py-28 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Résultats"
          title="Avant / Après : jugez par vous-même"
          description="Nos techniciens vapeur redonnent vie à chaque véhicule — sans eau, sans chimique, sans micro-rayure."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {comparisons.map((comp) => (
            <div key={comp.image} className="overflow-hidden rounded-2xl shadow-lg">
              <div className="relative aspect-video">
                <Image
                  src={comp.image}
                  alt={comp.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="bg-white px-6 py-4">
                <p className="text-sm text-muted-foreground">{comp.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
