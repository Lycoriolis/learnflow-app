<script lang="ts">
  import { onMount, onDestroy } from 'svelte'; // Import onDestroy
  import { goto } from '$app/navigation';
  import { user, isAuthenticated, loading as authLoading, authError } from '$lib/stores/authStore.js';
  import { 
    userProfile, 
    userProfileLoading, 
    userProfileError, 
    loadUserProfile, 
    updateUserProfile as serviceUpdateUserProfile // Aliased to avoid conflict
  } from '$lib/stores/userProfileStore.js';
  import { timerSettings } from '$lib/stores/pipStores.js';
  import type { User } from 'firebase/auth';
  import { getCurrentUser, updateProfile as firebaseUpdateProfile } from '$lib/services/authService.js'; // Corrected path
  import type { UserProfile, UserPreferences } from '$lib/services/userService.js';
  import type { TimerSettings } from '$lib/stores/pipStores.js'; // Ensure this type is correctly defined/exported

  let currentUser: User | null = null;
  let localProfile: UserProfile | null = null;
  let localPreferences: UserPreferences | null = null; // Stays UserPreferences | null
  let localTimerSettings: TimerSettings | null = null;

  let displayName = '';
  let email = ''; // Email is usually not changed directly via profile update in Firebase Auth
  let photoURL = '';
  
  let theme = 'system'; // Default theme
  let notifications = {
    email: true,
    inApp: true,
  };
  let focusDuration = 25;
  let shortBreakDuration = 5;
  let longBreakDuration = 15;
  let focusSessionsBeforeLongBreak = 4;

  let isLoading = false;
  let error: string | null = null;
  let successMessage: string | null = null;

  let unsubProfile: (() => void) | null = null;
  let unsubTimer: (() => void) | null = null;

  onMount(async () => {
    if (!$authLoading && $user) {
      currentUser = getCurrentUser();
      if (currentUser) {
        if (!$userProfileLoading && $userProfile) {
          localProfile = $userProfile;
          displayName = $userProfile.displayName || '';
          email = $userProfile.email || '';
          photoURL = $userProfile.photoURL || '';
          localPreferences = $userProfile.preferences ?? null;
          theme = $userProfile.preferences?.theme || 'system';
          notifications = {
            email: $userProfile.preferences?.notifications?.email !== undefined ? $userProfile.preferences.notifications.email : true,
            inApp: $userProfile.preferences?.notifications?.inApp !== undefined ? $userProfile.preferences.notifications.inApp : true,
          };
        } else if (!$userProfileLoading) {
          await loadUserProfile(currentUser.uid, currentUser.email || '', currentUser.displayName || undefined);
        }
      }
    }

    unsubProfile = userProfile.subscribe(profile => {
      if (profile) {
        localProfile = profile;
        displayName = profile.displayName || '';
        email = profile.email || '';
        photoURL = profile.photoURL || '';
        localPreferences = profile.preferences ?? null;
        theme = profile.preferences?.theme || 'system';
        notifications = {
          email: profile.preferences?.notifications?.email !== undefined ? profile.preferences.notifications.email : true,
          inApp: profile.preferences?.notifications?.inApp !== undefined ? profile.preferences.notifications.inApp : true,
        };
      }
    });

    unsubTimer = timerSettings.subscribe(settings => {
      if (settings) {
        localTimerSettings = settings;
        focusDuration = settings.workDuration;
        shortBreakDuration = settings.shortBreakDuration;
        longBreakDuration = settings.longBreakDuration;
        focusSessionsBeforeLongBreak = settings.longBreakInterval;
      }
    });
  });

  onDestroy(() => {
    if (unsubProfile) {
      unsubProfile();
    }
    if (unsubTimer) {
      unsubTimer();
    }
  });

  async function handleProfileUpdate() {
    if (!currentUser || !localProfile) return;
    isLoading = true;
    error = null;
    successMessage = null;

    try {
      // Update Firebase Auth profile (displayName, photoURL)
      await firebaseUpdateProfile(currentUser, { displayName, photoURL });

      // Update Firestore profile (additional preferences)
      const updatedProfileData: Partial<UserProfile> = {
        ...localProfile,
        displayName, // Ensure displayName is part of the update to Firestore as well
        photoURL,    // Ensure photoURL is part of the update to Firestore as well
        preferences: {
          ...(localProfile.preferences || {}),
          theme,
          notifications,
        }
      };
      await serviceUpdateUserProfile(currentUser.uid, updatedProfileData);
      
      successMessage = 'Profile updated successfully!';
    } catch (err: any) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }

  async function handleTimerSettingsUpdate() {
    isLoading = true;
    error = null;
    successMessage = null;
    try {
      timerSettings.set({
        workDuration: focusDuration, // Fix: Map to workDuration
        shortBreakDuration,
        longBreakDuration,
        longBreakInterval: focusSessionsBeforeLongBreak // Fix: Map to longBreakInterval
      });
      successMessage = 'Timer settings saved!';
    } catch (err:any) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }

  function handleLogout() {
    // Placeholder for actual logout logic, likely from authService
    console.log("Logout initiated");
    // import('$lib/services/authService.js').then(auth => auth.logout().then(() => goto('/login')));
  }
</script>

<svelte:head>
  <title>Account Settings | LearnFlow</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-6">
  {#if $authLoading || $userProfileLoading}
    <div class="flex justify-center items-center min-h-[50vh]">
      <i class="fas fa-spinner fa-spin text-3xl text-indigo-500"></i>
    </div>
  {:else if $isAuthenticated && $user && $userProfile}
    <h1 class="text-2xl font-bold mb-4">Account Settings</h1>
    {#if error}
      <div class="text-red-500 mb-4">{error}</div>
    {/if}
    {#if successMessage}
      <div class="text-green-500 mb-4">{successMessage}</div>
    {/if}
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
      <!-- Profile Info -->
      <div>
        <h2 class="text-lg font-semibold mb-2">Profile</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="displayName" class="block text-sm font-medium mb-1">Display Name</label>
            <input type="text" id="displayName" bind:value={displayName} class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium mb-1">Email (cannot change)</label>
            <input type="email" id="email" value={email} readonly class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-gray-100 dark:bg-gray-600 text-gray-500" />
          </div>
        </div>
      </div>

      <!-- Preferences -->
      <div>
        <h2 class="text-lg font-semibold mb-2">Preferences</h2>
        <div class="space-y-4">
          <div>
            <label for="theme" class="block text-sm font-medium mb-1">Theme</label>
            <select id="theme" bind:value={theme} class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700">
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <fieldset class="space-y-4">
              <legend class="text-sm font-medium mb-1">Pomodoro Durations (minutes)</legend>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="focus-duration" class="block text-sm text-gray-500">Focus Duration</label>
                  <input type="number" id="focus-duration" min="1" bind:value={focusDuration} class="w-full rounded border-gray-300 dark:border-gray-600 p-2" />
                </div>
                <div>
                  <label for="short-break" class="block text-sm text-gray-500">Short Break</label>
                  <input type="number" id="short-break" min="1" bind:value={shortBreakDuration} class="w-full rounded border-gray-300 dark:border-gray-600 p-2" />
                </div>
                <div>
                  <label for="long-break" class="block text-sm text-gray-500">Long Break</label>
                  <input type="number" id="long-break" min="1" bind:value={longBreakDuration} class="w-full rounded border-gray-300 dark:border-gray-600 p-2" />
                </div>
                <div>
                  <label for="sessions-before-long-break" class="block text-sm text-gray-500">Sessions Before Long Break</label>
                  <input type="number" id="sessions-before-long-break" min="1" bind:value={focusSessionsBeforeLongBreak} class="w-full rounded border-gray-300 dark:border-gray-600 p-2" />
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-2">
        <button class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" on:click={handleLogout}>Sign Out</button>
        <button class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" on:click={handleProfileUpdate} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        <button class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" on:click={handleTimerSettingsUpdate} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Timer Settings'}
        </button>
      </div>
    </div>
  {:else}
    <div class="text-center py-20">
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">Please log in to manage your settings.</p>
      <button class="px-6 py-2 bg-indigo-600 text-white rounded" on:click={() => goto('/login?redirect=/settings')}>Log In</button>
    </div>
  {/if}
</div>
