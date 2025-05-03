// File: /home/linux/learnflow-app/learnflow-app/src/lib/server/firebaseAdmin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Only initialize if full credentials are provided
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

let adminDb: ReturnType<typeof getFirestore>;
let adminAuth: ReturnType<typeof getAuth>;

if (projectId && clientEmail && privateKey) {
  try {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey
        })
      });
      console.log('Firebase Admin SDK initialized successfully');
    }
    adminDb = getFirestore();
    adminAuth = getAuth();
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    throw new Error('Failed to initialize Firebase Admin SDK');
  }
} else {
  console.warn(
    'Firebase Admin credentials are not fully set. Required environment variables:',
    'FIREBASE_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY'
  );
  
  if (process.env.NODE_ENV === 'development') {
    // In development, provide mock implementations
    adminDb = {
      collection: () => ({}),
      doc: () => ({})
    } as any;
    
    adminAuth = {
      verifyIdToken: async () => ({}),
      createCustomToken: async () => ''
    } as any;
  } else {
    throw new Error('Firebase Admin credentials are required in production');
  }
}

export { adminDb, adminAuth };