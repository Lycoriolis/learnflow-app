<script lang="ts">
  import { onMount } from 'svelte';
  import { findRelatedContent, type RelatedContentItem } from '$lib/services/relatedContentService';
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';

  export let contentId: string;
  export let contentType: 'exercise' | 'course' | 'lesson' = 'exercise';
  export let maxItems: number = 4;
  export let showTags: boolean = true;
  export let showSimilarity: boolean = false;

  let relatedItems: RelatedContentItem[] = [];
  let loading: boolean = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      loading = true;
      relatedItems = await findRelatedContent(contentId, { limit: maxItems });
    } catch (err) {
      console.error('Error loading related content:', err);
      error = 'Failed to load related content';
    } finally {
      loading = false;
    }
  });

  function getContentUrl(item: RelatedContentItem): string {
    switch(item.type) {
      case 'exercise':
        return `/exercises/${item.slug || item.id}`;
      case 'course':
        return `/courses/${item.id}`;
      case 'lesson':
        // This would need to be updated with the proper course ID
        return `/courses/unknown/${item.id}`;
      default:
        return '#';
    }
  }
  
  function getDifficultyClass(difficulty: string | undefined): string {
    switch(difficulty) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  }
</script>

<div class="mt-8">
  <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Related Content</h2>
  
  {#if loading}
    <div class="animate-pulse flex flex-col space-y-3">
      {#each Array(3) as _, i}
        <div class="bg-gray-200 dark:bg-gray-700 rounded-lg h-20"></div>
      {/each}
    </div>
  {:else if error}
    <div class="text-red-500">{error}</div>
  {:else if relatedItems.length === 0}
    <div class="text-gray-500 dark:text-gray-400 text-sm">No related content found</div>
  {:else}
    <div class="grid gap-4" in:fade={{ duration: 300 }}>
      {#each relatedItems as item}
        <a
          href={getContentUrl(item)}
          class="group flex flex-col p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {item.title}
              </h3>
              {#if item.description}
                <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{item.description}</p>
              {/if}
            </div>
            
            {#if item.isPrerequisite}
              <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                Prerequisite
              </span>
            {:else if showSimilarity}
              <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                {Math.round(item.similarity * 100)}% match
              </span>
            {/if}
          </div>
          
          {#if showTags && item.tags && item.tags.length > 0}
            <div class="mt-2 flex flex-wrap gap-2">
              {#each item.tags.slice(0, 3) as tag}
                <span class="inline-flex text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                  {tag}
                </span>
              {/each}
              {#if item.tags.length > 3}
                <span class="inline-flex text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                  +{item.tags.length - 3} more
                </span>
              {/if}
            </div>
          {/if}
        </a>
      {/each}
    </div>
  {/if}
</div>
