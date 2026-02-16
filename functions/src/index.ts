import { initializeApp } from "firebase-admin/app";

initializeApp();

export { submitContactForm } from "./leads/submitContactForm";
export { submitOperatorApplication } from "./leads/submitOperatorApplication";
export { onUserCreate } from "./auth/onUserCreate";
