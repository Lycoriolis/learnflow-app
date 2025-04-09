<!-- src/routes/admin/statistics/+page.svelte -->
<script lang="ts">
  import StatCard from '$lib/components/StatCard.svelte';

  // --- Mock Data (Replace with data loaded from API in +page.ts) ---
  const totalUsers = 125; // Example
  const activeUsersToday = 34;
  const coursesPublished = 5;
  const averageFocusTime = 45; // Example in minutes
  const mostPopularCourse = 'Algebra Basics';
  // --- End Mock Data ---

</script>

<svelte:head>
  <title>Admin | Site Statistics</title>
</svelte:head>

<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Site Statistics</h1>

<p class="mb-6 text-sm text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-gray-700 p-3 rounded-md border border-orange-200 dark:border-orange-600">
  <i class="fas fa-exclamation-triangle mr-2"></i>
  Note: The data displayed on this page is currently mock data for demonstration purposes. A backend API is required to fetch real-time aggregate user statistics.
</p>

<!-- Key Metrics -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  <StatCard
    title="Total Registered Users"
    value={totalUsers.toString()}
    icon="fa-users"
    color="blue"
  />
  <StatCard
    title="Active Users (Today)"
    value={activeUsersToday.toString()}
    icon="fa-user-clock"
    color="green"
  />
  <StatCard
    title="Published Courses"
    value={coursesPublished.toString()}
    icon="fa-book-open"
    color="purple"
  />
   <StatCard
    title="Avg. Focus Time / User"
    value={`${averageFocusTime} min`}
    icon="fa-stopwatch"
    color="indigo"
  />
   <StatCard
    title="Most Popular Course"
    value={mostPopularCourse}
    icon="fa-fire"
    color="red"
  />
   <!-- Add more relevant stats -->
</div>

<!-- Placeholder for Charts -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">User Sign-ups Over Time (Placeholder)</h2>
      <div class="h-64 flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
         Chart would be here (e.g., Line chart showing signups per day/week/month)
      </div>
  </div>
   <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Course Completion Rates (Placeholder)</h2>
      <div class="h-64 flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
         Chart would be here (e.g., Bar chart showing completion % per course)
      </div>
  </div>
</div> 