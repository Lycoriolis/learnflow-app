<script lang="ts">
  import { onMount } from 'svelte';
  
  // Accept the progress prop from parent
  export let progress: {
    coursesCompleted: number;
    coursesInProgress: number;
    exercisesCompleted: number;
    totalTimeSpent: number;
    learningStreak: number;
    lastActive: string;
  };
  
  // These would come from real data in a production app
  let weeklyActivity = [
    { day: 'Mon', hours: 1.5 },
    { day: 'Tue', hours: 2.2 },
    { day: 'Wed', hours: 0.8 },
    { day: 'Thu', hours: 1.7 },
    { day: 'Fri', hours: 3.0 },
    { day: 'Sat', hours: 0.5 },
    { day: 'Sun', hours: 1.2 }
  ];
  
  let skills = [
    { name: 'Calculus', level: 85 },
    { name: 'Linear Algebra', level: 72 },
    { name: 'Quantum Physics', level: 45 },
    { name: 'Graph Theory', level: 60 }
  ];
  
  // Function to calculate the height of the activity bar
  function getBarHeight(hours: number) {
    const maxHeight = 100; // maximum height in pixels
    const maxHours = Math.max(...weeklyActivity.map(day => day.hours));
    return (hours / maxHours) * maxHeight;
  }
</script>

<div>
  <h2 class="text-xl font-semibold text-white mb-6">Learning Progress</h2>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Weekly Activity Chart -->
    <div class="bg-gray-700 rounded-lg p-5">
      <h3 class="text-lg font-medium text-white mb-4">Weekly Activity</h3>
      
      <div class="flex items-end justify-between h-32 mb-2">
        {#each weeklyActivity as day}
          <div class="flex flex-col items-center">
            <div class="text-xs text-gray-400 mb-1">{day.hours}h</div>
            <div 
              class="w-8 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm"
              style="height: {getBarHeight(day.hours)}px"
            ></div>
          </div>
        {/each}
      </div>
      
      <div class="flex justify-between mt-2">
        {#each weeklyActivity as day}
          <div class="text-xs text-gray-400">{day.day}</div>
        {/each}
      </div>
    </div>
    
    <!-- Skills Progress -->
    <div class="bg-gray-700 rounded-lg p-5">
      <h3 class="text-lg font-medium text-white mb-4">Skills Progress</h3>
      
      <div class="space-y-4">
        {#each skills as skill}
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-sm text-gray-300">{skill.name}</span>
              <span class="text-sm text-gray-400">{skill.level}%</span>
            </div>
            <div class="w-full bg-gray-600 rounded-full h-2.5">
              <div 
                class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" 
                style="width: {skill.level}%"
              ></div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
  
  <!-- Learning Goals -->
  <div class="mt-8 bg-gray-700 rounded-lg p-5">
    <h3 class="text-lg font-medium text-white mb-4">Learning Goals</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gray-800 p-4 rounded-lg">
        <div class="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h4 class="text-white font-medium">Daily Goal</h4>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400 text-sm">1 hour of learning</span>
          <span class="text-green-500 text-sm font-medium">Completed</span>
        </div>
      </div>
      
      <div class="bg-gray-800 p-4 rounded-lg">
        <div class="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 class="text-white font-medium">Weekly Goal</h4>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400 text-sm">5 exercises completed</span>
          <span class="text-yellow-500 text-sm font-medium">In Progress (3/5)</span>
        </div>
      </div>
      
      <div class="bg-gray-800 p-4 rounded-lg">
        <div class="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h4 class="text-white font-medium">Monthly Goal</h4>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400 text-sm">Complete 1 course</span>
          <span class="text-yellow-500 text-sm font-medium">In Progress (75%)</span>
        </div>
      </div>
    </div>
  </div>
</div>
