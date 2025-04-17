<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { isAuthenticated, user, loading as authLoading, logout as firebaseLogout } from '$lib/stores/authStore.js';
  import { goto } from '$app/navigation';
  import { userProfile, userProfileLoading, updateUserProfile } from '$lib/stores/userProfileStore.js';
  import { getCurrentUser, updateProfile as firebaseUpdateProfile } from '$lib/authService.js';
  import { timerSettings } from '$lib/stores/pipStores';

  // Local form state
  let displayName = '';
  let email = '';
  let theme = 'auto';
  let durations = { work: 25, shortBreak: 5, longBreak: 15, interval: 4 };
  let saving = false;
  let error: string | null = null;

  let unsubProfile;
  onMount(() => {
    unsubProfile = userProfile.subscribe(profile => {
      if (profile) {
        displayName = profile.displayName || '';
        email = profile.email;
        // load theme if stored
        theme = profile.preferences?.theme || 'auto';
      }
    });
    // load timer settings store
    const unsubTimer = timerSettings.subscribe(s => durations = { 
      work: Math.round(s.workDuration/60), 
      shortBreak: Math.round(s.shortBreakDuration/60), 
      longBreak: Math.round(s.longBreakDuration/60), 
      interval: s.longBreakInterval
    });
    return () => { unsubProfile(); unsubTimer(); };
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
      await updateUserProfile(currentUser.uid, { 
        displayName, 
        preferences: { 
          theme,
          // update enrollments, etc untouched
        }
      });
      // Update Pimodoro durations store
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
  {#if authLoading || userProfileLoading}
    <div class="flex justify-center items-center min-h-[50vh]"><i class="fas fa-spinner fa-spin text-3xl text-indigo-500"></i></div>
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
            <label class="block text-sm font-medium mb-1">Display Name</label>
            <input type="text" bind:value={displayName} class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email (cannot change)</label>
            <input type="email" value={email} readonly class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-gray-100 dark:bg-gray-600 text-gray-500" />
          </div>
        </div>
      </div>

      <!-- Preferences -->
      <div>
        <h2 class="text-lg font-semibold mb-2">Preferences</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Theme</label>
            <select bind:value={theme} class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700">
              <option value="auto">Auto</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Pomodoro Durations (minutes)</label>
            <div class="grid grid-cols-2 gap-4">
              <div><input type="number" min="1" bind:value={durations.work} class="w-full rounded border-gray-300 dark:border-gray-600 p-2" placeholder="Work" /></div>
              <div><input type="number" min="1" bind:value={durations.shortBreak} class="w-full rounded border-gray-300 dark:border-gray-600 p-2" placeholder="Short Break" /></div>
              <div><input type="number" min="1" bind:value={durations.longBreak} class="w-full rounded border-gray-300 dark:border-gray-600 p-2" placeholder="Long Break" /></div>
              <div><input type="number" min="1" bind:value={durations.interval} class="w-full rounded border-gray-300 dark:border-gray-600 p-2" placeholder="Interval" /></div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-2">
        <button class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" on:click={() => firebaseLogout()}>Sign Out</button>
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
