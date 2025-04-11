<script lang="ts">
  import { onMount } from 'svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import { fly } from 'svelte/transition';
  
  // Example data - in a real app, this would come from Firebase/API
  let stats = {
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    completedLessons: 0,
    avgEngagement: 0,
  };
  
  let recentUsers = [];
  let recentCourses = [];
  let isLoading = true;
  
  onMount(async () => {
    // Simulate API call to get dashboard data
    setTimeout(() => {
      stats = {
        totalUsers: 125,
        activeUsers: 42,
        totalCourses: 15,
        completedLessons: 863,
        avgEngagement: 28
      };
      
      recentUsers = [
        { id: '1', name: 'John Doe', email: 'john@example.com', joinedAt: '2 days ago' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', joinedAt: '5 days ago' },
        { id: '3', name: 'Mike Johnson', email: 'mike@example.com', joinedAt: '1 week ago' }
      ];
      
      recentCourses = [
        { id: '1', title: 'Introduction to Python', enrollments: 45, status: 'Published' },
        { id: '2', title: 'Advanced Mathematics', enrollments: 32, status: 'Published' },
        { id: '3', title: 'Web Development Basics', enrollments: 53, status: 'Published' }
      ];
      
      isLoading = false;
    }, 1000);
  });
</script>

<svelte:head>
  <title>Admin Dashboard | LearnFlow</title>
</svelte:head>

{#if isLoading}
  <div class="flex justify-center items-center h-64">
    <div class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
  </div>
{:else}
  <div in:fly={{ y: 20, duration: 300 }}>
    <!-- Welcome Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Welcome to the Admin Dashboard</h2>
      <p class="text-gray-600 dark:text-gray-300">
        Here you can manage your learning platform - view analytics, manage users, courses, and more.
      </p>
    </div>
    
    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Total Users"
        value={stats.totalUsers.toString()}
        icon="fa-users"
        color="blue"
      />
      <StatCard
        title="Active Users"
        value={stats.activeUsers.toString()}
        icon="fa-user-check"
        color="green"
      />
      <StatCard
        title="Total Courses"
        value={stats.totalCourses.toString()}
        icon="fa-graduation-cap"
        color="purple"
      />
      <StatCard
        title="Completed Lessons"
        value={stats.completedLessons.toString()}
        icon="fa-check-circle"
        color="indigo"
      />
      <StatCard
        title="Avg. Engagement (min/day)"
        value={stats.avgEngagement.toString()}
        icon="fa-clock"
        color="yellow"
      />
    </div>
    
    <!-- Recent Activity Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Users -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Users</h3>
            <a href="/admin/users" class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View all</a>
          </div>
        </div>
        <div class="p-6">
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each recentUsers as user}
              <li class="py-4 flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">Joined {user.joinedAt}</span>
              </li>
            {/each}
          </ul>
        </div>
      </div>
      
      <!-- Recent Courses -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recent Courses</h3>
            <a href="/admin/courses" class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View all</a>
          </div>
        </div>
        <div class="p-6">
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each recentCourses as course}
              <li class="py-4">
                <div class="flex justify-between">
                  <div>
                    <a href="/admin/courses/{course.id}" class="text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                      {course.title}
                    </a>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{course.enrollments} enrollments</p>
                  </div>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {course.status}
                  </span>
                </div>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md mt-6 p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a href="/admin/users/new" class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150">
          <i class="fas fa-user-plus text-indigo-500 text-xl mr-3"></i>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Add New User</span>
        </a>
        <a href="/admin/courses/new" class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150">
          <i class="fas fa-plus-circle text-green-500 text-xl mr-3"></i>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Create Course</span>
        </a>
        <a href="/admin/statistics" class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150">
          <i class="fas fa-chart-line text-blue-500 text-xl mr-3"></i>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">View Analytics</span>
        </a>
        <a href="/admin/settings" class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150">
          <i class="fas fa-cog text-gray-500 text-xl mr-3"></i>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Site Settings</span>
        </a>
      </div>
    </div>
  </div>
{/if} 