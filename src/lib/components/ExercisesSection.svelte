<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  import { getRecommendations } from '$lib/services/recommendationService.js';
  import { loadContent } from '$lib/services/contentService.js';
  import { user } from '$lib/stores/authStore.js';
  import type { Recommendation } from '$lib/services/recommendationService.js';
  import type { ContentMetadata } from '$lib/services/contentService.js';
  import { logEvent } from '$lib/services/activityService.js';
  import { goto } from '$app/navigation';

  interface ExerciseRec {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: string;
  }

  let exercises: ExerciseRec[] = [];
  let loading: boolean = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const currentUser = get(user);
      if (!currentUser?.uid) throw new Error('User not authenticated');
      const recs: Recommendation[] = await getRecommendations(currentUser.uid, 6);
      const exerciseRecs = recs.filter((r) => r.type.includes('exercise'));
      exercises = await Promise.all(
        exerciseRecs.map(async (rec: Recommendation) => {
          const content: ContentMetadata | null = await loadContent('exercise', rec.referenceId);
          return {
            id: rec.referenceId,
            title: rec.title || content?.title || '',
            description: rec.description || content?.description || '',
            icon: 'fa-code',
            category: content?.tags?.[0] || 'General'
          };
        })
      );
    } catch (e) {
      console.error('Error fetching recommended exercises', e);
      error = 'Failed to load recommendations.';
    } finally {
      loading = false;
    }
  });
</script>

<div class="mb-8">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-lg font-semibold text-gray-100">Recommended Exercises</h2>
    <a href="/exercises" class="text-sm text-indigo-300 hover:text-indigo-100 font-medium">View All</a>
  </div>

  {#if loading}
    <div class="py-4 text-gray-400">Loading recommendations...</div>
  {:else if error}
    <div class="py-4 text-red-500">{error}</div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each exercises as exercise}
        <div class="bg-gray-700 border border-orange-500 p-5 rounded-2xl shadow-sm squircle-sm card-hover">
          <div class="flex items-start mb-4">
            <div class="w-10 h-10 bg-indigo-900 rounded-lg flex items-center justify-center mr-3">
              <i class="fas {exercise.icon} text-indigo-300"></i>
            </div>
            <div>
              <h3 class="font-semibold text-gray-100">{exercise.title}</h3>
              <p class="text-gray-300 text-sm">{exercise.description}</p>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs px-2 py-1 bg-indigo-800 text-indigo-100 rounded">{exercise.category}</span>
            <a
              href="/exercises/{exercise.id}"
              class="text-sm text-indigo-300 hover:text-indigo-100 font-medium"
              on:click|preventDefault={async () => {
                try {
                  await logEvent('start_exercise', exercise.id);
                } catch (err) {
                  console.error('Error logging start_exercise', err);
                }
                goto(`/exercises/${exercise.id}`);
              }}
            >Start</a>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
