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

/**
 * Callable function invoked by the /rejoindre application form.
 * Creates a Lead document in Firestore with type "operator".
 */
export const submitOperatorApplication = onCall<OperatorApplicationData>(
  { region: "europe-west1" },
  async (request) => {
    const { firstName, lastName, email, phone, city, currentStatus, motivation, honeypot } =
      request.data;

    // Anti-spam: reject if honeypot field is filled
    if (honeypot) {
      // Silently succeed to not reveal the honeypot to bots
      return { success: true, leadId: "ok" };
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !city || !currentStatus) {
      throw new HttpsError(
        "invalid-argument",
        "Tous les champs obligatoires doivent être remplis.",
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new HttpsError("invalid-argument", "Adresse email invalide.");
    }

    // SLA: 48h for operator leads
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + 48);

    const db = getFirestore();
    const leadRef = await db.collection("leads").add({
      type: "operator",
      source: "website_operator",
      status: "new",
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      city: city.trim(),
      currentStatus: currentStatus.trim(),
      motivation: motivation?.trim() ?? "",
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
