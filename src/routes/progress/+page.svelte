<script>
  import { isAuthenticated, loading } from '$lib/stores/authStore.js';
  import { login } from '$lib/services/authService.js'; // Keep this import
  import { goto } from '$app/navigation'; // Import goto for navigation
</script>

<svelte:head>
  <title>LearnFlow | My Progress</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  {#if $loading}
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)] text-4xl text-indigo-500">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
  {:else if $isAuthenticated}
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Progress</h1>
    <p class="text-gray-600 dark:text-gray-300">Your learning progress and statistics will be shown here. (Placeholder)</p>
    <!-- Add progress visualization logic here -->
  {:else}
    <div class="text-center py-10">
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-4">Please log in to view your progress.</p>
      <button 
        class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150"
        on:click={() => goto('/login?redirect=/progress')}
      >
        Log In
      </button>
    </div>
  {/if}
</div>