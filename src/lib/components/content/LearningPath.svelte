<script lang="ts">
  import { onMount } from 'svelte';
  import { generateLearningPath, type RelatedContentItem } from '$lib/services/relatedContentService';
  import { fade, fly } from 'svelte/transition';

  export let startContentId: string;
  export let goalContentId: string | undefined = undefined;
  export let maxLength: number = 5;
  export let title: string = 'Suggested Learning Path';

  let path: RelatedContentItem[] = [];
  let loading: boolean = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      loading = true;
      path = await generateLearningPath(startContentId, goalContentId, { maxLength });
    } catch (err) {
      console.error('Error generating learning path:', err);
      error = 'Failed to generate learning path';
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
        return `/courses/unknown/${item.id}`;
      default:
        return '#';
    }
  }
  
  function getTypeIcon(type: string): string {
    switch(type) {
      case 'exercise':
        return 'fa-dumbbell';
      case 'course':
        return 'fa-book';
      case 'lesson':
        return 'fa-file-alt';
      default:
        return 'fa-file';
    }
  }
</script>

<div class="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm">
  <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{title}</h2>
  
  {#if loading}
    <div class="flex justify-center items-center py-8">
      <div data-testid="loading-spinner" class="w-8 h-8 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
    </div>
  {:else if error}
    <div class="text-red-500 text-center py-4">{error}</div>
  {:else if path.length === 0}
    <div class="text-gray-500 dark:text-gray-400 text-center py-4">No learning path available</div>
  {:else}
    <div class="relative" in:fade={{ duration: 300 }}>
      <!-- Path timeline connector -->
      <div class="absolute top-0 bottom-0 left-7 w-0.5 bg-indigo-200 dark:bg-indigo-800 z-0"></div>
      
      <div class="relative z-10">
        {#each path as item, index}
          <div 
            class="mb-6 flex items-start gap-4"
            in:fly={{ y: 20, duration: 300, delay: index * 100 }}
          >
            <!-- Step circle with icon -->
            <div class="relative flex-shrink-0">
              <div class="w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 shadow-sm">
                <i class="fas {getTypeIcon(item.type)} text-lg"></i>
              </div>
              <!-- Step number -->
              <div class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow">
                {index + 1}
              </div>
            </div>
            
            <!-- Content card -->
            <div class="flex-grow">
              <a 
                href={getContentUrl(item)}
                class="block bg-white dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-md transition-all duration-200 hover:bg-indigo-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
              >
                <h3 class="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                {#if item.description}
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{item.description}</p>
                {/if}
                
                {#if item.tags && item.tags.length > 0}
                  <div class="mt-2 flex flex-wrap gap-1">
                    {#each item.tags.slice(0, 2) as tag}
                      <span class="inline-flex text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                        {tag}
                      </span>
                    {/each}
                    {#if item.tags.length > 2}
                      <span class="inline-flex text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                        +{item.tags.length - 2}
                      </span>
                    {/if}
                  </div>
                {/if}
              </a>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
