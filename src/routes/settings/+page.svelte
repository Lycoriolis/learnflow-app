<script lang="ts">
  import { onMount } from 'svelte';
  import { isAuthenticated, user, loading as authLoading, logout } from '$lib/stores/authStore.js';
  import { goto } from '$app/navigation';
  import type { UserProfile } from '$lib/services/userService.js';
  import { userProfile, userProfileLoading, updateUserProfile } from '$lib/stores/userProfileStore.js';
  import { getCurrentUser, updateProfile as firebaseUpdateProfile } from '$lib/authService.js';
  import type { TimerSettings } from '$lib/stores/pipStores.js';
  import { timerSettings } from '$lib/stores/pipStores.js';

  // Local form state
  let displayName = '';
  let email = '';
  let theme = 'auto';
  let durations = { work: 25, shortBreak: 5, longBreak: 15, interval: 4 };
  let saving = false;
  let error: string | null = null;

  let unsubProfile: () => void;
  let unsubTimer: () => void;

  onMount(() => {
    unsubProfile = userProfile.subscribe((profile: UserProfile | null) => {
      if (profile) {
        displayName = profile.displayName || '';
        email = profile.email;
        // load theme if stored
        theme = profile.preferences?.theme || 'auto';
      }
    });
    // load timer settings store
    unsubTimer = timerSettings.subscribe((s: TimerSettings) => {
      durations = { 
        work: Math.round(s.workDuration/60), 
        shortBreak: Math.round(s.shortBreakDuration/60), 
        longBreak: Math.round(s.longBreakDuration/60), 
        interval: s.longBreakInterval
      };
    });
    return () => { 
      if (unsubProfile) unsubProfile();
      if (unsubTimer) unsubTimer();
    };
  });

  async function saveSettings() {
    saving = true;
    error = null;
    try {
      // Update Firebase auth displayName
      const currentUser = getCurrentUser();
      if (currentUser && displayName !== currentUser.displayName) {
        await firebaseUpdateProfile(currentUser, { displayName });
      }
      // Update preferences in Firestore
      if (currentUser) {
        await updateUserProfile(currentUser.uid, { 
          displayName, 
          preferences: { 
            theme,
            // preserve other preferences
            ...($userProfile?.preferences || {})
          }
        });
      }
      // Update Pomodoro durations store
      timerSettings.set({
        workDuration: durations.work * 60,
        shortBreakDuration: durations.shortBreak * 60,
        longBreakDuration: durations.longBreak * 60,
        longBreakInterval: durations.interval
      });
    } catch (e:any) {
      console.error(e);
      error = e.message;
    } finally {
      saving = false;
    }
  }

  function goToLogin() {
    goto('/login?redirect=/settings');
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
              <option value="auto">Auto</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <fieldset class="space-y-4">
              <legend class="text-sm font-medium mb-1">Pomodoro Durations (minutes)</legend>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="work-duration" class="block text-sm text-gray-500">Work Duration</label>
                  <input type="number" id="work-duration" min="1" bind:value={durations.work} class="w-full rounded border-gray-300 dark:border-gray-600 p-2" />
                </div>
                <div>
                  <label for="short-break" class="block text-sm text-gray-500">Short Break</label>
                  <input type="number" id="short-break" min="1" bind:value={durations.shortBreak} class="w-full rounded border-gray-300 dark:border-gray-600 p-2" />
                </div>
                <div>
                  <label for="long-break" class="block text-sm text-gray-500">Long Break</label>
                  <input type="number" id="long-break" min="1" bind:value={durations.longBreak} class="w-full rounded border-gray-300 dark:border-gray-600 p-2" />
                </div>
                <div>
                  <label for="interval" class="block text-sm text-gray-500">Sessions Before Long Break</label>
                  <input type="number" id="interval" min="1" bind:value={durations.interval} class="w-full rounded border-gray-300 dark:border-gray-600 p-2" />
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-2">
        <button class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" on:click={() => logout()}>Sign Out</button>
        <button class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" on:click={saveSettings} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  {:else}
    <div class="text-center py-20">
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">Please log in to manage your settings.</p>
      <button class="px-6 py-2 bg-indigo-600 text-white rounded" on:click={goToLogin}>Log In</button>
    </div>
  {/if}
</div>
