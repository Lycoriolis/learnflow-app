import type { UserProfile } from '../services/userService.js';
import { updateUserProfile as updateUserProfileService } from '../services/userService.js';
export declare const userProfile: import("svelte/store").Writable<UserProfile | null>;
export declare const userProfileLoading: import("svelte/store").Writable<boolean>;
export declare const userProfileError: import("svelte/store").Writable<string | null>;
/**
 * Load or create the user profile for the given UID and email/displayName.
 */
export declare function loadUserProfile(uid: string, email: string, displayName?: string): Promise<void>;
export declare const updateUserProfile: typeof updateUserProfileService;
