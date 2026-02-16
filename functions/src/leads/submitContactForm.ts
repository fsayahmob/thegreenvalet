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
  { region: "europe-west1" },
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
        "Les champs golfName, contactName, city et email sont obligatoires.",
      );
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new HttpsError("invalid-argument", "Adresse email invalide.");
    }

    // Phone validation (if provided)
    if (phone && !/^[\d\s\-+().]{6,20}$/.test(phone)) {
      throw new HttpsError("invalid-argument", "Numéro de téléphone invalide.");
    }

    // Parse contact name into first/last
    const nameParts = contactName.split(/\s+/);
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // SLA: 24h for partner leads
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + 24);

    const db = getFirestore();

    // Rate limit: max 3 leads from same email in 24h
    const recent = await db
      .collection("leads")
      .where("email", "==", email.toLowerCase())
      .where("createdAt", ">", Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)))
      .limit(3)
      .get();
    if (recent.size >= 3) {
      throw new HttpsError("resource-exhausted", "Trop de demandes récentes. Réessayez plus tard.");
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
