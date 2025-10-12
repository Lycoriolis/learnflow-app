<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import { exerciseProgressService } from '$lib/services/exercises/exerciseProgressService';

  export let limit: number | null = null;

  type ActivityType = 'completed' | 'inprogress' | 'started';

  interface ActivityItem {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    timestamp: string;
    link?: string;
  }

  let activities: ActivityItem[] = [];
  let loading = true;
  let error: string | null = null;

  function formatRelativeTime(timestamp: number | undefined): string {
    if (!timestamp) return 'Unknown';
    const diff = Date.now() - timestamp;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) return 'Just now';
    if (diff < hour) {
      const minutes = Math.floor(diff / minute);
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }
    if (diff < day) {
      const hours = Math.floor(diff / hour);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    const days = Math.floor(diff / day);
    if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
    const years = Math.floor(days / 365);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }

  function buildActivities(): ActivityItem[] {
    if (!browser) return [];

    const progress = exerciseProgressService
      .getAllProgress()
      .sort((a, b) => (b.lastAccessedAt || 0) - (a.lastAccessedAt || 0));

    return progress.map((item) => {
      const progressLabel = item.isCompleted ? 'Completed' : `${Math.round(item.readingProgress)}% complete`;
      const detail = item.difficulty ? `${item.difficulty} · ${item.category ?? 'General'}` : item.category ?? '';
      const timeSpentMinutes = Math.round((item.timeSpent || 0) / 60000);
      const timeLabel = timeSpentMinutes > 0 ? `${timeSpentMinutes}m logged` : null;

      const segments = [progressLabel, detail, timeLabel].filter(Boolean);

      return {
        id: item.exerciseId,
        type: item.isCompleted ? 'completed' : item.readingProgress > 0 ? 'inprogress' : 'started',
        title: item.title || 'Exercise Progress',
        description: segments.join(' · '),
        timestamp: formatRelativeTime(item.lastAccessedAt),
        link: item.href
      };
    });
  }

  function getIcon(type: ActivityType): string {
    switch (type) {
      case 'completed':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'inprogress':
        return 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253';
      case 'started':
        return 'M5 3l14 9-14 9V3z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  function getColorClass(type: ActivityType): string {
    if (type === 'completed') return 'bg-green-500';
    if (type === 'inprogress') return 'bg-sky-500';
    return 'bg-indigo-500';
  }

  function loadActivityLog() {
    try {
      loading = true;
      error = null;
      activities = buildActivities();
      if (limit) {
        activities = activities.slice(0, limit);
      }
    } catch (err: any) {
      console.error('Error building activity log:', err);
      error = err?.message || 'Failed to load activity log';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadActivityLog();
  });
</script>

<div>
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-xl font-semibold text-white">Activity Log</h2>
    {#if limit}
      <a href="/profile?tab=activity" class="text-blue-400 hover:text-blue-300 text-sm">
        View All
      </a>
    {/if}
  </div>
  
  {#if loading}
    <div class="flex justify-center items-center h-48">
      <LoadingSpinner />
    </div>
  {:else if error}
    <div class="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 p-4 rounded-lg">
      <p>{error}</p>
    </div>
  {:else if activities.length === 0}
    <div class="bg-gray-700 p-6 rounded-lg text-center">
      <p class="text-gray-300">No activity recorded yet. Start learning to see your activity here!</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each activities as activity}
        <div class="bg-gray-700 rounded-lg p-4 flex items-start hover:bg-gray-650 transition-colors">
          <div class="mr-4 mt-1">
            <div class={`p-2 rounded-full ${getColorClass(activity.type)}`}>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIcon(activity.type)} />
              </svg>
            </div>
          </div>
          
          <div class="flex-1">
            <h3 class="text-white font-medium">{activity.title}</h3>
            <p class="text-gray-400 text-sm">{activity.description}</p>
            <div class="flex justify-between items-center mt-2">
              <span class="text-gray-500 text-xs">{activity.timestamp}</span>
              {#if activity.link}
                <a href={activity.link} class="text-blue-400 hover:text-blue-300 text-xs">
                  View Details
                </a>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
