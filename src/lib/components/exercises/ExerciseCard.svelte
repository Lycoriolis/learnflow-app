<script lang="ts">
  import type { ServerContentNode } from '$lib/server/contentService';
  import Icon from '@iconify/svelte';

  export let exercise: ServerContentNode;
  export let className = '';

  let href: string;
  // Use a reactive block to update href if exercise changes
  $: {
    if (exercise.contentPath) {
      // contentPath is already in the format like /exercises/maths/mpsi-maths or /exercises/maths/mpsi-maths/exercise-1
      // For the new routing structure, we need to remove the /exercises prefix since our route is /exercises/[...contentPath]
      const relativePath = exercise.contentPath.replace(/^\/exercises\/?/, '');
      href = relativePath ? `/exercises/${relativePath}` : '/exercises';
    } else {
      // Fallback if contentPath is somehow missing (should be rare)
      const basePath = '/exercises';
      const categoryPart = exercise.categoryPath ? exercise.categoryPath : (exercise.category || 'uncategorized');
      const idPart = exercise.id.endsWith('_index') ? exercise.id.replace('_index', '') : exercise.id;
      
      if (categoryPart && idPart && categoryPart !== idPart) {
        href = `${basePath}/${categoryPart}/${idPart}`.replace(/\/\//g, '/');
      } else if (idPart) {
        href = `${basePath}/${idPart}`.replace(/\/\//g, '/');
      } else {
        href = '#'; // Absolute fallback
      }
      console.warn('ExerciseCard: Exercise missing contentPath, using fallback href:', href, exercise);
    }
  }

</script>

<a {href} class="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 {className} group">
  <div class="p-4 flex flex-col h-full">
    <div class="flex-grow">
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600">
          {exercise.title || 'Untitled Exercise'}
        </h3>
        {#if exercise.difficulty}
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 flex-shrink-0">
          {exercise.difficulty}
        </span>
        {/if}
      </div>
      
      {#if exercise.description}
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
        {exercise.description}
      </p>
      {/if}
      
      <div class="flex flex-wrap gap-2 mb-4">
        {#if exercise.category && exercise.itemType !== 'course' && exercise.itemType !== 'theme' && !(exercise.id && exercise.id.endsWith('_index'))}
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cherry-100 dark:bg-cherry-900/30 text-cherry-800 dark:text-cherry-400">
            {exercise.category}
          </span>
        {/if}
        {#if exercise.tags && exercise.tags.length > 0}
          {#each exercise.tags.slice(0, 2) as tag}
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
              {tag}
            </span>
          {/each}
          {#if exercise.tags.length > 2}
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
              +{exercise.tags.length - 2} more
            </span>
          {/if}
        {/if}
      </div>
    </div>
    
    <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-2">
        {#if (exercise.itemType === 'exercise' || (exercise.id && exercise.id.endsWith('_index'))) && exercise.estimatedTime}
        <Icon icon="mdi:clock-outline" class="h-4 w-4 text-gray-400" />
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {exercise.estimatedTime}{typeof exercise.estimatedTime === 'number' || (typeof exercise.estimatedTime === 'string' && !isNaN(parseInt(exercise.estimatedTime))) ? ' min' : ''}
        </span>
        {/if}
      </div>
      
      <span class="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:underline">
        {#if exercise.id && exercise.id.endsWith('_index')}View Overview{:else}View Exercise{/if}
        <Icon icon="mdi:arrow-right" class="inline-block h-4 w-4 ml-1" />
      </span>
    </div>
  </div>
</a>