export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    createdAt: number;
    preferences?: Record<string, any>;
}
/**
 * Verifies if a user has admin privileges based on their email
 */
export declare function verifyUserIsAdmin(email: string | null | undefined): Promise<boolean>;
/**
 * Fetches all user profiles from the database (admin only)
 */
export declare function getAllUsers(): Promise<UserProfile[]>;
