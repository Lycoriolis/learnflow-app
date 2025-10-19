<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import Icon from '@iconify/svelte';
  import { exerciseProgressService, type ExerciseProgress } from '$lib/services/exercises/exerciseProgressService';
  import { exerciseBookmarkService } from '$lib/services/exercises/exerciseBookmarkService';

  export let className = '';

  let analytics = {
    totalExercises: 0,
    completedExercises: 0,
    totalTimeSpent: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageSessionLength: 0,
    bookmarkCount: 0,
    sessionsThisWeek: 0,
    completionRate: 0,
    favoriteCategory: '',
    recentActivity: [] as ExerciseProgress[]
  };

  let weeklyProgress = Array(7).fill(0);
  let categoryStats: { [key: string]: { completed: number; total: number; timeSpent: number } } = {};
  let difficultyStats: { [key: string]: { completed: number; total: number; averageTime: number } } = {};
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    if (!browser) return;
    
    try {
      await loadAnalytics();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load analytics';
      console.error('Analytics loading error:', err);
    } finally {
      loading = false;
    }
  });

  async function loadAnalytics() {
    // Get all progress data
    const allProgress = await exerciseProgressService.getAllProgress();
    const sessions = await exerciseProgressService.getAllSessions();
    const bookmarks = await exerciseBookmarkService.getAllBookmarks();

    // Calculate basic stats
    analytics.totalExercises = allProgress.length;
    analytics.completedExercises = allProgress.filter(p => p.isCompleted).length;
    analytics.totalTimeSpent = allProgress.reduce((sum, p) => sum + p.timeSpent, 0);
    analytics.bookmarkCount = bookmarks.length;
    analytics.completionRate = analytics.totalExercises > 0 ? 
      (analytics.completedExercises / analytics.totalExercises) * 100 : 0;

    // Calculate streaks
    const streaks = calculateStreaks(allProgress);
    analytics.currentStreak = streaks.current;
    analytics.longestStreak = streaks.longest;

    // Calculate average session length
    analytics.averageSessionLength = sessions.length > 0 ? 
      sessions.reduce((sum, s) => sum + (s.endTime ? 
        (s.endTime.getTime() - s.startTime.getTime()) / (1000 * 60) : 0), 0) / sessions.length : 0;

    // Calculate weekly activity
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    analytics.sessionsThisWeek = sessions.filter(s => s.startTime >= weekAgo).length;

    // Generate weekly progress chart data
    weeklyProgress = generateWeeklyProgress(sessions);

    // Calculate category stats
    categoryStats = calculateCategoryStats(allProgress);
    analytics.favoriteCategory = Object.entries(categoryStats)
      .sort(([,a], [,b]) => b.timeSpent - a.timeSpent)[0]?.[0] || 'N/A';

    // Calculate difficulty stats
    difficultyStats = calculateDifficultyStats(allProgress);

    // Get recent activity
    analytics.recentActivity = allProgress
      .filter(p => p.lastAccessed)
      .sort((a, b) => (b.lastAccessed?.getTime() || 0) - (a.lastAccessed?.getTime() || 0))
      .slice(0, 5);
  }

  function calculateStreaks(progress: ExerciseProgress[]) {
    const completionDates = progress
      .filter(p => p.isCompleted && p.completedAt)
      .map(p => p.completedAt!)
      .sort((a, b) => b.getTime() - a.getTime());

    if (completionDates.length === 0) {
      return { current: 0, longest: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    // Check if the most recent completion was today or yesterday
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const mostRecent = completionDates[0];
    
    if (isSameDay(mostRecent, today) || isSameDay(mostRecent, yesterday)) {
      currentStreak = 1;
    }

    // Calculate streaks
    for (let i = 0; i < completionDates.length - 1; i++) {
      const current = completionDates[i];
      const next = completionDates[i + 1];
      const daysDiff = Math.floor((current.getTime() - next.getTime()) / (24 * 60 * 60 * 1000));

      if (daysDiff === 1) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
        if (i === 0) currentStreak = 0;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);
    return { current: currentStreak, longest: longestStreak };
  }

  function isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  function generateWeeklyProgress(sessions: any[]): number[] {
    const weekData = Array(7).fill(0);
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      weekData[6 - i] = sessions.filter(s => 
        s.startTime >= dayStart && s.startTime < dayEnd
      ).length;
    }

    return weekData;
  }

  function calculateCategoryStats(progress: ExerciseProgress[]) {
    const stats: { [key: string]: { completed: number; total: number; timeSpent: number } } = {};

    progress.forEach(p => {
      const category = p.metadata?.category || 'uncategorized';
      if (!stats[category]) {
        stats[category] = { completed: 0, total: 0, timeSpent: 0 };
      }
      stats[category].total++;
      stats[category].timeSpent += p.timeSpent;
      if (p.isCompleted) {
        stats[category].completed++;
      }
    });

    return stats;
  }

  function calculateDifficultyStats(progress: ExerciseProgress[]) {
    const stats: { [key: string]: { completed: number; total: number; averageTime: number } } = {};

    progress.forEach(p => {
      const difficulty = p.metadata?.difficulty || 'unknown';
      if (!stats[difficulty]) {
        stats[difficulty] = { completed: 0, total: 0, averageTime: 0 };
      }
      stats[difficulty].total++;
      if (p.isCompleted) {
        stats[difficulty].completed++;
      }
    });

    // Calculate average times
    Object.keys(stats).forEach(difficulty => {
      const relevantProgress = progress.filter(p => 
        (p.metadata?.difficulty || 'unknown') === difficulty && p.isCompleted
      );
      if (relevantProgress.length > 0) {
        stats[difficulty].averageTime = relevantProgress.reduce((sum, p) => sum + p.timeSpent, 0) / relevantProgress.length;
      }
    });

    return stats;
  }

  function formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  }

  function formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }
</script>

<div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg {className}">
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Learning Analytics</h2>
    <button
      on:click={loadAnalytics}
      disabled={loading}
      class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
      aria-label="Refresh analytics data"
    >
      <Icon 
        icon={loading ? 'mdi:loading' : 'mdi:refresh'} 
        class="h-4 w-4 mr-2 {loading ? 'animate-spin' : ''}" 
      />
      Refresh
    </button>
  </div>

  {#if loading}
    <div class="flex items-center justify-center h-64">
      <div class="flex items-center space-x-2">
        <Icon icon="mdi:loading" class="h-6 w-6 animate-spin text-indigo-600" />
        <span class="text-gray-600 dark:text-gray-400">Loading analytics...</span>
      </div>
    </div>
  {:else if error}
    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
      <div class="flex">
        <Icon icon="mdi:alert-circle" class="h-5 w-5 text-red-400 mt-0.5" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800 dark:text-red-400">Error loading analytics</h3>
          <p class="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    </div>
  {:else}
    <!-- Overview Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
        <div class="flex items-center">
          <Icon icon="mdi:book-open-page-variant" class="h-8 w-8 opacity-80" />
          <div class="ml-3">
            <p class="text-blue-100 text-sm">Completed</p>
            <p class="text-2xl font-bold">{analytics.completedExercises}/{analytics.totalExercises}</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
        <div class="flex items-center">
          <Icon icon="mdi:clock-time-four" class="h-8 w-8 opacity-80" />
          <div class="ml-3">
            <p class="text-green-100 text-sm">Time Spent</p>
            <p class="text-2xl font-bold">{formatTime(analytics.totalTimeSpent)}</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
        <div class="flex items-center">
          <Icon icon="mdi:fire" class="h-8 w-8 opacity-80" />
          <div class="ml-3">
            <p class="text-orange-100 text-sm">Current Streak</p>
            <p class="text-2xl font-bold">{analytics.currentStreak} days</p>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
        <div class="flex items-center">
          <Icon icon="mdi:bookmark" class="h-8 w-8 opacity-80" />
          <div class="ml-3">
            <p class="text-red-100 text-sm">Bookmarks</p>
            <p class="text-2xl font-bold">{analytics.bookmarkCount}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Activity Chart -->
    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Activity</h3>
      <div class="flex items-end justify-between h-32 space-x-2">
        {#each weeklyProgress as sessions, index}
          {@const height = Math.max(8, (sessions / Math.max(...weeklyProgress, 1)) * 100)}
          {@const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
          <div class="flex flex-col items-center flex-1">
            <div 
              class="w-full bg-indigo-500 rounded-t transition-all duration-300 hover:bg-indigo-600"
              style="height: {height}%"
              title="{sessions} sessions"
            ></div>
            <span class="text-xs text-gray-500 dark:text-gray-400 mt-2">{dayNames[index]}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Category Performance -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Performance</h3>
        <div class="space-y-3">
          {#each Object.entries(categoryStats).slice(0, 5) as [category, stats]}
            {@const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{category}</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{stats.completed}/{stats.total}</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style="width: {completionRate}%"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Difficulty Breakdown -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Difficulty Breakdown</h3>
        <div class="space-y-3">
          {#each Object.entries(difficultyStats) as [difficulty, stats]}
            {@const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="capitalize text-sm font-medium text-gray-700 dark:text-gray-300">{difficulty}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {stats.completed}/{stats.total} ({Math.round(completionRate)}%)
                </span>
              </div>
              {#if stats.averageTime > 0}
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  avg: {formatTime(stats.averageTime)}
                </span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      <div class="space-y-3">
        {#each analytics.recentActivity as exercise}
          <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-md">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                {#if exercise.isCompleted}
                  <Icon icon="mdi:check-circle" class="h-5 w-5 text-green-500" />
                {:else}
                  <Icon icon="mdi:play-circle" class="h-5 w-5 text-blue-500" />
                {/if}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{exercise.exerciseId}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {exercise.completionPercentage}% complete • {formatTime(exercise.timeSpent)}
                </p>
              </div>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {exercise.lastAccessed ? formatDate(exercise.lastAccessed) : 'Never'}
            </span>
          </div>
        {:else}
          <p class="text-gray-500 dark:text-gray-400 text-center py-4">No recent activity</p>
        {/each}
      </div>
    </div>

    <!-- Additional Insights -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="text-center">
        <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          {Math.round(analytics.completionRate)}%
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Completion Rate</div>
      </div>
      
      <div class="text-center">
        <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          {formatTime(analytics.averageSessionLength)}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Avg Session Length</div>
      </div>
      
      <div class="text-center">
        <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          {analytics.longestStreak}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Longest Streak</div>
      </div>
    </div>
  {/if}
</div>
