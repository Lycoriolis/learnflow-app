<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { getCourse, type CourseStructure, type Lesson } from '$lib/services/courseService.js';

  let courseId: string;
  let lessonId: string;
  let course: CourseStructure | null = null;
  let lesson: Lesson | null = null;
  let loading = true;

  $: courseId = $page.params.slug;
  $: lessonId = $page.params.lessonId;

  onMount(async () => {
    course = await getCourse(courseId);
    if (course) {
      for (const mod of course.modules) {
        const found = mod.lessons.find(l => l.id === lessonId);
        if (found) {
          lesson = found;
          break;
        }
      }
    }
    loading = false;
  });
</script>

<svelte:head>
  <title>{lesson?.title || 'Lesson'} | LearnFlow</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
  {#if loading}
    <p>Loading lesson...</p>
  {:else if !lesson}
    <p>Lesson not found.</p>
  {:else}
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{lesson.title}</h1>
    <p class="text-gray-700 dark:text-gray-300">Content for this lesson will be added soon.</p>
  {/if}
</div>