<script lang="ts">
  import { page } from '$app/stores';
  import { fetchCourseBySlug } from '$lib/services/courses/courseService';
  import type { CourseStructure } from '$lib/types/shared';
  import { onMount } from 'svelte';
  import MarkdownRenderer from '$lib/components/shared/MarkdownRenderer.svelte';
  import Icon from '@iconify/svelte';

  let course: CourseStructure | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const slug = $page.params.slug;
      if (!slug) {
        throw new Error('Course slug is required');
      }
      course = await fetchCourseBySlug(slug);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load course';
    } finally {
      loading = false;
    }
  });
</script>

<div class="container mx-auto px-4 py-8">
  {#if loading}
    <div class="flex justify-center items-center min-h-[60vh]">
      <i class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i>
    </div>
  {:else if error}
    <div class="flex justify-center items-center min-h-[60vh]">
      <div class="text-red-500">{error}</div>
    </div>
  {:else if course}
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="md:col-span-3">
        <div class="mb-6">
          <a href="/courses" class="inline-flex items-center text-cherry-600 dark:text-cherry-400 hover:underline mb-4">
            <Icon icon="mdi:arrow-left" class="w-5 h-5 mr-1" />
            Back to Courses
          </a>
          
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h1>
          
          {#if course.description}
            <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">{course.description}</p>
          {/if}
          
          <div class="flex flex-wrap gap-2 mb-4">
            {#if course.category}
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-cherry-100 dark:bg-cherry-900/30 text-cherry-800 dark:text-cherry-400">
                {course.category}
              </span>
            {/if}
            
            {#if course.level}
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                {course.level}
              </span>
            {/if}
            
            {#if course.tags && course.tags.length > 0}
              {#each course.tags as tag}
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                  {tag}
                </span>
              {/each}
            {/if}
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {#if course.content}
            <div class="prose dark:prose-invert max-w-none">
              <MarkdownRenderer content={course.content} />
            </div>
          {:else}
            <p class="text-gray-700 dark:text-gray-300 italic">No content available for this course yet.</p>
          {/if}
        </div>
      </div>
      
      <div class="md:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Course Information</h2>
          
          <div class="space-y-4">
            {#if course.author}
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Instructor</h3>
                <p class="text-gray-900 dark:text-white">{course.author}</p>
              </div>
            {/if}
            
            {#if course.duration}
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</h3>
                <p class="text-gray-900 dark:text-white">{course.duration}</p>
              </div>
            {/if}
            
            {#if course.prerequisites && course.prerequisites.length > 0}
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Prerequisites</h3>
                <ul class="list-disc list-inside text-gray-900 dark:text-white">
                  {#each course.prerequisites as prereq}
                    <li>{prereq}</li>
                  {/each}
                </ul>
              </div>
            {/if}
            
            <div class="pt-4">
              <button class="w-full bg-cherry-600 hover:bg-cherry-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Enroll in this Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="flex justify-center items-center min-h-[60vh]">
      <div class="text-gray-500">Course not found</div>
    </div>
  {/if}
</div>