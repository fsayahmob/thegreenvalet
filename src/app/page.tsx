import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ClientHero } from "@/components/client/ClientHero";
import { ClientProcess } from "@/components/client/ClientProcess";
import { BeforeAfterSection } from "@/components/client/BeforeAfterSection";
import { SteamSection } from "@/components/client/SteamSection";
import { FormulasSection } from "@/components/client/FormulasSection";
import { EcoSection } from "@/components/client/EcoSection";
import { GolfMapSection } from "@/components/client/GolfMapSection";

export const metadata: Metadata = {
  title: "The Green Valet — Lavage vapeur pendant votre partie de golf",
  description:
    "Pendant votre parcours, votre voiture est lavée à la vapeur directement sur le parking de votre golf. Écologique, premium, sans effort. Dès 29€.",
  openGraph: {
    title: "The Green Valet — Lavage vapeur pendant votre partie de golf",
    description:
      "Pendant votre parcours, votre voiture est lavée à la vapeur directement sur le parking de votre golf. Écologique, premium, sans effort.",
    images: [{ url: "/images/hero.jpg", width: 2400, height: 1028 }],
  },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <ClientHero />
        <ClientProcess />
        <BeforeAfterSection />
        <SteamSection />
        <FormulasSection />
        <EcoSection />
        <GolfMapSection />
      </main>
      <Footer />
    </>
  );
}
