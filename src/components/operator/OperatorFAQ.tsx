import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/ui/section-header";

const faqs = [
  {
    question: "Quel statut faut-il avoir ?",
    answer:
      "Vous devez être auto-entrepreneur (micro-entreprise). Si vous ne l'êtes pas encore, on vous accompagne dans les démarches de création. C'est gratuit et ça prend 15 minutes en ligne.",
  },
  {
    question: "Combien puis-je gagner ?",
    answer:
      "Vos revenus dépendent du nombre de lavages réalisés. En moyenne, un opérateur à temps plein réalise 6 à 10 lavages par jour. Avec nos commissions, cela représente un revenu attractif dès le premier mois.",
  },
  {
    question: "Faut-il de l'expérience en lavage auto ?",
    answer:
      "Non. Notre formation de 2 jours vous apprend tout : techniques vapeur, detailing, gestion client. Nous recherchons avant tout des personnes motivées, soigneuses et autonomes.",
  },
  {
    question: "Qui fournit le matériel ?",
    answer:
      "Tout est fourni dans le container : nettoyeur vapeur professionnel, aspirateur, microfibres, produits de finition. Vous venez avec votre motivation, on fournit le reste.",
  },
  {
    question: "Puis-je choisir mes horaires et mes golfs ?",
    answer:
      "Oui. Vous réservez vos créneaux sur les golfs disponibles dans votre zone. Vous êtes libre de travailler les jours et horaires qui vous conviennent, y compris le week-end.",
  },
  {
    question: "Comment sont gérés les clients ?",
    answer:
      "Les réservations arrivent via notre plateforme. Vous recevez une notification, vous réalisez le lavage, le paiement est automatique. Pas de gestion administrative de votre côté.",
  },
];

export function OperatorFAQ() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="FAQ" title="Questions fréquentes" />

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left font-semibold text-charcoal-900">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
