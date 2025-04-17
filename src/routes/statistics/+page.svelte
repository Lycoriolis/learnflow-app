<script lang="ts">
  import { isAuthenticated, loading as authLoading } from '$lib/stores/authStore.js';
  import { userProfile, userProfileLoading } from '$lib/stores/userProfileStore.js';
  import { focusSessions, todos, exerciseSessions } from '$lib/stores/pipStores';
  import { goto } from '$app/navigation';
  import StatCard from '$lib/components/StatCard.svelte';
  import FocusTimeChart from '$lib/components/FocusTimeChart.svelte';

  // Chart unit
  let unit: 'day' | 'week' | 'month' = 'week';

  // Derived stats
  let totalFocus = 0;
  let sessionCount = 0;
  let avgSession = 0;
  let longestSession = 0;
  let tasksDone = 0;
  let exercisesCompleted = 0;
  let enrollmentsCount = 0;

  function goToLogin() {
    goto('/login?redirect=/statistics');
  }

  // Recompute stats whenever relevant stores update
  $: if ($isAuthenticated && !$authLoading && !$userProfileLoading && $userProfile) {
    const sessions = $focusSessions;
    sessionCount = sessions.length;
    totalFocus = sessions.reduce((sum, s) => sum + s.duration / 60, 0);
    avgSession = sessionCount ? totalFocus / sessionCount : 0;
    longestSession = sessions.reduce((max, s) => Math.max(max, s.duration / 60), 0);
    tasksDone = $todos.filter(t => t.completed).length;
    exercisesCompleted = $exerciseSessions.filter(es => es.completed).length;
    const enroll = $userProfile.preferences.enrollments || [];
    enrollmentsCount = enroll.filter(e => e.progress > 0 && e.progress < 100).length;
  }
</script>

<svelte:head>
  <title>Statistics | LearnFlow</title>
</svelte:head>

{#if $authLoading}
  <div class="flex items-center justify-center min-h-[60vh]"><i class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
{:else if !$isAuthenticated}
  <div class="flex flex-col items-center justify-center min-h-[60vh]">
    <p class="text-lg text-gray-600 dark:text-gray-300 mb-4">Log in to view your statistics.</p>
    <button class="px-6 py-2 bg-indigo-600 text-white rounded" on:click={goToLogin}>Log In</button>
  </div>
{:else if $userProfileLoading}
  <div class="flex items-center justify-center min-h-[60vh]"><i class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
{:else}
  <div class="max-w-5xl mx-auto px-4 py-6 space-y-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Your Statistics</h1>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <StatCard title="Focus Sessions" value={String(sessionCount)} icon="fa-stopwatch" color="yellow" />
      <StatCard title="Total Focus (min)" value={String(Math.round(totalFocus))} icon="fa-clock" color="purple" />
      <StatCard title="Avg Session (min)" value={avgSession.toFixed(1)} icon="fa-chart-line" color="blue" />
      <StatCard title="Longest Session" value={longestSession.toFixed(1)} icon="fa-mountain" color="indigo" />
      <StatCard title="Tasks Completed" value={String(tasksDone)} icon="fa-list-check" color="green" />
      <StatCard title="Exercises Completed" value={String(exercisesCompleted)} icon="fa-pencil-alt" color="gray" />
      <StatCard title="Courses In Progress" value={String(enrollmentsCount)} icon="fa-book-open" color="red" />
    </div>
    <div class="space-y-4">
      <div class="flex items-center space-x-4">
        <label class="font-medium">View by:</label>
        <select bind:value={unit} class="rounded border-gray-300 p-2 bg-white dark:bg-gray-800">
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4" style="height: 300px;">
        <FocusTimeChart sessions={$focusSessions} timeUnit={unit} />
      </div>
    </div>
  </div>
{/if}