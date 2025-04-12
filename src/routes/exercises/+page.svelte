<script lang="ts">
  import { onMount } from 'svelte';
  import { isAuthenticated, loading } from '$lib/stores/authStore.js';
  import { listContent, type ContentMetadata } from '$lib/services/contentService.js';
  
  // Exercises state
  let exercises: ContentMetadata[] = [];
  let isLoading = true;
  let error: string | null = null;
  
  // Filters
  let selectedDifficulty = 'all';
  let searchQuery = '';
  
  // Load exercises on mount
  onMount(async () => {
    try {
      exercises = await listContent('exercise');
      isLoading = false;
    } catch (err) {
      console.error('Error loading exercises:', err);
      error = 'Failed to load exercises';
      isLoading = false;
    }
  });
  
  // Filter exercises based on search and difficulty
  $: filteredExercises = exercises.filter(exercise => {
    // Filter by difficulty
    if (selectedDifficulty !== 'all' && exercise.difficulty !== selectedDifficulty) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !exercise.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
</script>

<svelte:head>
  <title>LearnFlow | Exercises</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  {#if $loading}
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)] text-4xl text-indigo-500">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
  {:else if !$isAuthenticated}
    <div class="text-center py-10">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Exercises</h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-4">Please log in to access exercises.</p>
      <a 
        href="/login?redirect=/exercises"
        class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150"
      >
        Log In
      </a>
    </div>
  {:else}
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Practice Exercises</h1>
      <p class="text-gray-600 dark:text-gray-300">
        Apply what you've learned with hands-on practice exercises.
      </p>
    </div>
    
    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-1">
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              id="search"
              bind:value={searchQuery}
              class="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Search exercises..."
            />
          </div>
        </div>
        
        <div class="w-40">
          <label for="difficulty" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
          <select
            id="difficulty"
            bind:value={selectedDifficulty}
            class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
    </div>
    
    {#if isLoading}
      <div class="flex justify-center items-center py-20 text-4xl text-indigo-500">
        <i class="fas fa-spinner fa-spin"></i>
      </div>
    {:else if error}
      <div class="text-center py-10">
        <p class="text-red-500 dark:text-red-400 mb-4">{error}</p>
        <button 
          class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150"
          on:click={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    {:else if filteredExercises.length === 0}
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
        <div class="text-gray-500 dark:text-gray-400 text-5xl mb-4">
          <i class="fas fa-search"></i>
        </div>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">No exercises found</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Try adjusting your search or filters.
        </p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredExercises as exercise}
          <a href="/exercises/{exercise.id}" class="block">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 card-hover">
              <div class="p-5">
                <div class="flex justify-between items-start mb-3">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">{exercise.title}</h3>
                  {#if exercise.difficulty}
                    <span class="ml-2 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full whitespace-nowrap">
                      {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                    </span>
                  {/if}
                </div>
                
                {#if exercise.description}
                  <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{exercise.description}</p>
                {/if}
                
                <div class="flex justify-between items-center">
                  {#if exercise.estimatedTime}
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      <i class="far fa-clock mr-1"></i> {exercise.estimatedTime}
                    </span>
                  {/if}
                  
                  <span class="text-indigo-600 dark:text-indigo-400 font-medium">
                    Start Exercise <i class="fas fa-arrow-right ml-1"></i>
                  </span>
                </div>
              </div>
              
              {#if exercise.tags && exercise.tags.length > 0}
                <div class="px-5 pb-4 flex flex-wrap gap-2">
                  {#each exercise.tags.slice(0, 3) as tag}
                    <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
                      {tag}
                    </span>
                  {/each}
                  {#if exercise.tags.length > 3}
                    <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
                      +{exercise.tags.length - 3} more
                    </span>
                  {/if}
                </div>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    {/if}
  {/if}
</div> 