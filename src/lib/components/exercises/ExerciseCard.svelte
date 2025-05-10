<!-- src/lib/components/exercises/ExerciseCard.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { logEvent } from '$lib/services/activityService';
  
  export let exercise = {
    id: '',
    title: '',
    description: '',
    category: { name: '', color: 'blue' },
    icon: 'fa-code',
    difficulty: 'beginner',
    estimatedTime: '',
    status: 'not-started' as 'not-started' | 'in-progress' | 'completed'
  };
  
  // Map difficulty to colors
  const difficultyColors = {
    beginner: 'green',
    intermediate: 'yellow',
    advanced: 'red'
  };
  
  // Get difficulty color
  const difficultyColor = difficultyColors[exercise.difficulty as keyof typeof difficultyColors] || 'blue';
  
  // Get status color and icon
  let statusColor: string;
  let statusIcon: string;
  
  $: {
    switch (exercise.status) {
      case 'completed':
        statusColor = 'text-green-600 dark:text-green-400';
        statusIcon = 'fa-circle-check';
        break;
      case 'in-progress':
        statusColor = 'text-amber-600 dark:text-amber-400';
        statusIcon = 'fa-spinner';
        break;
      default:
        statusColor = 'text-gray-400 dark:text-gray-600';
        statusIcon = 'fa-circle';
    }
  }
  
  function navigateToExercise() {
    logEvent('click_exercise', { exerciseId: exercise.id, title: exercise.title });
    goto(`/exercises/${exercise.slug || exercise.id}`);
  }
</script>

<div 
  class="group relative flex flex-col h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
  on:click={navigateToExercise}
  on:keydown={(e) => e.key === 'Enter' && navigateToExercise()}
  role="link"
  tabindex="0"
>
  <!-- Status indicator -->
  <div class="absolute top-3 right-3 z-10">
    <span class="sr-only">{exercise.status}</span>
    <i class="fas {statusIcon} {statusColor}"></i>
  </div>
  
  <!-- Category and type badges -->
  <div class="relative p-4 pb-2">
    <div class="flex flex-wrap items-center gap-2 mb-3">
      <!-- Category badge -->
      {#if exercise.category.name}
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
          {exercise.category.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
           exercise.category.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
           exercise.category.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
           'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}"
        >
          {exercise.category.name}
        </span>
      {/if}
      
      <!-- Difficulty badge -->
      {#if exercise.difficulty}
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
          {difficultyColor === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
           difficultyColor === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
           difficultyColor === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
           'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}"
        >
          {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
        </span>
      {/if}
    </div>
    
    <div class="flex items-start">
      <!-- Icon -->
      <div class="mr-3 flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 w-10 h-10 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300">
        <i class="fas {exercise.icon}"></i>
      </div>
      
      <!-- Title -->
      <h3 class="text-base font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {exercise.title}
      </h3>
    </div>
  </div>
  
  <!-- Description -->
  {#if exercise.description}
    <div class="px-4 py-2 flex-grow">
      <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
        {exercise.description}
      </p>
    </div>
  {/if}
  
  <!-- Footer with estimated time -->
  <div class="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mt-auto flex justify-between items-center">
    {#if exercise.estimatedTime}
      <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
        <i class="fas fa-clock mr-1"></i>
        <span>{exercise.estimatedTime}</span>
      </div>
    {:else}
      <div></div>
    {/if}
    
    <!-- Status text -->
    <div class="text-xs {statusColor} flex items-center">
      {#if exercise.status === 'completed'}
        <span>Completed</span>
      {:else if exercise.status === 'in-progress'}
        <span>In Progress</span>
      {:else}
        <span>Not Started</span>
      {/if}
    </div>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
