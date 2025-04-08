<script>
  import { isAuthenticated, user, loading } from '$lib/stores/authStore.js';
  import { login } from '$lib/authService.js';
</script>

<svelte:head>
  <title>LearnFlow | Account Settings</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  {#if $loading}
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)] text-4xl text-indigo-500">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
  {:else if $isAuthenticated && $user}
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h1>
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">Profile Information</h2>
      <div class="space-y-3">
        <p><strong class="text-gray-600 dark:text-gray-400">Name:</strong> {$user.name ?? 'N/A'}</p>
        <p><strong class="text-gray-600 dark:text-gray-400">Email:</strong> {$user.email ?? 'N/A'}</p>
        <p><strong class="text-gray-600 dark:text-gray-400">Nickname:</strong> {$user.nickname ?? 'N/A'}</p>
        <!-- Add other settings fields or profile editing options here -->
      </div>
    </div>
  {:else}
    <div class="text-center py-10">
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-4">Please log in to manage your settings.</p>
      <button 
        class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150"
        on:click={login}
      >
        Log In
      </button>
    </div>
  {/if}
</div>
