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

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: number;
  updatedAt?: number;
  photoURL?: string;
  bio?: string;
  location?: string;
  website?: string;
  preferences?: UserPreferences;
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
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
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
      return snap.data() as UserProfile;
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
export async function createUserProfile(profile: UserProfile): Promise<void> {
  try {
    if (!profile || !profile.uid) {
      throw new UserServiceError('Valid user profile with UID is required', 'invalid-argument');
    }
    
    if (typeof window === 'undefined') return;
    
    const { getFirestore, doc, setDoc } = await import('firebase/firestore');
    const { app } = await import('../firebase.js');
    const db = getFirestore(app);
    const ref = doc(db, 'users', profile.uid);
    
    await setDoc(ref, profile);
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
export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
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
