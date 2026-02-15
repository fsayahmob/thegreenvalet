import { ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ClientHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt="Voiture brillante sur le parking d'un golf"
        fill
        className="object-cover"
        priority
        quality={85}
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
          Jouez tranquille.
          <br />
          <span className="text-green-400">On s&apos;occupe du reste.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
          Pendant votre parcours, votre voiture est lavée à la vapeur
          directement sur le parking de votre golf.
          <br className="hidden sm:block" />
          Écologique. Premium. Sans effort.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="white" size="xl" asChild>
            <Link href="#formulas">Découvrir nos formules</Link>
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="border-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href="#how">Comment ça marche ?</Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ArrowDown className="text-white/60" size={28} />
      </div>
    </section>
  );
}
