<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/authStore.js';
  
  // Dashboard metrics (mock data)
  let stats = {
    activeUsers: { value: 0, change: 8.2 },
    enrolledStudents: { value: 0, change: 12.5 },
    activeCourses: { value: 0, change: 3.7 },
    completionRate: { value: 0, change: -2.1 }
  };
  
  let recentActivities = [];
  let pendingActions = [];
  let courseEngagementData = [];
  let isLoading = true;
  
  // Load dashboard data
  onMount(async () => {
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock data for dashboard
      stats = {
        activeUsers: { value: 243, change: 8.2 },
        enrolledStudents: { value: 1054, change: 12.5 },
        activeCourses: { value: 18, change: 3.7 },
        completionRate: { value: 76.8, change: -2.1 }
      };
      
      recentActivities = [
        { 
          id: 1, 
          type: 'enrollment', 
          user: 'John Doe', 
          action: 'enrolled in', 
          target: 'Web Development Basics', 
          timestamp: '2 hours ago',
          iconClass: 'fa-user-plus text-green-500 bg-green-100 dark:bg-green-900'
        },
        { 
          id: 2, 
          type: 'completion', 
          user: 'Sarah Smith', 
          action: 'completed', 
          target: 'JavaScript Fundamentals', 
          timestamp: '3 hours ago',
          iconClass: 'fa-check-circle text-blue-500 bg-blue-100 dark:bg-blue-900'
        },
        { 
          id: 3, 
          type: 'course-update', 
          user: 'Admin', 
          action: 'updated course', 
          target: 'Python for Beginners', 
          timestamp: '5 hours ago',
          iconClass: 'fa-edit text-indigo-500 bg-indigo-100 dark:bg-indigo-900'
        },
        { 
          id: 4, 
          type: 'quiz-completed', 
          user: 'Mike Johnson', 
          action: 'scored 95% on quiz', 
          target: 'Data Structures', 
          timestamp: '12 hours ago',
          iconClass: 'fa-clipboard-check text-purple-500 bg-purple-100 dark:bg-purple-900'
        },
        { 
          id: 5, 
          type: 'forum-post', 
          user: 'Emily Clark', 
          action: 'posted in forum', 
          target: 'Machine Learning', 
          timestamp: '1 day ago',
          iconClass: 'fa-comments text-yellow-500 bg-yellow-100 dark:bg-yellow-900'
        }
      ];
      
      pendingActions = [
        { id: 1, text: 'Review new course submission: "Advanced React Patterns"', priority: 'high' },
        { id: 2, text: 'Approve 3 pending user registrations', priority: 'medium' },
        { id: 3, text: 'Update privacy policy before January 15th', priority: 'medium' },
        { id: 4, text: 'Moderate flagged comments in JavaScript forum', priority: 'low' }
      ];
      
      courseEngagementData = [
        { name: 'Web Development', enrolled: 243, completed: 142, active: 87 },
        { name: 'Python Programming', enrolled: 187, completed: 89, active: 67 },
        { name: 'Data Science', enrolled: 162, completed: 54, active: 95 },
        { name: 'JavaScript', enrolled: 139, completed: 72, active: 58 },
        { name: 'UX Design', enrolled: 118, completed: 47, active: 65 }
      ];
      
      isLoading = false;
    }, 1000);
  });
  
  // Format number with comma separators
  function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
  }
  
  // Return appropriate color classes based on value change
  function getChangeColorClass(change) {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  }
  
  // Return appropriate icon based on value change
  function getChangeIcon(change) {
    if (change > 0) return 'fa-arrow-up';
    if (change < 0) return 'fa-arrow-down';
    return 'fa-minus';
  }
</script>

<svelte:head>
  <title>LearnFlow Admin</title>
</svelte:head>

<div>
  <!-- Welcome Banner -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {$user?.displayName || 'Admin'}
        </h1>
        <p class="mt-1 text-gray-600 dark:text-gray-300">
          Here's what's happening with your learning platform today
        </p>
      </div>
      <div class="text-right hidden md:block">
        <div class="text-sm text-gray-500 dark:text-gray-400">Today's Date</div>
        <div class="text-lg font-medium text-gray-800 dark:text-gray-200">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  </div>
  
  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <!-- Active Users Card -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</h3>
        <div class="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30">
          <i class="fas fa-users text-blue-500"></i>
        </div>
      </div>
      {#if isLoading}
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
        <div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      {:else}
        <div class="flex items-baseline">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">
            {formatNumber(stats.activeUsers.value)}
          </span>
          <span class="ml-2 {getChangeColorClass(stats.activeUsers.change)} text-sm flex items-center">
            <i class="fas {getChangeIcon(stats.activeUsers.change)} mr-1"></i>
            {Math.abs(stats.activeUsers.change)}%
          </span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Compared to previous month
        </p>
      {/if}
    </div>
    
    <!-- Enrolled Students Card -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Enrolled Students</h3>
        <div class="rounded-full p-2 bg-green-100 dark:bg-green-900/30">
          <i class="fas fa-user-graduate text-green-500"></i>
        </div>
      </div>
      {#if isLoading}
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
        <div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      {:else}
        <div class="flex items-baseline">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">
            {formatNumber(stats.enrolledStudents.value)}
          </span>
          <span class="ml-2 {getChangeColorClass(stats.enrolledStudents.change)} text-sm flex items-center">
            <i class="fas {getChangeIcon(stats.enrolledStudents.change)} mr-1"></i>
            {Math.abs(stats.enrolledStudents.change)}%
          </span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Compared to previous month
        </p>
      {/if}
    </div>
    
    <!-- Active Courses Card -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Courses</h3>
        <div class="rounded-full p-2 bg-purple-100 dark:bg-purple-900/30">
          <i class="fas fa-book-open text-purple-500"></i>
        </div>
      </div>
      {#if isLoading}
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
        <div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      {:else}
        <div class="flex items-baseline">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">
            {formatNumber(stats.activeCourses.value)}
          </span>
          <span class="ml-2 {getChangeColorClass(stats.activeCourses.change)} text-sm flex items-center">
            <i class="fas {getChangeIcon(stats.activeCourses.change)} mr-1"></i>
            {Math.abs(stats.activeCourses.change)}%
          </span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Compared to previous month
        </p>
      {/if}
    </div>
    
    <!-- Completion Rate Card -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</h3>
        <div class="rounded-full p-2 bg-orange-100 dark:bg-orange-900/30">
          <i class="fas fa-chart-pie text-orange-500"></i>
        </div>
      </div>
      {#if isLoading}
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
        <div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      {:else}
        <div class="flex items-baseline">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.completionRate.value}%
          </span>
          <span class="ml-2 {getChangeColorClass(stats.completionRate.change)} text-sm flex items-center">
            <i class="fas {getChangeIcon(stats.completionRate.change)} mr-1"></i>
            {Math.abs(stats.completionRate.change)}%
          </span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Compared to previous month
        </p>
      {/if}
    </div>
  </div>
  
  <!-- Dashboard Main Content Area -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Recent Activities -->
    <div class="lg:col-span-2">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 h-full">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Recent Activities</h2>
          <a href="/admin/activities" class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            View all
          </a>
        </div>
        
        {#if isLoading}
          {#each Array(5) as _, i}
            <div class="mb-4">
              <div class="h-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          {/each}
        {:else}
          <div class="space-y-4">
            {#each recentActivities as activity}
              <div class="flex items-start">
                <div class="flex-shrink-0 h-10 w-10 rounded-full {activity.iconClass.split(' ').slice(1).join(' ')} flex items-center justify-center">
                  <i class="fas {activity.iconClass.split(' ')[0]}"></i>
                </div>
                <div class="ml-4 flex-1">
                  <div class="flex items-center justify-between">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      <span class="font-semibold">{activity.user}</span> {activity.action} <a href="#" class="text-indigo-600 dark:text-indigo-400 hover:underline">{activity.target}</a>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Action Items -->
    <div class="lg:col-span-1">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 h-full">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Pending Actions</h2>
        
        {#if isLoading}
          {#each Array(4) as _, i}
            <div class="mb-3">
              <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          {/each}
        {:else if pendingActions.length === 0}
          <div class="text-center py-8">
            <div class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
              <i class="fas fa-check-circle text-3xl"></i>
            </div>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No pending actions</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You're all caught up!
            </p>
          </div>
        {:else}
          <div class="space-y-3">
            {#each pendingActions as action}
              <div class="border border-gray-200 dark:border-gray-700 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div 
                      class="w-2 h-2 rounded-full mr-2 {action.priority === 'high' 
                        ? 'bg-red-500' 
                        : action.priority === 'medium' 
                        ? 'bg-yellow-500' 
                        : 'bg-blue-500'}"
                    ></div>
                    <span class="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {action.priority}
                    </span>
                  </div>
                  <button class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                </div>
                <p class="mt-2 text-sm text-gray-800 dark:text-gray-200">{action.text}</p>
              </div>
            {/each}
          </div>
          
          <div class="mt-4">
            <a 
              href="/admin/tasks" 
              class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              View All Tasks
            </a>
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <!-- Course Engagement Table -->
  <div class="mt-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Top Course Engagement</h2>
        <a href="/admin/courses" class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Manage Courses
        </a>
      </div>
      
      {#if isLoading}
        <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      {:else}
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Course Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Enrolled
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Completed
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Active
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Completion Rate
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {#each courseEngagementData as course}
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {course.name}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{course.enrolled}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{course.completed}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{course.active}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <span class="text-sm text-gray-900 dark:text-white mr-2">
                        {Math.round((course.completed / course.enrolled) * 100)}%
                      </span>
                      <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          class="bg-indigo-600 h-2.5 rounded-full"
                          style="width: {Math.round((course.completed / course.enrolled) * 100)}%"
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>
</div> 