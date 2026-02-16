import * as crypto from "crypto";
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { YousignClient } from "./yousign-client";

const yousignWebhookSecret = defineSecret("YOUSIGN_WEBHOOK_SECRET");
const yousignApiKey = defineSecret("YOUSIGN_API_KEY");

interface WebhookPayload {
  event_id: string;
  event_name: string;
  event_time: string;
  sandbox: boolean;
  data: {
    signature_request: {
      id: string;
      status: string;
    };
  };
}

/**
 * HTTP function: receives Yousign webhook callbacks.
 *
 * Events handled:
 * - signature_request.done → download signed PDF, store, update status
 * - signature_request.declined → update status
 * - signature_request.expired → update status
 */
export const yousignWebhook = onRequest(
  {
    region: "europe-west1",
    secrets: [yousignWebhookSecret, yousignApiKey],
  },
  async (req, res) => {
    // Only accept POST
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    // ── Verify HMAC signature ──────────────────────────
    const signature = req.headers["x-yousign-signature-256"] as string | undefined;
    if (!signature) {
      res.status(401).send("Missing signature header");
      return;
    }

    const secret = yousignWebhookSecret.value();
    const hmac = crypto.createHmac("sha256", secret);
    const rawBody = (req as unknown as { rawBody: Buffer }).rawBody;
    const computed = `sha256=${hmac.update(rawBody).digest("hex")}`;

    if (!crypto.timingSafeEqual(Buffer.from(signature, "utf8"), Buffer.from(computed, "utf8"))) {
      res.status(401).send("Invalid signature");
      return;
    }

    // ── Parse event ────────────────────────────────────
    const payload = req.body as WebhookPayload;
    const { event_id, event_name, data } = payload;
    const yousignRequestId = data?.signature_request?.id;

    if (!yousignRequestId || !event_name) {
      res.status(400).send("Invalid payload");
      return;
    }

    const db = getFirestore();

    // ── Deduplicate: check if this event was already processed ──
    const existingEvents = await db
      .collection("yousign_requests")
      .where("yousignRequestId", "==", yousignRequestId)
      .where("lastEventId", "==", event_id)
      .limit(1)
      .get();

    if (!existingEvents.empty) {
      // Already processed — return 200 to acknowledge
      res.status(200).send("Already processed");
      return;
    }

    // ── Find our YousignRequest ────────────────────────
    const requestSnap = await db
      .collection("yousign_requests")
      .where("yousignRequestId", "==", yousignRequestId)
      .limit(1)
      .get();

    if (requestSnap.empty) {
      // Unknown request — acknowledge but don't process
      res.status(200).send("Unknown request");
      return;
    }

    const requestDoc = requestSnap.docs[0];
    const requestData = requestDoc.data();

    // ── Handle event ───────────────────────────────────
    try {
      switch (event_name) {
        case "signature_request.done": {
          // Download signed PDF
          const env = process.env.YOUSIGN_ENV === "production" ? "production" : "sandbox";
          const client = new YousignClient(yousignApiKey.value(), env);
          const yousignDocId = requestData.yousignDocumentId as string;

          if (!yousignDocId) {
            // Cannot download without document ID — just update status
            await requestDoc.ref.update({
              yousignStatus: "done",
              completedAt: FieldValue.serverTimestamp(),
              lastEventId: event_id,
              updatedAt: FieldValue.serverTimestamp(),
            });
            break;
          }

          const signedPdf = await client.downloadSignedDocument(yousignRequestId, yousignDocId);

          // Store signed PDF in Storage
          const entityType = requestData.entityType as string;
          const entityId = requestData.entityId as string;
          const storagePath = `signed/${entityType}/${entityId}/${Date.now()}_signed.pdf`;
          const bucket = getStorage().bucket();
          const file = bucket.file(storagePath);
          await file.save(signedPdf, { contentType: "application/pdf" });

          // Get download URL
          const [signedUrl] = await file.getSignedUrl({
            action: "read",
            expires: "01-01-2030",
          });

          // Update YousignRequest
          await requestDoc.ref.update({
            yousignStatus: "done",
            completedAt: FieldValue.serverTimestamp(),
            signedDocumentUrl: signedUrl,
            signedDocumentId: storagePath,
            lastEventId: event_id,
            updatedAt: FieldValue.serverTimestamp(),
          });

          // Find and update the original document → auto-approve
          const docsSnap = await db
            .collection("documents")
            .where("yousignRequestId", "==", yousignRequestId)
            .limit(1)
            .get();

          if (!docsSnap.empty) {
            await docsSnap.docs[0].ref.update({
              status: "approved",
              fileUrl: signedUrl,
              validatedBy: "yousign",
              validatedAt: FieldValue.serverTimestamp(),
              updatedAt: FieldValue.serverTimestamp(),
            });
          }
          break;
        }

        case "signature_request.declined":
          await requestDoc.ref.update({
            yousignStatus: "declined",
            lastEventId: event_id,
            updatedAt: FieldValue.serverTimestamp(),
          });
          break;

        case "signature_request.expired":
          await requestDoc.ref.update({
            yousignStatus: "expired",
            lastEventId: event_id,
            updatedAt: FieldValue.serverTimestamp(),
          });
          break;

        default:
          // Unknown event — acknowledge but don't process
          break;
      }

      res.status(200).send("OK");
    } catch (err) {
      console.error("Webhook processing error:", err);
      // Return 500 so Yousign will retry
      res.status(500).send("Processing error");
    }
  },
);
