<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { getRecommendations } from '$lib/services/recommendationService.js';
  import type { Recommendation } from '$lib/services/recommendationService.js';
  import { user } from '$lib/stores/authStore.js';

  export let limit: number = 5;

  let recommendations: Recommendation[] = [];
  let loading: boolean = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const currentUser = get(user);
      if (!currentUser?.uid) throw new Error('User not authenticated');
      recommendations = await getRecommendations(currentUser.uid, limit);
    } catch (e:any) {
      console.error('Error fetching recommendations', e);
      error = e.message || 'Failed to load recommendations.';
    } finally {
      loading = false;
    }
  });

  function getLink(rec: Recommendation): string {
    switch(rec.type) {
      case 'next_lesson':
        return `/courses/${rec.metadata?.courseId}/${rec.referenceId}`;
      case 'review_flashcards':
        return `/tools/flashcards`;
      case 'view_courses':
        return `/courses`;
      case 'course':
        return `/courses/${rec.referenceId}`;
      case 'exercise':
        return `/exercises/${rec.referenceId}`;
      default:
        return '#';
    }
  }
</script>

<div class="mb-8">
  <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Recommended for You</h2>
  {#if loading}
    <p class="text-gray-600">Loading recommendations...</p>
  {:else if error}
    <p class="text-red-500">{error}</p>
  {:else if recommendations.length === 0}
    <p class="text-gray-600">No recommendations at this time.</p>
  {:else}
    <div class="space-y-4">
      {#each recommendations as rec}
        <a href={getLink(rec)} class="block bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition flex items-center">
          <div class="flex-1">
            <h3 class="font-medium text-gray-900 dark:text-white">{rec.title}</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">{rec.description}</p>
          </div>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </a>
      {/each}
    </div>
  {/if}
</div>