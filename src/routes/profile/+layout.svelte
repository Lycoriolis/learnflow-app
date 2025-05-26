<script lang="ts">
  import { page } from '$app/stores';
  import { isAuthenticated, loading } from '$lib/stores/authStore';
  import { userProfile, userProfileLoading } from '$lib/stores/userProfileStore';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  
  // Check if we're on a profile page with a userId parameter
  $: isUserProfilePage = $page.route.id?.includes('[userId]') || false;
</script>

{#if $loading || $userProfileLoading}
  <div class="container mx-auto py-16 px-4 flex justify-center">
    <LoadingSpinner size="lg" color="blue" />
  </div>
{:else if !$isAuthenticated && !isUserProfilePage}
  <div class="container mx-auto py-16 px-4">
    <div class="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold text-white mb-4">Authentication Required</h1>
      <p class="text-gray-300 mb-6">Please sign in to view your profile.</p>
      <a 
        href={`/login?returnTo=${$page.url.pathname}`}
        class="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
      >
        Sign In
      </a>
    </div>
  </div>
{:else}
  <slot />
{/if}
