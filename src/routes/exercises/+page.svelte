<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  onMount(() => {
    if (data.error) {
      console.error("Error loading page data:", data.error);
    }
  });
</script>

<svelte:head>
  <title>Exercises - LearnFlow</title>
  <meta name="description" content="Explore a variety of exercises across different subjects." />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <header class="mb-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-4">Exercises</h1>
    <p class="text-xl text-gray-600">Explore exercises across different subjects and difficulty levels.</p>
  </header>

  {#if data.error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600">Error: {data.error}</p>
    </div>
  {:else if data.categories && data.categories.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each data.categories as category}
        <a 
          href={category.href}
          class="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 hover:border-blue-300"
        >
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
              {#if category.description}
                <p class="text-gray-600 text-sm line-clamp-2">{category.description}</p>
              {/if}
              {#if category.tags && category.tags.length > 0}
                <div class="mt-3 flex flex-wrap gap-1">
                  {#each category.tags.slice(0, 3) as tag}
                    <span class="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </a>
      {/each}
    </div>
  {:else}
    <div class="text-center py-12">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No Exercise Categories Found</h3>
      <p class="text-gray-600">Check back later or contact support if this issue persists.</p>
    </div>
  {/if}
</div>