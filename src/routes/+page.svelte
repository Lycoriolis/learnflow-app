<script lang="ts">
  import { onMount } from 'svelte';
  import WelcomeBanner from '$lib/components/WelcomeBanner.svelte';
  import ProgressMetrics from '$lib/components/ProgressMetrics.svelte';
  import CourseCarousel from '$lib/components/CourseCarousel.svelte';
  import ExercisesSection from '$lib/components/ExercisesSection.svelte';
  import RecentActivity from '$lib/components/RecentActivity.svelte';
  import { isAuthenticated, user, loading as authLoading } from '$lib/stores/authStore.js';
  import GeneralWelcome from '$lib/components/GeneralWelcome.svelte';
  import { userProfile, userProfileLoading } from '$lib/stores/userProfileStore.js';
  import { focusSessions, todos } from '$lib/stores/pipStores';
  import { listContent, type ContentMetadata } from '$lib/services/contentService.js';
  import FocusTimeChart from '$lib/components/FocusTimeChart.svelte';
  import { writable } from 'svelte/store';

  // Data stores
  let metrics = [];
  let suggestions = writable<ContentMetadata[]>([]);

  // Compute dynamic data on mount
  onMount(async () => {
    if ($isAuthenticated && $userProfile) {
      const enrollments = $userProfile.preferences.enrollments || [];
      const courses = await listContent('course');
      // Metrics
      const inProgress = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
      const completed = enrollments.filter(e => e.progress === 100).length;
      const sessions = $focusSessions;
      const sessionCount = sessions.length;
      const totalFocus = sessions.reduce((sum, s) => sum + s.duration / 60, 0).toFixed(0);
      const tasksDone = $todos.filter(t => t.completed).length;
      metrics = [
        { title: 'Courses In Progress', value: String(inProgress), icon: 'fa-book', color: 'indigo' },
        { title: 'Courses Completed', value: String(completed), icon: 'fa-award', color: 'green' },
        { title: 'Focus Sessions', value: String(sessionCount), icon: 'fa-stopwatch', color: 'yellow' },
        { title: 'Total Focus Time (min)', value: totalFocus, icon: 'fa-clock', color: 'purple' },
        { title: 'Tasks Completed', value: String(tasksDone), icon: 'fa-list-check', color: 'blue' }
      ];
      // Suggestions: courses not enrolled yet
      const enrolledIds = enrollments.map(e => e.id);
      const available = courses.filter(c => !enrolledIds.includes(c.id));
      suggestions.set(available);
    }
  });
</script>

<svelte:head>
  <title>LearnFlow | Your Dashboard</title>
  <meta name="description" content="Your personalized learning dashboard on LearnFlow." />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  {#if $authLoading || $userProfileLoading}
    <div class="flex justify-center items-center min-h-[60vh]"><i class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
  {:else if $isAuthenticated && $userProfile}
    <WelcomeBanner username={$user.displayName ?? $user.email} />

    <ProgressMetrics {metrics} />

    <div class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Focus Time Log</h2>
      <FocusTimeChart sessions={$focusSessions} timeUnit="day" />
    </div>

    <div class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CourseCarousel title="Continue Learning" items={$suggestions} />
        <ExercisesSection />
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 class="text-lg font-semibold mb-2">Your Tasks</h3>
          <p class="text-gray-600 dark:text-gray-300">Manage your study tasks.</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 class="text-lg font-semibold mb-2">Your Notes</h3>
          <p class="text-gray-600 dark:text-gray-300">Jot down quick thoughts.</p>
        </div>
      </div>
    </div>

    <RecentActivity />

  {:else}
    <GeneralWelcome />
  {/if}
</div>
