<!-- src/lib/components/exercises/ExerciseComponent.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { ContentMetadata } from '$lib/services/enhancedContentService';
  import MultipleChoiceExercise from './types/MultipleChoiceExercise.svelte';
  import CodingExercise from './types/CodingExercise.svelte';
  import WrittenExercise from './types/WrittenExercise.svelte';
  import RelatedContent from '../RelatedContent.svelte';
  
  export let exercise: ContentMetadata;
  export let showRelatedContent = true;
  export let showRatingAfterCompletion = true;
  
  type ExerciseType = 'multiple-choice' | 'coding' | 'written' | 'unknown';
  
  const dispatch = createEventDispatcher<{
    complete: { exerciseId: string; score: number };
    rate: { exerciseId: string; rating: number; feedback?: string };
  }>();
  
  let exerciseType: ExerciseType = 'unknown';
  let exerciseCompleted = false;
  let exerciseScore = 0;
  let showRating = false;
  
  // Determine exercise type from metadata
  $: {
    if (exercise) {
      if (exercise.type) {
        // If type is explicitly specified
        exerciseType = exercise.type as ExerciseType;
      } else if (exercise.tags && Array.isArray(exercise.tags)) {
        // Determine from tags
        const tags = exercise.tags.map(tag => tag.toLowerCase());
        
        if (tags.includes('multiple-choice') || tags.includes('quiz')) {
          exerciseType = 'multiple-choice';
        } else if (tags.includes('coding') || tags.includes('code')) {
          exerciseType = 'coding';
        } else if (tags.includes('written') || tags.includes('essay')) {
          exerciseType = 'written';
        } else {
          // Default to multiple-choice if no specific type is identified
          exerciseType = 'multiple-choice';
        }
      } else {
        // Default fallback
        exerciseType = 'multiple-choice';
      }
    }
  }
  
  function handleExerciseSubmit(event: CustomEvent) {
    const result = event.detail;
    
    // Mark as completed (in a real app, this would be persisted)
    exerciseCompleted = true;
    
    // Store the score (0-1 range)
    exerciseScore = result.score || (result.correct ? 1 : 0);
    
    // Show rating if enabled
    if (showRatingAfterCompletion) {
      showRating = true;
    }
    
    // Dispatch completion event for parent components
    dispatch('complete', {
      exerciseId: exercise.id || '',
      score: exerciseScore
    });
  }
  
  function handleRatingSubmit(event: CustomEvent) {
    const { rating, feedback } = event.detail;
    
    // Dispatch rating event
    dispatch('rate', {
      exerciseId: exercise.id || '',
      rating,
      feedback
    });
    
    // Hide rating component
    showRating = false;
  }
</script>

<div class="exercise-component">
  <!-- Exercise header -->
  <div class="exercise-header mb-6">
    {#if exercise.title}
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{exercise.title}</h2>
    {/if}
    
    <div class="exercise-metadata flex flex-wrap gap-2">
      {#if exercise.difficulty}
        <span class="px-2 py-1 text-xs rounded-full
          {exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
           exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
           exercise.difficulty === 'advanced' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
           'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}"
        >
          {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
        </span>
      {/if}
      
      <span class="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
        {exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1).replace('-', ' ')}
      </span>
      
      {#if exercise.estimatedTime}
        <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 flex items-center">
          <i class="fas fa-clock mr-1"></i>
          {exercise.estimatedTime}
        </span>
      {/if}
    </div>
  </div>
  
  <!-- Exercise content -->
  <div class="exercise-content mb-8">
    {#if exerciseType === 'multiple-choice'}
      <MultipleChoiceExercise 
        {exercise} 
        on:submit={handleExerciseSubmit}
      />
    {:else if exerciseType === 'coding'}
      <CodingExercise 
        {exercise} 
        on:submit={handleExerciseSubmit}
      />
    {:else if exerciseType === 'written'}
      <WrittenExercise 
        {exercise} 
        on:submit={handleExerciseSubmit}
      />
    {:else}
      <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
        <p class="text-gray-700 dark:text-gray-300">
          Unknown exercise type. Please check the exercise metadata.
        </p>
      </div>
    {/if}
  </div>
  
  <!-- Exercise rating (shown after completion) -->
  {#if showRating}
    <div class="exercise-rating mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">How was this exercise?</h3>
      
      <div class="rating-stars flex items-center mb-4">
        {#each Array(5) as _, i}
          <button 
            class="star-button p-1 text-2xl focus:outline-none"
            on:click={() => {
              handleRatingSubmit({ detail: { rating: i + 1 } });
            }}
            aria-label={`Rate ${i + 1} star${i > 0 ? 's' : ''}`}
          >
            <i class="far fa-star text-amber-400 hover:text-amber-500 transition-colors"></i>
          </button>
        {/each}
      </div>
      
      <!-- Additional feedback would be added here in a real implementation -->
    </div>
  {/if}
  
  <!-- Related content -->
  {#if showRelatedContent && exercise.id}
    <div class="related-content mt-12">
      <RelatedContent contentId={exercise.id} contentType="exercise" />
    </div>
  {/if}
</div>
