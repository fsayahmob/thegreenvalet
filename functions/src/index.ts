import { initializeApp } from "firebase-admin/app";

initializeApp();

export { submitContactForm } from "./leads/submitContactForm";
export { submitOperatorApplication } from "./leads/submitOperatorApplication";
export { onUserCreate } from "./auth/onUserCreate";
export { sendToYousign } from "./yousign/sendToYousign";
export { yousignWebhook } from "./yousign/yousignWebhook";
