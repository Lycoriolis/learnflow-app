<script lang="ts">
  export let progress: {
    coursesCompleted: number;
    coursesInProgress: number;
    exercisesCompleted: number;
    totalTimeSpent: string;
    learningStreak: number;
    lastActive: string;
  };

  export let weeklyActivity: Array<{
    label: string;
    hours: number;
    exercisesCompleted: number;
  }> = [];

  export let categoryProgress: Array<{
    name: string;
    completion: number;
    total: number;
    completed?: number;
    timeSpentMinutes: number;
  }> = [];

  export let metrics: {
    completionRate: number;
    averageProgress: number;
    totalTimeLabel: string;
    streak: number;
    lastActiveLabel: string;
    completedExercises: number;
    totalExercises: number;
  } = {
    completionRate: 0,
    averageProgress: 0,
    totalTimeLabel: '0m',
    streak: 0,
    lastActiveLabel: 'No activity yet',
    completedExercises: 0,
    totalExercises: 0
  };

  $: maxHours = weeklyActivity.length ? Math.max(...weeklyActivity.map((entry) => entry.hours)) : 0;

  let keyMetrics: Array<{ label: string; value: string; icon: string }> = [];
  $: completedSummary = metrics.totalExercises > 0
    ? `${metrics.completedExercises}/${metrics.totalExercises}`
    : `${metrics.completedExercises}`;
  $: keyMetrics = [
    { label: 'Completion Rate', value: `${metrics.completionRate}%`, icon: 'fa-circle-check' },
    { label: 'Average Progress', value: `${metrics.averageProgress}%`, icon: 'fa-chart-line' },
    { label: 'Exercises Completed', value: completedSummary, icon: 'fa-list-check' },
    { label: 'Total Time Spent', value: metrics.totalTimeLabel, icon: 'fa-clock' }
  ];

  function getBarHeight(hours: number) {
    if (!maxHours) return 8;
    const maxHeight = 120;
    return Math.max(8, (hours / maxHours) * maxHeight);
  }
</script>

<div>
  <h2 class="text-xl font-semibold text-white mb-6">Learning Progress</h2>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="bg-gray-700 rounded-lg p-5">
      <h3 class="text-lg font-medium text-white mb-4">Weekly Activity</h3>

      {#if weeklyActivity.length === 0}
        <div class="flex h-32 items-center justify-center text-sm text-gray-300">
          No activity recorded yet.
        </div>
      {:else}
        <div class="flex items-end justify-between h-36 mb-2 gap-2">
          {#each weeklyActivity as entry}
            <div class="flex flex-1 flex-col items-center">
              <div class="text-xs text-gray-400 mb-1">{entry.hours.toFixed(1)}h</div>
              <div
                class="w-8 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm"
                style={`height:${getBarHeight(entry.hours)}px`}
                aria-label={`${entry.hours.toFixed(1)} hours in ${entry.label}`}
              ></div>
              <div class="mt-2 text-xs text-gray-400">{entry.label}</div>
              <div class="text-[10px] text-gray-500">{entry.exercisesCompleted} ex</div>
            </div>
          {/each}
        </div>
        <p class="text-xs text-gray-400 text-right">Includes exercises completed each week.</p>
      {/if}
    </div>

    <div class="bg-gray-700 rounded-lg p-5">
      <h3 class="text-lg font-medium text-white mb-4">Category Progress</h3>

      {#if categoryProgress.length === 0}
        <div class="text-sm text-gray-300">No category breakdown available yet.</div>
      {:else}
        <div class="space-y-4">
          {#each categoryProgress as category}
            <div>
              <div class="flex justify-between mb-1 text-sm text-gray-300">
                <span>{category.name}</span>
                <span>{category.completion}%</span>
              </div>
              <div class="w-full bg-gray-600 rounded-full h-2.5">
                <div
                  class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                  style={`width:${Math.min(category.completion, 100)}%`}
                ></div>
              </div>
              <div class="mt-1 text-xs text-gray-400">
                {category.completed ?? 0}/{category.total} completed · {category.timeSpentMinutes}m spent
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <div class="mt-8 bg-gray-700 rounded-lg p-5">
    <h3 class="text-lg font-medium text-white mb-4">Key Metrics</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {#each keyMetrics as metric}
        <div class="rounded-lg border border-gray-600 bg-gray-800 px-4 py-5 text-white">
          <div class="flex items-center justify-between">
            <span class="text-xs uppercase tracking-wide text-gray-400">{metric.label}</span>
            <i class={`fas ${metric.icon} text-sm text-gray-400`}></i>
          </div>
          <p class="mt-3 text-2xl font-semibold">{metric.value}</p>
        </div>
      {/each}
    </div>
    <div class="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-300">
      <span><i class="fas fa-fire text-orange-400 mr-2"></i>{progress.learningStreak} day streak</span>
      <span><i class="fas fa-clock text-sky-400 mr-2"></i>Last active {metrics.lastActiveLabel}</span>
    </div>
  </div>
</div>
