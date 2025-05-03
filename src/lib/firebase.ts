import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { browser } from '$app/environment';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// For debugging - only log in development
const isDev = import.meta.env.DEV;
const logDebug = (message: string, data?: any) => {
  if (isDev && browser) {
    console.log(message, data);
  }
};

// Initialize Firebase only if it hasn't been initialized already
function getFirebase() {
  // Store Firebase services
  let app: FirebaseApp;
  let auth: Auth;
  let analytics: Analytics | null = null;
  let db: Firestore;

  // Only initialize Firebase in the browser environment
  if (browser) {
    try {
      // Check if Firebase app has already been initialized
      if (!getApps().length) {
        logDebug('Initializing Firebase app');
        app = initializeApp(firebaseConfig);
        logDebug('Firebase app initialized successfully');
      } else {
        logDebug('Using existing Firebase app');
        app = getApps()[0];
      }
      
      // Initialize Firebase Authentication
      auth = getAuth(app);
      
      // Initialize Firestore
      db = getFirestore(app);
      
      // Use auth emulator if in development
      if (isDev && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
        logDebug('Connecting to Firebase Auth emulator');
        connectAuthEmulator(auth, 'http://localhost:9099');
      }

      // Initialize Analytics (only in browser)
      try {
        analytics = getAnalytics(app);
        logDebug('Firebase analytics initialized');
      } catch (error) {
        if (isDev) {
          console.warn('Failed to initialize Firebase Analytics:', error);
        }
      }
      
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  } else {
    // Create empty mock instances for SSR
    app = {} as FirebaseApp;
    auth = {} as Auth;
    db = {} as Firestore;
    analytics = null;
  }

  return { app, auth, db, analytics };
}

// Export Firebase services (singleton pattern)
export const { app, auth, db, analytics } = getFirebase();