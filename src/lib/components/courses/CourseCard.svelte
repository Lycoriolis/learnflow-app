<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';
  import type { CourseStructure } from '$lib/types/shared';
  import { navigateToCourse } from '$lib/utils/navigation';

  export let course: CourseStructure;
  export let className = '';
  export let isSelected: boolean = false;
  export let isCompleted: boolean = false;
  export let progress: number = 0;
  
  const dispatch = createEventDispatcher<{
    select: { course: CourseStructure };
  }>();
  
  function handleSelect() {
    dispatch('select', { course });
  }
  
  function handleViewDetails(event: MouseEvent) {
    event.stopPropagation(); // Prevent triggering the card's click event
    if (course.id) {
      navigateToCourse(course.id);
    }
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect();
    }
  }
  
  $: statusClass = isCompleted ? 
    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 
    progress > 0 ? 
      'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 
      'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400';
  
  $: statusText = isCompleted ? 
    'Completed' : 
    progress > 0 ? 
      `In Progress (${Math.round(progress)}%)` : 
      'Not Started';
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 {className}">
  <div class="relative h-48">
    {#if course.thumbnail}
      <img
        src={course.thumbnail}
        alt={course.title}
        class="w-full h-full object-cover"
      />
    {:else}
      <div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <Icon icon="mdi:book-open-variant" class="h-12 w-12 text-gray-400" />
      </div>
    {/if}
    <div class="absolute top-2 right-2">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
        {course.difficulty}
      </span>
    </div>
  </div>
  
  <div class="p-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {course.title}
    </h3>
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
      {course.description}
    </p>
    
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <Icon icon="mdi:clock-outline" class="h-4 w-4 text-gray-400" />
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {course.totalDuration} min
        </span>
      </div>
      
      <div class="flex items-center space-x-2">
        <Icon icon="mdi:account-group" class="h-4 w-4 text-gray-400" />
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {course.enrolledCount} enrolled
        </span>
      </div>
    </div>
  </div>
</div>

<style>
  /* Use standard CSS with line-clamp */
  :global(.line-clamp-2) {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 2;  /* Standard property for future compatibility */
  }
</style>