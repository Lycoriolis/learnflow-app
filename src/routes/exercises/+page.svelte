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
  let showAnswer: Record<string, boolean> = {};
  let showHint: Record<string, boolean> = {};

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

  function toggleAnswer(id: string) {
    showAnswer[id] = !showAnswer[id];
  }

  function toggleHint(id: string) {
    showHint[id] = !showHint[id];
  }

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
      <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center text-center">
        <!-- Hint Button -->
        <button class="absolute top-4 right-4 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition"
                on:click={() => toggleHint(ex.id)}>
          <i class="fas fa-lightbulb"></i>
        </button>

        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{ex.title}</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">{ex.description}</p>

        <button class="px-4 py-2 bg-green-600 text-white rounded-md mb-4 hover:bg-green-700 transition"
                on:click={() => toggleAnswer(ex.id)}>
          {showAnswer[ex.id] ? 'Hide Answer' : 'Show Answer'}
        </button>

        {#if showAnswer[ex.id]}
          <div class="w-full bg-gray-100 dark:bg-gray-700 p-4 rounded mb-4 text-left">
            <MarkdownRenderer content={ex.answer || 'No answer provided.'} />
          </div>
        {/if}

        {#if showHint[ex.id]}
          <div class="absolute inset-y-0 right-0 w-2/3 bg-indigo-50 dark:bg-gray-900 p-6 overflow-auto"
               in:slide={{ x: 300 }} out:slide={{ x: 300 }}>
            <h3 class="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-2">Indications</h3>
            <MarkdownRenderer content={ex.hints || 'No hints available.'} />
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/if}

<style>
  /* Ensure each tile is centered and hint panel overlays correctly */
  .relative { position: relative; }
</style>