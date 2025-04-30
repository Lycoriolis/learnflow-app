<script lang="ts">
  export let exercise = {
    id: '',
    title: '',
    description: '',
    category: { name: '', color: 'blue' },
    icon: 'fa-code',
    difficulty: 'beginner',
    estimatedTime: ''
  };
  import { logEvent } from '$lib/services/activityService.js';
  import { goto } from '$app/navigation';

  // Map difficulty to colors
  const difficultyColors = {
    beginner: 'green',
    intermediate: 'yellow',
    advanced: 'red'
  };
</script>

<a
  href={`/exercises/${exercise.id}`}
  on:click|preventDefault={async () => {
    try {
      await logEvent('start_exercise', exercise.id);
    } catch (err) {
      console.error('Error logging start_exercise', err);
    }
    goto(`/exercises/${exercise.id}`);
  }}
  class="bg-gray-700 border border-orange-500 p-5 rounded-2xl shadow-sm squircle-sm card-hover h-full block"
>
  <div class="flex items-start mb-4">
    <div class="w-10 h-10 bg-indigo-900 rounded-lg flex items-center justify-center mr-3">
      <i class="fas {exercise.icon} text-indigo-300"></i>
    </div>
    <div class="flex-1">
      <h3 class="font-semibold text-gray-100">{exercise.title}</h3>
      <p class="text-gray-300 text-sm mb-2">{exercise.description}</p>
      <div class="flex gap-2 items-center">
        <span class="text-xs px-2 py-1 rounded-full" style="background-color: rgb(var(--color-{difficultyColors[exercise.difficulty] || 'blue'}-500))">
          {exercise.difficulty}
        </span>
        {#if exercise.estimatedTime}
          <span class="text-xs text-gray-400">
            <i class="fas fa-clock mr-1"></i>
            {exercise.estimatedTime}
          </span>
        {/if}
      </div>
    </div>
  </div>
  <div class="flex justify-between items-center">
    <span class="text-xs text-gray-300">{exercise.category.name}</span>
    <i class="fas fa-chevron-right text-gray-500"></i>
  </div>
</a>