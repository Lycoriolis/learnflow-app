<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { logStart, logEnd } from '$lib/services/activityService.js';
  import { loadCourseStructure, type CourseStructure, type Module } from '$lib/services/enhancedContentService';

  // Get parameters from URL
  let courseId: string = $page.params.slug;
  let moduleId: string = $page.params.moduleId;
  
  // Component state
  let course: CourseStructure | null = null;
  let currentModule: Module | null = null;
  let loading = true;
  let error: string | null = null;
  let viewId: string | null = null;

  onMount(async () => {
    viewId = await logStart('view_module', `${courseId}/${moduleId}`);
    
    try {
      // Load course and find the current module
      course = await loadCourseStructure(courseId);
      
      if (!course) {
        error = "Course not found";
      } else {
        // Find the module with matching ID
        currentModule = course.modules.find(mod => mod.id === moduleId) || null;
        
        if (!currentModule) {
          error = "Module not found";
        }
      }
    } catch (err) {
      console.error(`Error loading module ${moduleId} in course ${courseId}:`, err);
      error = "Failed to load module. Please try again later.";
    } finally {
      loading = false;
    }
  });

  onDestroy(() => {
    if (viewId) logEnd(viewId);
  });
</script>

<svelte:head>
  <title>{currentModule?.title || 'Module'} | {course?.title || 'Course'} | LearnFlow</title>
  <meta name="description" content={currentModule?.description || 'Module lessons page'} />
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-8">
  {#if loading}
    <div class="flex justify-center items-center py-12">
      <div data-testid="loading-spinner" class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
    </div>
  {:else if error || !course || !currentModule}
    <div class="text-center py-12">
      <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Module Not Found</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">The module you're looking for doesn't exist or has been moved.</p>
      <a href={`/courses/${courseId}`} class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        <i class="fas fa-arrow-left mr-2"></i> Back to Course
      </a>
    </div>
  {:else}
    <!-- Breadcrumb navigation -->
    <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
      <a href="/courses" class="hover:text-indigo-600 dark:hover:text-indigo-400">Courses</a>
      <i class="fas fa-chevron-right text-xs"></i>
      <a href={`/courses/${courseId}`} class="hover:text-indigo-600 dark:hover:text-indigo-400">{course.title}</a>
      <i class="fas fa-chevron-right text-xs"></i>
      <span>{currentModule.title}</span>
    </div>
    
    <!-- Module Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">{currentModule.title}</h1>
      {#if currentModule.description}
        <p class="text-gray-600 dark:text-gray-300 mb-4">{currentModule.description}</p>
      {/if}
      
      <!-- Module progress (would be real user progress in a complete app) -->
      <div class="bg-gray-100 dark:bg-gray-800 h-2 rounded-full mb-4 overflow-hidden">
        <div 
          class="bg-indigo-500 h-full rounded-full" 
          style="width: {Math.floor(Math.random() * 100)}%;"
        ></div>
      </div>
    </div>
    
    <!-- Lesson List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
      <div class="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Module Lessons
        </h2>
      </div>
      
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        {#each currentModule.lessons as lesson, i}
          <div class="p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition">
            <a 
              href={`/courses/${courseId}/${moduleId}/${lesson.id}`}
              class="flex items-start"
            >
              <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span class="text-indigo-600 dark:text-indigo-300 font-medium">{i + 1}</span>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">
                  {lesson.title}
                </h3>
                {#if lesson.estimatedTime}
                  <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <i class="far fa-clock mr-1"></i> {lesson.estimatedTime}
                  </p>
                {/if}
                {#if lesson.frontmatter?.objectives && Array.isArray(lesson.frontmatter.objectives) && lesson.frontmatter.objectives.length > 0}
                  <div class="mt-2">
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-1">Objectives:</p>
                    <ul class="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                      {#each lesson.frontmatter.objectives.slice(0, 2) as objective}
                        <li>{objective}</li>
                      {/each}
                      {#if lesson.frontmatter.objectives.length > 2}
                        <li>...and {lesson.frontmatter.objectives.length - 2} more</li>
                      {/if}
                    </ul>
                  </div>
                {/if}
              </div>
            </a>
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Navigation -->
    <div class="flex justify-between mt-8">
      <a 
        href={`/courses/${courseId}`}
        class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        <i class="fas fa-arrow-left mr-2"></i> Back to Course
      </a>
      
      {#if currentModule.lessons.length > 0}
        <a 
          href={`/courses/${courseId}/${moduleId}/${currentModule.lessons[0].id}`}
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Start Module <i class="fas fa-arrow-right ml-2"></i>
        </a>
      {/if}
    </div>
  {/if}
</div>
