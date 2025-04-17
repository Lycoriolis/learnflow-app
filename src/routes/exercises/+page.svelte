<script lang="ts">
  import { onMount } from 'svelte';
  import { isAuthenticated, loading } from '$lib/stores/authStore.js';
  import { goto } from '$app/navigation';
  import { listContent, type ContentMetadata } from '$lib/services/contentService.js';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
  import { slide } from 'svelte/transition';

  let exercises: ContentMetadata[] = [];
  let isLoading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      exercises = await listContent('exercise');
    } catch (err) {
      console.error(err);
      error = 'Failed to load exercises';
    } finally {
      isLoading = false;
    }
  });

  function goToLogin() {
    goto(`/login?redirect=/exercises`);
  }
</script>

<svelte:head>
  <title>LearnFlow | Exercises</title>
</svelte:head>

{#if $loading || isLoading}
  <div class="flex items-center justify-center min-h-[60vh]">
    <i class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i>
  </div>
{:else if !$isAuthenticated}
  <div class="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Practice Exercises</h1>
    <p class="text-gray-600 dark:text-gray-300 mb-6">Please log in to access exercises.</p>
    <button class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md" on:click={goToLogin}>
      Log In
    </button>
  </div>
{:else}
  <div class="max-w-7xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#if error}
      <div class="col-span-full text-center text-red-500">{error}</div>
    {/if}
    {#each exercises as ex (ex.id)}
      <a href={`/exercises/${ex.id}`} class="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition p-6 text-center flex flex-col h-full">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{ex.title}</h2>
        <p class="text-gray-600 dark:text-gray-300 flex-grow">{ex.description}</p>
        <span class="mt-4 inline-block px-3 py-1 bg-indigo-600 text-white rounded">Go to Exercise</span>
      </a>
    {/each}
  </div>
{/if}

<style>
  /* Ensure each tile is centered and hint panel overlays correctly */
  .relative { position: relative; }
</style>