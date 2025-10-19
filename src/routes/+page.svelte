<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import WelcomeBanner from '$lib/components/WelcomeBanner.svelte';
  import ProgressMetrics from '$lib/components/ProgressMetrics.svelte';
  import CourseCarousel from '$lib/components/courses/CourseCarousel.svelte';
  import ExercisesSection from '$lib/components/ExercisesSection.svelte';
  import RecentActivity from '$lib/components/RecentActivity.svelte';
  import { isAuthenticated, user, loading as authLoading } from '$lib/stores/authStore.js';
  import GeneralWelcome from '$lib/components/GeneralWelcome.svelte';
  import { userProfile, userProfileLoading } from '$lib/stores/userProfileStore.js';
  import { focusSessions, todos } from '$lib/stores/pipStores';
  import FocusTimeChart from '$lib/components/FocusTimeChart.svelte';
  import { logStart, logEnd } from '$lib/services/activityService';
  import RecommendationsSection from '$lib/components/RecommendationsSection.svelte';
  import ScoreCard from '$lib/components/ScoreCard.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  // Initialize suggested courses from data or default to empty array
  $: suggestedContent = data.suggestedContent || [];
  $: safeSuggestedContent = Array.isArray(suggestedContent) ? suggestedContent : [];
  $: suggestedCourses = safeSuggestedContent.filter((item: any) => item.type === 'course') || [];

  type Metric = { title: string; value: string; icon: string; color: string };
  let metrics: Metric[] = [];
  let dashboardEventId: string | null = null;

  onMount(() => {
    let dashboardEventId: string | null = null;
    
    // Initialize dashboard event logging asynchronously
    logStart('view_dashboard', 'dashboard').then((id) => {
      dashboardEventId = id;
    }).catch((error) => {
      console.error('Failed to log dashboard start:', error);
    });

    const updateMetrics = () => {
      if ($isAuthenticated && $userProfile) {
        const preferences = ($userProfile as any).preferences;
        const enrollments: any[] = preferences?.enrollments || [];
        const inProgress = enrollments.filter((e: any) => e.progress > 0 && e.progress < 100).length;
        const completed = enrollments.filter((e: any) => e.progress === 100).length;
        const sessions = $focusSessions;
        const sessionCount = sessions.length;
        const totalFocus = sessions.reduce((sum: number, s: any) => sum + (s.duration || 0) / 60, 0).toFixed(0);
        const tasksDone = $todos.filter((t: any) => t.completed).length;
        metrics = [
          { title: 'Courses In Progress', value: String(inProgress), icon: 'fa-book', color: 'indigo' },
          { title: 'Courses Completed', value: String(completed), icon: 'fa-award', color: 'green' },
          { title: 'Focus Sessions', value: String(sessionCount), icon: 'fa-stopwatch', color: 'yellow' },
          { title: 'Total Focus Time (min)', value: totalFocus, icon: 'fa-clock', color: 'red' },
          { title: 'Tasks Completed', value: String(tasksDone), icon: 'fa-list-check', color: 'blue' }
        ];
      }
    };

    updateMetrics();

    const unsubscribeUserProfile = userProfile.subscribe(updateMetrics);
    const unsubscribeFocusSessions = focusSessions.subscribe(updateMetrics);
    const unsubscribeTodos = todos.subscribe(updateMetrics);

    return () => {
      unsubscribeUserProfile();
      unsubscribeFocusSessions();
      unsubscribeTodos();
    };
  });

  onDestroy(() => {
    if (dashboardEventId) {
      logEnd(dashboardEventId);
    }
  });
</script>

<svelte:head>
  <title>LearnFlow | Your Dashboard</title>
  <meta name="description" content="Your personalized learning dashboard on LearnFlow." />
</svelte:head>

<div class="p-6 sm:p-8 md:p-10 text-slate-100">
  {#if $authLoading || $userProfileLoading}
    <div class="flex justify-center items-center min-h-[60vh]"><i class="fas fa-spinner fa-spin text-4xl text-cyan-500"></i></div>
  {:else if $isAuthenticated && $userProfile}
    <WelcomeBanner username={$user ? ($user.displayName ?? $user.email ?? '') : ''} />

    <ProgressMetrics {metrics} />

    <div class="mb-10">
      <h2 class="text-2xl sm:text-3xl font-semibold text-slate-100 mb-6 pb-2 border-b-2 border-cyan-500/30">Focus Time Log</h2>
      <div class="bg-slate-800/70 p-4 sm:p-6 rounded-xl border border-slate-700 shadow-xl">
        <FocusTimeChart sessions={$focusSessions} timeUnit="day" />
      </div>
    </div>

    <div class="mb-10">
      <h2 class="text-2xl sm:text-3xl font-semibold text-slate-100 mb-6 pb-2 border-b-2 border-sky-500/30">Quick Actions & Overview</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        
        <div class="bg-slate-800/70 rounded-xl border border-slate-700 shadow-xl p-5 group hover:border-slate-600/80 transition-all duration-300">
          <CourseCarousel title="Suggested Courses" courses={suggestedCourses} />
        </div>

        <div class="bg-slate-800/70 rounded-xl border border-slate-700 shadow-xl p-5 group hover:border-slate-600/80 transition-all duration-300">
          <ExercisesSection limit={3} /> 
        </div>

        <div class="bg-slate-800/70 rounded-xl border border-slate-700 shadow-xl p-6 flex flex-col items-center justify-center text-center group hover:border-slate-600/80 transition-all duration-300 min-h-[180px]">
          <h3 class="text-xl font-semibold mb-2 text-slate-100 group-hover:text-cyan-400 transition-colors">Your Tasks</h3>
          <p class="text-slate-400 mb-4">Manage your study tasks efficiently.</p>
          <a href="/todos" class="mt-auto px-4 py-2 text-sm font-medium rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50">View Tasks</a>
        </div>

        <div class="bg-slate-800/70 rounded-xl border border-slate-700 shadow-xl p-6 flex flex-col items-center justify-center text-center group hover:border-slate-600/80 transition-all duration-300 min-h-[180px]">
          <h3 class="text-xl font-semibold mb-2 text-slate-100 group-hover:text-sky-400 transition-colors">Your Notes</h3>
          <p class="text-slate-400 mb-4">Jot down quick thoughts and ideas.</p>
          <a href="/notes" class="mt-auto px-4 py-2 text-sm font-medium rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50">View Notes</a>
        </div>
      </div>
    </div>

    <div class="mb-10">
      <ScoreCard />
    </div>

    <div class="mb-10">
      <RecommendationsSection limit={4} />
    </div>
    
    <RecentActivity />

  {:else}
    <GeneralWelcome />
  {/if}
</div>
