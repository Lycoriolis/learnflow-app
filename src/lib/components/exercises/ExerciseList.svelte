<!-- src/lib/components/exercises/ExerciseList.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import ExerciseFilters from './ExerciseFilters.svelte';
  import { 
    initExerciseFilterService, 
    filteredExercises, 
    setFilters, 
    type Exercise 
  } from '$lib/services/exerciseFilterService';
  
  export let exercises: Exercise[] = [];
  export let title = 'Exercises';
  export let showFilters = true;
  
  let isLoading = true;
  let uniqueTags: string[] = [];
  
  // Extract unique tags from exercises
  $: {
    const tagSet = new Set<string>();
    exercises.forEach(exercise => {
      if (exercise.tags && exercise.tags.length > 0) {
        exercise.tags.forEach(tag => tagSet.add(tag));
      }
    });
    uniqueTags = Array.from(tagSet).sort();
  }
  
  onMount(() => {
    // Initialize the filter service with the provided exercises
    initExerciseFilterService(exercises);
    isLoading = false;
  });
  
  // Handle filter changes from the ExerciseFilters component
  function handleFilterChange(event: CustomEvent) {
    const filters = event.detail;
    setFilters({
      status: filters.status,
      type: filters.type,
      difficulty: filters.difficulty,
      tags: filters.tags,
      sortBy: filters.sortBy
    });
  }
  
  // Navigate to exercise details using slug route pattern
  function goToExercise(exerciseId: string) {
    // Using the slug-based route as specified in routing documentation
    goto(`/exercises/${exerciseId}`);
  }
  
  // Helper function to get badge color based on difficulty
  function getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  }
  
  // Helper function to get icon based on exercise type
  function getExerciseTypeIcon(type: string): string {
    switch (type) {
      case 'multiple-choice':
        return 'fa-list-ul';
      case 'coding':
        return 'fa-code';
      case 'written':
        return 'fa-pen-to-square';
      case 'interactive':
        return 'fa-puzzle-piece';
      default:
        return 'fa-graduation-cap';
    }
  }
  
  // Helper function to get status color
  function getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'text-green-500 dark:text-green-400';
      case 'in-progress':
        return 'text-blue-500 dark:text-blue-400';
      default:
        return 'text-gray-400 dark:text-gray-500';
    }
  }
  
  // Helper function to get status icon
  function getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return 'fa-check-circle';
      case 'in-progress':
        return 'fa-clock';
      default:
        return 'fa-circle';
    }
  }
</script>

<div class="exercise-list-container">
  <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
  
  {#if showFilters}
    <ExerciseFilters 
      on:change={handleFilterChange} 
      availableTags={uniqueTags}
      includeTags={uniqueTags.length > 0}
    />
  {/if}
  
  {#if isLoading}
    <div class="flex justify-center py-8">
      <div class="loader w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if $filteredExercises.length === 0}
    <div class="empty-state py-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
      <i class="fas fa-filter text-3xl text-gray-400 dark:text-gray-600 mb-3"></i>
      <p class="text-gray-600 dark:text-gray-400">No exercises match your filters.</p>
      <button 
        class="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
        on:click={() => setFilters({
          status: [],
          type: [],
          difficulty: [],
          tags: [],
          sortBy: 'newest'
        })}
      >
        Clear filters
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {#each $filteredExercises as exercise}
        <div 
          class="exercise-card bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
          on:click={() => goToExercise(exercise.id)}
          on:keydown={(e) => e.key === 'Enter' && goToExercise(exercise.id)}
          tabindex="0"
          role="link"
        >
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{exercise.title}</h3>
              <div class="status-icon {getStatusColor(exercise.status || 'not-started')}">
                <i class="fas {getStatusIcon(exercise.status || 'not-started')}"></i>
              </div>
            </div>
            
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{exercise.description}</p>
            
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <span class="bg-gray-100 dark:bg-gray-700 rounded-full p-1.5 text-gray-600 dark:text-gray-400 mr-2">
                  <i class="fas {getExerciseTypeIcon(exercise.type)} text-xs"></i>
                </span>
                <span class="text-xs text-gray-600 dark:text-gray-400">{exercise.type}</span>
              </div>
              
              <div class="badge {getDifficultyColor(exercise.difficulty)} text-xs px-2 py-1 rounded-full">
                {exercise.difficulty}
              </div>
            </div>
          </div>
          
          {#if exercise.tags.length > 0}
            <div class="tags-section px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
              <div class="flex flex-wrap gap-2">
                {#each exercise.tags.slice(0, 3) as tag}
                  <button 
                    class="tag text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                    on:click|stopPropagation={() => {
                      setFilters({
                        status: [],
                        type: [],
                        difficulty: [],
                        tags: [tag],
                        sortBy: 'newest'
                      });
                    }}
                  >
                    {tag}
                  </button>
                {/each}
                {#if exercise.tags.length > 3}
                  <span class="text-xs text-gray-500 dark:text-gray-500">+{exercise.tags.length - 3} more</span>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .exercise-card {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .tags-section {
    margin-top: auto;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
