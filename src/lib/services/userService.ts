import type { UserProfile as AppUserProfile } from '$lib/types/shared'; // Import the new UserProfile type

export interface UserPreferences {
  enrollments?: Array<{
    courseId: string;
    progress: number;
    startedAt: number;
    lastAccessedAt: number;
  }>;
  focusSessions?: Array<{
    duration: number;
    timestamp: number;
    task?: string;
  }>;
  tasks?: Array<{
    id: string;
    text: string;
    completed: boolean;
    deadline?: string;
    priority?: number;
  }>;
  notes?: string;
  theme?: 'light' | 'dark' | 'system';
  languagePreference?: string;
  notificationSettings?: {
    email: boolean;
    push: boolean;
    dailyDigest: boolean;
  };
}

/**
 * Error class for user service operations
 */
export class UserServiceError extends Error {
  constructor(message: string, public code: string, public originalError?: any) {
    super(message);
    this.name = 'UserServiceError';
  }
}

/**
 * Load the user profile from Firestore. Returns null if not found.
 */
export async function getUserProfile(uid: string): Promise<AppUserProfile | null> {
  try {
    if (!uid) {
      throw new UserServiceError('User ID is required', 'invalid-argument');
    }

    if (typeof window === 'undefined') return null;
    
    const { getFirestore, doc, getDoc } = await import('firebase/firestore');
    const { app } = await import('../firebase.js');
    const db = getFirestore(app);
    const ref = doc(db, 'users', uid);
    
    const snap = await getDoc(ref);
    if (snap.exists()) {
      // Ensure the fetched data conforms to AppUserProfile, especially the isPremium field
      const data = snap.data();
      return {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        isPremium: data.isPremium ?? false, // Default to false if not present
        // Map other fields from data to AppUserProfile as needed
      } as AppUserProfile;
    }
    return null;
  } catch (err: any) {
    console.error('Error getting user profile:', err);
    
    // Create a standardized error object
    const errorCode = err.code || 'unknown';
    const errorMessage = err.message || 'Failed to get user profile';
    
    throw new UserServiceError(errorMessage, errorCode, err);
  }
}

/**
 * Create a new user profile document in Firestore.
 */
export async function createUserProfile(profile: AppUserProfile): Promise<void> {
  try {
    if (!profile || !profile.uid) {
      throw new UserServiceError('Valid user profile with UID is required', 'invalid-argument');
    }
    
    if (typeof window === 'undefined') return;
    
    const { getFirestore, doc, setDoc } = await import('firebase/firestore');
    const { app } = await import('../firebase.js');
    const db = getFirestore(app);
    const ref = doc(db, 'users', profile.uid);
    
    // Ensure isPremium is explicitly set, defaulting to false if not provided
    const profileToSave = {
      ...profile,
      isPremium: profile.isPremium ?? false,
    };
    
    await setDoc(ref, profileToSave);
    console.log(`User profile created: ${profile.uid}`);
  } catch (err: any) {
    console.error('Error creating user profile:', err);
    
    // Create a standardized error object
    const errorCode = err.code || 'unknown';
    const errorMessage = err.message || 'Failed to create user profile';
    
    throw new UserServiceError(errorMessage, errorCode, err);
  }
}

/**
 * Update existing user profile fields.
 */
export async function updateUserProfile(uid: string, data: Partial<AppUserProfile>): Promise<void> {
  try {
    if (!uid) {
      throw new UserServiceError('User ID is required', 'invalid-argument');
    }
    
    if (!data || Object.keys(data).length === 0) {
      throw new UserServiceError('Update data is required', 'invalid-argument');
    }
    
    if (typeof window === 'undefined') return;
    
    const { getFirestore, doc, updateDoc } = await import('firebase/firestore');
    const { app } = await import('../firebase.js');
    const db = getFirestore(app);
    const ref = doc(db, 'users', uid);
    
    await updateDoc(ref, data);
    console.log(`User profile updated: ${uid}`);
  } catch (err: any) {
    console.error('Error updating user profile:', err);
    
    // Create a standardized error object
    const errorCode = err.code || 'unknown';
    const errorMessage = err.message || 'Failed to update user profile';
    
    throw new UserServiceError(errorMessage, errorCode, err);
  }
}

/**
 * Check if a user profile exists
 */
export async function userProfileExists(uid: string): Promise<boolean> {
  try {
    if (!uid) return false;
    
    const profile = await getUserProfile(uid);
    return profile !== null;
  } catch (err) {
    console.error('Error checking if user profile exists:', err);
    return false;
  }
}
