import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Firebase configuration
// For development, provide sensible defaults if env vars not defined
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key-for-development",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:a1b2c3d4e5f6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ABCDEF"
};

// For debugging - only log in development
const isDev = import.meta.env.DEV;
const logDebug = (message: string, data?: any) => {
  if (isDev) {
    console.log(message, data);
  }
};

// Initialize Firebase
let app;
let auth: Auth;
let analytics = null;
let db: Firestore;

try {
  logDebug('Initializing Firebase app');
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication
  auth = getAuth(app);
  
  // Initialize Firestore
  db = getFirestore(app);
  
  // Use auth emulator if in development
  if (isDev && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
    logDebug('Connecting to Firebase Auth emulator');
    connectAuthEmulator(auth, 'http://localhost:9099');
  }

  // Initialize Analytics if in browser environment
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
      logDebug('Firebase analytics initialized');
    } catch (error) {
      if (isDev) {
        console.warn('Failed to initialize Firebase Analytics:', error);
      }
    }
  }
  
  logDebug('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Export Firebase services
export { app, auth, db, analytics };