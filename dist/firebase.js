import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
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
// For debugging
console.log('Firebase config:', {
    apiKey: firebaseConfig.apiKey ? (firebaseConfig.apiKey.substring(0, 3) + '...') : 'missing',
    authDomain: firebaseConfig.authDomain || 'missing',
    projectId: firebaseConfig.projectId || 'missing'
});
// Initialize Firebase
let app;
let auth;
let analytics = null;
try {
    console.log('Initializing Firebase app');
    app = initializeApp(firebaseConfig);
    // Initialize Firebase Authentication
    console.log('Initializing Firebase auth');
    auth = getAuth(app);
    // Use auth emulator if in development
    if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
        console.log('Connecting to Firebase Auth emulator');
        connectAuthEmulator(auth, 'http://localhost:9099');
    }
    // Initialize Analytics if in browser environment
    if (typeof window !== 'undefined') {
        try {
            console.log('Initializing Firebase analytics');
            analytics = getAnalytics(app);
        }
        catch (error) {
            console.warn('Failed to initialize Firebase Analytics:', error);
        }
    }
    console.log('Firebase initialized successfully');
}
catch (error) {
    console.error('Error initializing Firebase:', error);
    // Provide fallback mock implementations for development/testing
    app = { name: 'mock-app' };
    // Simple mock auth with minimal functionality
    auth = {
        currentUser: null,
        // Mock implementation of onAuthStateChanged that immediately calls the callback with null
        // and returns an unsubscribe function
        onAuthStateChanged: (callback, error) => {
            // Call the callback with null (user not logged in)
            if (typeof callback === 'function') {
                callback(null);
            }
            // Return a function that would normally unsubscribe the listener
            return () => { };
        }
    };
}
export { app, auth, analytics };
