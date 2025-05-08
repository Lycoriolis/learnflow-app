export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    createdAt: number;
    preferences?: Record<string, any>;
}
/**
 * Load the user profile from Firestore. Returns null if not found.
 */
export declare function getUserProfile(uid: string): Promise<UserProfile | null>;
/**
 * Create a new user profile document in Firestore.
 */
export declare function createUserProfile(profile: UserProfile): Promise<void>;
/**
 * Update existing user profile fields.
 */
export declare function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void>;
