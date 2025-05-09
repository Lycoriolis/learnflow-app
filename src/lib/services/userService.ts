export interface UserPreferences {
  theme?: string;
  notifications?: {
    email?: boolean;
    inApp?: boolean;
  };
  enrollments?: string[]; // Assuming array of course IDs or similar
  focusSessions?: any[]; // Define more specifically if possible
  tasks?: any[];         // Define more specifically if possible
  notes?: string;
  // Add other specific preference fields here as your application evolves
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string; // Added photoURL
  createdAt: number;
  preferences?: UserPreferences; // Changed to use UserPreferences type
  progress?: { // Added progress property
    [courseId: string]: {
      overallProgress?: number;
      lastAccessed?: number;
      // Potentially other progress-related fields like completedModules, scores, etc.
    };
  };
}

/**
 * Load the user profile from Firestore. Returns null if not found.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (typeof window === 'undefined') return null;
  const { getFirestore, doc, getDoc } = await import('firebase/firestore');
  const { app }: { app: import('firebase/app').FirebaseApp } = await import('../firebase.js');
  const db = getFirestore(app);
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
}

/**
 * Create a new user profile document in Firestore.
 */
export async function createUserProfile(profile: UserProfile): Promise<void> {
  if (typeof window === 'undefined') return;
  const { getFirestore, doc, setDoc } = await import('firebase/firestore');
  const { app }: { app: import('firebase/app').FirebaseApp } = await import('../firebase.js');
  const db = getFirestore(app);
  const ref = doc(db, 'users', profile.uid);
  await setDoc(ref, profile);
}

/**
 * Update existing user profile fields.
 */
export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  if (typeof window === 'undefined') return;
  const { getFirestore, doc, updateDoc } = await import('firebase/firestore');
  const { app }: { app: import('firebase/app').FirebaseApp } = await import('../firebase.js');
  const db = getFirestore(app);
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, data);
}
