import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { SimulateurSection } from "@/components/landing/SimulateurSection";
import { ContainerSection } from "@/components/landing/ContainerSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { RSESection } from "@/components/landing/RSESection";
import { TrustSection } from "@/components/landing/TrustSection";
import { StickyGolfCTA } from "@/components/landing/StickyGolfCTA";
import { Footer } from "@/components/landing/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partenaires Golf — The Green Valet",
  description:
    "Offrez un service de lavage vapeur premium à vos membres. Zéro investissement, zéro contrainte. On installe, on opère, vous récoltez les bénéfices.",
};

export default function GolfPartnerPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <SimulateurSection />
        <ContainerSection />
        <ProcessSection />
        <RSESection />
        <TrustSection />
      </main>
      <Footer />
      <StickyGolfCTA />
    </>
  );
}
