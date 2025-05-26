<script lang="ts">
  import { onMount } from 'svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  
  export let limit: number | null = null;
  
  interface ActivityItem {
    id: string;
    type: 'completed' | 'started' | 'achievement' | 'forum' | 'certificate';
    title: string;
    description: string;
    timestamp: string;
    icon: string;
    color: string;
    link?: string;
  }
  
  let activities: ActivityItem[] = [];
  let loading = true;
  let error: string | null = null;
  
  // This would be replaced with actual data fetching logic
  async function fetchActivityLog() {
    try {
      loading = true;
      error = null;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Sample data - in a real app this would come from an API
      activities = [
        {
          id: '1',
          type: 'completed',
          title: 'Completed Exercise',
          description: 'JavaScript Closures Exercise',
          timestamp: '2 hours ago',
          icon: 'check-circle',
          color: 'green',
          link: '/exercises/javascript-closures'
        },
        {
          id: '2',
          type: 'started',
          title: 'Started New Course',
          description: 'Quantum Physics',
          timestamp: 'Yesterday',
          icon: 'book',
          color: 'blue',
          link: '/courses/quantum-physics'
        },
        {
          id: '3',
          type: 'achievement',
          title: 'Achievement Unlocked',
          description: '7-Day Learning Streak',
          timestamp: '3 days ago',
          icon: 'trophy',
          color: 'amber',
          link: '/achievements'
        },
        {
          id: '4',
          type: 'forum',
          title: 'Posted in Forum',
          description: 'How to solve differential equations?',
          timestamp: '5 days ago',
          icon: 'message',
          color: 'indigo',
          link: '/forums/math/differential-equations'
        },
        {
          id: '5',
          type: 'completed',
          title: 'Completed Course',
          description: 'Linear Algebra Fundamentals',
          timestamp: '1 week ago',
          icon: 'graduation-cap',
          color: 'purple',
          link: '/courses/linear-algebra'
        },
        {
          id: '6',
          type: 'certificate',
          title: 'Earned Certificate',
          description: 'Advanced Calculus',
          timestamp: '2 weeks ago',
          icon: 'certificate',
          color: 'yellow',
          link: '/certificates/advanced-calculus'
        },
        {
          id: '7',
          type: 'started',
          title: 'Started Exercise',
          description: 'Graph Theory Problem Set',
          timestamp: '2 weeks ago',
          icon: 'play',
          color: 'cyan',
          link: '/exercises/graph-theory'
        }
      ];
      
      // Apply limit if provided
      if (limit) {
        activities = activities.slice(0, limit);
      }
      
    } catch (err: any) {
      console.error('Error fetching activity log:', err);
      error = err.message || 'Failed to load activity log';
    } finally {
      loading = false;
    }
  }
  
  // Get the appropriate icon based on the activity type
  function getIcon(type: string): string {
    switch (type) {
      case 'completed':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'started':
        return 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253';
      case 'achievement':
        return 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z';
      case 'forum':
        return 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z';
      case 'certificate':
        return 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }
  
  // Get the appropriate color for the icon background
  function getColorClass(color: string): string {
    const colorMap: Record<string, string> = {
      'green': 'bg-green-500',
      'blue': 'bg-blue-500',
      'amber': 'bg-amber-500',
      'indigo': 'bg-indigo-500',
      'purple': 'bg-purple-500',
      'yellow': 'bg-yellow-500',
      'cyan': 'bg-cyan-500',
      'red': 'bg-red-500'
    };
    
    return colorMap[color] || 'bg-gray-500';
  }
  
  onMount(() => {
    fetchActivityLog();
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
            <div class={`p-2 rounded-full ${getColorClass(activity.color)}`}>
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
