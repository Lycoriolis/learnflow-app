<script>
  import WelcomeBanner from '$lib/components/WelcomeBanner.svelte';
  import ProgressMetrics from '$lib/components/ProgressMetrics.svelte';
  import CourseCarousel from '$lib/components/CourseCarousel.svelte';
  import ExercisesSection from '$lib/components/ExercisesSection.svelte';
  import RecentActivity from '$lib/components/RecentActivity.svelte';
  import { user } from '$lib/stores/appStore';
</script>

<svelte:head>
  <title>LearnFlow | Dashboard</title>
  <meta name="description" content="Your adaptive learning companion" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  <WelcomeBanner username={$user.name.split(' ')[0]} />
  
  <ProgressMetrics />
  
  <CourseCarousel />
  
  <ExercisesSection />
  
  <RecentActivity />
</div>
