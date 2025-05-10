<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { logStart, logEnd } from '$lib/services/activityService';
  import ExerciseCard from '$lib/components/ExerciseCard.svelte';
  import ExerciseList from '$lib/components/exercises/ExerciseList.svelte';
  import { listExercises, type ContentMetadata } from '$lib/services/enhancedContentService.js';
  import type { Exercise } from '$lib/services/exerciseFilterService';

  let exercises: ContentMetadata[] = [];
  let loading = true;
  let error: string | null = null;
  let viewId: string | null = null;
  
  // Converted exercises for the filter component
  let formattedExercises: Exercise[] = [];

  onMount(async () => {
    try {
      console.log('Exercises page mounted - fetching exercises');
      viewId = await logStart('view_exercises', 'exercises');
      exercises = await listExercises();
      console.log('Exercises fetched:', exercises);
      
      // Convert ContentMetadata to Exercise format for our filters
      formattedExercises = exercises.map(ex => ({
        id: ex.id || '',
        title: ex.title || '',
        description: ex.description || '',
        type: determineExerciseType(ex),
        difficulty: determineExerciseDifficulty(ex),
        tags: ex.tags || [],
        createdAt: new Date(ex.createdAt || Date.now()),
        updatedAt: new Date(ex.updatedAt || Date.now()),
        rating: ex.rating,
        completions: ex.completionCount
      }));
      
    } catch (err) {
      console.error("Error loading exercises:", err);
      error = "Failed to load exercises. Please try again later.";
    } finally {
      loading = false;
      console.log('Exercises loading complete:', { loading, error, exercisesCount: exercises.length });
    }
  });

  onDestroy(() => {
    if (viewId) logEnd(viewId);
  });
  
  // Helper functions to determine exercise type and difficulty based on content metadata
  function determineExerciseType(exercise: ContentMetadata): 'multiple-choice' | 'coding' | 'written' | 'interactive' {
    if (exercise.exerciseType === 'multiple-choice') return 'multiple-choice';
    if (exercise.exerciseType === 'coding') return 'coding';
    if (exercise.exerciseType === 'written') return 'written';
    if (exercise.exerciseType === 'interactive') return 'interactive';
    
    // Fallback logic based on tags or other metadata
    const tags = exercise.tags || [];
    if (tags.includes('coding') || tags.includes('code')) return 'coding';
    if (tags.includes('quiz') || tags.includes('multiple-choice')) return 'multiple-choice';
    if (tags.includes('writing') || tags.includes('essay')) return 'written';
    
    // Default
    return 'multiple-choice';
  }
  
  function determineExerciseDifficulty(exercise: ContentMetadata): 'beginner' | 'intermediate' | 'advanced' {
    if (exercise.difficulty === 'beginner') return 'beginner';
    if (exercise.difficulty === 'intermediate') return 'intermediate';
    if (exercise.difficulty === 'advanced') return 'advanced';
    
    // Fallback to beginner if not specified
    return 'beginner';
  }
</script>

<svelte:head>
  <title>Exercises | LearnFlow</title>
  <meta name="description" content="Browse and filter through our collection of exercises to enhance your skills" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Exercises</h1>
  <p class="text-gray-600 dark:text-gray-400 mb-8">
    Browse through our collection of exercises to practice and enhance your skills.
    Use the filters to find exercises that match your interests and skill level.
  </p>

  {#if loading}
    <div class="flex justify-center items-center py-12">
      <div class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
    </div>
  {:else if error}
    <div class="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
      <p class="text-red-600 dark:text-red-200">{error}</p>
    </div>
  {:else if exercises.length === 0}
    <div class="text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <i class="fas fa-code text-2xl text-gray-400"></i>
      </div>
      <p class="text-gray-500 dark:text-gray-400">No exercises available at the moment.</p>
    </div>
  {:else}
    <!-- New Exercise Filtering UI -->
    <div class="mb-8">
      <ExerciseList exercises={formattedExercises} showFilters={true} />
    </div>
    
    <!-- Original grid layout is kept as a fallback but commented out -->
    <!-- 
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each exercises as ex}
        <ExerciseCard exercise={{
          id: ex.id,
          title: ex.title,
          description: ex.description || '',
          category: { 
            name: ex.tags?.[0] || 'General',
            color: ex.difficulty === 'beginner' ? 'green' : 
                   ex.difficulty === 'intermediate' ? 'yellow' : 
                   ex.difficulty === 'advanced' ? 'red' : 'blue'
          },
          icon: 'fa-code',
          difficulty: ex.difficulty || 'beginner',
          estimatedTime: ex.estimatedTime || ''
        }} />
      {/each}
    </div>
    -->
  {/if}
</div>
