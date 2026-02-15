import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { ContainerSection } from "@/components/landing/ContainerSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { RSESection } from "@/components/landing/RSESection";
import { TrustSection } from "@/components/landing/TrustSection";
import { ContactSection } from "@/components/landing/ContactSection";
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
        <ProcessSection />
        <ContainerSection />
        <StatsSection />
        <RSESection />
        <TrustSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
