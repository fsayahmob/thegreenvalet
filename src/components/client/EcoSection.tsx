import { Droplets, Leaf, Recycle, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const ecoPoints = [
  {
    icon: Droplets,
    value: "6L",
    label: "d'eau par véhicule",
    detail: "vs 200L en station classique — soit une réduction de 97%",
  },
  {
    icon: Leaf,
    value: "0",
    label: "produit chimique",
    detail: "vapeur à 190°C : elle dissout, désinfecte et dégraisse sans aucun solvant",
  },
  {
    icon: ShieldCheck,
    value: "99,99%",
    label: "bactéries éliminées",
    detail: "certifié par les tests sanitaires — acariens, moisissures, allergènes détruits",
  },
  {
    icon: Recycle,
    value: "0",
    label: "rejet dans les eaux",
    detail: "aucun ruissellement, aucune pollution des nappes phréatiques",
  },
];

export function EcoSection() {
  return (
    <section className="py-20 sm:py-24 bg-green-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Éco-responsable"
          title={
            <>
              Bon pour votre voiture.
              <br />
              Bon pour la planète.
            </>
          }
          description="La vapeur haute pression remplace l'eau, les chimiques et les brosses. Un lavage plus propre à tous les sens du terme."
          dark
          className="mb-16"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {ecoPoints.map((point) => (
            <div key={point.label} className="text-center">
              <div className="h-12 w-12 mx-auto rounded-xl bg-green-800/50 flex items-center justify-center">
                <point.icon className="text-green-300" size={24} />
              </div>
              <p className="mt-4 text-4xl sm:text-5xl font-bold text-white">
                {point.value}
              </p>
              <p className="mt-2 text-base font-medium text-green-300">
                {point.label}
              </p>
              <p className="mt-2 text-sm text-green-400/70 leading-relaxed">{point.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
