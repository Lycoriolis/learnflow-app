<script>
  import WelcomeBanner from '$lib/components/WelcomeBanner.svelte';
  import ProgressMetrics from '$lib/components/ProgressMetrics.svelte';
  import CourseCarousel from '$lib/components/CourseCarousel.svelte';
  import ExercisesSection from '$lib/components/ExercisesSection.svelte';
  import RecentActivity from '$lib/components/RecentActivity.svelte';
  import { isAuthenticated, user, loading } from '$lib/stores/authStore.js';
  import GeneralWelcome from '$lib/components/GeneralWelcome.svelte';
</script>

<svelte:head>
  <title>LearnFlow | Your Adaptive Learning Companion</title>
  <meta name="description" content="Welcome to LearnFlow, your adaptive learning companion." />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  {#if $loading}
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <p class="text-gray-500">Loading...</p>
    </div>
  {:else if $isAuthenticated && $user}
    <WelcomeBanner username={$user.given_name ?? $user.nickname ?? 'Learner'} />
    
    <ProgressMetrics />
    
    <CourseCarousel />
    
    <ExercisesSection />
    
    <RecentActivity />

  {:else}
    <GeneralWelcome />
  {/if}
</div>
