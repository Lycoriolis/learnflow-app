<script lang="ts">
  import { page } from '$app/stores';
  import { onDestroy } from 'svelte';
  import { loadContent, type ContentItem } from '$lib/services/contentService.js';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
  import { exerciseSessions } from '$lib/stores/pipStores.js';
  import { get } from 'svelte/store';

  let exercise: ContentItem | null = null;
  let loading = true;
  let error: string | null = null;
  let unsub;
  let isCompleted = false;

  unsub = page.subscribe(async ($page) => {
    const id = $page.params.id;
    if (!id) return;
    loading = true;
    const item = await loadContent('exercise', id);
    if (item) {
      exercise = item;
      error = null;
      // Check if exercise is already completed
      const sessions = get(exerciseSessions);
      isCompleted = sessions.some(session => session.exerciseId === id);
    } else {
      exercise = null;
      error = 'Exercise not found';
    }
    loading = false;
  });

  onDestroy(() => unsub && unsub());

  function toggleCompletion() {
    if (!exercise) return;
    
    if (!isCompleted) {
      // Add to completed exercises
      exerciseSessions.update(sessions => [
        ...sessions,
        {
          exerciseId: exercise.id,
          timestamp: Date.now(),
          completed: true
        }
      ]);
    } else {
      // Remove from completed exercises
      exerciseSessions.update(sessions => 
        sessions.filter(session => session.exerciseId !== exercise.id)
      );
    }
    isCompleted = !isCompleted;
  }
</script>

<svelte:head>
  <title>{exercise ? exercise.title + ' | Exercise' : 'Loading...'}</title>
</svelte:head>

<div class="max-w-4xl mx-auto p-6">
  {#if loading}
    <div class="text-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else if error}
    <div class="text-red-500">{error}</div>
  {:else if exercise}
    <h1 class="text-3xl font-bold mb-4">{exercise.title}</h1>
    <MarkdownRenderer content={exercise.content} />
    <button 
      class="mt-8 px-6 py-2 rounded-lg font-bold shadow transition-all duration-200 {isCompleted ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white"
      on:click={toggleCompletion}
    >
      {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
    </button>
  {/if}
</div>