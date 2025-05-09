<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { logStart, logEnd } from '$lib/services/activityService.js';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
  import { loadExercise, type ContentItem } from '$lib/services/enhancedContentService.js';
  import ExerciseRating from '$lib/components/ExerciseRating.svelte';

  let exercise: ContentItem | null = null;
  let loading = true;
  let viewId: string | null = null;
  $: slug = $page.params.slug;

  onMount(async () => {
    viewId = await logStart('view_exercise', slug);
    exercise = await loadExercise(slug);
    loading = false;
  });
  
  onDestroy(() => {
    if (viewId) logEnd(viewId);
  });
</script>

<svelte:head>
  <title>{exercise?.title || 'Exercise'} | LearnFlow</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  {#if loading}
    <div class="flex justify-center items-center py-12">
      <div data-testid="loading-spinner" class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
    </div>
  {:else if !exercise}
    <div class="text-center py-12">
      <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Exercise Not Found</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">The exercise you're looking for doesn't exist or has been moved.</p>
      <a href="/exercises" class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        <i class="fas fa-arrow-left mr-2"></i> Back to Exercises
      </a>
    </div>
  {:else}
    <div class="mb-6">
      <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
        <a href="/exercises" class="hover:text-indigo-600 dark:hover:text-indigo-400">Exercises</a>
        <i class="fas fa-chevron-right text-xs"></i>
        <span>{exercise.title}</span>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{exercise.title}</h1>
      
      <div class="flex flex-wrap gap-4 mb-4">
        {#if exercise.difficulty}
          <div class="flex items-center">
            <span class="text-gray-600 dark:text-gray-400 mr-2">Difficulty:</span>
            <span class={`px-2 py-1 rounded text-sm ${
              exercise.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
              exercise.difficulty === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
              'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}>
              {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
            </span>
          </div>
        {/if}
        
        {#if exercise.estimatedTime}
          <div class="flex items-center">
            <i class="far fa-clock text-gray-600 dark:text-gray-400 mr-2"></i>
            <span class="text-gray-700 dark:text-gray-300">{exercise.estimatedTime}</span>
          </div>
        {/if}
      </div>
      
      {#if exercise.tags && exercise.tags.length > 0}
        <div class="flex flex-wrap gap-2 mb-4">
          {#each exercise.tags as tag}
            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded">
              {tag}
            </span>
          {/each}
        </div>
      {/if}
      
      {#if exercise.description}
        <p class="text-gray-700 dark:text-gray-300 mb-6">{exercise.description}</p>
      {/if}
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
      <div class="p-6">
        <MarkdownRenderer content={exercise.content} className="prose-lg" />
      </div>
    </div>
    
    <div class="mt-8">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">How was this exercise?</h2>
      <ExerciseRating exerciseId={exercise.id} />
    </div>
    
    <div class="flex justify-between mt-8">
      <a 
        href="/exercises" 
        class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        <i class="fas fa-arrow-left mr-2"></i> Back to Exercises
      </a>
      
      <button 
        class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        on:click={() => alert('Exercise completed! This would typically save your progress.')}
      >
        Mark as Complete <i class="fas fa-check ml-2"></i>
      </button>
    </div>
  {/if}
</div>
