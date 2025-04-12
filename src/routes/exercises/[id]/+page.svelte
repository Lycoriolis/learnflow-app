<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { isAuthenticated, loading } from '$lib/stores/authStore.js';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
  import { loadContent } from '$lib/services/contentService.js';
  
  // Exercise state
  let exercise: any = null;
  let content = '';
  let isLoading = true;
  let error: string | null = null;
  
  // Get exercise ID from the route params
  $: exerciseId = $page.params.id;
  
  // Load the exercise content
  async function loadExercise() {
    isLoading = true;
    error = null;
    
    try {
      const result = await loadContent('exercise', exerciseId);
      
      if (result) {
        exercise = result;
        content = result.content;
      } else {
        error = 'Exercise not found';
      }
    } catch (err) {
      console.error('Error loading exercise:', err);
      error = 'Failed to load exercise content';
    } finally {
      isLoading = false;
    }
  }
  
  // Load the exercise when the component mounts or the ID changes
  $: if (exerciseId) {
    loadExercise();
  }
</script>

<svelte:head>
  <title>LearnFlow | {exercise ? exercise.title : 'Exercise'}</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  {#if $loading}
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)] text-4xl text-indigo-500">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
  {:else if !$isAuthenticated}
    <div class="text-center py-10">
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-4">Please log in to access exercises.</p>
      <a 
        href="/login?redirect=/exercises/{exerciseId}"
        class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150"
      >
        Log In
      </a>
    </div>
  {:else if isLoading}
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)] text-4xl text-indigo-500">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
  {:else if error}
    <div class="text-center py-10">
      <h1 class="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h1>
      <p class="text-gray-600 dark:text-gray-300">{error}</p>
      <a href="/exercises" class="mt-6 inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150">
        Back to Exercises
      </a>
    </div>
  {:else if exercise}
    <!-- Exercise Header -->
    <div class="mb-8">
      <div class="flex justify-between items-start">
        <div>
          <a href="/exercises" class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center mb-2">
            <i class="fas fa-arrow-left mr-2"></i> Back to all exercises
          </a>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{exercise.title}</h1>
          
          {#if exercise.tags && exercise.tags.length > 0}
            <div class="mt-3 flex flex-wrap gap-2">
              {#each exercise.tags as tag}
                <span class="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">
                  {tag}
                </span>
              {/each}
            </div>
          {/if}
        </div>
        
        <div class="flex flex-col items-end">
          {#if exercise.difficulty}
            <span class="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">
              {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
            </span>
          {/if}
          
          {#if exercise.estimatedTime}
            <span class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <i class="far fa-clock mr-1"></i> {exercise.estimatedTime}
            </span>
          {/if}
        </div>
      </div>
      
      {#if exercise.description}
        <p class="mt-4 text-gray-600 dark:text-gray-300">{exercise.description}</p>
      {/if}
    </div>
    
    <!-- Exercise Content -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-8">
      <div class="p-6">
        <MarkdownRenderer content={content} className="bg-white dark:bg-gray-800" />
      </div>
    </div>
    
    <!-- Exercise Submission Form -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Solution</h2>
        
        <div class="mb-4">
          <textarea 
            class="w-full h-64 p-3 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your solution here..."
          ></textarea>
        </div>
        
        <div class="flex justify-end">
          <button 
            class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150"
          >
            Submit Solution
          </button>
        </div>
      </div>
    </div>
  {/if}
</div> 