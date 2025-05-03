import { 
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	onAuthStateChanged,
	sendPasswordResetEmail,
	updateProfile,
	GoogleAuthProvider,
	signInWithPopup,
	setPersistence,
	browserLocalPersistence,
	browserSessionPersistence,
	type User,
	type UserCredential,
	type AuthError,
	type Auth
} from 'firebase/auth';
import { auth } from './firebase.js';
import { isAuthenticated, user, loading, authError } from './stores/authStore.js';
import { loadUserProfile } from './stores/userProfileStore.js';
import { browser } from '$app/environment';

// Custom error type for auth operations
type AuthOperationError = {
	code?: string;
	message: string;
	original?: any;
};

// Flag to track if auth initialization has completed
let authInitialized = false;
let unsubscribeAuth: (() => void) | null = null;

// Initialize the auth listener
function initAuth() {
	if (!browser) return; // Don't initialize auth in SSR contexts
	
	if (authInitialized) {
		console.log('Auth already initialized, skipping');
		return;
	}
	
	loading.set(true);
	console.log('Initializing auth listener');
	
	try {
		// Set up an observer to watch for auth state changes
		unsubscribeAuth = onAuthStateChanged(auth, 
			(userData: User | null) => {
				if (userData) {
					console.log('Auth state changed: User authenticated', {
						uid: userData.uid,
						email: userData.email,
						displayName: userData.displayName
					});
					isAuthenticated.set(true);
					user.set(userData);
					// Load or initialize Firestore user profile
					loadUserProfile(userData.uid, userData.email || '', userData.displayName || undefined)
							.catch((err: Error) => {
								console.error('Failed to load user profile:', err);
								// Don't fail authentication if profile loading fails
								// But store the error for potential display or retry logic
								authError.set('Your profile information could not be loaded. Some features may be limited.');
							});
				} else {
					console.log('Auth state changed: User not authenticated');
					isAuthenticated.set(false);
					user.set(null);
				}
				loading.set(false);
				authInitialized = true;
			}, 
			(error: Error) => {
				console.error('Auth state change error:', error);
				authError.set(`Authentication error: ${error.message}`);
				loading.set(false);
				authInitialized = true;
			}
		);
	} catch (error) {
		console.error('Error setting up auth listener:', error);
		loading.set(false);
		authInitialized = true;
	}
	
	return unsubscribeAuth;
}

// Clean up auth listener
function cleanupAuth() {
	if (unsubscribeAuth) {
		unsubscribeAuth();
		unsubscribeAuth = null;
		authInitialized = false;
		console.log('Auth listener cleaned up');
	}
}

// Set auth persistence based on "remember me" preference
async function setAuthPersistence(rememberMe: boolean): Promise<void> {
	if (!browser) return; // Skip in SSR context
	
	try {
		const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence;
		await setPersistence(auth, persistenceType);
		console.log(`Auth persistence set to: ${rememberMe ? 'LOCAL' : 'SESSION'}`);
	} catch (error) {
		console.error('Failed to set auth persistence:', error);
		// Continue with auth operation even if persistence setting fails
	}
}

// Helper function to format Firebase auth errors
function formatAuthError(error: any): AuthOperationError {
	let code = error?.code || '';
	let message = 'An unexpected error occurred. Please try again.';
	
	// Common Firebase auth error codes
	const errorMap: Record<string, string> = {
		// Registration errors
		'auth/email-already-in-use': 'This email is already registered. Please use a different email or try logging in.',
		'auth/invalid-email': 'The email address is not valid.',
		'auth/weak-password': 'Password is too weak. Please use a stronger password.',
		
		// Login errors
		'auth/user-not-found': 'Invalid email or password. Please try again.',
		'auth/wrong-password': 'Invalid email or password. Please try again.',
		'auth/invalid-credential': 'Invalid email or password. Please try again.',
		'auth/user-disabled': 'This account has been disabled. Please contact support.',
		'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later or reset your password.',
		
		// Google sign-in errors
		'auth/popup-closed-by-user': 'Sign-in popup was closed before completion. Please try again.',
		'auth/popup-blocked': 'Sign-in popup was blocked by your browser. Please allow popups for this site and try again.',
		'auth/cancelled-popup-request': 'Multiple popup requests were detected. Please try again.',
		'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials. Try signing in with a different method.',
		
		// Password reset errors
		'auth/missing-email': 'Please enter an email address.',
		
		// Network errors
		'auth/network-request-failed': 'Network error. Please check your connection and try again.',
		
		// Default for unknown errors
		'default': 'An unexpected error occurred. Please try again.'
	};
	
	// Get the specific error message or use default
	message = errorMap[code] || errorMap['default'];
	
	return {
		code,
		message,
		original: error
	};
}

// Register a new user with email and password
async function register(email: string, password: string, displayName: string, rememberMe: boolean = true): Promise<void> {
	if (!browser) return Promise.reject(new Error('Cannot register in server context')); 
	
	loading.set(true);
	authError.set('');
	console.log('Attempting to register user:', { email, displayName });
	
	try {
		// Set persistence before registration
		await setAuthPersistence(rememberMe);
		
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		// Update the user profile with display name
		if (userCredential.user) {
			await updateProfile(userCredential.user, { displayName });
			console.log('User registered successfully');
		}
	} catch (error: any) {
		console.error('Registration error:', error);
		const formattedError = formatAuthError(error);
		authError.set(formattedError.message);
		throw error;
	} finally {
		loading.set(false);
	}
}

// Login with email and password
async function login(email: string, password: string, rememberMe: boolean = true): Promise<void> {
	if (!browser) return Promise.reject(new Error('Cannot login in server context'));
	
	loading.set(true);
	authError.set('');
	console.log('Attempting to login user:', { email });
	
	try {
		// Set persistence before login
		await setAuthPersistence(rememberMe);
		
		const result = await signInWithEmailAndPassword(auth, email, password);
		console.log('Login successful:', { 
			uid: result.user.uid,
			email: result.user.email,
			displayName: result.user.displayName,
			emailVerified: result.user.emailVerified
		});
	} catch (error: any) {
		console.error('Login error:', error);
		const formattedError = formatAuthError(error);
		authError.set(formattedError.message);
		throw error;
	} finally {
		loading.set(false);
	}
}

// Sign in with Google
async function loginWithGoogle(rememberMe: boolean = true): Promise<void> {
	if (!browser) return Promise.reject(new Error('Cannot login with Google in server context'));
	
	loading.set(true);
	authError.set('');
	console.log('Attempting Google sign-in');
	
	try {
		// Set persistence before Google login
		await setAuthPersistence(rememberMe);
		
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, provider);
		console.log('Google sign-in successful:', { 
			uid: result.user.uid,
			email: result.user.email,
			displayName: result.user.displayName
		});
	} catch (error: any) {
		console.error('Google sign-in error:', error);
		const formattedError = formatAuthError(error);
		authError.set(formattedError.message);
		throw error;
	} finally {
		loading.set(false);
	}
}

// Logout the user
async function logout(): Promise<void> {
	if (!browser) return Promise.reject(new Error('Cannot logout in server context'));
	
	loading.set(true);
	authError.set('');
	console.log('Logging out user');
	
	try {
		await firebaseSignOut(auth);
		console.log('Logout successful');
	} catch (error: any) {
		console.error('Logout error:', error);
		authError.set('Failed to log out. Please try again.');
		throw error;
	} finally {
		loading.set(false);
	}
}

// Reset password
async function resetPassword(email: string): Promise<void> {
	if (!browser) return Promise.reject(new Error('Cannot reset password in server context'));
	
	loading.set(true);
	authError.set('');
	console.log('Requesting password reset for:', { email });
	
	try {
		await sendPasswordResetEmail(auth, email);
		console.log('Password reset email sent');
	} catch (error: any) {
		console.error('Password reset error:', error);
		const formattedError = formatAuthError(error);
		authError.set(formattedError.message);
		throw error;
	} finally {
		loading.set(false);
	}
}

// Get current user
function getCurrentUser(): User | null {
	if (!browser) return null; // Don't access auth in SSR contexts
	
	const currentUser = auth.currentUser;
	console.log('Getting current user:', currentUser ? {
		uid: currentUser.uid,
		email: currentUser.email,
		displayName: currentUser.displayName
	} : 'No user');
	return currentUser;
}

export {
	initAuth,
	cleanupAuth,
	register,
	login,
	loginWithGoogle,
	logout,
	resetPassword,
	getCurrentUser,
	updateProfile
};