<script lang="ts">
  import ResetPassword from '$lib/components/ResetPassword.svelte';
  import { loading } from '$lib/stores/authStore.js';
</script>

<svelte:head>
  <title>Reset Password - LearnFlow</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
  {#if $loading}
    <div class="flex flex-col items-center justify-center">
      <div class="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  {:else}
    <ResetPassword />
  {/if}
</div> 