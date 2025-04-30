<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { logStart, logEnd } from '$lib/services/activityService.js';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
  import { loadContent, type ContentItem } from '$lib/services/contentService.js';

  let content: ContentItem | null = null;
  let loading = true;
  let viewId: string | null = null;
  $: slug = $page.params.slug;

  onMount(async () => {
    viewId = await logStart('view_exercise', slug);
    content = await loadContent('exercise', slug);
    loading = false;
  });
  onDestroy(() => {
    if (viewId) logEnd(viewId);
  });
</script>

<svelte:head>
  <title>{content?.title || 'Exercise'} | LearnFlow</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  {#if loading}
    <p>Loading exercise...</p>
  {:else if !content}
    <p>Exercise not found.</p>
  {:else}
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{content.title}</h1>
    {#if content.description}
      <p class="text-gray-700 dark:text-gray-300 mb-6">{content.description}</p>
    {/if}
    <MarkdownRenderer content={content.content} className="prose-lg" />
  {/if}
</div>