import { ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt="Station de lavage vapeur The Green Valet sur un golf"
        fill
        className="object-cover"
        priority
        quality={75}
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
          Vos membres jouent.
          <br />
          <span className="text-green-400">Leur voiture brille.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
          Le premier service de lavage vapeur éco-responsable intégré aux golfs.
          <br className="hidden sm:block" />
          Zéro investissement, zéro contrainte, 100% image premium.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="white" size="xl" asChild>
            <Link href="#concept">Découvrir le concept</Link>
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="border-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href="#simulator">Estimer mes revenus</Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce [animation-delay:2s] [animation-iteration-count:3]">
        <ArrowDown className="text-white/40" size={24} />
      </div>
    </section>
  );
}
