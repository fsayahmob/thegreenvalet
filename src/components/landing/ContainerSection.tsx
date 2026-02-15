import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

export function ContainerSection() {
  return (
    <section id="container" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Images */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src="/images/container-open.jpg"
                alt="Container ouvert — intérieur équipé avec station vapeur"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src="/images/container-closed.jpg"
                  alt="Container fermé — bardage bois intégré au paysage"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src="/images/hero-close.jpg"
                  alt="Vue rapprochée — auvent et éclairage LED"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>

          {/* Right — Text */}
          <div>
            <SectionHeader
              eyebrow="Le container"
              title={
                <>
                  Discret. Élégant.
                  <br />
                  Pensé pour les golfs.
                </>
              }
              description="Un container compact de 4 mètres, habillé de bardage bois naturel, qui s'intègre dans le paysage de votre club comme un mobilier de jardin haut de gamme."
              align="left"
            />

            <ul className="mt-8 space-y-4">
              {[
                "Bardage bois claire-voie — finition naturelle, intégration paysagère",
                "Ouverture double volet — auvent + terrasse déployable",
                "Station complète — vapeur, filtration, recyclage d'eau intégrés",
                "Démontable — installation réversible, sans emprise permanente",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-green-600 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/specs"
              className="mt-8 inline-flex items-center gap-2 text-green-800 font-medium hover:text-green-900 transition-colors"
            >
              Voir les spécifications techniques
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
