<!-- src/routes/exercises/[id]/+page.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { getExerciseById, type ContentMetadata } from '$lib/services/enhancedContentService';
  import { logStart, logEnd, logEvent } from '$lib/services/activityService';
  import ExerciseComponent from '$lib/components/exercises/ExerciseComponent.svelte';
  import LearningPath from '$lib/components/LearningPath.svelte';
  import { updateExerciseProgress } from '$lib/services/progressService';
  import { user } from '$lib/stores/authStore';
  import { fly } from 'svelte/transition';
  
  let exercise: ContentMetadata | null = null;
  let loading = true;
  let error: string | null = null;
  let viewId: string | null = null;
  let showLearningPath = false;
  
  onMount(async () => {
    try {
      const exerciseId = $page.params.id;
      
      // Log activity
      viewId = await logStart('view_exercise', { exerciseId });
      
      // Fetch exercise
      exercise = await getExerciseById(exerciseId);
      
      // Update progress - mark as started
      if ($user && exercise && exercise.slug) {
        await updateExerciseProgress(exercise.slug, {
          started: true,
          lastViewed: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Error loading exercise:', err);
      error = 'Failed to load exercise content. Please try again later.';
    } finally {
      loading = false;
    }
  });
  
  onDestroy(() => {
    if (viewId) logEnd(viewId);
  });
  
  async function handleExerciseComplete(event: CustomEvent) {
    const { exerciseId, score } = event.detail;
    
    if (!$user || !exercise || !exercise.slug) return;
    
    try {
      // Update progress - mark as completed
      await updateExerciseProgress(exercise.slug, {
        started: true,
        completed: true,
        lastViewed: new Date().toISOString(),
        score
      });
      
      // Log completion
      logEvent('complete_exercise', { exerciseId, score });
      
      // Show learning path option
      showLearningPath = true;
    } catch (err) {
      console.error('Error updating exercise progress:', err);
    }
  }
  
  async function handleExerciseRating(event: CustomEvent) {
    const { exerciseId, rating, feedback } = event.detail;
    
    try {
      // Log rating
      logEvent('rate_exercise', { exerciseId, rating, feedback });
      
      // In a real implementation, this would send the rating to the backend
    } catch (err) {
      console.error('Error submitting exercise rating:', err);
    }
  }
</script>

<svelte:head>
  {#if exercise}
    <title>{exercise.title} | LearnFlow</title>
    <meta name="description" content={exercise.description || `Exercise: ${exercise.title}`} />
  {:else}
    <title>Exercise | LearnFlow</title>
    <meta name="description" content="Complete this exercise to enhance your skills" />
  {/if}
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  <!-- Back link -->
  <a href="/exercises" class="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-6">
    <i class="fas fa-arrow-left mr-2"></i>
    Back to Exercises
  </a>
  
  {#if loading}
    <div class="flex justify-center items-center py-24">
      <div class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
    </div>
  {:else if error}
    <div class="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg text-center">
      <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
      <p class="text-red-600 dark:text-red-300 mb-3">{error}</p>
      <a href="/exercises" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
        Return to Exercises
      </a>
    </div>
  {:else if exercise}
    <!-- Exercise Component -->
    <div class="mb-8">
      <ExerciseComponent 
        {exercise} 
        showRelatedContent={true}
        showRatingAfterCompletion={true}
        on:complete={handleExerciseComplete}
        on:rate={handleExerciseRating}
      />
    </div>
    
    <!-- Learning Path - shown after completion -->
    {#if showLearningPath && exercise?.id}
      <div in:fly={{ y: 20, duration: 300 }}>
        <LearningPath startContentId={exercise.id} />
      </div>
    {/if}
  {:else}
    <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
      <i class="fas fa-search text-gray-400 text-3xl mb-4"></i>
      <p class="text-gray-600 dark:text-gray-400 mb-3">Exercise not found.</p>
      <a href="/exercises" class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
        Browse Exercises
      </a>
    </div>
  {/if}
</div>
