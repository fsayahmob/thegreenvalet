// ─── Roles ────────────────────────────────────────
export type UserRole = "admin" | "partner" | "operator";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
}

// ─── Leads ──────────────────────────────────────────
export type LeadSource = "website_golf" | "website_operator" | "referral" | "outbound" | "other";
export type LeadType = "partner" | "operator";
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "rejected";

export interface Lead {
  id: string;
  type: LeadType;
  source: LeadSource;
  status: LeadStatus;

  // Contact info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;

  // Partner-specific
  golfName?: string;

  // Operator-specific
  currentStatus?: string; // "auto-entrepreneur", "salarie", etc.
  motivation?: string;

  // SLA tracking
  slaDeadline: Date;
  slaBreached: boolean;

  // Qualification (filled by admin)
  qualificationNotes?: string;
  qualificationDate?: Date;
  qualifiedBy?: string;

  // Conversion
  convertedEntityId?: string;
  rejectionReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

// ─── Documents ────────────────────────────────────
export type DocumentStatus =
  | "uploaded"
  | "under_review"
  | "approved"
  | "rejected"
  | "expired";

export type EntityType = "partner" | "operator" | "site";

export interface AppDocument {
  id: string;
  entityType: EntityType;
  entityId: string;
  type: string;
  fileName: string;
  fileUrl: string;
  status: DocumentStatus;
  expiresAt: Date | null;
  validatedBy: string | null;
  validatedAt: Date | null;
  rejectionReason: string | null;
  yousignRequestId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Eligibility (Golf) ─────────────────────────────
export interface GolfEligibility {
  triphase: boolean | null;       // Triphasé 400V disponible
  waterAccess: boolean | null;    // Point d'eau DN15 accessible
  surfaceAvailable: boolean | null; // ~30m² disponible
  truckAccess: boolean | null;    // Accès camion livraison
  pluCompatible: boolean | null;  // Zone PLU constructible
  outsideCoastalBand: boolean | null; // Hors bande 100m littoral
  abfZone: boolean | null;        // En périmètre ABF (info, pas bloquant)
  directionApproval: boolean | null; // Direction golf favorable
  notes?: string;
}

// ─── Partners (Golf) ─────────────────────────────
export type PartnerStatus = "prospect" | "onboarding" | "active" | "suspended";

export interface Partner {
  id: string;
  userId: string | null;
  name: string;
  siret: string;
  address: string;
  city: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactRole: string;
  status: PartnerStatus;
  currentStageKey: string;
  pipelineProgress: PipelineProgress[];
  eligibility: GolfEligibility;
  leadId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Operators (Laveurs) ─────────────────────────
export type OperatorStatus = "prospect" | "onboarding" | "active" | "suspended";

export interface Operator {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  siret: string;
  email: string;
  phone: string;
  status: OperatorStatus;
  currentStageKey: string;
  pipelineProgress: PipelineProgress[];
  assignedSites: string[];
  leadId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sites ────────────────────────────────────────
export interface Site {
  id: string;
  partnerId: string;
  name: string;
  address: string;
  surfaceM2?: number;
  assignedOperatorId: string | null;
  isActive: boolean;
  coordinates?: { lat: number; lng: number };
  createdAt: Date;
}

// ─── Pipeline ─────────────────────────────────────
export type PipelineStageStatus = "locked" | "in_progress" | "waiting_external" | "completed" | "skipped";

export interface PipelineStage {
  order: number;
  key: string;
  name: string;
  description: string;
  requiredDocTypes: string[];
  optionalDocTypes?: string[];
  estimatedDuration?: string;
  canRunParallel?: boolean;
  requiresYousign?: boolean;
  actions: string[];
}

export interface PipelineProgress {
  stageKey: string;
  status: PipelineStageStatus;
  startedAt?: Date;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
  actionChecklist?: Record<string, boolean>;
}

// ─── Pipeline Configs ─────────────────────────────

export const PARTNER_PIPELINE: PipelineStage[] = [
  {
    order: 0,
    key: "pre_qualification",
    name: "Pré-qualification",
    description: "Appel, vérifier éligibilité (questionnaire technique)",
    requiredDocTypes: [],
    actions: ["Appeler le contact", "Remplir le questionnaire d'éligibilité"],
  },
  {
    order: 1,
    key: "site_visit",
    name: "Visite site",
    description: "Visite physique, photos, mesures, vérification raccordements",
    requiredDocTypes: ["site_visit_report", "site_photos"],
    actions: ["Planifier la visite", "Prendre des photos", "Mesurer la zone disponible"],
  },
  {
    order: 2,
    key: "plu_verification",
    name: "Vérification PLU",
    description: "Vérification du Plan Local d'Urbanisme",
    requiredDocTypes: ["plu_verification"],
    actions: ["Vérifier sur geoportail-urbanisme.gouv.fr", "Contacter le service urbanisme"],
  },
  {
    order: 3,
    key: "declaration_prealable",
    name: "Déclaration Préalable",
    description: "Cerfa 13703 déposé en mairie (1-3 mois d'attente)",
    requiredDocTypes: ["dp_cerfa_13703", "dp_receipt"],
    estimatedDuration: "1-3 mois",
    canRunParallel: true,
    actions: ["Préparer le dossier Cerfa 13703", "Déposer en mairie", "Attendre la réponse"],
  },
  {
    order: 4,
    key: "electrical_consuel",
    name: "Électricité & Consuel",
    description: "Installation électrique triphasée + attestation Consuel",
    requiredDocTypes: ["consuel_attestation"],
    optionalDocTypes: ["electrical_quote"],
    canRunParallel: true,
    actions: ["Engager un électricien qualifié", "Réaliser l'installation", "Obtenir le Consuel"],
  },
  {
    order: 5,
    key: "insurance",
    name: "Assurance site",
    description: "Certificat d'assurance du site fourni par le golf",
    requiredDocTypes: ["insurance_certificate"],
    canRunParallel: true,
    actions: ["Demander l'attestation au golf"],
  },
  {
    order: 6,
    key: "site_layout",
    name: "Plan d'implantation",
    description: "Plan de positionnement du container validé par les 2 parties",
    requiredDocTypes: ["site_layout_plan"],
    canRunParallel: true,
    actions: ["Préparer le plan", "Faire valider par le golf"],
  },
  {
    order: 7,
    key: "convention_signed",
    name: "Convention signée",
    description: "Convention d'occupation temporaire signée par les 2 parties",
    requiredDocTypes: ["convention"],
    requiresYousign: true,
    actions: ["Générer la convention depuis le template", "Envoyer à signature"],
  },
];

export const OPERATOR_PIPELINE: PipelineStage[] = [
  {
    order: 0,
    key: "pre_qualification",
    name: "Pré-qualification",
    description: "Entretien téléphonique avec le candidat",
    requiredDocTypes: [],
    actions: ["Appeler le candidat", "Évaluer la motivation et la disponibilité"],
  },
  {
    order: 1,
    key: "admin_documents",
    name: "Documents administratifs",
    description: "K-Bis, pièce d'identité et casier judiciaire vierge",
    requiredDocTypes: ["kbis_urssaf", "id_document", "casier_judiciaire"],
    actions: ["Vérifier le SIRET", "Vérifier l'identité", "Vérifier le casier vierge"],
  },
  {
    order: 2,
    key: "insurance",
    name: "Assurance RC Pro",
    description: "Assurance responsabilité civile professionnelle valide",
    requiredDocTypes: ["rc_professionnelle"],
    actions: ["Demander l'attestation RC Pro"],
  },
  {
    order: 3,
    key: "training",
    name: "Formation",
    description: "Formation au lavage vapeur (2 jours) + évaluation",
    requiredDocTypes: ["training_certificate"],
    optionalDocTypes: ["training_assessment"],
    actions: ["Planifier la formation", "Confirmer la présence", "Évaluer le candidat"],
  },
  {
    order: 4,
    key: "equipment",
    name: "Équipement",
    description: "Attribution et validation du matériel",
    requiredDocTypes: ["equipment_checklist"],
    actions: ["Attribuer le matériel", "Faire signer la checklist"],
  },
  {
    order: 5,
    key: "site_assignment",
    name: "Affectation site",
    description: "Assignation à un site actif",
    requiredDocTypes: [],
    actions: ["Choisir le site", "Briefer l'opérateur sur le site"],
  },
  {
    order: 6,
    key: "cgv_signed",
    name: "CGV signées",
    description: "Conditions générales signées",
    requiredDocTypes: ["cgv"],
    requiresYousign: true,
    actions: ["Générer les CGV depuis le template", "Envoyer à signature"],
  },
];

// ─── Document Types ─────────────────────────────────

export const PARTNER_DOCUMENT_TYPES = [
  { type: "plu_verification", label: "Vérification PLU", required: true, hasExpiry: false },
  { type: "dp_cerfa_13703", label: "Déclaration Préalable (Cerfa 13703)", required: true, hasExpiry: false },
  { type: "dp_receipt", label: "Accusé de réception DP", required: true, hasExpiry: false },
  { type: "consuel_attestation", label: "Attestation Consuel", required: true, hasExpiry: false },
  { type: "electrical_quote", label: "Devis électricien", required: false, hasExpiry: false },
  { type: "insurance_certificate", label: "Attestation assurance site", required: true, hasExpiry: true },
  { type: "site_layout_plan", label: "Plan d'implantation", required: true, hasExpiry: false },
  { type: "site_visit_report", label: "Rapport de visite", required: false, hasExpiry: false },
  { type: "site_photos", label: "Photos du site", required: true, hasExpiry: false },
  { type: "convention", label: "Convention signée", required: true, hasExpiry: true },
] as const;

export const OPERATOR_DOCUMENT_TYPES = [
  { type: "kbis_urssaf", label: "K-Bis / Attestation URSSAF", required: true, hasExpiry: true },
  { type: "id_document", label: "Pièce d'identité", required: true, hasExpiry: true },
  { type: "casier_judiciaire", label: "Extrait casier judiciaire (B3)", required: true, hasExpiry: false },
  { type: "rc_professionnelle", label: "RC Professionnelle", required: true, hasExpiry: true },
  { type: "training_certificate", label: "Attestation de formation", required: true, hasExpiry: false },
  { type: "training_assessment", label: "Évaluation formation", required: false, hasExpiry: false },
  { type: "equipment_checklist", label: "Checklist équipement", required: true, hasExpiry: false },
  { type: "cgv", label: "CGV signées", required: true, hasExpiry: false },
  { type: "domiciliation_proof", label: "Justificatif de domiciliation", required: false, hasExpiry: false },
] as const;

// ─── Templates ──────────────────────────────────────

export type TemplateType = "convention" | "cgv" | "cgu" | "plaquette" | "fiche_metier" | "specs";

export interface MergeFieldDefinition {
  key: string;
  label: string;
  source: string; // dot path: "partner.name"
  type: "text" | "date" | "number" | "address";
  required: boolean;
}

export interface DocumentTemplate {
  id: string;
  type: TemplateType;
  name: string;
  version: number;
  description: string;
  entityType: EntityType | "all";
  fileUrl: string;
  fileName: string;
  content?: string; // HTML content with {{merge_field}} placeholders
  mergeFields: MergeFieldDefinition[];
  yousignTemplateId?: string;
  signerRoles?: string[];
  isActive: boolean;
  isPublic: boolean; // visible on public site
  previousVersionId?: string;
  changelog?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Communication Log ──────────────────────────────

export type CommunicationType = "phone_call" | "email" | "visit" | "note" | "sms";
export type CommunicationDirection = "inbound" | "outbound" | "internal";

export interface CommunicationEntry {
  id: string;
  entityType: EntityType;
  entityId: string;
  type: CommunicationType;
  direction: CommunicationDirection;
  subject: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}

// ─── Yousign (Phase 2) ──────────────────────────────

export type YousignStatus = "draft" | "activated" | "done" | "expired" | "declined" | "canceled";

export interface YousignRequest {
  id: string;
  entityType: EntityType;
  entityId: string;
  templateId: string;
  templateVersion: number;
  yousignRequestId: string;
  yousignStatus: YousignStatus;
  signerEmails: string[];
  activatedAt?: Date;
  completedAt?: Date;
  signedDocumentUrl?: string;
  signedDocumentId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
