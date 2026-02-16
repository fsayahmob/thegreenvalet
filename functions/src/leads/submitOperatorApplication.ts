import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";

interface OperatorApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  currentStatus: string;
  motivation?: string;
  honeypot?: string; // Anti-spam honeypot field
}

const MAX_TEXT = 200;
const MAX_MOTIVATION = 2000;

function ensureString(val: unknown, name: string, maxLen = MAX_TEXT): string {
  if (typeof val !== "string") {
    throw new HttpsError("invalid-argument", `${name} doit être une chaîne de caractères.`);
  }
  const trimmed = val.trim();
  if (trimmed.length > maxLen) {
    throw new HttpsError("invalid-argument", `${name} ne doit pas dépasser ${maxLen} caractères.`);
  }
  return trimmed;
}

/**
 * Callable function invoked by the /rejoindre application form.
 * Creates a Lead document in Firestore with type "operator".
 */
export const submitOperatorApplication = onCall<OperatorApplicationData>(
  { region: "europe-west1", cors: [/thegreenvalet\.fr$/, /localhost/] },
  async (request) => {
    const data = request.data;

    // Anti-spam: reject if honeypot field is filled
    if (data.honeypot) {
      // Silently succeed to not reveal the honeypot to bots
      return { success: true };
    }

    // Type-safe extraction with length validation
    const firstName = ensureString(data.firstName, "Prénom");
    const lastName = ensureString(data.lastName, "Nom");
    const email = ensureString(data.email, "Email");
    const phone = ensureString(data.phone, "Téléphone");
    const city = ensureString(data.city, "Ville");
    const currentStatus = ensureString(data.currentStatus, "Statut actuel");
    const motivation = data.motivation ? ensureString(data.motivation, "Motivation", MAX_MOTIVATION) : "";

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !city || !currentStatus) {
      throw new HttpsError(
        "invalid-argument",
        "Données invalides. Veuillez vérifier le formulaire.",
      );
    }

    // Email validation
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      throw new HttpsError("invalid-argument", "Données invalides. Veuillez vérifier le formulaire.");
    }

    // Phone validation
    if (!/^[\d\s\-+().]{6,20}$/.test(phone)) {
      throw new HttpsError("invalid-argument", "Données invalides. Veuillez vérifier le formulaire.");
    }

    // SLA: 48h for operator leads
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + 48);

    const db = getFirestore();

    // Rate limit: max 3 leads from same email in 24h (checked BEFORE any writes)
    const recent = await db
      .collection("leads")
      .where("email", "==", email.toLowerCase())
      .where("createdAt", ">", Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)))
      .limit(3)
      .get();
    if (recent.size >= 3) {
      // Generic message — don't reveal rate limiting specifics
      throw new HttpsError("resource-exhausted", "Demande non traitée. Veuillez réessayer plus tard.");
    }

    const leadRef = await db.collection("leads").add({
      type: "operator",
      source: "website_operator",
      status: "new",
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      city,
      currentStatus,
      motivation,
      slaDeadline: Timestamp.fromDate(slaDeadline),
      slaBreached: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // TODO (Sprint 4): Send notification email to admin via Resend
    // TODO (Sprint 4): Send confirmation email to candidate

    return { success: true, leadId: leadRef.id };
  },
);
