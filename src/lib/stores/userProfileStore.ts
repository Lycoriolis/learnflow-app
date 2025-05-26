import { writable } from 'svelte/store';
import type { UserProfile as AppUserProfile } from '$lib/types/shared';
import { getUserProfile, createUserProfile, updateUserProfile as updateUserProfileService } from '../services/userService.js';

export const userProfile = writable<AppUserProfile | null>(null);
export const userProfileLoading = writable<boolean>(false);
export const userProfileError = writable<string | null>(null);

/**
 * Load or create the user profile for the given UID and email/displayName.
 */
export async function loadUserProfile(uid: string, email: string | null, displayName?: string | null): Promise<void> {
  userProfileLoading.set(true);
  userProfileError.set(null);

  try {
    let profile = await getUserProfile(uid);
    if (!profile) {
      // create new profile
      profile = {
        uid,
        email: email ?? undefined,
        displayName: displayName ?? undefined,
        isPremium: false
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

export const updateUserProfile = updateUserProfileService;