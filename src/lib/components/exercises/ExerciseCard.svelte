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
        progress = exerciseProgress.completionPercentage;
        isCompleted = exerciseProgress.isCompleted;
        timeSpent = exerciseProgress.timeSpent;
        lastAccessed = exerciseProgress.lastAccessed;
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
    progress = exerciseProgress.completionPercentage;
    isCompleted = exerciseProgress.isCompleted;
    timeSpent = exerciseProgress.timeSpent;
    lastAccessed = exerciseProgress.lastAccessed;
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
      if (isBookmarked) {
        await exerciseBookmarkService.removeBookmark(exercise.id);
        isBookmarked = false;
      } else {
        await exerciseBookmarkService.addBookmark({
          exerciseId: exercise.id,
          title: exercise.title || 'Untitled Exercise',
          category: exercise.category || 'uncategorized',
          difficulty: exercise.difficulty,
          tags: exercise.tags || [],
          url: href
        });
        isBookmarked = true;
      }
      
      dispatch('bookmark', { exerciseId: exercise.id, bookmarked: isBookmarked });
    } catch (error) {
      console.error('Failed to update bookmark:', error);
    }
  }

  function handleCardClick() {
    if (browser) {
      // Track exercise access
      exerciseProgressService.startSession(exercise.id, {
        title: exercise.title || 'Untitled Exercise',
        category: exercise.category || 'uncategorized',
        difficulty: exercise.difficulty,
        estimatedTime: exercise.estimatedTime
      });
    }
    
    dispatch('click', { exercise });
  }

  function formatTimeSpent(minutes: number): string {
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
  class="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 {className} group transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 relative"
  aria-label="View exercise: {exercise.title || 'Untitled Exercise'}"
  on:click={handleCardClick}
>
  <!-- Bookmark Button -->
  {#if showBookmark}
    <button
      on:click={handleBookmark}
      disabled={loading}
      class="absolute top-3 right-3 z-10 p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Icon 
        icon={loading ? 'mdi:loading' : (isBookmarked ? 'mdi:bookmark' : 'mdi:bookmark-outline')} 
        class="h-4 w-4 {isBookmarked ? 'text-indigo-600' : 'text-gray-400'} {loading ? 'animate-spin' : ''}"
      />
    </button>
  {/if}

  <!-- Progress Bar -->
  {#if showProgress && progress > 0}
    <div class="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
      <div 
        class="h-full bg-indigo-600 transition-all duration-300" 
        style="width: {progress}%"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Exercise progress: {progress}%"
      ></div>
    </div>
  {/if}

  <!-- Completion Badge -->
  {#if isCompleted}
    <div class="absolute top-3 left-3 z-10">
      <div class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
        <Icon icon="mdi:check-circle" class="h-3 w-3 mr-1" />
        Completed
      </div>
    </div>
  {/if}

  <div class="p-4 flex flex-col h-full">
    <div class="flex-grow">
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
          {exercise.title || 'Untitled Exercise'}
        </h3>
        {#if exercise.difficulty}
          <div class="flex items-center gap-1 ml-2 flex-shrink-0">
            <Icon icon={getDifficultyIcon(exercise.difficulty)} class="h-4 w-4" />
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getDifficultyColor(exercise.difficulty)}">
              {exercise.difficulty}
            </span>
          </div>
        {/if}
      </div>
      
      {#if exercise.description}
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
          {exercise.description}
        </p>
      {/if}
      
      <!-- Tags and Category -->
      <div class="flex flex-wrap gap-2 mb-4">
        {#if exercise.category && exercise.itemType !== 'course' && exercise.itemType !== 'theme' && !(exercise.id && exercise.id.endsWith('_index'))}
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <Icon icon="mdi:folder" class="h-3 w-3 mr-1" />
            {exercise.category}
          </span>
        {/if}
        {#if exercise.tags && exercise.tags.length > 0}
          {#each exercise.tags.slice(0, 2) as tag}
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
              <Icon icon="mdi:tag" class="h-3 w-3 mr-1" />
              {tag}
            </span>
          {/each}
          {#if exercise.tags.length > 2}
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
              +{exercise.tags.length - 2} more
            </span>
          {/if}
        {/if}
      </div>
    </div>
    
    <!-- Footer with metadata and action -->
    <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
        {#if (exercise.itemType === 'exercise' || (exercise.id && exercise.id.endsWith('_index'))) && exercise.estimatedTime}
          <div class="flex items-center gap-1">
            <Icon icon="mdi:clock-outline" class="h-4 w-4" />
            <span>
              {exercise.estimatedTime}{typeof exercise.estimatedTime === 'number' || (typeof exercise.estimatedTime === 'string' && !isNaN(parseInt(exercise.estimatedTime))) ? ' min' : ''}
            </span>
          </div>
        {/if}
        
        {#if showStatistics && timeSpent > 0}
          <div class="flex items-center gap-1" title="Time spent on this exercise">
            <Icon icon="mdi:timer" class="h-4 w-4" />
            <span>{formatTimeSpent(timeSpent)}</span>
          </div>
        {/if}
        
        {#if showStatistics && lastAccessed}
          <div class="flex items-center gap-1" title="Last accessed">
            <Icon icon="mdi:calendar-clock" class="h-4 w-4" />
            <span>{formatLastAccessed(lastAccessed)}</span>
          </div>
        {/if}
        
        {#if exercise.difficulty}
          <div class="flex items-center gap-1">
            <Icon icon="mdi:speedometer" class="h-4 w-4" />
            <span class="capitalize">{exercise.difficulty}</span>
          </div>
        {/if}
      </div>
      
      <div class="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
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
        <Icon icon="mdi:arrow-right" class="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </div>
</a>