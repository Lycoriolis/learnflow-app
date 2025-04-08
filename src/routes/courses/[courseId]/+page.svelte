<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  // Reactive statements to get the course data or error
  $: course = data.course;
  $: error = data.error;

  // Reactive title and description for <svelte:head>
  $: pageTitle = error 
      ? 'LearnFlow | Error' 
      : course 
      ? `LearnFlow | ${course.title}` 
      : 'LearnFlow | Loading Course...';

  $: pageDescription = error 
      ? error.message || 'Could not load the course.'
      : course
      ? course.description
      : 'Loading course details.';

</script>

<svelte:head>
  <title>{pageTitle}</title>
  {#if !error && course}
    <meta name="description" content={pageDescription} />
  {/if}
</svelte:head>

{#if error}
  <div class="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 text-center">
    <h1 class="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h1>
    <p class="text-gray-600 dark:text-gray-300">{error.message || 'Could not load the course.'}</p>
    <a href="/courses" class="mt-6 inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150">
      Back to Courses
    </a>
  </div>
{:else if course}
  <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    <!-- Course Header -->
    <div class="mb-8 p-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg text-white">
      <span class="block text-sm font-medium text-indigo-200 mb-1">{course.category}</span>
      <h1 class="text-4xl font-bold mb-2">{course.title}</h1>
      <p class="text-lg text-indigo-100">{course.description}</p>
      <!-- Optional: Add progress indicator here -->
    </div>

    <!-- Course Content - Modules and Lessons -->
    <div class="space-y-6">
      {#each course.modules as module, moduleIndex}
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <h2 class="text-xl font-semibold p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white">
            Module {moduleIndex + 1}: {module.title}
          </h2>
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each module.lessons as lesson, lessonIndex}
              <li class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                <a href="/courses/{course.id}/lesson/{lesson.id}" class="flex justify-between items-center">
                  <div class="flex items-center">
                    <span class="text-indigo-600 dark:text-indigo-400 mr-3 font-medium w-8 text-right">{moduleIndex + 1}.{lessonIndex + 1}</span>
                    <span class="text-gray-700 dark:text-gray-200">{lesson.title}</span>
                  </div>
                  <!-- Optional: Add completion status icon -->
                  <i class="fas fa-chevron-right text-gray-400"></i>
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>
{:else}
  <!-- Should ideally not be reached if load handles errors, but good as a fallback -->
  <div class="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 text-center">
     <div class="flex justify-center items-center min-h-[calc(100vh-200px)] text-4xl text-indigo-500">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
  </div>
{/if} 