<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { isAuthenticated, user, loading, authError } from '$lib/stores/authStore.js';
  import { fade } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';
  import { getCurrentUser } from '$lib/authService';

  let checked = false;
  let authCheckComplete = false;
  let localError = '';
  
  // Session timeout check interval (5 minutes)
  const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;
  let sessionCheckInterval: ReturnType<typeof setInterval> | null = null;
  
  // Initial auth check function
  async function checkAuthentication() {
    try {
      if (!$isAuthenticated && !$loading) {
        // Double-check with Firebase directly in case store is out of sync
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          console.warn('User not authenticated, redirecting to login');
          redirectToLogin();
        }
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      localError = 'Failed to verify authentication status';
    } finally {
      authCheckComplete = true;
      checked = true;
    }
  }
  
  // Redirect to login with return URL
  function redirectToLogin() {
    goto('/login?redirect=' + encodeURIComponent($page.url.pathname));
  }
  
  // Periodic session validation to catch auth timeouts
  function startSessionCheck() {
    sessionCheckInterval = setInterval(async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser && $isAuthenticated) {
          console.warn('Session expired during active use, redirecting to login');
          redirectToLogin();
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    }, SESSION_CHECK_INTERVAL);
  }
  
  onMount(() => {
    console.log('Protected layout mounted', { 
      isAuthenticated: $isAuthenticated, 
      loading: $loading,
      user: $user ? { email: $user.email } : null 
    });
    
    checkAuthentication();
    startSessionCheck();
  });
  
  onDestroy(() => {
    if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval);
    }
  });
  
  // Watch for auth state changes
  $: if (!$loading && !checked) {
    checked = true;
    console.log('Auth check in protected layout:', {
      isAuthenticated: $isAuthenticated,
      loading: $loading
    });
    
    if (!$isAuthenticated) {
      console.warn('User not authenticated, redirecting to login');
      redirectToLogin();
    }
  }
  
  // Watch for auth errors
  $: if ($authError) {
    localError = $authError;
  }
</script>

{#if $loading || !authCheckComplete}
  <div in:fade class="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex justify-center items-center">
    <div class="flex flex-col items-center">
      <div class="w-16 h-16 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Verifying authentication...</p>
    </div>
  </div>
{:else if $isAuthenticated}
  {#if localError}
    <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
      <p class="font-bold">Warning</p>
      <p>{localError}</p>
    </div>
  {/if}
  <slot />
{:else}
  <div in:fade class="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
      <div class="text-center">
        <div class="mb-4 flex justify-center">
          <div class="h-16 w-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <i class="fas fa-lock text-red-600 dark:text-red-400 text-2xl"></i>
          </div>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Authentication Required</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          You need to be logged in to access this page.
        </p>
        {#if localError}
          <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{localError}</p>
          </div>
        {/if}
        <a href="/login?redirect={encodeURIComponent($page.url.pathname)}" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
          Go to Login
        </a>
      </div>
    </div>
  </div>
{/if}