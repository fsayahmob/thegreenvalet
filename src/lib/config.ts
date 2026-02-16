// ─── Collection Names ─────────────────────────────────
export const COLLECTIONS = {
  USERS: "users",
  LEADS: "leads",
  PARTNERS: "partners",
  OPERATORS: "operators",
  SITES: "sites",
  DOCUMENTS: "documents",
  TEMPLATES: "templates",
  YOUSIGN_REQUESTS: "yousign_requests",
} as const;

// ─── SLA Configuration ───────────────────────────────
export const SLA = {
  PARTNER_HOURS: 24,
  OPERATOR_HOURS: 48,
} as const;

// ─── Status Transitions (allowed next states) ────────
export const LEAD_TRANSITIONS: Record<string, string[]> = {
  new: ["contacted", "rejected"],
  contacted: ["qualified", "rejected"],
  qualified: ["converted", "rejected"],
  converted: [],
  rejected: [],
};

export const PARTNER_STATUS_TRANSITIONS: Record<string, string[]> = {
  prospect: ["onboarding"],
  onboarding: ["active", "suspended"],
  active: ["suspended"],
  suspended: ["active"],
};

export const OPERATOR_STATUS_TRANSITIONS: Record<string, string[]> = {
  prospect: ["onboarding"],
  onboarding: ["active", "suspended"],
  active: ["suspended"],
  suspended: ["active"],
};

// ─── Status Display ──────────────────────────────────
export type StatusColor = "green" | "blue" | "amber" | "red" | "purple" | "gray";

export const LEAD_STATUS_CONFIG: Record<string, { label: string; color: StatusColor }> = {
  new: { label: "Nouveau", color: "blue" },
  contacted: { label: "Contacté", color: "amber" },
  qualified: { label: "Qualifié", color: "purple" },
  converted: { label: "Converti", color: "green" },
  rejected: { label: "Rejeté", color: "red" },
};

export const ENTITY_STATUS_CONFIG: Record<string, { label: string; color: StatusColor }> = {
  prospect: { label: "Prospect", color: "gray" },
  onboarding: { label: "Onboarding", color: "blue" },
  active: { label: "Actif", color: "green" },
  suspended: { label: "Suspendu", color: "red" },
};

export const DOCUMENT_STATUS_CONFIG: Record<string, { label: string; color: StatusColor }> = {
  uploaded: { label: "Uploadé", color: "blue" },
  under_review: { label: "En revue", color: "amber" },
  approved: { label: "Approuvé", color: "green" },
  rejected: { label: "Rejeté", color: "red" },
  expired: { label: "Expiré", color: "gray" },
};

export const PIPELINE_STATUS_CONFIG: Record<string, { label: string; color: StatusColor }> = {
  locked: { label: "Verrouillé", color: "gray" },
  in_progress: { label: "En cours", color: "blue" },
  waiting_external: { label: "Attente externe", color: "amber" },
  completed: { label: "Terminé", color: "green" },
  skipped: { label: "Ignoré", color: "gray" },
};
