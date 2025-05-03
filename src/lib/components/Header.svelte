<script lang="ts">
  import { pipVisible } from '$lib/stores/pipStores.js';
  import { isAuthenticated, user, loading } from '$lib/stores/authStore.js';
  import { logout } from '$lib/authService.js';
  import { slide } from 'svelte/transition';
  import { navigateToLogin } from '$lib/utils/navigation';
  import { goto } from '$app/navigation';

  export let onTogglePip = () => pipVisible.update((v: boolean) => !v);
  
  let searchQuery = '';
  
  function handleSearch() {
    if (searchQuery.trim()) {
      // Navigate to search results page (implementation would depend on your routing)
      console.log('Searching for:', searchQuery);
    }
  }
  
  function navigateTo(path: string) {
    goto(path);
  }
</script>

<header class="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
  <div class="max-w-full mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
    <!-- Logo and Navigation -->
    <div class="flex items-center">
      <a href="/" class="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
        <i class="fas fa-graduation-cap text-2xl"></i>
        <span class="font-bold text-xl hidden sm:inline">LearnFlow</span>
      </a>
      
      <nav class="ml-6 hidden md:flex space-x-4">
        <a href="/courses" class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Courses</a>
        <a href="/exercises" class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Exercises</a>
        <a href="/forums" class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Forums</a>
        {#if $isAuthenticated}
          <a href="/my-learning" class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">My Learning</a>
        {/if}
      </nav>
    </div>

    <!-- Centered Search Container -->
    <div class="flex-1 relative max-w-lg mx-auto px-4">
      <form on:submit|preventDefault={handleSearch} class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fas fa-search text-gray-400"></i>
        </div>
        <input
          type="text"
          bind:value={searchQuery}
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Search courses, exercises..."
        />
        <button type="submit" class="absolute inset-y-0 right-0 pr-3 flex items-center" aria-label="Search">
          <i class="fas fa-arrow-right text-gray-400 hover:text-indigo-500"></i>
        </button>
      </form>
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
          <div class="relative group">
            <button class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              {$user.displayName?.charAt(0).toUpperCase() ?? $user.email?.charAt(0).toUpperCase() ?? 'U'}
            </button>
            <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 hidden group-hover:block">
              <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile Settings</a>
              <a href="/my-learning" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">My Learning</a>
              <button 
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                on:click={logout}
              >
                Log out
              </button>
            </div>
          </div>
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