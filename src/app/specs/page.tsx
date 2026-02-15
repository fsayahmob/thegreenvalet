import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { SpecsAccordion } from "@/components/specs/SpecsAccordion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spécifications techniques — The Green Valet",
  description:
    "Documentation technique complète du container de lavage vapeur : dimensions, électricité, eau, équipements, réglementation.",
};

export default function SpecsPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-green-800 transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Retour à l&apos;accueil
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal-900">
            Spécifications techniques
          </h1>
          <p className="mt-4 text-lg text-[var(--muted-foreground)] max-w-2xl">
            Documentation technique complète de la station de lavage vapeur The
            Green Valet. Cliquez sur chaque catégorie pour afficher les détails.
          </p>

          <div className="mt-12">
            <SpecsAccordion />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
