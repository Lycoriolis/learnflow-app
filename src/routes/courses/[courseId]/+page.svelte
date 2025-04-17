<script lang="ts">
  import { page } from '$app/stores';
  import { onDestroy } from 'svelte';
  import { loadContent, type ContentItem } from '$lib/services/contentService.js';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
  import { goto } from '$app/navigation';

  let course: ContentItem | null = null;
  let loading = true;
  let error: string | null = null;
  let unsub;

  // Watch route param and fetch content
  unsub = page.subscribe(async ($page) => {
    const id = $page.params.courseId;
    if (!id) return;
    loading = true;
    error = null;
    const item = await loadContent('course', id);
    if (item) course = item;
    else {
      error = 'Course not found';
      course = null;
    }
    loading = false;
  });

  onDestroy(() => unsub && unsub());
</script>

<svelte:head>
  <title>{course ? course.title + ' | LearnFlow' : 'Loading...'}</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-6">
  {#if loading}
    <div class="flex justify-center items-center min-h-[50vh]"><i class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
  {:else if error}
    <div class="text-red-500 text-center py-10">{error}</div>
  {:else if course}
    <h1 class="text-3xl font-bold mb-4">{course.title}</h1>
    <MarkdownRenderer content={course.content} />
  {/if}
</div>