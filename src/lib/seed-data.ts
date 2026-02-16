import type { MergeFieldDefinition, TemplateType, EntityType } from "@/lib/types";

// ─── Seed Templates ─────────────────────────────────

export interface SeedTemplate {
  type: TemplateType;
  name: string;
  description: string;
  entityType: EntityType | "all";
  isPublic: boolean;
  mergeFields: MergeFieldDefinition[];
}

export const SEED_TEMPLATES: SeedTemplate[] = [
  {
    type: "convention",
    name: "Convention d'Occupation Temporaire",
    description:
      "Convention entre The Green Valet et le golf partenaire pour l'occupation temporaire d'un espace dédié au lavage automobile.",
    entityType: "partner",
    isPublic: false,
    mergeFields: [
      { key: "partner_name", label: "Nom du golf", source: "partner.name", type: "text", required: true },
      { key: "partner_siret", label: "SIRET du golf", source: "partner.siret", type: "text", required: true },
      { key: "partner_address", label: "Adresse du golf", source: "partner.address", type: "address", required: true },
      { key: "contact_name", label: "Nom du contact", source: "partner.contactName", type: "text", required: true },
      { key: "contact_email", label: "Email du contact", source: "partner.contactEmail", type: "text", required: true },
      { key: "site_address", label: "Adresse du site", source: "site.address", type: "address", required: true },
      { key: "site_surface", label: "Surface (m²)", source: "site.surfaceM2", type: "number", required: true },
      { key: "monthly_fee", label: "Redevance mensuelle (€)", source: "convention.monthlyFee", type: "number", required: true },
      { key: "start_date", label: "Date de début", source: "convention.startDate", type: "date", required: true },
      { key: "end_date", label: "Date de fin", source: "convention.endDate", type: "date", required: true },
      { key: "duration_months", label: "Durée (mois)", source: "convention.durationMonths", type: "number", required: true },
    ],
  },
  {
    type: "cgv",
    name: "CGV Opérateur",
    description:
      "Conditions générales de vente entre The Green Valet et l'opérateur laveur auto-entrepreneur.",
    entityType: "operator",
    isPublic: false,
    mergeFields: [
      { key: "operator_full_name", label: "Nom complet de l'opérateur", source: "operator.firstName+operator.lastName", type: "text", required: true },
      { key: "operator_siret", label: "SIRET de l'opérateur", source: "operator.siret", type: "text", required: true },
      { key: "commission_rate", label: "Taux de commission (%)", source: "cgv.commissionRate", type: "number", required: true },
      { key: "effective_date", label: "Date d'effet", source: "cgv.effectiveDate", type: "date", required: true },
    ],
  },
  {
    type: "cgu",
    name: "CGU Plateforme",
    description:
      "Conditions générales d'utilisation de la plateforme The Green Valet.",
    entityType: "all",
    isPublic: true,
    mergeFields: [],
  },
  {
    type: "specs",
    name: "Specs Techniques Container",
    description:
      "Spécifications techniques du container de lavage vapeur : dimensions, raccordements électriques (triphasé 400V), alimentation eau, évacuation.",
    entityType: "all",
    isPublic: true,
    mergeFields: [],
  },
  {
    type: "plaquette",
    name: "Plaquette Commerciale",
    description:
      "Plaquette de présentation commerciale du service The Green Valet pour les golfs et prospects.",
    entityType: "all",
    isPublic: true,
    mergeFields: [],
  },
  {
    type: "fiche_metier",
    name: "Fiche Métier Laveur",
    description:
      "Fiche métier du laveur automobile vapeur : missions, compétences, équipement, rémunération indicative.",
    entityType: "all",
    isPublic: true,
    mergeFields: [],
  },
];

// ─── Seed Leads ──────────────────────────────────────

export interface SeedLead {
  type: "partner" | "operator";
  source: "website_golf" | "website_operator";
  status: "new";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  golfName?: string;
  currentStatus?: string;
  motivation?: string;
}

export const SEED_LEADS: SeedLead[] = [
  {
    type: "partner",
    source: "website_golf",
    status: "new",
    firstName: "Jean-Marc",
    lastName: "Dupont",
    email: "jm.dupont@golf-test.fr",
    phone: "06 12 34 56 78",
    city: "Aix-en-Provence",
    golfName: "Golf de la Sainte-Victoire",
  },
  {
    type: "operator",
    source: "website_operator",
    status: "new",
    firstName: "Karim",
    lastName: "Benzema",
    email: "karim.b@laveur-test.fr",
    phone: "06 98 76 54 32",
    city: "Marseille",
    currentStatus: "auto-entrepreneur",
    motivation: "Reconversion professionnelle, passionné automobile et écologie.",
  },
];
