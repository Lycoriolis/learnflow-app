import { 
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	onAuthStateChanged,
	sendPasswordResetEmail,
	updateProfile,
	GoogleAuthProvider,
	signInWithPopup,
	type User,
	type UserCredential,
	type AuthError
} from 'firebase/auth';
import { auth } from './firebase.js';
import { isAuthenticated, user, loading, authError } from './stores/authStore.js';

// Initialize the auth listener
function initAuth() {
	loading.set(true);
	// Set up an observer to watch for auth state changes
	onAuthStateChanged(auth, 
		(userData: User | null) => {
			if (userData) {
				isAuthenticated.set(true);
				user.set(userData);
			} else {
				isAuthenticated.set(false);
				user.set(null);
			}
			loading.set(false);
		}, 
		(error: Error) => {
			console.error('Auth state change error:', error);
			authError.set(error.message);
			loading.set(false);
		}
	);
}

// Register a new user with email and password
async function register(email: string, password: string, displayName: string): Promise<void> {
	loading.set(true);
	authError.set(null);
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		// Update the user profile with display name
		if (userCredential.user) {
			await updateProfile(userCredential.user, { displayName });
		}
	} catch (error: any) {
		console.error('Registration error:', error);
		authError.set(error.message);
		throw error;
	} finally {
		loading.set(false);
	}
}

// Login with email and password
async function login(email: string, password: string): Promise<void> {
	loading.set(true);
	authError.set(null);
	try {
		await signInWithEmailAndPassword(auth, email, password);
	} catch (error: any) {
		console.error('Login error:', error);
		authError.set(error.message);
		throw error;
	} finally {
		loading.set(false);
	}
}

// Sign in with Google
async function loginWithGoogle(): Promise<void> {
	loading.set(true);
	authError.set(null);
	try {
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
	} catch (error: any) {
		console.error('Google sign-in error:', error);
		authError.set(error.message);
		throw error;
	} finally {
		loading.set(false);
	}
}

// Logout the user
async function logout(): Promise<void> {
	loading.set(true);
	authError.set(null);
	try {
		await firebaseSignOut(auth);
	} catch (error: any) {
		console.error('Logout error:', error);
		authError.set(error.message);
		throw error;
	} finally {
		loading.set(false);
	}
}

// Reset password
async function resetPassword(email: string): Promise<void> {
	loading.set(true);
	authError.set(null);
	try {
		await sendPasswordResetEmail(auth, email);
	} catch (error: any) {
		console.error('Password reset error:', error);
		authError.set(error.message);
		throw error;
	} finally {
		loading.set(false);
	}
}

// Get current user
function getCurrentUser(): User | null {
	return auth.currentUser;
}

export {
	initAuth,
	register,
	login,
	loginWithGoogle,
	logout,
	resetPassword,
	getCurrentUser
}; 