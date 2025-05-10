<!-- src/lib/components/RelatedContent.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { findRelatedContent, getPrerequisites, type RelatedContentItem } from '$lib/services/relatedContentService';
  
  export let contentId: string;
  export let contentType: 'course' | 'exercise' | 'lesson' = 'exercise';
  export let title = 'Related Content';
  export let showPrerequisites = true;
  export let maxItems = 4;
  
  let relatedItems: RelatedContentItem[] = [];
  let prerequisites: RelatedContentItem[] = [];
  let isLoading = true;
  
  onMount(async () => {
    isLoading = true;
    
    try {
      // Load related content and prerequisites in parallel
      const [relatedResults, prereqResults] = await Promise.all([
        findRelatedContent(contentId, { limit: maxItems }),
        showPrerequisites ? getPrerequisites(contentId) : Promise.resolve([])
      ]);
      
      // Store the results
      prerequisites = prereqResults;
      
      // Filter out prerequisites from related content (to avoid duplicates)
      if (prerequisites.length > 0) {
        const prereqIds = prerequisites.map(item => item.id);
        relatedItems = relatedResults.filter(item => !prereqIds.includes(item.id));
      } else {
        relatedItems = relatedResults;
      }
    } catch (error) {
      console.error('Error loading related content:', error);
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
        // Assuming lessons are accessed via their parent course
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
</script>

<div class="related-content-container">
  <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h2>
  
  {#if isLoading}
    <div class="flex justify-center py-6">
      <div class="loader w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else}
    <!-- Prerequisites Section -->
    {#if prerequisites.length > 0}
      <div class="prerequisites-section mb-6">
        <h3 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
          <i class="fas fa-clipboard-check mr-2 text-amber-500"></i>
          Prerequisites
        </h3>
        
        <div class="grid grid-cols-1 gap-3">
          {#each prerequisites as item}
            <div 
              class="prerequisite-item p-3 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30 rounded-lg cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-800/50 transition-colors"
              on:click={() => navigateToContent(item)}
              on:keydown={(e) => e.key === 'Enter' && navigateToContent(item)}
              tabindex="0"
              role="link"
            >
              <div class="flex items-start">
                <div class="content-type-icon flex-shrink-0 w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-700 flex items-center justify-center text-amber-700 dark:text-amber-200 mr-3">
                  <i class="fas {getContentTypeIcon(item.type)} text-sm"></i>
                </div>
                
                <div class="flex-grow">
                  <h4 class="text-sm font-medium text-gray-800 dark:text-gray-200">{item.title}</h4>
                  <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{item.description}</p>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    <!-- Related Content Section -->
    {#if relatedItems.length > 0}
      <div class="related-items-section">
        <h3 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 {prerequisites.length === 0 ? 'hidden' : ''}">
          <i class="fas fa-shuffle mr-2 text-indigo-500"></i>
          Related Content
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          {#each relatedItems as item}
            <div 
              class="related-item p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              on:click={() => navigateToContent(item)}
              on:keydown={(e) => e.key === 'Enter' && navigateToContent(item)}
              tabindex="0"
              role="link"
            >
              <div class="flex items-start">
                <div class="content-type-icon flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-3">
                  <i class="fas {getContentTypeIcon(item.type)} text-sm"></i>
                </div>
                
                <div class="flex-grow">
                  <div class="flex justify-between items-start">
                    <h4 class="text-sm font-medium text-gray-800 dark:text-gray-200">{item.title}</h4>
                    <span class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full ml-2 flex-shrink-0">
                      {item.type}
                    </span>
                  </div>
                  
                  <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{item.description}</p>
                  
                  {#if item.tags.length > 0}
                    <div class="mt-2 flex flex-wrap gap-1">
                      {#each item.tags.slice(0, 2) as tag}
                        <span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      {/each}
                      {#if item.tags.length > 2}
                        <span class="text-xs text-gray-500 dark:text-gray-500">+{item.tags.length - 2}</span>
                      {/if}
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else if prerequisites.length === 0}
      <div class="empty-state text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <i class="fas fa-link-slash text-2xl text-gray-400 dark:text-gray-600 mb-2"></i>
        <p class="text-gray-600 dark:text-gray-400 text-sm">No related content found.</p>
      </div>
    {/if}
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
