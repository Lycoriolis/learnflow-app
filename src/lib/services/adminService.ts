// Admin authentication service - client-side only
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDocument, queryDocuments } from '$lib/firebase/databaseUtils';

/**
 * Checks if a user is an admin
 * @param userId The user ID to check
 * @returns Promise<boolean> True if the user is an admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    // First check if the user exists in the users collection
    const userDoc = await getDocument('users', userId);
    if (!userDoc) return false;
    
    // Check if the user has admin role
    return userDoc.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Login as admin
 * @param email Admin email
 * @param password Admin password
 * @returns Promise with the user credentials
 */
export async function adminLogin(email: string, password: string) {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Verify this user is actually an admin
    const isAdmin = await isUserAdmin(userCredential.user.uid);
    
    if (!isAdmin) {
      // Sign out if not an admin
      await auth.signOut();
      throw new Error('User is not authorized as an admin');
    }
    
    return userCredential;
  } catch (error) {
    console.error('Admin login failed:', error);
    throw error;
  }
}

/**
 * Get all admin users - client-safe implementation
 * This uses client-side Firebase SDK functions
 * @returns Promise with array of admin users
 */
export async function getAdminUsers() {
  try {
    return await queryDocuments(
      'users',
      [{ field: 'role', operator: '==', value: 'admin' }]
    );
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }
}

/**
 * Check if email is in allowed admin emails list
 * @param email Email to check
 * @returns Boolean indicating if the email is allowed
 */
export function isAllowedAdminEmail(email: string): boolean {
  const allowedEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',');
  return allowedEmails.includes(email.toLowerCase());
}