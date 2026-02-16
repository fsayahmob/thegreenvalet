import { MapPin, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";

export function TrustSection() {
  return (
    <section className="py-20 sm:py-28 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Confiance"
          title="Premiers déploiements en Bretagne"
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <MapPin className="text-green-700" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-charcoal-900">
                    Golf de Dinard
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Saint-Briac-sur-Mer, Bretagne
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Badge variant="success">En cours de déploiement</Badge>
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Premier site partenaire. Un container installé sur le parking du
                club-house, au service des 800 membres du golf.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-900 border-green-800 p-8 text-white">
            <CardContent className="p-0">
              <Quote className="text-green-400" size={32} />
              <blockquote className="mt-4 text-lg leading-relaxed text-green-100">
                &ldquo;Notre ambition : que chaque golf en France puisse offrir à
                ses membres un service de lavage premium, écologique et sans
                contrainte. Le parking de votre club est le dernier espace
                sous-exploité — nous le transformons en atout.&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-800 flex items-center justify-center text-sm font-bold">
                  G
                </div>
                <div>
                  <p className="font-semibold">Gaëtan</p>
                  <p className="text-sm text-green-300">
                    Fondateur, The Green Valet
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-lg">
            <span className="font-semibold text-charcoal-900">350 golfs</span>{" "}
            en France &middot;{" "}
            <span className="font-semibold text-charcoal-900">
              400 000 licenciés
            </span>{" "}
            &middot;{" "}
            <span className="font-semibold text-green-800">
              0 offre de lavage vapeur sur site
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
