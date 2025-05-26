<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';
  import type { ContentNode } from '$lib/services/contentService';
  
  export let course: ContentNode;
  export let isSelected: boolean = false;
  export let isCompleted: boolean = false;
  export let progress: number = 0;
  
  const dispatch = createEventDispatcher<{
    select: { course: ContentNode };
  }>();
  
  function handleSelect() {
    dispatch('select', { course });
  }
  
  function handleKeyDown(event: CustomEvent<KeyboardEvent>) {
    const keyboardEvent = event.detail;
    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
      event.preventDefault();
      dispatch('select', { course });
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

<div 
  role="button"
  tabindex="0"
  aria-pressed={isSelected}
  class="course-card relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md mb-4 cursor-pointer {isSelected ? 'border-cherry-500 bg-cherry-50 dark:bg-cherry-900/20 shadow-md' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}"
  on:click={handleSelect}
  on:keydown={handleKeyDown}
>
  <div class="flex justify-between items-start">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">{course.title}</h3>
    {#if course.level}
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
        {course.level}
      </span>
    {/if}
  </div>
  
  {#if course.description}
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{course.description}</p>
  {/if}
  
  <div class="flex flex-wrap gap-2 mb-3">
    {#if course.category}
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cherry-100 dark:bg-cherry-900/30 text-cherry-800 dark:text-cherry-400">
        {course.category}
      </span>
    {/if}
    {#if course.tags && course.tags.length > 0}
      {#each course.tags.slice(0, 3) as tag}
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
          {tag}
        </span>
      {/each}
      {#if course.tags.length > 3}
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
          +{course.tags.length - 3} more
        </span>
      {/if}
    {/if}
  </div>
  
  <div class="flex justify-between items-center">
    <span class="inline-flex items-center text-xs {statusClass} px-2.5 py-0.5 rounded-full">
      {statusText}
    </span>
    
    {#if progress > 0 && !isCompleted}
      <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div class="bg-amber-500 dark:bg-amber-400 h-2 rounded-full" style="width: {progress}%"></div>
      </div>
    {/if}
    
    <div class="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
      {#if course.duration}
        <Icon icon="mdi:clock-outline" class="w-4 h-4" />
        <span class="text-xs">{course.duration}</span>
      {/if}
    </div>
  </div>
  
  {#if isSelected}
    <div class="absolute top-2 right-2 text-cherry-500 dark:text-cherry-400">
      <Icon icon="mdi:check-circle" class="w-5 h-5" />
    </div>
  {/if}
</div>
