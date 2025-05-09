<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { logStart, logEnd } from '$lib/services/activityService.js';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
  import { loadCourseStructure, type CourseStructure } from '$lib/services/enhancedContentService.js';
  
  let course: CourseStructure | null = null;
  let loading = true;
  let viewId: string | null = null;
  $: courseId = $page.params.slug;

  onMount(async () => {
    viewId = await logStart('view_course_detail', courseId);
    course = await loadCourseStructure(courseId);
    loading = false;
  });
  onDestroy(() => {
    if (viewId) logEnd(viewId);
  });
</script>

<svelte:head>
  <title>{course?.title || 'Course'} | LearnFlow</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  {#if loading}
    <div class="flex justify-center items-center py-12">
      <div class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
    </div>
  {:else if !course}
    <div class="text-center py-12">
      <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Course Not Found</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">The course you're looking for doesn't exist or has been moved.</p>
      <a href="/courses" class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        <i class="fas fa-arrow-left mr-2"></i> Back to Courses
      </a>
    </div>
  {:else}
    <div class="mb-8">
      <div class="flex items-center mb-2">
        <div class="w-10 h-10 flex items-center justify-center rounded-full mr-3" 
             style="background: linear-gradient(to right, #{course.gradient.from}, #{course.gradient.to})">
          <i class="fas {course.icon} text-white"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
      </div>
      
      <p class="text-gray-700 dark:text-gray-300 mb-4">{course.description}</p>
      
      {#if course.tags && course.tags.length > 0}
        <div class="flex flex-wrap gap-2 mb-4">
          {#each course.tags as tag}
            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded">
              {tag}
            </span>
          {/each}
        </div>
      {/if}
      
      <div class="flex flex-wrap gap-4 mb-6">
        {#if course.difficulty}
          <div class="flex items-center">
            <span class="text-gray-600 dark:text-gray-400 mr-2">Difficulty:</span>
            <span class={`px-2 py-1 rounded text-sm ${
              course.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
              course.difficulty === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
              'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}>
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </span>
          </div>
        {/if}
        
        {#if course.estimatedTime}
          <div class="flex items-center">
            <i class="far fa-clock text-gray-600 dark:text-gray-400 mr-2"></i>
            <span class="text-gray-700 dark:text-gray-300">{course.estimatedTime}</span>
          </div>
        {/if}
      </div>
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {#each course.modules as module, moduleIndex}
        <div class="border-b border-gray-200 dark:border-gray-700 last:border-0">
          <div class="px-6 py-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Module {moduleIndex + 1}: {module.title}
            </h2>
            {#if module.description}
              <p class="text-gray-600 dark:text-gray-400 mb-3">{module.description}</p>
            {/if}
            
            <ul class="space-y-3">
              {#each module.lessons as lesson, lessonIndex}
                <li>
                  <a 
                    href={`/courses/${courseId}/${module.id}/${lesson.id}`} 
                    class="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div class="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 mr-3">
                      {lessonIndex + 1}
                    </div>
                    <div class="flex-1">
                      <h3 class="text-gray-800 dark:text-gray-200 font-medium">{lesson.title}</h3>
                      {#if lesson.estimatedTime}
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          <i class="far fa-clock mr-1"></i> {lesson.estimatedTime}
                        </p>
                      {/if}
                    </div>
                    <i class="fas fa-chevron-right text-gray-400"></i>
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
