<script lang="ts">
  import ActivityItem from './ActivityItem.svelte';
  
  // Sample activity data (in a real app, this would come from an API or store)
  const activities = [
    {
      id: '1',
      type: 'completed',
      title: 'Completed exercise',
      description: 'JavaScript Closure Exercise',
      timestamp: '2 hours ago',
      icon: 'fa-check-circle',
      color: 'indigo'
    },
    {
      id: '2',
      type: 'started',
      title: 'Started new course',
      description: 'Quantum Physics',
      timestamp: 'Yesterday',
      icon: 'fa-book',
      color: 'blue'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Achievement unlocked',
      description: '7-Day Learning Streak',
      timestamp: '3 days ago',
      icon: 'fa-trophy',
      color: 'green'
    }
  ];
</script>

<div>
  <h2 class="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
  
  <div class="bg-white p-6 rounded-2xl shadow-sm squircle-sm">
    <div class="space-y-4">
      {#each activities as activity (activity.id)}
        <ActivityItem {activity} />
      {/each}
    </div>
  </div>
</div> 