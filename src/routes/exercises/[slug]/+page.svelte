<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { logStart, logEnd } from '$lib/services/activityService.js';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
  import ExerciseRating from '$lib/components/ExerciseRating.svelte';
  import ExerciseComponent from '$lib/components/exercises/ExerciseComponent.svelte';
  import RelatedContent from '$lib/components/content/RelatedContent.svelte';
  import LearningPath from '$lib/components/content/LearningPath.svelte';
  import PrerequisiteIndicator from '$lib/components/content/PrerequisiteIndicator.svelte';
  import { updateExerciseProgress } from '$lib/services/progressService';
  import { user } from '$lib/stores/authStore';
  import { fade } from 'svelte/transition';

  export let data;

  let viewId: string | null = null;
  let exercise = data.exercise;
  let progress = data.progress;
  let relatedContent = data.relatedContent || [];
  let prerequisites = data.prerequisites || [];
  let loading = !exercise;
  let showLearningPath = false;
  
  // Handle progress tracking
  onMount(async () => {
    const exerciseIdFromParam = $page.params.slug; // This is the slug from URL, likely category/id
    viewId = await logStart('view_exercise', exerciseIdFromParam);
    
    // Mark as started if authenticated
    if ($user && exercise && exercise.slug) { // Ensure exercise and exercise.slug exist
      await updateExerciseProgress(exercise.slug, { // Use exercise.slug as the key
        started: true,
        lastViewed: new Date().toISOString()
      });
    }
  });
  
  onDestroy(() => {
    if (viewId) logEnd(viewId);
  });
  
  // Handle completion of exercise
  async function handleExerciseComplete(event) {
    if (!$user || !exercise || !exercise.slug) return; // Ensure exercise and exercise.slug exist
    
    const { score, maxScore } = event.detail;
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 100;
    
    await updateExerciseProgress(exercise.slug, { // Use exercise.slug as the key
      completed: true,
      score: percentage,
      lastCompleted: new Date().toISOString()
    });
    
    // Refresh progress data
    progress = {
      ...progress,
      completed: true,
      score: percentage,
      lastCompleted: new Date().toISOString()
    };
  }
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
      
      <!-- Prerequisites indicator -->
      {#if exercise.id}
        <PrerequisiteIndicator contentId={exercise.id} contentType="exercise" />
      {/if}
      
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
    
    <!-- Related Content -->
    {#if exercise.id}
      <RelatedContent contentId={exercise.id} contentType="exercise" />
    {/if}
    
    <div class="flex justify-between mt-8">
      <a 
        href="/exercises" 
        class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        <i class="fas fa-arrow-left mr-2"></i> Back to Exercises
      </a>
      
      <button 
        class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        on:click={() => {
          updateExerciseProgress(exercise.id);
          showLearningPath = true;
        }}
      >
        Mark as Complete <i class="fas fa-check ml-2"></i>
      </button>
    </div>
    
    <!-- Learning Path - displayed after exercise completion -->
    {#if showLearningPath && exercise.id}
      <div class="mt-8" transition:fade={{ duration: 300 }}>
        <LearningPath startContentId={exercise.id} title="What to learn next" />
      </div>
    {/if}
  {/if}
</div>
