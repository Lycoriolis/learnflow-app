<!-- src/routes/admin/statistics/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import StatCard from '$lib/components/StatCard.svelte';
  import { analytics } from '$lib/firebase.js';
  import Chart from 'chart.js/auto';
  
  let isLoading = true;
  let userSignupsChart: Chart | null = null;
  let engagementChart: Chart | null = null;
  let dateRange = '30days'; // Default to last 30 days
  
  // Simulation data for analytics
  let stats = {
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    averageEngagement: 0
  };
  
  let topCourses = [];
  let userGrowthData = [];
  let engagementData = [];
  
  onMount(async () => {
    // Simulate loading data
    setTimeout(() => {
      stats = {
        totalUsers: 125,
        activeUsers: 38,
        totalCourses: 15,
        totalLessons: 128,
        completedLessons: 863,
        averageEngagement: 42
      };
      
      topCourses = [
        { title: 'Introduction to Python', enrollments: 45, completionRate: 68 },
        { title: 'Advanced Mathematics', enrollments: 32, completionRate: 45 },
        { title: 'Web Development Basics', enrollments: 53, completionRate: 72 },
        { title: 'French for Beginners', enrollments: 24, completionRate: 51 }
      ];
      
      // Simulate signup data for the last 30 days
      userGrowthData = generateDemoData(30, 0, 5);
      
      // Simulate engagement data
      engagementData = [
        { category: 'Computer Science', minutes: 8500 },
        { category: 'Mathematics', minutes: 6200 },
        { category: 'Languages', minutes: 4800 },
        { category: 'Science', minutes: 3500 },
        { category: 'Arts & Humanities', minutes: 2100 }
      ];
      
      isLoading = false;
      
      // Initialize charts after data is loaded
      initCharts();
    }, 1500);
  });
  
  function initCharts() {
    // Initialize user signups chart
    const userSignupsCtx = document.getElementById('userSignupsChart') as HTMLCanvasElement;
    if (userSignupsCtx) {
      userSignupsChart = new Chart(userSignupsCtx, {
        type: 'line',
        data: {
          labels: userGrowthData.map(d => d.date),
          datasets: [{
            label: 'New Users',
            data: userGrowthData.map(d => d.count),
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            }
          }
        }
      });
    }
    
    // Initialize engagement chart
    const engagementCtx = document.getElementById('engagementChart') as HTMLCanvasElement;
    if (engagementCtx) {
      engagementChart = new Chart(engagementCtx, {
        type: 'bar',
        data: {
          labels: engagementData.map(d => d.category),
          datasets: [{
            label: 'Total Minutes',
            data: engagementData.map(d => d.minutes),
            backgroundColor: [
              'rgba(79, 70, 229, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(239, 68, 68, 0.7)',
              'rgba(99, 102, 241, 0.7)'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Total Minutes'
              }
            }
          }
        }
      });
    }
  }
  
  // Handle date range changes
  function handleDateRangeChange() {
    let days = 30;
    switch (dateRange) {
      case '7days':
        days = 7;
        break;
      case '30days':
        days = 30;
        break;
      case '90days':
        days = 90;
        break;
      case '365days':
        days = 365;
        break;
    }
    
    // Simulate new data based on the selected range
    userGrowthData = generateDemoData(days, 0, 5);
    
    // Update chart
    if (userSignupsChart) {
      userSignupsChart.data.labels = userGrowthData.map(d => d.date);
      userSignupsChart.data.datasets[0].data = userGrowthData.map(d => d.count);
      userSignupsChart.update();
    }
  }
  
  // Helper function to generate demo data for charts
  function generateDemoData(days: number, minVal: number, maxVal: number) {
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const count = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count
      });
    }
    
    return data;
  }
  
  // Format minutes to hours and minutes
  function formatMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
</script>

<svelte:head>
  <title>Admin | Analytics | LearnFlow</title>
</svelte:head>

<div in:fly={{ y: 20, duration: 300 }}>
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
    <p class="text-gray-600 dark:text-gray-400 mt-1">Track user engagement, course performance, and learning trends</p>
  </div>
  
  {#if isLoading}
    <div class="flex justify-center items-center h-64">
      <div class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
    </div>
  {:else}
    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Total Users"
        value={stats.totalUsers.toString()}
        icon="fa-users"
        color="blue"
      />
      <StatCard
        title="Active Users (Today)"
        value={stats.activeUsers.toString()}
        icon="fa-user-clock"
        color="green"
      />
      <StatCard
        title="Total Courses"
        value={stats.totalCourses.toString()}
        icon="fa-book-open"
        color="purple"
      />
      <StatCard
        title="Total Lessons"
        value={stats.totalLessons.toString()}
        icon="fa-book"
        color="indigo"
      />
      <StatCard
        title="Completed Lessons"
        value={stats.completedLessons.toString()}
        icon="fa-check-circle"
        color="green"
      />
      <StatCard
        title="Avg. Time/User (min/day)"
        value={stats.averageEngagement.toString()}
        icon="fa-clock"
        color="yellow"
      />
    </div>
    
    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- User Growth Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">New User Signups</h3>
            <select 
              bind:value={dateRange} 
              on:change={handleDateRangeChange}
              class="block w-32 pl-3 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="365days">Last year</option>
            </select>
          </div>
        </div>
        <div class="p-6">
          <div class="h-80">
            <canvas id="userSignupsChart"></canvas>
          </div>
        </div>
      </div>
      
      <!-- Category Engagement Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Category Engagement</h3>
        </div>
        <div class="p-6">
          <div class="h-80">
            <canvas id="engagementChart"></canvas>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Top Courses Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Top Performing Courses</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-white dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course Title</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enrollments</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Completion Rate</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {#each topCourses as course}
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{course.title}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{course.enrollments}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="mr-4 text-sm text-gray-500 dark:text-gray-400">{course.completionRate}%</div>
                    <div class="relative w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div 
                        class="absolute top-0 left-0 h-2 bg-indigo-600 rounded-full" 
                        style="width: {course.completionRate}%;"
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Google Analytics Integration Note -->
    <div class="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-info-circle text-blue-500 dark:text-blue-400 text-lg"></i>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">Firebase Analytics Integration</h3>
          <div class="mt-2 text-sm text-blue-700 dark:text-blue-400">
            <p>
              This dashboard shows demo data. In production, this would be connected directly to Firebase Analytics to show real-time analytics data about your users and courses.
            </p>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div> 