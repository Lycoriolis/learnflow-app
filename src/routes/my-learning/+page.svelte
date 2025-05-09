<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { userProfile, userProfileLoading } from '$lib/stores/userProfileStore.js';
  import { isAuthenticated, loading as authLoading } from '$lib/stores/authStore.js';
  import { loadContent, type ContentMetadata, type ContentItem } from '$lib/services/contentService.js';
  import type { UserProfile } from '$lib/services/userService.js';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';

  interface Enrollment { id: string; progress: number; lastAccessed: number; }

  let coursesData = writable<{ meta: ContentItem; enrollment: Enrollment }[]>([]);
  let loading = false;
  let error: string | null = null;
  let activeTab: 'in-progress' | 'completed' | 'all' = 'in-progress';
  let profileUnsub: () => void;

  function goToLogin() { goto('/login?redirect=/my-learning'); }

  async function loadCourses(profile: UserProfile | null) {
    loading = true;
    error = null;

    if (profile && profile.preferences && profile.preferences.enrollments && profile.preferences.enrollments.length > 0) {
      const coursesDataPromises = profile.preferences.enrollments.map(
        async (enrollmentId: string) => {
          const meta = await loadContent('course', enrollmentId);
          if (!meta) {
            console.warn(`Metadata not found for course ID: ${enrollmentId}`);
            return null;
          }

          const courseProgressData = profile.progress?.[enrollmentId];
          const enrollment: Enrollment = {
            id: enrollmentId,
            progress: courseProgressData?.overallProgress ?? 0,
            lastAccessed: courseProgressData?.lastAccessed ?? 0
          };
          return { meta, enrollment };
        }
      );
      const coursesDataResults = await Promise.all(coursesDataPromises);
      coursesData.set(coursesDataResults.filter(
        (course): course is { meta: ContentItem; enrollment: Enrollment } => course !== null && course.meta !== null
      ));
    } else {
      coursesData.set([]);
    }
    loading = false;
  }

  onMount(() => {
    if (!$isAuthenticated) return;
    profileUnsub = userProfileLoading.subscribe((loadingProfile) => {
      if (!loadingProfile && $userProfile) {
        loadCourses($userProfile);
      }
    });
  });

  onDestroy(() => {
    if (profileUnsub) profileUnsub();
  });

  // Derived lists
  $: myCourses = $coursesData.filter(c => c.enrollment.progress > 0 && c.enrollment.progress < 100);
  $: completedCourses = $coursesData.filter(c => c.enrollment.progress === 100);
  $: allCourses = $coursesData;
  $: suggestion = allCourses.find(c => c.enrollment.progress > 0 && c.enrollment.progress < 100);
</script>

<svelte:head>
  <title>My Learning | LearnFlow</title>
</svelte:head>

{#if $authLoading || $userProfileLoading || loading}
  <div class="flex items-center justify-center min-h-[60vh]"><i class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
{:else if !$isAuthenticated}
  <div class="flex flex-col items-center justify-center min-h-[60vh]">
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-4">Please log in to view your learning progress.</p>
    <button class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md" on:click={goToLogin}>Log In</button>
  </div>
{:else}
  <div class="max-w-7xl mx-auto px-4 py-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">My Learning</h1>
    {#if error}
      <div class="text-red-500 mb-4">{error}</div>
    {/if}
    {#if allCourses.length === 0}
      <div class="text-center text-gray-600 dark:text-gray-400 py-20">
        <p>You are not enrolled in any courses yet.</p>
        <a href="/courses" class="mt-4 inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">Browse Courses</a>
      </div>
    {:else}
      <!-- Suggestion -->
      {#if suggestion}
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Continue Learning</h2>
          <p class="text-gray-700 dark:text-gray-300">Next: {suggestion.meta.title}</p>
          <a href={`/courses/${suggestion.meta.id}`} class="mt-4 inline-block text-indigo-600 hover:underline">Go to Course</a>
        </div>
      {/if}
      <!-- Tabs -->
      <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
        <button class={`py-2 px-4 ${activeTab==='in-progress'? 'border-b-2 border-indigo-500 text-indigo-600':''}`} on:click={()=>activeTab='in-progress'}>In Progress</button>
        <button class={`py-2 px-4 ${activeTab==='completed'? 'border-b-2 border-indigo-500 text-indigo-600':''}`} on:click={()=>activeTab='completed'}>Completed</button>
        <button class={`py-2 px-4 ${activeTab==='all'? 'border-b-2 border-indigo-500 text-indigo-600':''}`} on:click={()=>activeTab='all'}>All</button>
      </div>
      <!-- Course List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each (activeTab==='in-progress'? myCourses : activeTab==='completed'? completedCourses : allCourses) as item (item.meta.id)}
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.meta.title}</h3>
            <div class="flex items-center mb-2">
              <div class="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div class="h-2 bg-indigo-600 dark:bg-indigo-500" style="width:{item.enrollment.progress}%"></div>
              </div>
              <span class="ml-2 text-sm">{item.enrollment.progress}%</span>
            </div>
            <a href={`/courses/${item.meta.id}`} class="mt-auto text-indigo-600 hover:underline">View Course</a>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}