import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
if (projectId && clientEmail && privateKey) {
  if (!getApps().length) {
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }
} else {
  console.warn("Firebase Admin credentials are not fully set; skipping initialization.");
}
const adminDb = getApps().length ? getFirestore() : void 0;
const adminAuth = getApps().length ? getAuth() : void 0;
export {
  adminDb as a,
  adminAuth as b
};
//# sourceMappingURL=firebaseAdmin.js.map
