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

/**
 * Callable function invoked by the /golf contact form.
 * Creates a Lead document in Firestore with type "partner".
 */
export const submitContactForm = onCall<ContactFormData>(
  { region: "europe-west1" },
  async (request) => {
    const { golfName, contactName, city, email, phone, message } = request.data;

    // Validate required fields
    if (!golfName || !contactName || !city || !email) {
      throw new HttpsError(
        "invalid-argument",
        "Les champs golfName, contactName, city et email sont obligatoires.",
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new HttpsError("invalid-argument", "Adresse email invalide.");
    }

    // Parse contact name into first/last
    const nameParts = contactName.trim().split(/\s+/);
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // SLA: 24h for partner leads
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + 24);

    const db = getFirestore();
    const leadRef = await db.collection("leads").add({
      type: "partner",
      source: "website_golf",
      status: "new",
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      phone: phone?.trim() ?? "",
      city: city.trim(),
      golfName: golfName.trim(),
      qualificationNotes: message?.trim() ?? "",
      slaDeadline: Timestamp.fromDate(slaDeadline),
      slaBreached: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // TODO (Sprint 4): Send notification email to admin via Resend

    return { success: true, leadId: leadRef.id };
  },
);
