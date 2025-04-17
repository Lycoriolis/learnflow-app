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

  unsub = page.subscribe(async ($page) => {
    const id = $page.params.id;
    if (!id) return;
    loading = true;
    const item = await loadContent('exercise', id);
    if (item) {
      exercise = item;
      error = null;
    } else {
      exercise = null;
      error = 'Exercise not found';
    }
    loading = false;
  });

  onDestroy(() => unsub && unsub());

  function markComplete() {
    if (!exercise) return;
    const now = Date.now();
    const sessions = get(exerciseSessions);
    exerciseSessions.set([...sessions, { exerciseId: exercise.id, timestamp: now, completed: true }]);
  }
</script>

<svelte:head>
  <title>{exercise ? exercise.title + ' | Exercise' : 'Loading...'}</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-6">
  {#if loading}
    <div class="flex justify-center items-center min-h-[50vh]"><i class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
  {:else if error}
    <div class="text-red-500 text-center py-10">{error}</div>
  {:else if exercise}
    <h1 class="text-3xl font-bold mb-4">{exercise.title}</h1>
    <MarkdownRenderer content={exercise.content} />
    <button
      class="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      on:click={markComplete}
    >Mark Complete</button>
  {/if}
</div>