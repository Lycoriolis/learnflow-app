import { writable } from 'svelte/store';
import type { UserProfile } from '$lib/services/userService.js';
import { getUserProfile, createUserProfile } from '$lib/services/userService.js';

export const userProfile = writable<UserProfile | null>(null);
export const userProfileLoading = writable<boolean>(false);
export const userProfileError = writable<string | null>(null);

/**
 * Load or create the user profile for the given UID and email/displayName.
 */
export async function loadUserProfile(uid: string, email: string, displayName?: string) {
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
  } catch (err: any) {
    console.error('Error loading user profile:', err);
    userProfileError.set(err.message);
    userProfile.set(null);
  } finally {
    userProfileLoading.set(false);
  }
}