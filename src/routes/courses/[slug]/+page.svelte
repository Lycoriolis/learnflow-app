<script lang="ts">
  import { getCourse, type CourseStructure } from '$lib/services/courseService.js';
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { logStart, logEnd } from '$lib/services/activityService.js';

  let course: CourseStructure | null = null;
  let loading = true;
  let viewId: string | null = null;
  $: courseId = $page.params.slug;

  onMount(async () => {
    viewId = await logStart('view_course_detail', courseId);
    course = await getCourse(courseId);
    loading = false;
  });
  onDestroy(() => {
    if (viewId) logEnd(viewId);
  });
</script>

<svelte:head>
  <title>{course?.title || 'Course'} | LearnFlow</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  {#if loading}
    <p>Loading course...</p>
  {:else if !course}
    <p>Course not found.</p>
  {:else}
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">{course.title}</h1>
    {#each course.modules as module}
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{module.title}</h2>
        <ul class="list-disc list-inside space-y-2">
          {#each module.lessons as lesson}
            <li>
              <a href={`/courses/${courseId}/${lesson.id}`} class="text-indigo-600 hover:underline">
                {lesson.title}
              </a>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  {/if}
</div>