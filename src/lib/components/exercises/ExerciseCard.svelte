<script lang="ts">
  import type { Exercise } from '$lib/types/shared';
  import Icon from '@iconify/svelte';

  export let exercise: Exercise;
  export let className = '';
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 {className}">
  <div class="p-4">
    <div class="flex items-start justify-between mb-3">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {exercise.title}
      </h3>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
        {exercise.difficulty}
      </span>
    </div>
    
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
      {exercise.description}
    </p>
    
    <div class="flex flex-wrap gap-2 mb-4">
      {#if exercise.category}
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cherry-100 dark:bg-cherry-900/30 text-cherry-800 dark:text-cherry-400">
          {exercise.category}
        </span>
      {/if}
      {#if exercise.tags && exercise.tags.length > 0}
        {#each exercise.tags.slice(0, 3) as tag}
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
            {tag}
          </span>
        {/each}
        {#if exercise.tags.length > 3}
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
            +{exercise.tags.length - 3} more
          </span>
        {/if}
      {/if}
    </div>
    
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <Icon icon="mdi:clock-outline" class="h-4 w-4 text-gray-400" />
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {exercise.estimatedTime} min
        </span>
      </div>
      
      <div class="flex items-center space-x-2">
        <Icon icon="mdi:account-group" class="h-4 w-4 text-gray-400" />
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {exercise.completedCount} completed
        </span>
      </div>
    </div>
  </div>
</div> 