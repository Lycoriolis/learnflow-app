<script lang="ts">
  import { onMount } from 'svelte';
  import { isAuthenticated, loading } from '$lib/stores/authStore.js';
  import { login } from '$lib/authService.js';
  import { listContent, type ContentMetadata } from '$lib/services/contentService.js';

  // Map Tailwind color names used dynamically to actual CSS color values
  const colorMap: { [key: string]: string } = {
    'sky-500': '#0ea5e9',
    'sky-400': '#38bdf8',
    'violet-500': '#8b5cf6',
    'violet-400': '#a78bfa',
    'emerald-500': '#10b981',
    'emerald-400': '#34d399',
    'rose-500': '#f43f5e',
    'rose-400': '#fb7185',
    'sky-600': '#0284c7',
    'violet-600': '#7c3aed',
    'emerald-600': '#059669',
    'rose-600': '#e11d48',
    'sky-700': '#0369a1',
    'violet-700': '#6d28d9',
    'emerald-700': '#047857',
    'rose-700': '#be123c',
  };

  function getCssColor(tailwindColorName: string): string {
    return colorMap[tailwindColorName] || '#6b7280';
  }

  // Courses state
  let courses: ContentMetadata[] = [];
  let isLoading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      courses = await listContent('course');
      isLoading = false;
    } catch (err) {
      console.error('Error loading courses:', err);
      error = 'Failed to load courses';
      isLoading = false;
    }
  });
</script>

<svelte:head>
  <title>LearnFlow | My Courses</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  {#if $loading || isLoading}
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)] text-4xl text-indigo-500">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
  {:else if $isAuthenticated}
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Courses</h1>
    {#if error}
      <div class="text-red-500 dark:text-red-400 mb-4">{error}</div>
    {:else if courses.length === 0}
      <div class="text-gray-600 dark:text-gray-300">No courses found.</div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each courses as course (course.id)}
          <div
            class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col h-full cursor-pointer"
            role="button" tabindex="0" aria-label={`View ${course.title} course`}
            on:click={() => window.location.href = `/courses/${course.id}`}
          >
            <div
              class="h-36 relative flex items-center justify-center"
              style:--gradient-from={getCssColor('sky-500')}
              style:--gradient-to={getCssColor('sky-400')}
              style="background-image: linear-gradient(to right, var(--gradient-from), var(--gradient-to));"
            >
              <i class="fas fa-book text-white text-5xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></i>
            </div>
            <div class="p-5 flex flex-col flex-grow">
              <h3 class="font-semibold text-lg text-gray-800 mb-2 group-hover:text-[var(--hover-color)] group-focus:text-[var(--hover-color)] transition-colors duration-300" style:--hover-color={getCssColor('sky-600')}>
                {course.title}
              </h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{course.description}</p>
              <div class="mt-auto pt-4">
                {#if course.estimatedTime}
                  <span class="text-xs text-gray-500">{course.estimatedTime}</span>
                {/if}
                {#if course.tags && course.tags.length > 0}
                  <div class="flex flex-wrap gap-1 mt-2">
                    {#each course.tags as tag}
                      <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{tag}</span>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {:else}
    <div class="text-center py-10">
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-4">Please log in to view your courses.</p>
      <button 
        class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150"
        on:click={login}
      >
        Log In
      </button>
    </div>
  {/if}
</div>

<style>
  .line-clamp-3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
  [role="button"]:focus {
      outline: none;
  }
  [role="button"]:focus-visible {
    box-shadow: 0 0 0 2px white, 0 0 0 4px #6366f1;
  }
</style>