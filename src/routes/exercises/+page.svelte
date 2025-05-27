<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import ExerciseFilters from '$lib/components/exercises/ExerciseFilters.svelte';
  import Icon from '@iconify/svelte';

  export let data: PageData;

  let filterOpen = false;
  let currentFilters = {
    searchQuery: data.filters.searchQuery,
    difficulty: data.filters.difficulty,
    category: data.filters.category,
    sortBy: data.filters.sortBy,
    sortOrder: data.filters.sortOrder,
    tags: data.filters.tags
  };

  onMount(() => {
    if (data.error) {
      console.error("Error loading page data:", data.error);
    }
  });

  function handleFilter(event: CustomEvent) {
    const filters = event.detail;
    currentFilters = filters;
    updateURL(filters);
  }

  function handleClearFilters() {
    currentFilters = {
      searchQuery: '',
      difficulty: 'all',
      category: 'all',
      sortBy: 'title',
      sortOrder: 'asc',
      tags: []
    };
    updateURL(currentFilters);
  }

  function updateURL(filters: any) {
    const params = new URLSearchParams();
    
    if (filters.searchQuery) params.set('search', filters.searchQuery);
    if (filters.difficulty !== 'all') params.set('difficulty', filters.difficulty);
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.sortBy !== 'title') params.set('sortBy', filters.sortBy);
    if (filters.sortOrder !== 'asc') params.set('sortOrder', filters.sortOrder);
    if (filters.tags.length > 0) params.set('tags', filters.tags.join(','));

    const newURL = `${$page.url.pathname}?${params.toString()}`;
    goto(newURL, { replaceState: true, noScroll: true });
  }

  function getDifficultyIcon(difficulty: string) {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'mdi:numeric-1-circle';
      case 'intermediate': return 'mdi:numeric-2-circle';
      case 'advanced': return 'mdi:numeric-3-circle';
      default: return 'mdi:help-circle';
    }
  }

  function getDifficultyColor(difficulty: string) {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }
</script>

<svelte:head>
  <title>Exercises - LearnFlow</title>
  <meta name="description" content="Explore a variety of exercises across different subjects. Practice and improve your skills with interactive content." />
  <meta name="keywords" content="exercises, practice, learning, education, interactive" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <header class="mb-12 text-center" in:fade={{ duration: 600 }}>
      <div class="mb-6">
        <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Exercises
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Explore exercises across different subjects and difficulty levels. Practice and reinforce your learning with interactive content.
        </p>
      </div>

      <!-- Statistics Cards -->
      {#if data.stats && !data.error}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" in:fly={{ y: 20, duration: 500, delay: 200 }}>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Exercises</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{data.stats.totalExercises}</p>
              </div>
              <Icon icon="mdi:book-open-variant" class="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{data.stats.totalCategories}</p>
              </div>
              <Icon icon="mdi:folder-multiple" class="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Difficulty Levels</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{Object.keys(data.stats.difficultyBreakdown).length}</p>
              </div>
              <Icon icon="mdi:speedometer" class="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Available Tags</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">{data.availableTags.length}</p>
              </div>
              <Icon icon="mdi:tag-multiple" class="h-8 w-8 text-cyan-600" />
            </div>
          </div>
        </div>
      {/if}
    </header>

    <!-- Filters -->
    {#if !data.error}
      <div class="mb-8" in:fly={{ y: 20, duration: 500, delay: 300 }}>
        <ExerciseFilters
          bind:isOpen={filterOpen}
          searchQuery={currentFilters.searchQuery}
          selectedDifficulty={currentFilters.difficulty}
          selectedCategory={currentFilters.category}
          selectedTags={currentFilters.tags}
          availableTags={data.availableTags}
          availableCategories={data.availableCategories}
          sortBy={currentFilters.sortBy}
          sortOrder={currentFilters.sortOrder}
          on:filter={handleFilter}
          on:clear={handleClearFilters}
        />
      </div>
    {/if}

    <!-- Content -->
    {#if data.error}
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6" in:fade={{ duration: 300 }}>
        <div class="flex items-center">
          <Icon icon="mdi:alert-circle" class="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
          <div>
            <h3 class="text-lg font-medium text-red-800 dark:text-red-200">Error Loading Content</h3>
            <p class="text-red-600 dark:text-red-400 mt-1">{data.error}</p>
          </div>
        </div>
        <button 
          on:click={() => window.location.reload()}
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    {:else if data.categories && data.categories.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:1000px]" in:fly={{ y: 20, duration: 500, delay: 400 }}>
        {#each data.categories as category, index}
          <a
            href={category.href}
            class="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out border border-gray-200 dark:border-gray-700 hover:border-transparent transform hover:-translate-y-2 relative overflow-hidden group/card"
            in:fly={{ y: 20, duration: 300, delay: 100 + index * 50 }}
            style="transform-style: preserve-3d;"
          >
            
            <span class="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover/card:opacity-75 transition-opacity duration-500 blur-sm group-hover/card:blur-md"></span>
            <span class="absolute inset-0 rounded-xl bg-white dark:bg-gray-800"></span> 
            
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ease-in-out transform group-hover/card:rotate-y-[-2deg] group-hover/card:rotate-x-[2deg]"></div> 
            <div class="p-6 relative z-10 transform transition-transform duration-500 ease-in-out group-hover/card:scale-[1.02]"> 
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover/card:shadow-indigo-400/60 transition-all duration-500 transform group-hover/card:scale-110 group-hover/card:rotate-6"> 
                    <Icon icon="mdi:book-open-page-variant-outline" class="w-8 h-8 text-white transition-transform duration-300 group-hover/card:scale-110" /> 
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <!-- Header with title and difficulty badge -->
                  <div class="flex items-start justify-between mb-3">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors duration-300 line-clamp-2 leading-tight">
                      {category.title}
                    </h3>
                    {#if category.difficulty}
                      <div class="flex items-center gap-1 ml-2 flex-shrink-0">
                        <Icon icon={getDifficultyIcon(category.difficulty)} class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {getDifficultyColor(category.difficulty)} opacity-90">
                          {category.difficulty}
                        </span>
                      </div>
                    {/if}
                  </div>

                  <!-- Description with expandable content -->
                  {#if category.description}
                    <div class="relative mb-4">
                      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed 
                                group-hover/card:line-clamp-none group-hover/card:text-gray-700 dark:group-hover/card:text-gray-300 
                                transition-colors duration-300">
                        {category.description}
                      </p>
                      <!-- Subtle fade effect for clamped text -->
                      <div class="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-white dark:from-gray-800 to-transparent 
                                  opacity-100 group-hover/card:opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  {/if}
                  
                  <!-- Compact tags section -->
                  <div class="flex flex-wrap gap-1.5 mb-4 min-h-[24px]">
                    {#if category.tags && category.tags.length > 0}
                      <!-- Default state: show limited tags -->
                      <div class="contents group-hover/card:hidden">
                        {#each category.tags.slice(0, 2) as tag}
                          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium 
                                       bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 
                                       border border-gray-200 dark:border-gray-600/50">
                            <Icon icon="mdi:tag-outline" class="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        {/each}
                        {#if category.tags.length > 2}
                          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium 
                                       bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 
                                       border border-indigo-200 dark:border-indigo-700/50 cursor-help" 
                                title="Hover to see all tags">
                            +{category.tags.length - 2} more
                          </span>
                        {/if}
                      </div>

                      <!-- Hover state: show all tags with different styling -->
                      <div class="hidden group-hover/card:contents">
                        {#each category.tags as tag}
                          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium 
                                       bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 
                                       border border-indigo-200 dark:border-indigo-700/60 
                                       transform transition-all duration-200 hover:scale-105">
                            <Icon icon="mdi:tag" class="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        {/each}
                      </div>
                    {/if}
                  </div>

                  <!-- Footer with improved layout -->
                  <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                    <!-- Left side: metadata -->
                    <div class="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                      {#if category.estimatedTime}
                        <div class="flex items-center gap-1">
                          <Icon icon="mdi:clock-outline" class="w-4 h-4" />
                          <span>{category.estimatedTime}</span>
                        </div>
                      {/if}
                      {#if category.difficulty}
                        <div class="flex items-center gap-1">
                          <Icon icon="mdi:speedometer" class="w-4 h-4" />
                          <span class="capitalize">{category.difficulty}</span>
                        </div>
                      {/if}
                    </div>
                    
                    <!-- Right side: action button -->
                    <div class="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 
                                group-hover/card:text-indigo-700 dark:group-hover/card:text-indigo-300 transition-colors">
                      <span>View Overview</span>
                      <Icon icon="mdi:arrow-right" class="w-4 h-4 ml-1 transform group-hover/card:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <div class="text-center py-16" in:fade={{ duration: 400 }}>
        <Icon icon="mdi:package-variant-closed-remove" class="w-24 h-24 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
        <h3 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">No Exercise Categories Found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          It seems we couldn't find any exercise categories matching your criteria, or there are no categories available at the moment.
        </p>
        <div class="flex justify-center space-x-4">
          <button
            on:click={handleClearFilters}
            class="inline-flex items-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-colors"
          >
            <Icon icon="mdi:filter-remove-outline" class="w-5 h-5 mr-2" />
            Clear Filters
          </button>
          <a 
            href="/courses"
            class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            <Icon icon="mdi:school" class="w-5 h-5 mr-2" />
            Browse Courses
          </a>
        </div>
      </div>
    {/if}
  </div>
</div>