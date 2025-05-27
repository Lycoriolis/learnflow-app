import type { FirebaseApp } from 'firebase/app';
import { getApps, initializeApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import type { Analytics } from 'firebase/analytics';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | undefined;
let analyticsInitialized = false; // Flag to track analytics initialization
let firebaseInitialized = false; // Flag to track core Firebase initialization

async function _initializeAnalytics(currentApp: FirebaseApp) {
  if (!analyticsInitialized && typeof window !== 'undefined' && await isSupported()) {
    try {
      analytics = getAnalytics(currentApp);
      analyticsInitialized = true;
      console.log('Firebase Analytics initialized.');
    } catch (e) {
      console.error('Error initializing Firebase Analytics', e);
    }
  }
}

function _initializeCoreFirebase() {
  if (firebaseInitialized) {
    return;
  }

  if (typeof window !== 'undefined') { // Ensure running in a browser environment
    if (!getApps().length) {
      try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        firebaseInitialized = true;
        console.log('Firebase core services initialized (new app).');
        // Initialize analytics asynchronously
        _initializeAnalytics(app).catch(e => console.error("Error during async analytics initialization", e));
      } catch (e) {
        console.error('Error initializing Firebase on client (new app)', e);
      }
    } else {
      app = getApps()[0]; // Get existing app
      // Ensure auth and db are set from the existing app
      auth = getAuth(app); // Safe to call multiple times
      db = getFirestore(app); // Safe to call multiple times
      firebaseInitialized = true;
      console.log('Firebase core services initialized (existing app).');
      // Ensure analytics is initialized if not already
      _initializeAnalytics(app).catch(e => console.error("Error during async analytics initialization on app reuse", e));
    }
  }
}

// Automatically initialize Firebase core services when this module is loaded on the client side.
// This ensures that `auth` and `db` are populated when imported by other modules.
_initializeCoreFirebase();

// Exported function to allow explicit initialization or to get instances.
export function initializeFirebase() {
  _initializeCoreFirebase(); // Ensures initialization logic runs
  return { app, auth, db, analytics };
}

// Export the initialized instances.
// These will be populated by _initializeCoreFirebase() when the module loads on the client.
export { app, auth, db, analytics };