<!-- src/lib/components/LearningPath.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { generateLearningPath, type RelatedContentItem } from '$lib/services/relatedContentService';
  
  export let startContentId: string;
  export let goalContentId: string | undefined = undefined;
  export let title = 'Learning Path';
  export let maxPathLength = 6;
  export let pathDescription = goalContentId 
    ? 'Follow this path to reach your learning goal'
    : 'Recommended path based on this content';
  
  let pathItems: RelatedContentItem[] = [];
  let isLoading = true;
  let error: string | null = null;
  
  onMount(async () => {
    isLoading = true;
    
    try {
      // Generate learning path
      pathItems = await generateLearningPath(startContentId, goalContentId, {
        maxLength: maxPathLength
      });
      
      if (pathItems.length <= 1) {
        error = 'Could not generate a learning path';
      }
    } catch (err) {
      console.error('Error generating learning path:', err);
      error = 'Failed to generate learning path';
    } finally {
      isLoading = false;
    }
  });
  
  function navigateToContent(item: RelatedContentItem) {
    let path = '';
    
    switch (item.type) {
      case 'course':
        path = `/courses/${item.id}`;
        break;
      case 'lesson':
        path = `/courses/lessons/${item.id}`;
        break;
      case 'exercise':
        path = `/exercises/${item.slug || item.id}`;
        break;
    }
    
    goto(path);
  }
  
  // Helper to get appropriate icon for content type
  function getContentTypeIcon(type: string): string {
    switch (type) {
      case 'course':
        return 'fa-book';
      case 'lesson':
        return 'fa-book-open';
      case 'exercise':
        return 'fa-code';
      default:
        return 'fa-graduation-cap';
    }
  }
  
  // Helper to get appropriate colors for path items
  function getItemColors(index: number, isActive = false): { bg: string, border: string, text: string } {
    if (index === 0) { // Starting point
      return {
        bg: isActive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-700 dark:text-green-300'
      };
    } else if (index === pathItems.length - 1 && goalContentId) { // Goal
      return {
        bg: isActive ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-700 dark:text-purple-300'
      };
    } else { // Intermediate steps
      return {
        bg: isActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300'
      };
    }
  }
</script>

<div class="learning-path-container">
  <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h2>
  <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{pathDescription}</p>
  
  {#if isLoading}
    <div class="flex justify-center py-8">
      <div class="loader w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if error}
    <div class="error-message bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
      <i class="fas fa-triangle-exclamation text-red-500 dark:text-red-400 text-xl mb-2"></i>
      <p class="text-red-600 dark:text-red-300">{error}</p>
    </div>
  {:else if pathItems.length > 0}
    <div class="learning-path relative">
      <!-- Path line -->
      <div class="path-line absolute left-4 top-8 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
      
      <!-- Path items -->
      <div class="path-items space-y-4">
        {#each pathItems as item, index}
          <div 
            class="path-item relative pl-12 pr-4 py-3 border rounded-lg cursor-pointer transition-colors hover:shadow-md"
            class:current={index === 0}
            class:goal={index === pathItems.length - 1 && goalContentId}
            class={`${getItemColors(index).border} ${getItemColors(index, false).bg} hover:${getItemColors(index, true).bg}`}
            on:click={() => navigateToContent(item)}
            on:keydown={(e) => e.key === 'Enter' && navigateToContent(item)}
            tabindex="0"
            role="link"
          >
            <!-- Circle marker -->
            <div class="absolute left-2 top-4 w-5 h-5 rounded-full border-2 {getItemColors(index).border} {getItemColors(index).bg} flex items-center justify-center">
              <span class="text-xs font-bold">{index + 1}</span>
            </div>
            
            <div class="flex justify-between items-start">
              <div>
                <span class="inline-block px-2 py-0.5 rounded text-xs {getItemColors(index).text} mb-1">
                  {index === 0 ? 'Start' : index === pathItems.length - 1 && goalContentId ? 'Goal' : item.type}
                </span>
                <h3 class="text-sm font-medium text-gray-800 dark:text-gray-200">{item.title}</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
              </div>
              
              <div class="content-type-icon flex-shrink-0 w-8 h-8 rounded-full {getItemColors(index).bg} flex items-center justify-center {getItemColors(index).text} ml-2">
                <i class="fas {getContentTypeIcon(item.type)} text-sm"></i>
              </div>
            </div>
            
            {#if item.tags.length > 0}
              <div class="mt-2 flex flex-wrap gap-1">
                {#each item.tags.slice(0, 3) as tag}
                  <span class="text-xs bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600">
                    {tag}
                  </span>
                {/each}
                {#if item.tags.length > 3}
                  <span class="text-xs text-gray-500 dark:text-gray-500">+{item.tags.length - 3}</span>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="empty-state text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <i class="fas fa-route text-3xl text-gray-400 dark:text-gray-600 mb-3"></i>
      <p class="text-gray-600 dark:text-gray-400">No learning path available.</p>
    </div>
  {/if}
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
