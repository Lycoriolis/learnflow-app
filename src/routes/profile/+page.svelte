<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { userProfile, userProfileLoading, userProfileError } from '$lib/stores/userProfileStore';
  import { user } from '$lib/stores/authStore';
  import { userProgressStore } from '$lib/stores/userProgress';
  import { exerciseProgressService } from '$lib/services/exercises/exerciseProgressService';
  import type { CourseProgress } from '$lib/stores/userProgress';
  import EnrolledCourses from './EnrolledCourses.svelte';
  import LearningProgress from './LearningProgress.svelte';
  import ActivityLog from './ActivityLog.svelte';
  import UserSettings from './UserSettings.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

  $: activeTab = $page.data.tab || 'overview';

  const tabs = [
    { id: 'overview', label: 'Overview', description: 'Track progress at a glance', icon: 'fa-gauge-simple-high' },
    { id: 'courses', label: 'My Courses', description: 'Manage enrolled journeys', icon: 'fa-graduation-cap' },
    { id: 'activity', label: 'Activity', description: 'Review recent steps and streak', icon: 'fa-bolt' },
    { id: 'settings', label: 'Settings', description: 'Update profile preferences', icon: 'fa-sliders' }
  ];

  const quickActions = [
    { label: 'Resume learning', icon: 'fa-play', tab: 'courses' },
    { label: 'View streak', icon: 'fa-fire', tab: 'activity' },
    { label: 'Edit profile', icon: 'fa-pen', tab: 'settings' }
  ];

  const courseProgressStore = userProgressStore.courseProgress;
  const totalProgressStore = userProgressStore.totalProgress;

  let progressInitialised = false;
  let courseProgressMap: Record<string, CourseProgress> = {};
  let totalProgressData = { lessonsCompleted: 0, coursesCompleted: 0, timeSpent: 0, streakDays: 0 };
  let overviewStats: Array<{ label: string; value: string | number; icon: string; accent: string }> = [];
  let weeklyActivity: Array<{ label: string; hours: number; exercisesCompleted: number }> = [];
  let categoryProgress: Array<{ name: string; completion: number; total: number; timeSpentMinutes: number }> = [];
  let learningMetrics = {
    completionRate: 0,
    averageProgress: 0,
    totalTimeLabel: '0m',
    streak: 0,
    lastActiveLabel: 'No activity yet',
    completedExercises: 0,
    totalExercises: 0
  };
  let enrolledCourses: Array<{
    id: string;
    title: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    timeSpentMinutes: number;
    lastAccessedLabel: string;
    lastAccessedAt: number;
    href: string;
  }> = [];

  let progress = {
    coursesCompleted: 0,
    coursesInProgress: 0,
    exercisesCompleted: 0,
    totalTimeSpent: '0m',
    learningStreak: 0,
    lastActive: 'No activity yet'
  };

  function toTitleCase(input: string): string {
    return input
      .split(/[\/]/)
      .pop()!
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }

  function formatRelativeTime(timestamp?: number | Date | null): string {
    if (!timestamp) return 'No activity yet';
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    if (Number.isNaN(date.getTime())) return 'No activity yet';
    const diffMs = Date.now() - date.getTime();
    if (diffMs < 0) return 'Just now';

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diffMs < minute) return 'Just now';
    if (diffMs < hour) {
      const minutes = Math.floor(diffMs / minute);
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }
    if (diffMs < day) {
      const hours = Math.floor(diffMs / hour);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    const days = Math.floor(diffMs / day);
    if (days < 7) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    }
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} month${months === 1 ? '' : 's'} ago`;
    }
    const years = Math.floor(days / 365);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }

  function formatDurationMinutes(totalMinutes: number): string {
    if (totalMinutes <= 0) return '0m';
    if (totalMinutes < 60) return `${totalMinutes}m`;
    const hours = totalMinutes / 60;
    return hours >= 10 ? `${Math.round(hours)}h` : `${hours.toFixed(1)}h`;
  }

  function mapCourseProgress(map: Record<string, CourseProgress>): typeof enrolledCourses {
    return Object.values(map || {})
      .map((course) => {
        const lastAccessed = course.lastAccessedAt instanceof Date ? course.lastAccessedAt : new Date(course.lastAccessedAt);
  const timeSpentMinutes = Math.round(course.timeSpent || 0);
        return {
          id: course.id,
          title: toTitleCase(course.id),
          progress: Math.round(course.progressPercentage || 0),
          totalLessons: course.totalLessons || 0,
          completedLessons: course.completedLessons?.length || 0,
          timeSpentMinutes,
          lastAccessedLabel: formatRelativeTime(lastAccessed),
          lastAccessedAt: lastAccessed instanceof Date && !Number.isNaN(lastAccessed.getTime()) ? lastAccessed.getTime() : 0,
          href: `/courses/${course.id}`
        };
      })
      .sort((a, b) => {
        const timeDiff = (b.lastAccessedAt || 0) - (a.lastAccessedAt || 0);
        if (timeDiff !== 0) return timeDiff;
        return (b.progress || 0) - (a.progress || 0);
      });
  }

  function refreshExerciseStats() {
    if (!browser) return;

    const stats = exerciseProgressService.getStatistics();
    const totalMinutes = Math.round((stats.totalTimeSpent || 0) / 60000);

    const weeklyRaw = stats.weeklyProgress.map((entry) => {
      const weekDate = new Date(entry.week);
      const label = Number.isNaN(weekDate.getTime())
        ? entry.week
        : weekDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      return {
        label,
        hours: Number((entry.timeSpent / (1000 * 60 * 60)).toFixed(2)),
        exercisesCompleted: entry.exercisesCompleted
      };
    });
    weeklyActivity = weeklyRaw.slice(-7);

    categoryProgress = Object.entries(stats.categoriesProgress || {})
      .map(([name, data]) => ({
        name,
        completion: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
        total: data.total,
        completed: data.completed,
        timeSpentMinutes: Math.round((data.timeSpent || 0) / 60000)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const lastActiveLabel = formatRelativeTime(stats.lastActiveDate || null);

    progress = {
      coursesCompleted: totalProgressData?.coursesCompleted || 0,
      coursesInProgress: Object.values(courseProgressMap || {}).filter((course) => {
        const percentage = course.progressPercentage || 0;
        return percentage > 0 && percentage < 100;
      }).length,
      exercisesCompleted: stats.completedExercises,
      totalTimeSpent: formatDurationMinutes(totalMinutes),
      learningStreak: stats.streak,
      lastActive: lastActiveLabel
    };

    learningMetrics = {
      completionRate: Math.round(stats.completionRate || 0),
      averageProgress: Math.round(stats.averageProgress || 0),
      totalTimeLabel: formatDurationMinutes(totalMinutes),
      streak: stats.streak,
      lastActiveLabel,
      completedExercises: stats.completedExercises,
      totalExercises: stats.totalExercises
    };
  }

  $: courseProgressMap = $courseProgressStore || {};
  $: totalProgressData = $totalProgressStore || totalProgressData;
  $: enrolledCourses = mapCourseProgress(courseProgressMap);
  $: overviewStats = [
    { label: 'Completed Courses', value: progress.coursesCompleted, icon: 'fa-circle-check', accent: 'from-emerald-400 to-teal-500' },
    { label: 'Active Modules', value: progress.coursesInProgress, icon: 'fa-layer-group', accent: 'from-sky-400 to-indigo-500' },
    { label: 'Exercises Solved', value: progress.exercisesCompleted, icon: 'fa-list-check', accent: 'from-violet-400 to-purple-500' },
    { label: 'Learning Streak', value: `${progress.learningStreak} days`, icon: 'fa-fire-flame-curved', accent: 'from-amber-400 to-orange-500' }
  ];
  $: browser && refreshExerciseStats();

  onMount(() => {
    if (!browser) return;
    refreshExerciseStats();
  });

  $: if (!progressInitialised && browser && $user?.uid) {
    progressInitialised = true;
    userProgressStore.initializeUserProgress($user.uid);
  }

  function setActiveTab(tab: string) {
    goto(`/profile?tab=${tab}`, { replaceState: true, noScroll: true });
  }

  $: avatarUrl = $user?.photoURL || $userProfile?.avatarUrl || '';
  $: displayName = $userProfile?.displayName || $user?.displayName || 'Learner';
  $: email = $userProfile?.email || $user?.email || '';
</script>

<svelte:head>
  <title>My Profile | LearnFlow</title>
</svelte:head>

<div class="profile-page min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-10">
  <div class="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
    {#if $userProfileLoading}
      <div class="flex h-72 items-center justify-center rounded-3xl bg-white/5 backdrop-blur">
        <LoadingSpinner />
      </div>
    {:else if $userProfileError}
      <div class="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-5 text-red-200 shadow-lg">
        <p class="font-semibold">Error loading profile</p>
        <p class="text-sm opacity-80">{$userProfileError}</p>
      </div>
    {:else if $userProfile}
      <div class="space-y-8">
        <section class="rounded-3xl border border-white/5 bg-gradient-to-br from-white/8 via-white/4 to-white/2 text-white shadow-[0_32px_120px_-40px_rgba(30,64,175,0.45)] backdrop-blur-xl">
          <div class="relative overflow-hidden rounded-3xl">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_60%)]"></div>
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.28),transparent_55%)]"></div>
            <div class="relative flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
              <div class="flex flex-1 items-center gap-6">
                <div class="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500 via-sky-500 to-purple-500 shadow-xl">
                  {#if avatarUrl}
                    <img src={avatarUrl} alt={`${displayName} avatar`} class="h-full w-full object-cover" />
                  {:else}
                    <div class="flex h-full w-full items-center justify-center text-3xl font-semibold text-white/90">
                      {displayName[0]}
                    </div>
                  {/if}
                  <span class="absolute -bottom-1 -right-1 inline-flex items-center justify-center rounded-full bg-emerald-400 px-2 py-1 text-xs font-semibold text-emerald-900 shadow-lg">
                    {progress.learningStreak} day streak
                  </span>
                </div>
                <div class="space-y-3">
                  <div>
                    <h1 class="text-3xl font-semibold tracking-tight text-white">{displayName}</h1>
                    {#if email}
                      <p class="text-sm text-white/70">{email}</p>
                    {/if}
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/80">
                      <i class="fas fa-shield-check text-emerald-300"></i>
                      Verified Learner
                    </span>
                    <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                      <i class="fas fa-clock text-sky-300"></i>
                      Last active {progress.lastActive}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-3 lg:w-72">
                <p class="text-sm font-medium text-white/70">Quick actions</p>
                <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {#each quickActions as action}
                    <button
                      class="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/10"
                      on:click={() => setActiveTab(action.tab)}
                    >
                      <span class="inline-flex items-center gap-2">
                        <i class={`fas ${action.icon} text-xs opacity-80`}></i>
                        {action.label}
                      </span>
                      <i class="fas fa-arrow-right text-xs opacity-0 transition-opacity group-hover:opacity-80"></i>
                    </button>
                  {/each}
                </div>
              </div>
            </div>
          </div>
        </section>

  <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {#each overviewStats as stat}
            <div class={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 text-white shadow-lg transition-transform hover:-translate-y-1`}> 
              <div class={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${stat.accent} opacity-40 blur-3xl`}></div>
              <div class="relative">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold uppercase tracking-wide text-white/60">{stat.label}</span>
                  <i class={`fas ${stat.icon} text-sm text-white/70`}></i>
                </div>
                <p class="mt-3 text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          {/each}
        </section>

  <section class="profile-shell">
          <div class="profile-shell__nav" role="tablist" aria-label="Profile sections">
            {#each tabs as tab}
              <button
                class={`profile-tab ${activeTab === tab.id ? 'profile-tab--active' : ''}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                on:click={() => setActiveTab(tab.id)}
              >
                <div class="profile-tab__icon">
                  <i class={`fas ${tab.icon}`}></i>
                </div>
                <div class="text-left">
                  <p class="text-sm font-semibold">{tab.label}</p>
                  <p class="text-xs text-white/60">{tab.description}</p>
                </div>
                <i class="fas fa-chevron-right profile-tab__chevron"></i>
              </button>
            {/each}
          </div>

          <div class="profile-shell__content" role="tabpanel">
            {#if activeTab === 'overview'}
              <div class="space-y-10">
                <div class="rounded-3xl border border-white/5 bg-white/[0.06] p-6 shadow-lg">
                  <LearningProgress {progress} {weeklyActivity} categoryProgress={categoryProgress} metrics={learningMetrics} />
                </div>
                <div class="rounded-3xl border border-white/5 bg-white/[0.06] p-6 shadow-lg">
                  <h2 class="mb-4 text-lg font-semibold text-white">Continue learning</h2>
                  <EnrolledCourses {enrolledCourses} limit={3} />
                </div>
                <div class="rounded-3xl border border-white/5 bg-white/[0.06] p-6 shadow-lg">
                  <h2 class="mb-4 text-lg font-semibold text-white">Recent activity</h2>
                  <ActivityLog limit={5} />
                </div>
              </div>
            {:else if activeTab === 'courses'}
              <div class="rounded-3xl border border-white/5 bg-white/[0.07] p-6 shadow-lg">
                <EnrolledCourses {enrolledCourses} />
              </div>
            {:else if activeTab === 'activity'}
              <div class="rounded-3xl border border-white/5 bg-white/[0.07] p-6 shadow-lg">
                <ActivityLog />
              </div>
            {:else if activeTab === 'settings'}
              <div class="rounded-3xl border border-white/5 bg-white/[0.07] p-6 shadow-lg">
                <UserSettings profile={$userProfile} />
              </div>
            {/if}
          </div>
        </section>
      </div>
    {:else}
      <div class="rounded-3xl border border-amber-500/30 bg-amber-500/20 px-6 py-5 text-amber-100 shadow-lg">
        <p class="font-semibold">Please sign in to view your profile.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .profile-shell {
    display: grid;
    gap: 2rem;
    grid-template-columns: minmax(0, 1fr);
  }

  @media (min-width: 1024px) {
    .profile-shell {
      grid-template-columns: 320px 1fr;
      align-items: start;
    }
  }

  .profile-shell__nav {
    position: sticky;
    top: 110px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    border-radius: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.07);
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
    padding: 1.5rem;
    backdrop-filter: blur(24px);
    box-shadow: 0 24px 60px -40px rgba(37, 99, 235, 0.45);
  }

  @media (max-width: 1023px) {
    .profile-shell__nav {
      position: static;
      flex-direction: row;
      overflow-x: auto;
      padding: 1rem;
    }
  }

  .profile-tab {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.9rem;
    border-radius: 1.75rem;
    border: 1px solid transparent;
    padding: 0.9rem 1.25rem;
    text-align: left;
    color: rgba(255, 255, 255, 0.75);
    background: rgba(255, 255, 255, 0.04);
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .profile-tab:hover {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

  .profile-tab--active {
    border-color: rgba(99, 102, 241, 0.65);
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.22), rgba(168, 85, 247, 0.22));
    color: #fff;
    box-shadow: 0 18px 40px -30px rgba(99, 102, 241, 0.6);
  }

  .profile-tab__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .profile-tab__chevron {
    margin-left: auto;
    font-size: 0.7rem;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .profile-tab--active .profile-tab__chevron,
  .profile-tab:hover .profile-tab__chevron {
    opacity: 0.7;
  }

  .profile-shell__content {
    min-width: 0;
  }

  @media (max-width: 1023px) {
    .profile-tab {
      min-width: 220px;
    }
  }
</style>
