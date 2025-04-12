import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, sendPasswordResetEmail, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth as firebaseAuth } from './firebase.js';
import { isAuthenticated, user, loading, authError } from './stores/authStore.js';
// Explicitly type the imported firebaseAuth
const auth = firebaseAuth;
// Flag to track if auth initialization has completed
let authInitialized = false;
// Initialize the auth listener
function initAuth() {
    if (authInitialized) {
        console.log('Auth already initialized, skipping');
        return;
    }
    loading.set(true);
    console.log('Initializing auth listener');
    // Set up an observer to watch for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (userData) => {
        if (userData) {
            console.log('Auth state changed: User authenticated', {
                uid: userData.uid,
                email: userData.email,
                displayName: userData.displayName
            });
            isAuthenticated.set(true);
            user.set(userData);
        }
        else {
            console.log('Auth state changed: User not authenticated');
            isAuthenticated.set(false);
            user.set(null);
        }
        loading.set(false);
        authInitialized = true;
    }, (error) => {
        console.error('Auth state change error:', error);
        authError.set(error.message);
        loading.set(false);
        authInitialized = true;
    });
    // Return unsubscribe function in case we need to detach the listener
    return unsubscribe;
}
// Register a new user with email and password
async function register(email, password, displayName) {
    loading.set(true);
    authError.set(null);
    console.log('Attempting to register user:', { email, displayName });
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update the user profile with display name
        if (userCredential.user) {
            await updateProfile(userCredential.user, { displayName });
            console.log('User registered successfully');
        }
    }
    catch (error) {
        console.error('Registration error:', error);
        authError.set(error.message);
        throw error;
    }
    finally {
        loading.set(false);
    }
}
// Login with email and password
async function login(email, password) {
    loading.set(true);
    authError.set(null);
    console.log('Attempting to login user:', { email });
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log('Login successful:', {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            emailVerified: result.user.emailVerified
        });
    }
    catch (error) {
        console.error('Login error:', error);
        authError.set(error.message);
        throw error;
    }
    finally {
        loading.set(false);
    }
}
// Sign in with Google
async function loginWithGoogle() {
    loading.set(true);
    authError.set(null);
    console.log('Attempting Google sign-in');
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        console.log('Google sign-in successful:', {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName
        });
    }
    catch (error) {
        console.error('Google sign-in error:', error);
        authError.set(error.message);
        throw error;
    }
    finally {
        loading.set(false);
    }
}
// Logout the user
async function logout() {
    loading.set(true);
    authError.set(null);
    console.log('Logging out user');
    try {
        await firebaseSignOut(auth);
        console.log('Logout successful');
    }
    catch (error) {
        console.error('Logout error:', error);
        authError.set(error.message);
        throw error;
    }
    finally {
        loading.set(false);
    }
}
// Reset password
async function resetPassword(email) {
    loading.set(true);
    authError.set(null);
    console.log('Requesting password reset for:', { email });
    try {
        await sendPasswordResetEmail(auth, email);
        console.log('Password reset email sent');
    }
    catch (error) {
        console.error('Password reset error:', error);
        authError.set(error.message);
        throw error;
    }
    finally {
        loading.set(false);
    }
}
// Get current user
function getCurrentUser() {
    const currentUser = auth.currentUser;
    console.log('Getting current user:', currentUser ? {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName
    } : 'No user');
    return currentUser;
}
// Check if a user is admin
function isUserAdmin(userEmail) {
    if (!userEmail)
        return false;
    // Get admin emails from environment variables for better security and scalability
    const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
    // Convert to lowercase for case-insensitive comparison
    return adminEmails.map(email => email.trim().toLowerCase())
        .includes(userEmail.toLowerCase());
}
export { initAuth, register, login, loginWithGoogle, logout, resetPassword, getCurrentUser, isUserAdmin };
