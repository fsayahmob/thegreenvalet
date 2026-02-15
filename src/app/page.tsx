import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ClientHero } from "@/components/client/ClientHero";
import { FormulasSection } from "@/components/client/FormulasSection";
import { SteamSection } from "@/components/client/SteamSection";
import { ClientProcess } from "@/components/client/ClientProcess";
import { EcoSection } from "@/components/client/EcoSection";
import { ClientCTA } from "@/components/client/ClientCTA";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <ClientHero />
        <FormulasSection />
        <SteamSection />
        <ClientProcess />
        <EcoSection />
        <ClientCTA />
      </main>
      <Footer />
    </>
  );
}
