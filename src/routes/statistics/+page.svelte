<script lang="ts">
  import { isAuthenticated, loading } from '$lib/stores/authStore.js';
  import { login } from '$lib/authService.js';
  import { todos, notes, timerSettings, focusSessions } from '$lib/stores/pipStores.js';
  import StatCard from '$lib/components/StatCard.svelte';
  import FocusTimeChart from '$lib/components/FocusTimeChart.svelte';
  import { onMount } from 'svelte';

  type TimeUnit = 'day' | 'week' | 'month';
  let selectedTimeUnit: TimeUnit = 'day';

  // Calculate derived stats
  $: completedTodos = $todos.filter(t => t.completed).length;
  $: pendingTodos = $todos.length - completedTodos;
  $: totalNotes = $notes.length;

  // Format duration in seconds to minutes
  function formatMinutes(seconds: number): number {
    return Math.round(seconds / 60);
  }

  let sessionsLoaded = false;
  onMount(() => {
      const unsubscribe = focusSessions.subscribe(value => {
          if (value) {
              sessionsLoaded = true;
          }
      });
      
      setTimeout(() => { sessionsLoaded = true; }, 50);
      return unsubscribe;
  });

</script>

<svelte:head>
  <title>LearnFlow | Statistics</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  {#if $loading}
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)] text-4xl text-indigo-500">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
  {:else if $isAuthenticated}
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Statistics & Activity</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Todo Stats -->
      <StatCard 
        title="Tasks Completed" 
        value={completedTodos.toString()} 
        icon="fa-check-circle" 
        color="green"
      />
       <StatCard 
        title="Tasks Pending" 
        value={pendingTodos.toString()} 
        icon="fa-clipboard-list" 
        color="yellow"
      />
      <!-- Notes Stats -->
      <StatCard 
        title="Notes Created" 
        value={totalNotes.toString()} 
        icon="fa-sticky-note" 
        color="blue"
      />
    </div>

    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6 mb-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-0">Focus Time History</h2>
        <div class="flex space-x-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-md">
          {#each [
            { label: 'Day', value: 'day' }, 
            { label: 'Week', value: 'week' }, 
            { label: 'Month', value: 'month' }
          ] as unit}
            <button 
              on:click={() => selectedTimeUnit = unit.value as TimeUnit}
              class="px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition duration-150 
                     {selectedTimeUnit === unit.value 
                       ? 'bg-white dark:bg-gray-600 text-indigo-700 dark:text-white shadow' 
                       : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}"
            >
              {unit.label}
            </button>
          {/each}
        </div>
      </div>
      {#if sessionsLoaded}
         <FocusTimeChart sessions={$focusSessions} timeUnit={selectedTimeUnit} />
      {:else}
          <div class="text-center py-10 text-gray-500">Loading chart data...</div>
      {/if}
    </div>

    <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Focus Timer Settings</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       <StatCard 
        title="Work Duration" 
        value={`${formatMinutes($timerSettings.workDuration)} min`} 
        icon="fa-briefcase" 
        color="indigo"
      />
       <StatCard 
        title="Short Break" 
        value={`${formatMinutes($timerSettings.shortBreakDuration)} min`} 
        icon="fa-coffee" 
        color="teal"
      />
      <StatCard 
        title="Long Break" 
        value={`${formatMinutes($timerSettings.longBreakDuration)} min`} 
        icon="fa-umbrella-beach" 
        color="cyan"
      />
       <StatCard 
        title="Long Break Interval" 
        value={`Every ${$timerSettings.longBreakInterval} cycles`} 
        icon="fa-redo" 
        color="purple"
      />
    </div>

    <p class="mt-8 text-sm text-gray-500 dark:text-gray-400">
      *Focus time is recorded when a 'Work' timer cycle completes naturally.*
    </p>

  {:else}
    <div class="text-center py-10">
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-4">Please log in to view your statistics.</p>
      <button 
        class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150"
        on:click={login}
      >
        Log In
      </button>
    </div>
  {/if}
</div> 