<script lang="ts">
  import { fade } from 'svelte/transition';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
  import ExerciseMarkdown from '$lib/components/courses/exercise/ExerciseMarkdown.svelte';
  import ExerciseRating from '$lib/components/courses/exercise/ExerciseRating.svelte';
  import ExerciseCard from '$lib/components/courses/exercise/ExerciseCard.svelte';
  import MathContent from '$lib/components/MathContent.svelte';
  
  export let data;
  
  // Handle both category and individual exercise display
  const { isCategory } = data;
</script>

<svelte:head>
  {#if isCategory}
    <title>{data.category.title} | LearnFlow Exercises</title>
    <meta name="description" content={data.category.description || `Browse exercises in the ${data.category.title} category`} />
  {:else}
    <title>{data.exercise?.title || 'Exercise'} | LearnFlow</title>
    <meta name="description" content={data.exercise?.description || 'Practice with this exercise on LearnFlow'} />
  {/if}
</svelte:head>

<div class="min-h-screen p-6 bg-gray-900 text-gray-100">
  {#if isCategory}
    <!-- Category View -->
    <div in:fade={{ duration: 300 }}>
      <a href="/exercises" class="text-sm text-red-300 hover:text-red-200 mb-4 inline-block">← All Exercises</a>
      
      <h1 class="text-3xl font-bold mb-2">{data.category.title}</h1>
      {#if data.category.description}
        <p class="text-gray-300 mb-6">{data.category.description}</p>
      {/if}
      
      {#if data.category.exercises && data.category.exercises.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {#each data.category.exercises as exercise}
            <ExerciseCard {exercise} href={`/exercises/${data.category.id}/${exercise.id}`} />
          {/each}
        </div>
      {:else}
        <p>No exercises found in this category.</p>
      {/if}
    </div>
  {:else}
    <!-- Individual Exercise View -->
    <div in:fade={{ duration: 300 }}>
      <a href="/exercises" class="text-sm text-red-300 hover:text-red-200 mb-4 inline-block">← All Exercises</a>
      
      {#if data.exercise}
        <div class="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h1 class="text-3xl font-bold mb-2">{data.exercise.title}</h1>
          
          <div class="flex flex-wrap gap-2 mb-4">
            {#if data.exercise.difficulty}
              <span class="px-2 py-1 text-xs rounded-full bg-opacity-20"
                class:bg-green-600={data.exercise.difficulty === 'beginner'}
                class:bg-yellow-600={data.exercise.difficulty === 'intermediate'}
                class:bg-red-600={data.exercise.difficulty === 'advanced'}
              >
                {data.exercise.difficulty.charAt(0).toUpperCase() + data.exercise.difficulty.slice(1)}
              </span>
            {/if}
            
            {#if data.exercise.estimatedTime}
              <span class="px-2 py-1 text-xs rounded-full bg-blue-600 bg-opacity-20">
                <i class="fas fa-clock mr-1"></i> {data.exercise.estimatedTime}
              </span>
            {/if}
            
            {#if data.exercise.tags && data.exercise.tags.length > 0}
              {#each data.exercise.tags as tag}
                <span class="px-2 py-1 text-xs rounded-full bg-purple-600 bg-opacity-20">{tag}</span>
              {/each}
            {/if}
          </div>
          
          {#if data.exercise.description}
            <p class="text-gray-300 mb-6">{data.exercise.description}</p>
          {/if}
          
          <!-- Exercise Content -->
          <div class="mt-6">
            {#if data.content}
              <ExerciseMarkdown content={data.content} />
            {:else}
              <p>No content available for this exercise.</p>
            {/if}
          </div>
          
          <!-- Exercise Rating -->
          <div class="mt-8 pt-6 border-t border-gray-700">
            <ExerciseRating exerciseId={data.exercise.id} />
          </div>
        </div>
      {:else}
        <div class="bg-red-900 bg-opacity-20 p-4 rounded-lg">
          <p>Exercise not found or failed to load.</p>
        </div>
      {/if}
    </div>
  {/if}
</div>