<script lang="ts">
  import Login from '$lib/components/Login.svelte';
  import { isAuthenticated, loading } from '$lib/stores/authStore.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  // Get the redirect parameter if present
  $: redirectTo = $page.url.searchParams.get('redirect') || '/';

  onMount(() => {
    // Redirect to home or specified redirect path if already authenticated
    if ($isAuthenticated) {
      goto(redirectTo);
    }
  });

  // Watch for authentication status changes
  $: if (!$loading && $isAuthenticated) {
    goto(redirectTo);
  }
</script>

<svelte:head>
  <title>Login - LearnFlow</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  {#if $loading}
    <div class="flex flex-col items-center justify-center">
      <div class="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  {:else}
    <Login {redirectTo} />
  {/if}
</div> 