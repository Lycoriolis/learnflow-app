<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { logStart, logEnd } from '$lib/services/activityService.js';
  import CourseCard from '$lib/components/CourseCard.svelte';
  import { listCourses, type ContentMetadata } from '$lib/services/enhancedContentService.js';

  let courses: ContentMetadata[] = [];
  let loading = true;
  let error: string | null = null;
  let viewId: string | null = null;

  // Function to get gradient colors based on course category/type
  function getCourseGradient(course: ContentMetadata) {
    if (course.id.includes('math')) {
      return { from: 'blue-500', to: 'blue-400' };
    } else if (course.id.includes('python')) {
      return { from: 'green-500', to: 'green-400' };
    }
    // Default gradient
    return { from: 'indigo-500', to: 'indigo-400' };
  }

  onMount(async () => {
    try {
      console.log('Courses page mounted - fetching courses');
      viewId = await logStart('view_courses', 'courses');
      courses = await listCourses();
      console.log('Courses fetched:', courses);
    } catch (err) {
      console.error("Error loading courses:", err);
      error = "Failed to load courses. Please try again later.";
    } finally {
      loading = false;
      console.log('Courses loading complete:', { loading, error, coursesCount: courses.length });
    }
  });

  onDestroy(() => {
    if (viewId) logEnd(viewId);
  });
</script>

<svelte:head>
  <title>Courses | LearnFlow</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Courses</h1>

  {#if loading}
    <div class="flex justify-center items-center py-12">
      <div class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
    </div>
  {:else if error}
    <div class="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
      <p class="text-red-600 dark:text-red-200">{error}</p>
    </div>
  {:else if courses.length === 0}
    <div class="text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <i class="fas fa-book text-2xl text-gray-400"></i>
      </div>
      <p class="text-gray-500 dark:text-gray-400">No courses available at the moment.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each courses as course}
        <CourseCard course={{
          id: course.id,
          title: course.title || course.id,
          description: course.description || '',
          progress: Math.floor(Math.random() * 100), // Mock progress - would be loaded from user data in real app
          icon: course.icon || 'fa-book',
          gradient: course.gradient || getCourseGradient(course)
        }} />
      {/each}
    </div>
  {/if}
</div>