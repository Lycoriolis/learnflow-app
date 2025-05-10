<script lang="ts">
  import { onMount } from 'svelte';
  import { getPrerequisites, type RelatedContentItem } from '$lib/services/relatedContentService';
  import { fly, fade } from 'svelte/transition';

  export let contentId: string;
  export let contentType: 'exercise' | 'course' | 'lesson' = 'exercise';
  export let compact: boolean = false;

  let prerequisites: RelatedContentItem[] = [];
  let loading: boolean = true;
  let error: string | null = null;
  let expanded: boolean = false;

  onMount(async () => {
    try {
      loading = true;
      prerequisites = await getPrerequisites(contentId);
    } catch (err) {
      console.error('Error loading prerequisites:', err);
      error = 'Failed to load prerequisites';
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
  
  function toggleExpanded() {
    expanded = !expanded;
  }
</script>

{#if prerequisites.length > 0}
  <div 
    class="mb-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 border-l-4 border-indigo-500"
    in:fade={{ duration: 300 }}
  >
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-medium text-indigo-800 dark:text-indigo-300">
        <i class="fas fa-info-circle mr-2"></i>
        Prerequisites
      </h3>
      
      {#if !compact && prerequisites.length > 1}
        <button 
          on:click={toggleExpanded}
          class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
          aria-label={expanded ? "Collapse prerequisites" : "Expand prerequisites"}
        >
          <i class="fas fa-chevron-{expanded ? 'up' : 'down'}"></i>
        </button>
      {/if}
    </div>
    
    <p class="text-sm text-indigo-700 dark:text-indigo-300 mb-3">
      {#if compact}
        This content requires previous knowledge. Please complete the prerequisites first.
      {:else}
        To get the most from this content, we recommend completing these prerequisites first:
      {/if}
    </p>
    
    {#if compact}
      <div class="flex flex-wrap gap-2">
        {#each prerequisites as prereq}
          <a
            href={getContentUrl(prereq)}
            class="text-xs font-medium px-2 py-1 bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-700"
          >
            {prereq.title}
          </a>
        {/each}
      </div>
    {:else}
      <div class="space-y-2">
        {#each prerequisites.slice(0, expanded ? prerequisites.length : 1) as prereq, i}
          <div
            in:fly={{ y: 10, duration: 200, delay: i * 50 }}
            out:fly={{ y: -10, duration: 200 }}
          >
            <a
              href={getContentUrl(prereq)}
              class="block p-3 bg-white dark:bg-gray-800 rounded border border-indigo-200 dark:border-indigo-800 hover:shadow-md transition-all"
            >
              <div class="flex items-center">
                <div class="w-8 h-8 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center mr-3 text-indigo-600 dark:text-indigo-300">
                  <i class="fas {prereq.type === 'exercise' ? 'fa-dumbbell' : prereq.type === 'course' ? 'fa-book' : 'fa-file-alt'}"></i>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">{prereq.title}</h4>
                  {#if prereq.description}
                    <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">{prereq.description}</p>
                  {/if}
                </div>
              </div>
            </a>
          </div>
        {/each}
        
        {#if !expanded && prerequisites.length > 1}
          <div class="text-center text-xs text-indigo-600 dark:text-indigo-400 pt-1">
            +{prerequisites.length - 1} more prerequisite{prerequisites.length > 2 ? 's' : ''}
          </div>
        {/if}
      </div>
    {/if}
  </div>
{/if}
