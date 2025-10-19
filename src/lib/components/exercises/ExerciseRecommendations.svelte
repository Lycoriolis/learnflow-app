<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import Icon from '@iconify/svelte';
  import { exerciseRecommendationService, type RecommendationResult } from '$lib/services/exercises/exerciseRecommendationService';
  import { exerciseProgressService } from '$lib/services/exercises/exerciseProgressService';
  import ExerciseCard from './ExerciseCard.svelte';
  import type { ServerContentNode } from '$lib/server/contentService';

  export let className = '';
  export let title = 'Recommended for You';
  export let subtitle = '';
  export let maxRecommendations = 6;
  export let compact = false;
  export let showReason = true;
  export let autoRefresh = false;
  export let refreshInterval = 300000; // 5 minutes

  // Recommendation types
  export let showPersonalized = true;
  export let showSimilar = true;
  export let showTrending = true;
  export let showBasedOnProgress = true;

  let recommendations: RecommendationResult[] = [];
  let loading = true;
  let error: string | null = null;
  let refreshTimer: number;

  onMount(async () => {
    if (!browser) return;
    
    await loadRecommendations();
    
    if (autoRefresh) {
      refreshTimer = setInterval(loadRecommendations, refreshInterval);
    }

    return () => {
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
    };
  });

  async function loadRecommendations() {
    loading = true;
    error = null;
    
    try {
      const allRecommendations: RecommendationResult[] = [];
      
      // Get personalized recommendations
      if (showPersonalized) {
        const personalized = await exerciseRecommendationService.getPersonalizedRecommendations(
          Math.ceil(maxRecommendations / 2)
        );
        allRecommendations.push(...personalized.map(r => ({
          ...r,
          reason: 'Personalized for you based on your learning history'
        })));
      }

      // Get progress-based recommendations
      if (showBasedOnProgress) {
        const progressData = await exerciseProgressService.getAllProgress();
        const recentProgress = progressData
          .filter(p => p.lastAccessed && p.lastAccessed > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
          .sort((a, b) => (b.lastAccessed?.getTime() || 0) - (a.lastAccessed?.getTime() || 0))
          .slice(0, 3);

        for (const progress of recentProgress) {
          try {
            const similar = await exerciseRecommendationService.getSimilarExercises(
              progress.exerciseId,
              2
            );
            allRecommendations.push(...similar.map(r => ({
              ...r,
              reason: `Because you recently worked on "${progress.exerciseId}"`
            })));
          } catch (e) {
            console.warn('Failed to get similar exercises for', progress.exerciseId, e);
          }
        }
      }

      // Remove duplicates and limit results
      const uniqueRecommendations = allRecommendations.filter((rec, index, arr) =>
        arr.findIndex(r => r.exercise.id === rec.exercise.id) === index
      );

      recommendations = uniqueRecommendations.slice(0, maxRecommendations);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load recommendations';
      console.error('Recommendations loading error:', err);
    } finally {
      loading = false;
    }
  }

  function getReasonIcon(reason: string): string {
    if (reason.includes('Personalized')) return 'mdi:account-star';
    if (reason.includes('recently worked')) return 'mdi:history';
    if (reason.includes('similar')) return 'mdi:related';
    if (reason.includes('popular')) return 'mdi:trending-up';
    return 'mdi:lightbulb';
  }

  function getReasonColor(reason: string): string {
    if (reason.includes('Personalized')) return 'text-red-600 dark:text-red-400';
    if (reason.includes('recently worked')) return 'text-blue-600 dark:text-blue-400';
    if (reason.includes('similar')) return 'text-green-600 dark:text-green-400';
    if (reason.includes('popular')) return 'text-orange-600 dark:text-orange-400';
    return 'text-indigo-600 dark:text-indigo-400';
  }

  function handleExerciseClick(event: CustomEvent<{ exercise: ServerContentNode }>) {
    // Track interaction for future recommendations
    if (browser) {
      exerciseRecommendationService.trackInteraction(event.detail.exercise.id, 'click');
    }
  }

  function handleBookmark(event: CustomEvent<{ exerciseId: string; bookmarked: boolean }>) {
    // Track bookmark action for recommendations
    if (browser) {
      exerciseRecommendationService.trackInteraction(
        event.detail.exerciseId, 
        event.detail.bookmarked ? 'bookmark' : 'unbookmark'
      );
    }
  }
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg {className}">
  <div class="p-6 border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {#if subtitle}
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        {/if}
      </div>
      <button
        on:click={loadRecommendations}
        disabled={loading}
        class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        title="Refresh recommendations"
      >
        <Icon 
          icon={loading ? 'mdi:loading' : 'mdi:refresh'} 
          class="h-4 w-4 mr-2 {loading ? 'animate-spin' : ''}" 
        />
        Refresh
      </button>
    </div>
  </div>

  <div class="p-6">
    {#if loading}
      <div class="flex items-center justify-center h-48">
        <div class="flex items-center space-x-2">
          <Icon icon="mdi:loading" class="h-6 w-6 animate-spin text-indigo-600" />
          <span class="text-gray-600 dark:text-gray-400">Loading recommendations...</span>
        </div>
      </div>
    {:else if error}
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
        <div class="flex">
          <Icon icon="mdi:alert-circle" class="h-5 w-5 text-red-400 mt-0.5" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-400">Error loading recommendations</h3>
            <p class="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
            <button
              on:click={loadRecommendations}
              class="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    {:else if recommendations.length === 0}
      <div class="text-center py-12">
        <Icon icon="mdi:lightbulb-outline" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No recommendations yet</h3>
        <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Start working on some exercises and we'll suggest related content based on your progress and interests.
        </p>
      </div>
    {:else}
      <div class="grid grid-cols-1 {compact ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'} gap-6">
        {#each recommendations as recommendation}
          <div class="relative">
            <!-- Recommendation reason -->
            {#if showReason && recommendation.reason}
              <div class="mb-3 flex items-center text-sm">
                <Icon 
                  icon={getReasonIcon(recommendation.reason)} 
                  class="h-4 w-4 mr-2 {getReasonColor(recommendation.reason)}" 
                />
                <span class="text-gray-600 dark:text-gray-400 truncate">
                  {recommendation.reason}
                </span>
              </div>
            {/if}

            <!-- Exercise Card -->
            <ExerciseCard
              exercise={recommendation.exercise}
              className="h-full"
              on:click={handleExerciseClick}
              on:bookmark={handleBookmark}
            />

            <!-- Similarity indicator -->
            {#if recommendation.similarityScore !== undefined}
              <div class="absolute top-2 left-2 z-20">
                <div 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-600"
                  title="Similarity score: {Math.round(recommendation.similarityScore * 100)}%"
                >
                  <Icon icon="mdi:percent" class="h-3 w-3 mr-1 text-indigo-600 dark:text-indigo-400" />
                  <span class="text-indigo-600 dark:text-indigo-400">
                    {Math.round(recommendation.similarityScore * 100)}%
                  </span>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Load More Button -->
      {#if recommendations.length === maxRecommendations}
        <div class="text-center mt-8">
          <button
            on:click={() => {
              maxRecommendations += 6;
              loadRecommendations();
            }}
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Icon icon="mdi:plus" class="h-4 w-4 mr-2" />
            Load More Recommendations
          </button>
        </div>
      {/if}

      <!-- Recommendation Stats -->
      {#if recommendations.length > 0}
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <div>
              <span class="font-medium text-gray-900 dark:text-white">
                {recommendations.length}
              </span>
              <div>Recommendations</div>
            </div>
            <div>
              <span class="font-medium text-gray-900 dark:text-white">
                {new Set(recommendations.map(r => r.exercise.category)).size}
              </span>
              <div>Categories</div>
            </div>
            <div>
              <span class="font-medium text-gray-900 dark:text-white">
                {recommendations.filter(r => r.similarityScore && r.similarityScore > 0.8).length}
              </span>
              <div>High Matches</div>
            </div>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>
