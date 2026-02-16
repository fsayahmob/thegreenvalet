import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";

interface ContactFormData {
  golfName: string;
  contactName: string;
  city: string;
  email: string;
  phone?: string;
  message?: string;
}

const MAX_TEXT = 200;
const MAX_MESSAGE = 5000;

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
 * Callable function invoked by the /golf contact form.
 * Creates a Lead document in Firestore with type "partner".
 */
export const submitContactForm = onCall<ContactFormData>(
  { region: "europe-west1", cors: [/thegreenvalet\.fr$/, /localhost/] },
  async (request) => {
    const data = request.data;

    // Type-safe extraction with length validation
    const golfName = ensureString(data.golfName, "Nom du golf");
    const contactName = ensureString(data.contactName, "Nom du contact");
    const city = ensureString(data.city, "Ville");
    const email = ensureString(data.email, "Email");
    const phone = data.phone ? ensureString(data.phone, "Téléphone") : "";
    const message = data.message ? ensureString(data.message, "Message", MAX_MESSAGE) : "";

    // Validate required fields
    if (!golfName || !contactName || !city || !email) {
      throw new HttpsError(
        "invalid-argument",
        "Données invalides. Veuillez vérifier le formulaire.",
      );
    }

    // Email validation
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      throw new HttpsError("invalid-argument", "Données invalides. Veuillez vérifier le formulaire.");
    }

    // Phone validation (if provided)
    if (phone && !/^[\d\s\-+().]{6,20}$/.test(phone)) {
      throw new HttpsError("invalid-argument", "Données invalides. Veuillez vérifier le formulaire.");
    }

    // Parse contact name into first/last
    const nameParts = contactName.split(/\s+/);
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // SLA: 24h for partner leads
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + 24);

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
      type: "partner",
      source: "website_golf",
      status: "new",
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      city,
      golfName,
      qualificationNotes: message,
      slaDeadline: Timestamp.fromDate(slaDeadline),
      slaBreached: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // TODO (Sprint 4): Send notification email to admin via Resend

    return { success: true, leadId: leadRef.id };
  },
);
