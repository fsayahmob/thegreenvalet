import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { OperatorHero } from "@/components/operator/OperatorHero";
import { AdvantagesSection } from "@/components/operator/AdvantagesSection";
import { OperatorProcess } from "@/components/operator/OperatorProcess";
import { FormationSection } from "@/components/operator/FormationSection";
import { OperatorFAQ } from "@/components/operator/OperatorFAQ";
import { ApplicationForm } from "@/components/operator/ApplicationForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rejoindre le réseau — The Green Valet",
  description:
    "Devenez laveur vapeur indépendant sur les golfs de France. Formation incluse, équipement fourni, revenus attractifs. Candidatez en 2 minutes.",
};

export default function RejoindreOperateurPage() {
  return (
    <>
      <Header />
      <main>
        <OperatorHero />
        <AdvantagesSection />
        <OperatorProcess />
        <FormationSection />
        <OperatorFAQ />
        <ApplicationForm />
      </main>
      <Footer />
    </>
  );
}
