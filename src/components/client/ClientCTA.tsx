import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClientCTA() {
  return (
    <section id="book" className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-2xl bg-gradient-to-br from-green-900 to-green-800 p-10 sm:p-16 text-center overflow-hidden"
          style={{ backgroundImage: "url(/images/texture-green.jpg)", backgroundSize: "cover", backgroundPosition: "center", backgroundBlendMode: "overlay" }}
        >
          <div className="h-14 w-14 mx-auto rounded-full bg-green-700/50 flex items-center justify-center">
            <MapPin className="text-green-300" size={28} />
          </div>

          <h2 className="mt-6 text-3xl sm:text-4xl font-bold text-white">
            Votre golf propose-t-il The Green Valet ?
          </h2>
          <p className="mt-4 text-lg text-green-200/80 max-w-2xl mx-auto">
            Nous déployons actuellement nos premiers sites en Bretagne.
            Vérifiez si votre golf est partenaire ou suggérez-le nous.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="white" size="xl" asChild>
              <Link href="/golf#contact">
                Suggérer mon golf
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/golf">Vous êtes directeur de golf ?</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Vous êtes laveur auto-entrepreneur ?{" "}
            <Link
              href="/rejoindre"
              className="font-medium text-green-800 hover:text-green-900 transition-colors"
            >
              Rejoignez notre réseau &rarr;
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
