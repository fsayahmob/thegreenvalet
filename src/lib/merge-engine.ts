import type { MergeFieldDefinition } from "./types";

/**
 * Resolve a dot-path like "partner.name" from a data context object.
 * Supports "+" concatenation: "operator.firstName+operator.lastName" → "Jean Dupont"
 */
export function resolveFieldValue(
  source: string,
  context: Record<string, unknown>,
): string {
  // Handle concatenation with "+"
  if (source.includes("+")) {
    return source
      .split("+")
      .map((part) => resolveFieldValue(part.trim(), context))
      .filter(Boolean)
      .join(" ");
  }

  // Traverse dot path
  const parts = source.split(".");
  let current: unknown = context;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return "";
    current = (current as Record<string, unknown>)[part];
  }

  if (current == null) return "";

  // Format dates
  if (current instanceof Date) {
    return current.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Format numbers
  if (typeof current === "number") {
    return current.toLocaleString("fr-FR");
  }

  return String(current);
}

/**
 * Replace all {{key}} placeholders in HTML content with resolved values.
 */
export function mergeTemplate(
  content: string,
  mergeFields: MergeFieldDefinition[],
  context: Record<string, unknown>,
): { html: string; missingFields: string[] } {
  const missingFields: string[] = [];
  const fieldMap = new Map(mergeFields.map((f) => [f.key, f]));

  const html = content.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const field = fieldMap.get(key);
    if (!field) return match; // unknown placeholder, leave as-is

    const value = resolveFieldValue(field.source, context);
    if (!value && field.required) {
      missingFields.push(key);
      return `<span class="merge-missing">[${field.label}]</span>`;
    }
    return value || `<span class="merge-empty">[—]</span>`;
  });

  return { html, missingFields };
}

/**
 * Build a context object for the merge engine from entity data.
 */
export function buildMergeContext(
  entityType: "partner" | "operator",
  entity: Record<string, unknown>,
  extras?: Record<string, unknown>,
): Record<string, unknown> {
  if (entityType === "partner") {
    return {
      partner: entity,
      site: extras?.site ?? {},
      convention: extras?.convention ?? {},
      ...extras,
    };
  }
  return {
    operator: {
      ...entity,
      // Auto-compute full name
      full_name: `${entity.firstName ?? ""} ${entity.lastName ?? ""}`.trim(),
    },
    cgv: extras?.cgv ?? {},
    charte: extras?.charte ?? {},
    decharge: extras?.decharge ?? {},
    site: extras?.site ?? {},
    ...extras,
  };
}
