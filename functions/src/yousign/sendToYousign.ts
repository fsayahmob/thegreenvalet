import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { YousignClient } from "./yousign-client";
import type { SignerInfo } from "./yousign-client";

const yousignApiKey = defineSecret("YOUSIGN_API_KEY");

interface SendToYousignData {
  documentId: string;
  entityType: "partner" | "operator";
  entityId: string;
  signers: SignerInfo[];
}

/**
 * Callable function: sends a generated PDF document to Yousign for e-signature.
 *
 * Flow:
 * 1. Validate input + admin auth
 * 2. Load document from Firestore → get fileUrl
 * 3. Download PDF from Storage
 * 4. Create Yousign signature request → upload doc → add signers → activate
 * 5. Store YousignRequest in Firestore
 * 6. Link yousignRequestId to original document
 */
export const sendToYousign = onCall<SendToYousignData>(
  {
    region: "europe-west1",
    cors: [/thegreenvalet\.(fr|com)$/, /localhost/],
    secrets: [yousignApiKey],
  },
  async (request) => {
    // ── Auth check ─────────────────────────────────────
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Authentification requise.");
    }

    const db = getFirestore();

    // Verify admin role
    const userDoc = await db.collection("users").doc(request.auth.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== "admin") {
      throw new HttpsError("permission-denied", "Seul un administrateur peut envoyer à signature.");
    }

    // ── Input validation ───────────────────────────────
    const { documentId, entityType, entityId, signers } = request.data;

    if (!documentId || typeof documentId !== "string") {
      throw new HttpsError("invalid-argument", "documentId requis.");
    }
    if (!entityType || !["partner", "operator"].includes(entityType)) {
      throw new HttpsError("invalid-argument", "entityType invalide.");
    }
    if (!entityId || typeof entityId !== "string") {
      throw new HttpsError("invalid-argument", "entityId requis.");
    }
    if (!Array.isArray(signers) || signers.length === 0 || signers.length > 5) {
      throw new HttpsError("invalid-argument", "Entre 1 et 5 signataires requis.");
    }
    for (const signer of signers) {
      if (!signer.firstName || !signer.lastName || !signer.email) {
        throw new HttpsError("invalid-argument", "Chaque signataire doit avoir firstName, lastName et email.");
      }
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(signer.email)) {
        throw new HttpsError("invalid-argument", `Email invalide : ${signer.email}`);
      }
    }

    // ── Load document from Firestore ───────────────────
    const docSnap = await db.collection("documents").doc(documentId).get();
    if (!docSnap.exists) {
      throw new HttpsError("not-found", "Document introuvable.");
    }
    const docData = docSnap.data()!;

    if (docData.yousignRequestId) {
      throw new HttpsError("already-exists", "Ce document a déjà été envoyé à signature.");
    }

    const fileUrl = docData.fileUrl as string;
    const fileName = docData.fileName as string;
    const docType = docData.type as string;

    if (!fileUrl) {
      throw new HttpsError("failed-precondition", "Le document n'a pas de fichier associé.");
    }

    // ── Find active template for this doc type ─────────
    const templateSnap = await db
      .collection("templates")
      .where("type", "==", docType)
      .where("isActive", "==", true)
      .limit(1)
      .get();

    const templateDoc = templateSnap.docs[0];
    const templateId = templateDoc?.id ?? "";
    const templateVersion = (templateDoc?.data()?.version as number) ?? 1;

    // ── Download PDF from Storage ──────────────────────
    // fileUrl is a Firebase Storage download URL — extract the path
    const bucket = getStorage().bucket();
    let pdfBuffer: Buffer;

    try {
      // Parse the storage path from the download URL
      const urlObj = new URL(fileUrl);
      const encodedPath = urlObj.pathname.split("/o/")[1]?.split("?")[0];
      if (!encodedPath) {
        throw new Error("Cannot extract storage path from URL");
      }
      const storagePath = decodeURIComponent(encodedPath);
      const [contents] = await bucket.file(storagePath).download();
      pdfBuffer = contents;
    } catch (err) {
      throw new HttpsError(
        "internal",
        `Erreur téléchargement du fichier : ${err instanceof Error ? err.message : "unknown"}`,
      );
    }

    // ── Build signature request name ───────────────────
    let entityName = entityId.slice(0, 8);
    if (entityType === "partner") {
      const partnerSnap = await db.collection("partners").doc(entityId).get();
      if (partnerSnap.exists) {
        entityName = (partnerSnap.data()?.name as string) ?? entityName;
      }
    } else {
      const operatorSnap = await db.collection("operators").doc(entityId).get();
      if (operatorSnap.exists) {
        const d = operatorSnap.data()!;
        entityName = `${d.firstName ?? ""} ${d.lastName ?? ""}`.trim() || entityName;
      }
    }

    const requestName = `${docType.replace(/_/g, " ")} — ${entityName}`;

    // ── Yousign API calls ──────────────────────────────
    const env = process.env.YOUSIGN_ENV === "production" ? "production" : "sandbox";
    const client = new YousignClient(yousignApiKey.value(), env);

    try {
      // 1. Create signature request
      const sigReq = await client.createSignatureRequest(requestName);

      // 2. Upload PDF
      const pdfFileName = fileName.endsWith(".pdf") ? fileName : `${fileName.replace(/\.\w+$/, "")}.pdf`;
      const uploadedDoc = await client.uploadDocument(sigReq.id, pdfBuffer, pdfFileName);

      // 3. Add signers (spread signatures vertically on last page)
      const baseY = 700;
      const yOffset = 80;
      for (let i = 0; i < signers.length; i++) {
        const x = i % 2 === 0 ? 77 : 350; // left/right columns
        const y = baseY - Math.floor(i / 2) * yOffset;
        await client.addSigner(sigReq.id, uploadedDoc.id, signers[i], {
          page: 1,
          x,
          y,
        });
      }

      // 4. Activate (sends emails)
      await client.activateRequest(sigReq.id);

      // ── Store YousignRequest in Firestore ──────────────
      const yousignRequestData = {
        entityType,
        entityId,
        templateId,
        templateVersion,
        yousignRequestId: sigReq.id,
        yousignDocumentId: uploadedDoc.id,
        yousignStatus: "activated",
        signerEmails: signers.map((s) => s.email),
        activatedAt: FieldValue.serverTimestamp(),
        createdBy: request.auth.uid,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      await db.collection("yousign_requests").add(yousignRequestData);

      // Link document to Yousign request
      await db.collection("documents").doc(documentId).update({
        yousignRequestId: sigReq.id,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return { success: true, yousignRequestId: sigReq.id };
    } catch (err) {
      throw new HttpsError(
        "internal",
        `Erreur Yousign : ${err instanceof Error ? err.message : "Erreur inconnue"}`,
      );
    }
  },
);
