import * as functions from "firebase-functions/v1";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Triggered after a new user is created in Firebase Auth (Google, email, etc.).
 * Checks the config/admins document for an authorized email list.
 * If the user's email is in the list → role: "admin", otherwise → role: "viewer".
 */
export const onUserCreate = functions
  .region("europe-west1")
  .auth.user()
  .onCreate(async (user) => {
    if (!user.uid || !user.email) return;

    const db = getFirestore();

    // Check admin email list
    const configDoc = await db.collection("config").doc("admins").get();
    const adminEmails: string[] = configDoc.exists
      ? configDoc.data()?.emails ?? []
      : [];

    const isAdmin = adminEmails.some(
      (e) => e.toLowerCase() === user.email!.toLowerCase(),
    );

    // Create user document
    await db
      .collection("users")
      .doc(user.uid)
      .set({
        email: user.email,
        displayName: user.displayName ?? "",
        role: isAdmin ? "admin" : "viewer",
        createdAt: new Date(),
      });
  });
