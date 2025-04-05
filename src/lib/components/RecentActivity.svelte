<script>
  export let activities = [
    {
      type: "completed",
      title: "Completed exercise",
      content: "JavaScript Closure Exercise",
      timeAgo: "2 hours ago",
      icon: "fa-check-circle",
      color: "indigo"
    },
    {
      type: "started",
      title: "Started new course",
      content: "Quantum Physics",
      timeAgo: "Yesterday",
      icon: "fa-book",
      color: "blue"
    },
    {
      type: "achievement",
      title: "Achievement unlocked",
      content: "7-Day Learning Streak",
      timeAgo: "3 days ago",
      icon: "fa-trophy",
      color: "green"
    }
  ];
</script>

<div>
  <h2 class="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
  
  <div class="bg-white p-6 rounded-2xl shadow-sm squircle-sm">
    <div class="space-y-4">
      {#each activities as activity}
        <div class="flex items-start">
          <div class="w-10 h-10 bg-{activity.color}-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <i class="fas {activity.icon} text-{activity.color}-600"></i>
          </div>
          <div>
            <h3 class="font-medium text-gray-800">{activity.title}</h3>
            <p class="text-gray-500 text-sm">{activity.content}</p>
            <p class="text-gray-400 text-xs mt-1">{activity.timeAgo}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
