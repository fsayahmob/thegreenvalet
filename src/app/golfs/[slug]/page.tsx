import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  Star,
  Crown,
  Droplets,
  Leaf,
  ShieldCheck,
  ParkingCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { golfLocations, getGolfBySlug } from "@/lib/golf-data";

/* ─── Reject unknown slugs at build time ─── */

export const dynamicParams = false;

/* ─── Static params for SSG ─── */

export function generateStaticParams() {
  return golfLocations
    .filter((g) => g.active)
    .map((g) => ({ slug: g.slug }));
}

/* ─── SEO metadata ─── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const golf = getGolfBySlug(slug);
  if (!golf) return {};

  const title = `Lavage vapeur au ${golf.name} — The Green Valet`;
  const description = golf.description
    ?? `Service de lavage vapeur éco-responsable au ${golf.name}, ${golf.city}. Pendant votre parcours, votre voiture est lavée sur le parking.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: golf.photos?.[0]
        ? [{ url: golf.photos[0].src, width: 1200, height: 630 }]
        : undefined,
      locale: "fr_FR",
      type: "website",
    },
  };
}

/* ─── Formulas (shared with FormulasSection) ─── */

const formulas = [
  {
    icon: Sparkles,
    name: "Essentielle",
    price: "29€",
    duration: "~30 min",
    features: ["Carrosserie complète", "Jantes & pneus", "Vitres & joints", "Séchage microfibre"],
  },
  {
    icon: Star,
    name: "Intégrale",
    price: "49€",
    duration: "~50 min",
    features: ["Tout Essentielle +", "Aspiration intérieur", "Tableau de bord", "Assainissement vapeur"],
    highlight: true,
  },
  {
    icon: Crown,
    name: "Prestige",
    price: "79€",
    duration: "~1h30",
    features: ["Tout Intégrale +", "Traitement cuir", "Polish carrosserie", "Protection céramique"],
  },
];

/* ─── Page ─── */

export default async function GolfDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const golf = getGolfBySlug(slug);

  if (!golf || !golf.active) notFound();

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${golf.coordinates.lat},${golf.coordinates.lng}`;
  const otherGolfs = golfLocations.filter((g) => g.slug !== slug).slice(0, 4);

  return (
    <>
      <Header />
      <main>
        {/* ─── Photo Hero ─── */}
        <section className="relative bg-charcoal-900">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 max-h-[420px] overflow-hidden">
            {(golf.photos ?? []).slice(0, 3).map((photo, i) => (
              <div
                key={photo.src}
                className={`relative aspect-[4/3] ${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes={i === 0 ? "66vw" : "33vw"}
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Back button overlay */}
          <Link
            href="/#book"
            className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-4 py-2 text-sm font-medium text-charcoal-900 shadow-sm hover:bg-white transition-colors"
          >
            <ChevronLeft size={16} />
            Carte
          </Link>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            {/* ─── Main column ─── */}
            <div className="lg:col-span-2 space-y-12">
              {/* Title + status */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge className="bg-green-600 text-white">Service actif</Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-900">
                  {golf.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {golf.city}
                  </span>
                  {golf.openingHours && (
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {golf.openingHours}
                    </span>
                  )}
                  {golf.startingPrice && (
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} />
                      À partir de {golf.startingPrice}€
                    </span>
                  )}
                </div>
              </div>

              {/* Service description */}
              {golf.description && (
                <div>
                  <h2 className="text-xl font-semibold text-charcoal-900 mb-3">
                    Le lavage vapeur, ici
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {golf.description}
                  </p>
                </div>
              )}

              {/* How it works — 3 steps */}
              <div>
                <h2 className="text-xl font-semibold text-charcoal-900 mb-6">
                  Comment ça marche
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    {
                      step: "1",
                      title: "Garez-vous",
                      desc: golf.parkingInstructions ?? "Garez votre véhicule sur le parking du golf.",
                      icon: ParkingCircle,
                    },
                    {
                      step: "2",
                      title: "Confiez vos clés",
                      desc: "Notre opérateur certifié prend en charge votre véhicule pendant votre partie.",
                      icon: ShieldCheck,
                    },
                    {
                      step: "3",
                      title: "Repartez propre",
                      desc: "Retrouvez votre voiture impeccable après votre partie. Paiement sur place.",
                      icon: Sparkles,
                    },
                  ].map((s) => (
                    <div key={s.step} className="text-center p-5 rounded-xl bg-muted">
                      <div className="h-10 w-10 mx-auto rounded-lg bg-green-100 flex items-center justify-center">
                        <s.icon className="text-green-700" size={20} />
                      </div>
                      <p className="mt-3 font-semibold text-charcoal-900">{s.title}</p>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulas */}
              <div>
                <h2 className="text-xl font-semibold text-charcoal-900 mb-6">
                  Nos formules
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {formulas.map((f) => (
                    <Card
                      key={f.name}
                      className={`p-5 ${f.highlight ? "border-green-600 ring-1 ring-green-600 bg-green-50" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <f.icon size={18} className="text-green-700" />
                        <p className="font-semibold text-charcoal-900">{f.name}</p>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-green-900">{f.price}</p>
                      <p className="text-xs text-muted-foreground">{f.duration}</p>
                      <ul className="mt-4 space-y-1.5">
                        {f.features.map((feat) => (
                          <li key={feat} className="flex items-center gap-1.5 text-sm text-charcoal-700">
                            <span className="h-1 w-1 rounded-full bg-green-600 shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>
              </div>

              {/* About the golf */}
              {golf.golfDescription && (
                <div>
                  <h2 className="text-xl font-semibold text-charcoal-900 mb-3">
                    À propos du golf
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {golf.golfDescription}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {golf.holes && (
                      <Badge variant="muted">{golf.holes} trous</Badge>
                    )}
                    {golf.par && <Badge variant="muted">Par {golf.par}</Badge>}
                    {golf.golfAmenities?.map((a) => (
                      <Badge key={a} variant="muted">{a}</Badge>
                    ))}
                  </div>

                  {golf.golfWebsiteUrl && (
                    <a
                      href={golf.golfWebsiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm text-green-700 hover:text-green-900 font-medium"
                    >
                      Site du golf
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              )}

              {/* Map + Directions */}
              <div>
                <h2 className="text-xl font-semibold text-charcoal-900 mb-3">
                  Accès & itinéraire
                </h2>
                <div className="rounded-xl overflow-hidden border border-border">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5000!2d${golf.coordinates.lng}!3d${golf.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sfr!4v1`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Carte ${golf.name}`}
                  />
                </div>
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <span>{golf.address}</span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                      <Navigation size={14} />
                      Itinéraire
                    </a>
                  </Button>
                </div>
              </div>

              {/* Eco trust */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Droplets, label: "6 L d'eau par lavage", color: "bg-blue-100 text-blue-700" },
                  { icon: Leaf, label: "0 produit chimique", color: "bg-emerald-100 text-emerald-700" },
                  { icon: ShieldCheck, label: "RC Pro & assurance", color: "bg-amber-100 text-amber-700" },
                ].map((t) => (
                  <div key={t.label} className="text-center p-4 rounded-xl bg-muted">
                    <div className={`h-9 w-9 mx-auto rounded-lg ${t.color} flex items-center justify-center`}>
                      <t.icon size={18} />
                    </div>
                    <p className="mt-2 text-xs font-medium text-charcoal-700">{t.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Sticky sidebar CTA ─── */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <Card className="p-6 shadow-lg border-green-100">
                  <p className="text-sm font-semibold text-charcoal-900">
                    Réservez votre lavage
                  </p>
                  <p className="mt-1 text-3xl font-bold text-green-900">
                    À partir de {golf.startingPrice ?? 29}€
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Paiement sur place · Annulation libre
                  </p>

                  {golf.phone && (
                    <Button size="lg" className="mt-6 w-full" asChild>
                      <a href={`tel:${golf.phone.replace(/\s/g, "")}`}>
                        <Phone size={18} />
                        Appeler pour réserver
                      </a>
                    </Button>
                  )}

                  <div className="mt-4 p-3 rounded-lg bg-muted text-center">
                    <p className="text-xs text-muted-foreground">
                      Bientôt : réservez directement depuis l&apos;app
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                    {golf.openingHours && (
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {golf.openingHours}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      {golf.city}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Other locations */}
          {otherGolfs.length > 0 && (
            <div className="mt-16 pt-12 border-t border-border">
              <h2 className="text-xl font-semibold text-charcoal-900 mb-6">
                Nos autres golfs
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {otherGolfs.map((g) => (
                  <div
                    key={g.slug}
                    className="rounded-xl border border-border p-4 bg-white"
                  >
                    <p className="font-semibold text-sm text-charcoal-900">
                      {g.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {g.city}
                    </p>
                    <Badge
                      variant="muted"
                      className={`mt-2 text-xs ${g.active ? "bg-green-100 text-green-700" : ""}`}
                    >
                      {g.active ? "Actif" : "Bientôt"}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link href="/#book">
                    Voir tous les golfs
                    <ArrowRight size={14} />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Mobile sticky CTA ─── */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-border px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-bold text-green-900">
                Dès {golf.startingPrice ?? 29}€
              </p>
              <p className="text-xs text-muted-foreground">
                Paiement sur place
              </p>
            </div>
            {golf.phone && (
              <Button size="lg" asChild>
                <a href={`tel:${golf.phone.replace(/\s/g, "")}`}>
                  <Phone size={16} />
                  Appeler
                </a>
              </Button>
            )}
          </div>
        </div>
        {/* Spacer so mobile sticky CTA doesn't cover footer */}
        <div className="h-20 lg:hidden" />
      </main>
      <Footer />
    </>
  );
}
