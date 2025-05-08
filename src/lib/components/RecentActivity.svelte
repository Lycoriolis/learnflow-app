<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchRecentActivities, type Activity } from '$lib/services/activityService';

  interface DisplayActivity extends Activity {
    title: string;
    content: string;
    timeAgo: string;
    icon: string;
    color: string;
  }

  let activities: DisplayActivity[] = [];

  // Compute relative time
  function formatTimeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  function mapEventTypeToTitle(type: string, metadata?: any): string {
    switch(type) {
      case 'view_course': return `Viewed Course`;
      case 'start_lesson': return `Started Lesson`;
      case 'complete_lesson': return `Completed Lesson`;
      case 'flashcard_review': return `Reviewed Flashcards`;
      default:
        return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
  }

  function eventTypeIcon(type: string): string {
    switch(type) {
      case 'view_course': return 'fa-book';
      case 'start_lesson':
      case 'complete_lesson': return 'fa-layer-group';
      case 'flashcard_review': return 'fa-layer-group';
      default: return 'fa-circle';
    }
  }

  function eventTypeColor(type: string): string {
    switch(type) {
      case 'view_course': return 'blue';
      case 'start_lesson': return 'yellow';
      case 'complete_lesson': return 'green';
      case 'flashcard_review': return 'purple';
      default: return 'gray';
    }
  }

  onMount(async () => {
    const data = await fetchRecentActivities(10);
    activities = data.map(a => ({
      ...a,
      title: mapEventTypeToTitle(a.eventType, a.metadata),
      content: a.referenceId,
      timeAgo: formatTimeAgo(a.timestampStart),
      icon: eventTypeIcon(a.eventType),
      color: eventTypeColor(a.eventType)
    }));
  });
</script>

<div>
  <h2 class="text-lg font-semibold text-gray-100 mb-4">Recent Activity</h2>
  <div class="bg-gray-700 border border-orange-500 p-6 rounded-2xl shadow-sm squircle-sm">
    <div class="space-y-4">
      {#each activities as activity (activity.id)}
        <div class="flex items-start">
          <div class={`w-10 h-10 bg-${activity.color}-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
            <i class={`fas ${activity.icon} text-${activity.color}-300`}></i>
          </div>
          <div>
            <h3 class="font-medium text-gray-100">{activity.title}</h3>
            <p class="text-gray-300 text-sm">{activity.content}</p>
            <p class="text-gray-400 text-xs mt-1">{activity.timeAgo}</p>
          </div>
        </div>
      {/each}
      {#if activities.length === 0}
        <p class="text-gray-400 text-sm">No recent activity.</p>
      {/if}
    </div>
  </div>
</div>
