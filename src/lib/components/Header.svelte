<script lang="ts">
  import { pipVisible } from '$lib/stores/pipStores.js';
  import { isAuthenticated, user, loading } from '$lib/stores/authStore.js';
  import { logout } from '$lib/services/authService.js';
  import { slide } from 'svelte/transition';
  import { goto } from '$app/navigation';

  export let onTogglePip = () => pipVisible.update((v: boolean) => !v);
  
  function navigateToLogin() {
    goto('/login');
  }
</script>

<header class="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
  <div class="max-w-full mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
    <div class="flex-1">
      <div class="relative max-w-lg">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fas fa-search text-gray-400"></i>
        </div>
        <input 
          type="text" 
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Search courses, exercises..."
        >
      </div>
    </div>

    <div class="ml-4 flex items-center space-x-3">
      <button 
        class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Show notifications"
      >
        <i class="fas fa-bell"></i>
      </button>
      
      <button 
        id="pipToggle" 
        class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        on:click={onTogglePip}
        aria-label="Toggle learning tools widget"
      >
        <i class="fas fa-puzzle-piece"></i>
      </button>

      {#if $loading}
        <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      {:else if $isAuthenticated && $user}
        <div class="flex items-center space-x-3">
          <div class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">
            {$user.displayName?.charAt(0).toUpperCase() ?? $user.email?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <button 
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            on:click={logout}
          >
            Log out
          </button>
        </div>
      {:else}
        <button 
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          on:click={navigateToLogin}
        >
          Log in
        </button>
      {/if}
    </div>
  </div>
</header>