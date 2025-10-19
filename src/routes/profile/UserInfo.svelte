<script lang="ts">
  import type { UserProfile } from '$lib/types/shared';
  
  export let profile: UserProfile;
  export let progress: {
    coursesCompleted: number;
    coursesInProgress: number;
    exercisesCompleted: number;
    totalTimeSpent: number;
    learningStreak: number;
    lastActive: string;
  };

  // Default avatar if user doesn't have one
  const defaultAvatar = '/images/default-avatar.png';
</script>

<div class="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
  <div class="flex flex-col items-center text-center mb-6">
    <div class="w-32 h-32 relative mb-4">
      <img 
        src={profile.photoURL || defaultAvatar} 
        alt="Profile Picture" 
        class="rounded-full object-cover w-full h-full border-4 border-orange-500"
        on:error={() => { 
          const img = event.target as HTMLImageElement;
          img.src = '/images/default-avatar.png';
        }}
      />
      <div class="absolute bottom-0 right-0 bg-gray-900 rounded-full p-2 cursor-pointer hover:bg-gray-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
    </div>
    
    <h1 class="text-2xl font-bold text-white">
      {profile.displayName || 'Learner'}
    </h1>
    
    <p class="text-gray-400 mt-1">{profile.email}</p>
    
    {#if profile.isPremium}
      <div class="mt-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
        Premium Member
      </div>
    {/if}
  </div>
  
  <div class="border-t border-gray-700 pt-6">
    <h2 class="text-lg font-semibold text-white mb-4">Learning Stats</h2>
    
    <div class="grid grid-cols-2 gap-4">
      <div class="text-center">
        <p class="text-2xl font-bold text-blue-500">{progress.coursesCompleted}</p>
        <p class="text-xs text-gray-400">Courses Completed</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-green-500">{progress.coursesInProgress}</p>
        <p class="text-xs text-gray-400">Courses In Progress</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-red-500">{progress.exercisesCompleted}</p>
        <p class="text-xs text-gray-400">Exercises Completed</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-orange-500">{progress.learningStreak}</p>
        <p class="text-xs text-gray-400">Day Streak</p>
      </div>
    </div>
    
    <div class="mt-6 text-sm text-gray-400">
      <div class="flex justify-between">
        <span>Total Time Spent:</span>
        <span class="text-white">{progress.totalTimeSpent} hours</span>
      </div>
      <div class="flex justify-between mt-2">
        <span>Last Active:</span>
        <span class="text-white">{progress.lastActive}</span>
      </div>
    </div>
  </div>
</div>
