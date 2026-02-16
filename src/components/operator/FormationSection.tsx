import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const skills = [
  "Techniques de lavage vapeur haute pression",
  "Detailing intérieur & extérieur",
  "Standards qualité The Green Valet",
  "Relation client & upsell",
];

export function FormationSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="La formation"
          title="2 jours pour maîtriser le métier"
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="relative lg:col-span-3 aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src="/images/step-formation.jpg"
              alt="Formation pratique vapeur"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="inline-block rounded-lg bg-white/90 backdrop-blur px-3 py-1.5 text-sm font-semibold text-charcoal-900">
                Jour 1 — Techniques vapeur & extérieur
              </span>
            </div>
          </div>

          <div className="relative lg:col-span-2 aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src="/images/formation-interieur.jpg"
              alt="Formation detailing intérieur"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="inline-block rounded-lg bg-white/90 backdrop-blur px-3 py-1.5 text-sm font-semibold text-charcoal-900">
                Jour 2 — Detailing intérieur & client
              </span>
            </div>
          </div>
        </div>

        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {skills.map((skill) => (
            <li key={skill} className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <span className="text-muted-foreground">{skill}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
