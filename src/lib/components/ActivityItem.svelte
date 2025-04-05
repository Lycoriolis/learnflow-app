<script lang="ts">
  export let activity = {
    id: '',
    type: '', // 'completed', 'started', 'achievement'
    title: '',
    description: '',
    timestamp: '',
    icon: 'fa-check-circle',
    color: 'indigo' // indigo, blue, green
  };
  
  // Get appropriate icon and color based on activity type
  $: icon = activity.icon || 
    (activity.type === 'completed' ? 'fa-check-circle' : 
     activity.type === 'started' ? 'fa-book' : 
     activity.type === 'achievement' ? 'fa-trophy' : 'fa-circle');
     
  $: color = activity.color || 
    (activity.type === 'completed' ? 'indigo' : 
     activity.type === 'started' ? 'blue' : 
     activity.type === 'achievement' ? 'green' : 'gray');
</script>

<div class="flex items-start">
  <div class="w-10 h-10 bg-{color}-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
    <i class="fas {icon} text-{color}-600"></i>
  </div>
  <div>
    <h3 class="font-medium text-gray-800">{activity.title}</h3>
    <p class="text-gray-500 text-sm">{activity.description}</p>
    <p class="text-gray-400 text-xs mt-1">{activity.timestamp}</p>
  </div>
</div> 