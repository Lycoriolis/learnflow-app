<script lang="ts">
  import type { ServerContentNode } from '$lib/server/contentService';
  import Icon from '@iconify/svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { exerciseProgressService, type ExerciseProgress } from '$lib/services/exercises/exerciseProgressService';
  import { exerciseBookmarkService } from '$lib/services/exercises/exerciseBookmarkService';

  export let exercise: ServerContentNode;
  export let className = '';
  export let showProgress = true;
  export let showBookmark = true;
  export let showStatistics = true;

  const dispatch = createEventDispatcher<{
    bookmark: { exerciseId: string; bookmarked: boolean };
    progress: { exerciseId: string; progress: number };
    click: { exercise: ServerContentNode };
  }>();

  let href: string;
  let exerciseProgress: ExerciseProgress | undefined;
  let isBookmarked = false;
  let progress = 0;
  let isCompleted = false;
  let timeSpent = 0;
  let lastAccessed: Date | null = null;
  let loading = false;

  // Initialize progress and bookmark data
  onMount(async () => {
    if (!browser) return;
    
    loading = true;
    try {
      // Load progress data
      exerciseProgress = await exerciseProgressService.getProgress(exercise.id);
      if (exerciseProgress) {
        progress = exerciseProgress.readingProgress; // Changed completionPercentage to readingProgress
        isCompleted = exerciseProgress.isCompleted;
        timeSpent = exerciseProgress.timeSpent;
        lastAccessed = new Date(exerciseProgress.lastAccessedAt); // Changed lastAccessed to lastAccessedAt and ensured it's a Date
      }

      // Load bookmark status
      isBookmarked = await exerciseBookmarkService.isBookmarked(exercise.id);
    } catch (error) {
      console.error('Failed to load exercise data:', error);
    } finally {
      loading = false;
    }
  });

  // Update progress when it changes externally
  $: if (browser && exerciseProgress) {
    progress = exerciseProgress.readingProgress; // Changed completionPercentage to readingProgress
    isCompleted = exerciseProgress.isCompleted;
    timeSpent = exerciseProgress.timeSpent;
    lastAccessed = new Date(exerciseProgress.lastAccessedAt); // Changed lastAccessed to lastAccessedAt and ensured it's a Date
  }
  
  // Use a reactive block to update href if exercise changes
  $: {
    if (exercise.contentPath) {
      // contentPath is already in the format like /exercises/maths/mpsi-maths or /exercises/maths/mpsi-maths/exercise-1
      // For the new routing structure, we need to remove the /exercises prefix since our route is /exercises/[...contentPath]
      const relativePath = exercise.contentPath.replace(/^\/exercises\/?/, '');
      href = relativePath ? `/exercises/${relativePath}` : '/exercises';
    } else {
      // Fallback if contentPath is somehow missing (should be rare)
      const basePath = '/exercises';
      const categoryPart = exercise.categoryPath ? exercise.categoryPath : (exercise.category || 'uncategorized');
      const idPart = exercise.id.endsWith('_index') ? exercise.id.replace('_index', '') : exercise.id;
      
      if (categoryPart && idPart && categoryPart !== idPart) {
        href = `${basePath}/${categoryPart}/${idPart}`.replace(/\/\//g, '/');
      } else if (idPart) {
        href = `${basePath}/${idPart}`.replace(/\/\//g, '/');
      } else {
        href = '#'; // Absolute fallback
      }
      console.warn('ExerciseCard: Exercise missing contentPath, using fallback href:', href, exercise);
    }
  }

  async function handleBookmark(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!browser) return;
    
    try {
      // Use toggleBookmark from exerciseBookmarkService
      isBookmarked = await exerciseBookmarkService.toggleBookmark(exercise.id, {
        href: href, // href is already defined in the component
        title: exercise.title || 'Untitled Exercise',
        category: exercise.category || 'uncategorized',
        difficulty: exercise.difficulty,
        tags: exercise.tags || []
      });
      
      dispatch('bookmark', { exerciseId: exercise.id, bookmarked: isBookmarked });
    } catch (error) {
      console.error('Failed to update bookmark:', error);
    }
  }

  function handleCardClick() {
    if (browser) {
      // Track exercise access using startExercise
      exerciseProgressService.startExercise(exercise.id, {
        href: href, // href is already defined in the component
        title: exercise.title || 'Untitled Exercise',
        category: exercise.category || 'uncategorized',
        difficulty: exercise.difficulty,
        tags: exercise.tags || []
        // estimatedTime is not a parameter for startExercise, so it's removed
      });
    }
    
    dispatch('click', { exercise });
  }

  function formatTimeSpent(milliseconds: number): string { // Assuming timeSpent is in milliseconds from the service
    const minutes = milliseconds / (1000 * 60);
    if (minutes < 1) {
      return '<1m';
    }
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  }

  function formatLastAccessed(date: Date | null): string {
    if (!date) return '';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  }

  function getDifficultyColor(difficulty: string | undefined) {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200';
    }
  }

  function getDifficultyIcon(difficulty: string | undefined) {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'mdi:numeric-1-circle';
      case 'intermediate':
        return 'mdi:numeric-2-circle';
      case 'advanced':
        return 'mdi:numeric-3-circle';
      default:
        return 'mdi:help-circle';
    }
  }
</script>

<a 
  {href} 
  class="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out border border-gray-200 dark:border-gray-700 hover:border-transparent transform hover:-translate-y-2 relative overflow-hidden group/card {className}"
  aria-label="View exercise: {exercise.title || 'Untitled Exercise'}"
  on:click={handleCardClick}
  style="transform-style: preserve-3d;"
>
  <!-- Gradient background on hover -->
  <span class="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-500 opacity-0 group-hover/card:opacity-75 transition-opacity duration-500 blur-sm group-hover/card:blur-md"></span>
  <span class="absolute inset-0 rounded-xl bg-white dark:bg-gray-800"></span>
  
  <!-- Content overlay with 3D effect -->
  <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-teal-600/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ease-in-out"></div>

  <!-- Progress Bar -->
  {#if showProgress && progress > 0}
    <div class="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-t-xl overflow-hidden">
      <div 
        class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" 
        style="width: {progress}%"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Exercise progress: {progress}%"
      ></div>
    </div>
  {/if}

  <div class="p-6 relative z-10 transform transition-transform duration-500 ease-in-out group-hover/card:scale-[1.02] flex flex-col h-full">
    <!-- Header Section -->
    <div class="flex items-start space-x-4 mb-4">
      <!-- Icon -->
      <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover/card:shadow-indigo-400/60 transition-all duration-500 transform group-hover/card:scale-110 group-hover/card:rotate-3">
          <Icon 
            icon={exercise.itemType === 'course' || exercise.id?.endsWith('_index') ? 'mdi:book-open-page-variant' : 'mdi:pencil-box'} 
            class="w-6 h-6 text-white transition-transform duration-300 group-hover/card:scale-110" 
          />
        </div>
      </div>

      <!-- Title and Status -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-2">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors duration-300 line-clamp-2 leading-tight">
            {exercise.title || 'Untitled Exercise'}
          </h3>
          
          <!-- Status indicators in top right -->
          <div class="flex items-center gap-2 ml-2 flex-shrink-0">
            <!-- Bookmark Button -->
            {#if showBookmark}
              <button
                on:click={handleBookmark}
                disabled={loading}
                class="p-1.5 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed group-hover/card:scale-110"
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <Icon 
                  icon={loading ? 'mdi:loading' : (isBookmarked ? 'mdi:bookmark' : 'mdi:bookmark-outline')} 
                  class="h-3.5 w-3.5 {isBookmarked ? 'text-indigo-600' : 'text-gray-400'} {loading ? 'animate-spin' : ''}"
                />
              </button>
            {/if}

            <!-- Completion Status -->
            {#if isCompleted}
              <div class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                <Icon icon="mdi:check-circle" class="h-3 w-3 mr-1" />
                Done
              </div>
            {:else if progress > 0}
              <div class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                <Icon icon="mdi:play-circle" class="h-3 w-3 mr-1" />
                {Math.round(progress)}%
              </div>
            {/if}
          </div>
        </div>

        <!-- Difficulty Badge -->
        {#if exercise.difficulty}
          <div class="flex items-center gap-1 mb-3">
            <Icon icon={getDifficultyIcon(exercise.difficulty)} class="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {getDifficultyColor(exercise.difficulty)} opacity-90">
              {exercise.difficulty}
            </span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Description with expandable content -->
    {#if exercise.description}
      <div class="relative mb-4">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3 leading-relaxed 
                  group-hover/card:line-clamp-none group-hover/card:text-gray-700 dark:group-hover/card:text-gray-300 
                  transition-colors duration-300">
          {exercise.description}
        </p>
        <!-- Subtle fade effect for clamped text -->
        <div class="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white dark:from-gray-800 to-transparent 
                    opacity-100 group-hover/card:opacity-0 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    {/if}
    
    <!-- Tags and Category Section -->
    <div class="flex flex-wrap gap-1.5 mb-4 min-h-[24px]">
      <!-- Category -->
      {#if exercise.category && exercise.itemType !== 'course' && exercise.itemType !== 'theme' && !(exercise.id && exercise.id.endsWith('_index'))}
        <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50">
          <Icon icon="mdi:folder-outline" class="w-3 h-3 mr-1" />
          {exercise.category}
        </span>
      {/if}

      <!-- Tags with progressive disclosure -->
      {#if exercise.tags && exercise.tags.length > 0}
        <!-- Default state: show limited tags -->
        <div class="contents group-hover/card:hidden">
          {#each exercise.tags.slice(0, 2) as tag}
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium 
                         bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 
                         border border-gray-200 dark:border-gray-600/50">
              <Icon icon="mdi:tag-outline" class="w-3 h-3 mr-1" />
              {tag}
            </span>
          {/each}
          {#if exercise.tags.length > 2}
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium 
                         bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 
                         border border-indigo-200 dark:border-indigo-700/50 cursor-help" 
                  title="Hover to see all tags">
              +{exercise.tags.length - 2} more
            </span>
          {/if}
        </div>

        <!-- Hover state: show all tags with enhanced styling -->
        <div class="hidden group-hover/card:contents">
          {#each exercise.tags as tag}
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium 
                         bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 
                         border border-indigo-200 dark:border-indigo-700/60 
                         transform transition-all duration-200 hover:scale-105">
              <Icon icon="mdi:tag" class="w-3 h-3 mr-1" />
              {tag}
            </span>
          {/each}
        </div>
      {/if}
    </div>
    
    <!-- Footer with metadata and action -->
    <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
      <!-- Left side: metadata -->
      <div class="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
        {#if (exercise.itemType === 'exercise' || (exercise.id && exercise.id.endsWith('_index'))) && exercise.estimatedTime}
          <div class="flex items-center gap-1">
            <Icon icon="mdi:clock-outline" class="w-4 h-4" />
            <span>
              {exercise.estimatedTime}{typeof exercise.estimatedTime === 'number' || (typeof exercise.estimatedTime === 'string' && !isNaN(parseInt(exercise.estimatedTime))) ? ' min' : ''}
            </span>
          </div>
        {/if}
        
        {#if showStatistics && timeSpent > 0}
          <div class="flex items-center gap-1" title="Time spent">
            <Icon icon="mdi:timer" class="w-4 h-4" />
            <span>{formatTimeSpent(timeSpent)}</span>
          </div>
        {/if}
        
        {#if showStatistics && lastAccessed}
          <div class="flex items-center gap-1" title="Last accessed">
            <Icon icon="mdi:calendar-clock" class="w-4 h-4" />
            <span>{formatLastAccessed(lastAccessed)}</span>
          </div>
        {/if}
      </div>
      
      <!-- Right side: action button -->
      <div class="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 
                  group-hover/card:text-indigo-700 dark:group-hover/card:text-indigo-300 transition-colors">
        <span>
          {#if exercise.id && exercise.id.endsWith('_index')}
            View Overview
          {:else if isCompleted}
            Review
          {:else if progress > 0}
            Continue
          {:else}
            Start Exercise
          {/if}
        </span>
        <Icon icon="mdi:arrow-right" class="w-4 h-4 ml-1 transform group-hover/card:translate-x-1 transition-transform" />
      </div>
    </div>
  </div>
</a>