<script lang="ts">
  import { onMount } from 'svelte';
  import { isAuthenticated, loading } from '$lib/stores/authStore.js';
  import { goto } from '$app/navigation';
  import { listContent, type ContentMetadata } from '$lib/services/contentService.js;

  // Exercises state
  let exercises: ContentMetadata[] = [];
  let isLoading = true;
  let error: string | null = null;

  // UI state maps
  let showAnswer: Record<string, boolean> = {};
  let showHint: Record<string, boolean> = {};

  // Load exercises
  onMount(async () => {
    try {
      exercises = await listContent('exercise');
    } catch (err) {
      console.error('Error loading exercises:', err);
      error = 'Failed to load exercises';
    } finally {
      isLoading = false;
    }
  });

  function toggleAnswer(id: string) {
    showAnswer[id] = !showAnswer[id];
  }

  function toggleHint(id: string) {
    showHint[id] = !showHint[id];
  }

  function goToLogin() {
    goto('/login?redirect=/exercises');
  }
</script>

<svelte:head>
  <title>LearnFlow | Exercises</title>
</svelte:head>

{#if $loading || isLoading}
  <div class="flex justify-center items-center min-h-[60vh]">
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
  <div class="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#if error}
      <div class="col-span-full text-red-500 text-center">{error}</div>
    {/if}
    {#each exercises as ex (ex.id)}
      <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center text-center overflow-hidden">
        <!-- Hint Button -->
        <button class="absolute top-3 right-3 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow hover:bg-indigo-700 transition"
                on:click={() => toggleHint(ex.id)}>
          <i class="fas fa-lightbulb"></i>
        </button>

        <!-- Question -->
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{ex.title}</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">{ex.description}</p>

        <!-- Show Answer Toggle -->
        <button class="px-4 py-2 bg-green-600 text-white rounded-md mb-4 hover:bg-green-700 transition"
                on:click={() => toggleAnswer(ex.id)}>
          {showAnswer[ex.id] ? 'Hide Answer' : 'Show Answer'}
        </button>

        {#if showAnswer[ex.id]}
          <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded mb-4 w-full">
            <MarkdownRenderer content={ex.answer || 'No answer provided.'} />
          </div>
        {/if}

        <!-- Hint Panel -->
        {#if showHint[ex.id]}
          <div class="absolute inset-y-0 right-0 w-2/3 bg-indigo-50 dark:bg-gray-900 p-6 transform transition-transform duration-300"
               style="transform: translateX(0);">
            <h3 class="text-md font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Indications</h3>
            <p class="text-gray-700 dark:text-gray-200">{ex.hints || 'No hints available.'}</p>
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/if}

<style>
  /* Center and contain the hint sliding panel outside normal flow */
  div[style*="transform"] {
    right: -100%;
  }
  div[style*="transform"][class*="absolute"][class*="inset-y-0"][class*="right-0"][class*="transform"][class*="transition-transform"][class*="duration-300"] {
    transform: translateX(-100%);
  }
  :global(.hint-open) {
    transform: translateX(0) !important;
  }
</style>