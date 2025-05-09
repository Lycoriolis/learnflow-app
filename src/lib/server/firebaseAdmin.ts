import admin from 'firebase-admin';
import { env } from '$env/dynamic/private';

// Ensure that private key newlines are correctly formatted
const projectId = env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = env.FIREBASE_ADMIN_CLIENT_EMAIL;
const rawPrivateKey = env.FIREBASE_ADMIN_PRIVATE_KEY;

if (!projectId || !clientEmail || !rawPrivateKey) {
  throw new Error('Missing Firebase Admin SDK environment variables. Please check your .env file.');
}

const privateKey = rawPrivateKey.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey,
      }),
      // Optionally, specify your databaseURL if using Realtime Database
      // databaseURL: `https://${projectId}.firebaseio.com`
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    // Depending on your error handling strategy, you might want to throw the error
    // or handle it in a way that doesn't prevent the app from starting if admin features are non-critical.
  }
}

export { admin };
