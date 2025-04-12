<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { user } from '$lib/stores/authStore.js';

  // Define course type
  type Course = {
    id: string;
    title: string;
    image: string;
    instructor: string;
    progress: number;
    lastAccessed: string;
    totalLessons: number;
    completedLessons: number;
    nextLesson?: {
      id: string;
      title: string;
    };
    certificate?: {
      id: string;
      issued: string;
    };
    tags?: string[];
  };

  // Placeholder data for enrolled courses
  let enrolledCourses: Course[] = [
    {
      id: 'course-1',
      title: 'Introduction to Web Development',
      image: '/images/courses/web-dev.jpg',
      instructor: 'Sarah Johnson',
      progress: 65,
      lastAccessed: '2023-04-10T14:30:00',
      totalLessons: 12,
      completedLessons: 8,
      nextLesson: {
        id: 'lesson-9',
        title: 'Introduction to JavaScript'
      },
      tags: ['HTML', 'CSS', 'JavaScript']
    },
    {
      id: 'course-2',
      title: 'Data Science Fundamentals',
      image: '/images/courses/data-science.jpg',
      instructor: 'Michael Chen',
      progress: 30,
      lastAccessed: '2023-04-08T10:15:00',
      totalLessons: 15,
      completedLessons: 4,
      nextLesson: {
        id: 'lesson-5',
        title: 'Statistical Analysis with Python'
      },
      tags: ['Python', 'Statistics', 'Data']
    },
    {
      id: 'course-3',
      title: 'UI/UX Design Principles',
      image: '/images/courses/uiux-design.jpg',
      instructor: 'Elena Rodriguez',
      progress: 100,
      lastAccessed: '2023-04-05T16:45:00',
      totalLessons: 10,
      completedLessons: 10,
      certificate: {
        id: 'cert-123',
        issued: '2023-04-06T12:00:00'
      },
      tags: ['UI', 'UX', 'Design']
    }
  ];

  let activeTab = 'in-progress';

  $: filteredCourses = enrolledCourses.filter(course => {
    if (activeTab === 'in-progress') {
      return course.progress > 0 && course.progress < 100;
    } else if (activeTab === 'completed') {
      return course.progress === 100;
    } else if (activeTab === 'not-started') {
      return course.progress === 0;
    } else {
      return true;
    }
  });

  $: continueLearningSuggestion = enrolledCourses
    .filter(course => course.progress > 0 && course.progress < 100)
    .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())[0];

  // Stats
  $: totalCourses = enrolledCourses.length;
  $: completedCourses = enrolledCourses.filter(course => course.progress === 100).length;
  $: inProgressCourses = enrolledCourses.filter(course => course.progress > 0 && course.progress < 100).length;

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  }

  let loading = true;

  onMount(() => {
    setTimeout(() => {
      loading = false;
    }, 800);
  });
</script>

<svelte:head>
  <title>My Learning | LearnFlow</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-7xl">
  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="loader"></div>
    </div>
  {:else}
    <div in:fade={{ duration: 300 }}>
      <!-- Dashboard Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Learning</h1>
          <p class="text-gray-600 dark:text-gray-400">Continue your learning journey</p>
        </div>
        
        <div class="mt-4 md:mt-0">
          <a 
            href="/explore" 
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium flex items-center transition-colors"
          >
            <i class="fas fa-compass mr-2"></i>
            Discover Courses
          </a>
        </div>
      </div>
      
      <!-- Learning Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center mr-4">
              <i class="fas fa-book text-indigo-600 dark:text-indigo-400 text-xl"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{totalCourses}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Total Courses</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mr-4">
              <i class="fas fa-check-circle text-green-600 dark:text-green-400 text-xl"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{completedCourses}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Completed Courses</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mr-4">
              <i class="fas fa-spinner text-blue-600 dark:text-blue-400 text-xl"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{inProgressCourses}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Continue Learning Section -->
      {#if continueLearningSuggestion}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
          <div class="px-6 pt-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Continue Learning</h2>
          </div>
          <div class="p-6 pt-0">
            <div class="flex flex-col md:flex-row">
              <div class="w-full md:w-1/3 mb-4 md:mb-0 md:pr-6">
                <div class="relative rounded-lg overflow-hidden">
                  <img 
                    src={continueLearningSuggestion.image} 
                    alt={continueLearningSuggestion.title}
                    class="w-full aspect-video object-cover"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div class="absolute bottom-2 left-2 right-2">
                    <span class="text-sm text-white font-medium px-2 py-1 rounded bg-indigo-600/90">
                      Lesson {continueLearningSuggestion.completedLessons + 1} of {continueLearningSuggestion.totalLessons}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {continueLearningSuggestion.title}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <i class="fas fa-user-circle mr-1"></i> {continueLearningSuggestion.instructor}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <i class="fas fa-clock mr-1"></i> Last accessed {formatDate(continueLearningSuggestion.lastAccessed)}
                </p>
                
                <div class="mb-4">
                  <div class="flex justify-between items-center text-sm mb-1">
                    <span class="text-indigo-600 dark:text-indigo-400 font-medium">
                      {continueLearningSuggestion.progress}% Complete
                    </span>
                    <span class="text-gray-500 dark:text-gray-400">
                      {continueLearningSuggestion.completedLessons}/{continueLearningSuggestion.totalLessons} Lessons
                    </span>
                  </div>
                  <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full" 
                      style="width: {continueLearningSuggestion.progress}%"
                    ></div>
                  </div>
                </div>
                
                {#if continueLearningSuggestion.nextLesson}
                  <p class="text-sm font-medium text-gray-800 dark:text-gray-200 mb-4">
                    Next: {continueLearningSuggestion.nextLesson.title}
                  </p>
                {/if}
                
                <div class="flex space-x-3">
                  <a 
                    href={`/courses/${continueLearningSuggestion.id}/lesson/${continueLearningSuggestion.nextLesson?.id}`}
                    class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors flex items-center"
                  >
                    <i class="fas fa-play-circle mr-2"></i>
                    Continue Learning
                  </a>
                  <a 
                    href={`/courses/${continueLearningSuggestion.id}`}
                    class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors flex items-center"
                  >
                    <i class="fas fa-info-circle mr-2"></i>
                    Course Details
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}
      
      <!-- Course Tabs -->
      <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex space-x-4">
          <button
            class={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'in-progress' 
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            on:click={() => activeTab = 'in-progress'}
          >
            In Progress
          </button>
          <button
            class={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'completed' 
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            on:click={() => activeTab = 'completed'}
          >
            Completed
          </button>
          <button
            class={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'all' 
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            on:click={() => activeTab = 'all'}
          >
            All Courses
          </button>
        </div>
      </div>
      
      <!-- Course Cards -->
      {#if filteredCourses.length === 0}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
          <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-book text-gray-400 dark:text-gray-500 text-xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {#if activeTab === 'in-progress'}
              You don't have any courses in progress. Start learning today!
            {:else if activeTab === 'completed'}
              You haven't completed any courses yet. Keep learning!
            {:else}
              You haven't enrolled in any courses yet.
            {/if}
          </p>
          
          <a 
            href="/explore" 
            class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <i class="fas fa-search mr-2"></i>
            Browse Courses
          </a>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each filteredCourses as course (course.id)}
            <div 
              class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-shadow hover:shadow-md"
              in:fade={{ duration: 200, delay: 50 }}
            >
              <!-- Course Image -->
              <div class="relative">
                <img 
                  src={course.image} 
                  alt={course.title}
                  class="w-full h-40 object-cover"
                />
                <!-- Progress Indicator -->
                <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
                  <div 
                    class={course.progress === 100 ? 'bg-green-500 dark:bg-green-400 h-full' : 'bg-indigo-500 dark:bg-indigo-400 h-full'}
                    style="width: {course.progress}%"
                  ></div>
                </div>
                
                <!-- Completion Badge -->
                {#if course.progress === 100}
                  <div class="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <i class="fas fa-check-circle mr-1"></i>
                    Completed
                  </div>
                {/if}
              </div>
              
              <!-- Course Info -->
              <div class="p-5">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">{course.title}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <i class="fas fa-user-circle mr-1"></i>
                  {course.instructor}
                </p>
                
                <!-- Tags -->
                {#if course.tags && course.tags.length > 0}
                  <div class="flex flex-wrap gap-1 mb-3">
                    {#each course.tags as tag}
                      <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                        {tag}
                      </span>
                    {/each}
                  </div>
                {/if}
                
                <!-- Progress Info -->
                <div class="mb-5">
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-700 dark:text-gray-300">{course.progress}% complete</span>
                    <span class="text-gray-500 dark:text-gray-400">{course.completedLessons}/{course.totalLessons} lessons</span>
                  </div>
                </div>
                
                <!-- Action Button -->
                {#if course.progress === 100}
                  <a 
                    href="/certificate/{course.certificate?.id}" 
                    class="w-full block text-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    <i class="fas fa-award mr-2"></i> View Certificate
                  </a>
                {:else}
                  <a 
                    href="/courses/{course.id}/lesson/{course.nextLesson?.id}" 
                    class="w-full block text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    {course.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                  </a>
                {/if}
              </div>
              
              <!-- Last Accessed Footer -->
              <div class="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                <i class="fas fa-history mr-1"></i>
                Last accessed {formatDate(course.lastAccessed)}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .loader {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #4f46e5;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .aspect-video {
    aspect-ratio: 16 / 9;
  }
</style> 