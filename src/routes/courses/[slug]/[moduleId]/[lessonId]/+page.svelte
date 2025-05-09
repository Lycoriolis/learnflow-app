<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { logStart, logEnd } from '$lib/services/activityService.js';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
  import { 
    loadCourseStructure, 
    loadLesson, 
    type CourseStructure, 
    type Lesson,
    type Module
  } from '$lib/services/enhancedContentService'; // Removed .ts extension
  import CourseFlashcardGenerator from '$lib/components/CourseFlashcardGenerator.svelte';

  let courseId: string;
  let moduleId: string;
  let lessonId: string;
  let course: CourseStructure | null = null;
  let lesson: Lesson | null = null;
  let currentModule: Module | null = null;
  let loading = true;
  let viewId: string | null = null;
  let nextLesson: { moduleId: string; lessonId: string; title: string } | null = null;
  let previousLesson: { moduleId: string; lessonId: string; title: string } | null = null;

  $: courseId = $page.params.slug;
  $: moduleId = $page.params.moduleId || '';
  $: lessonId = $page.params.lessonId;

  function findNeighborLessons() {
    if (!course) return;
    
    let foundCurrentLesson = false;
    let prevModule: Module | null = null;
    let prevLesson: { id: string; title: string } | null = null;
    
    // Initialize as null
    nextLesson = null;
    previousLesson = null;
    
    // Find the module containing the current lesson
    for (let i = 0; i < course.modules.length; i++) {
      const mod = course.modules[i];
      const currentLessonIndex = mod.lessons.findIndex(les => les.id === lessonId);
      
      if (currentLessonIndex >= 0) {
        // We found the current module and lesson
        currentModule = mod;
        foundCurrentLesson = true;
        
        // Set previous lesson if it exists
        if (currentLessonIndex > 0) {
          const prev = mod.lessons[currentLessonIndex - 1];
          previousLesson = { 
            moduleId: mod.id, 
            lessonId: prev.id, 
            title: prev.title 
          };
        } else if (prevModule && prevModule.lessons.length > 0) {
          // Last lesson of the previous module
          const prev = prevModule.lessons[prevModule.lessons.length - 1];
          previousLesson = { 
            moduleId: prevModule.id, 
            lessonId: prev.id, 
            title: prev.title 
          };
        }
        
        // Set next lesson if it exists
        if (currentLessonIndex < mod.lessons.length - 1) {
          const next = mod.lessons[currentLessonIndex + 1];
          nextLesson = { 
            moduleId: mod.id, 
            lessonId: next.id, 
            title: next.title 
          };
        } else if (i < course.modules.length - 1) {
          // First lesson of the next module
          const nextMod = course.modules[i + 1];
          if (nextMod.lessons.length > 0) {
            const next = nextMod.lessons[0];
            nextLesson = { 
              moduleId: nextMod.id, 
              lessonId: next.id, 
              title: next.title 
            };
          }
        }
        
        break;
      }
      
      // Save reference to current module before moving to the next one
      prevModule = mod;
    }
  }

  onMount(async () => {
    viewId = await logStart('view_lesson', `${courseId}/${moduleId}/${lessonId}`);
    
    try {
      // Load the course structure first
      course = await loadCourseStructure(courseId);
      
      if (course) {
        // Then load the specific lesson
        lesson = await loadLesson(courseId, moduleId, lessonId);
        
        // Find next and previous lessons
        findNeighborLessons();
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      loading = false;
    }
  });
  
  onDestroy(() => {
    if (viewId) logEnd(viewId);
  });
</script>

<svelte:head>
  <title>{lesson?.title || 'Lesson'} | LearnFlow</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  {#if loading}
    <div class="flex justify-center items-center py-12">
      <div data-testid="loading-spinner" class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
    </div>
  {:else if !lesson || !course}
    <div class="text-center py-12">
      <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Lesson Not Found</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">The lesson you're looking for doesn't exist or has been moved.</p>
      <a href={`/courses/${courseId}`} class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        <i class="fas fa-arrow-left mr-2"></i> Back to Course
      </a>
    </div>
  {:else}
    <div class="mb-4">
      <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
        <a href="/courses" class="hover:text-indigo-600 dark:hover:text-indigo-400">Courses</a>
        <i class="fas fa-chevron-right text-xs"></i>
        <a href={`/courses/${courseId}`} class="hover:text-indigo-600 dark:hover:text-indigo-400">{course.title}</a>
        {#if currentModule}
          <i class="fas fa-chevron-right text-xs"></i>
          <span>{currentModule.title}</span>
        {/if}
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{lesson.title}</h1>
      
      {#if lesson.estimatedTime}
        <div class="flex items-center mb-6">
          <i class="far fa-clock text-gray-600 dark:text-gray-400 mr-2"></i>
          <span class="text-gray-700 dark:text-gray-300">{lesson.estimatedTime}</span>
        </div>
      {/if}

      {#if lesson.frontmatter?.objectives && Array.isArray(lesson.frontmatter.objectives) && lesson.frontmatter.objectives.length > 0}
        <div class="mb-6">
          <h3 class="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-1">Learning Objectives:</h3>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
            {#each lesson.frontmatter.objectives as objective}
              <li>{objective}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
      <div class="p-6">
        <MarkdownRenderer content={lesson.content} className="prose-lg" />
      </div>
    </div>
    
    <CourseFlashcardGenerator content={lesson.content} courseName={course.title} />
    
    <div class="flex justify-between mt-8">
      {#if previousLesson}
        <a 
          href={`/courses/${courseId}/${previousLesson.moduleId}/${previousLesson.lessonId}`}
          class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <i class="fas fa-arrow-left mr-2"></i> Previous: {previousLesson.title}
        </a>
      {:else}
        <div></div>  <!-- Empty div to maintain flex layout -->
      {/if}
      
      {#if nextLesson}
        <a 
          href={`/courses/${courseId}/${nextLesson.moduleId}/${nextLesson.lessonId}`}
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Next: {nextLesson.title} <i class="fas fa-arrow-right ml-2"></i>
        </a>
      {:else}
        <a 
          href={`/courses/${courseId}`}
          class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Complete Course <i class="fas fa-check ml-2"></i>
        </a>
      {/if}
    </div>
  {/if}
</div>
