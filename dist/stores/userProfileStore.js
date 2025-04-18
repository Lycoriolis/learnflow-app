import { writable } from 'svelte/store';
import { getUserProfile, createUserProfile, updateUserProfile as updateUserProfileService } from '../services/userService.js';
export const userProfile = writable(null);
export const userProfileLoading = writable(false);
export const userProfileError = writable(null);
/**
 * Load or create the user profile for the given UID and email/displayName.
 */
export async function loadUserProfile(uid, email, displayName) {
    userProfileLoading.set(true);
    userProfileError.set(null);
    try {
        let profile = await getUserProfile(uid);
        if (!profile) {
            // create new profile
            const now = Date.now();
            profile = {
                uid,
                email,
                displayName,
                createdAt: now,
                preferences: {
                    enrollments: [],
                    focusSessions: [],
                    tasks: [],
                    notes: ''
                }
            };
            await createUserProfile(profile);
        }
        userProfile.set(profile);
    }
    catch (err) {
        console.error('Error loading user profile:', err);
        userProfileError.set(err.message);
        userProfile.set(null);
    }
    finally {
        userProfileLoading.set(false);
    }
}
export const updateUserProfile = updateUserProfileService;
