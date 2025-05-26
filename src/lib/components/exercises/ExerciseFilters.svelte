<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  
  export let isOpen = false;
  export let searchQuery = '';
  export let selectedDifficulty = 'all';
  export let selectedCategory = 'all';
  export let selectedTags: string[] = [];
  export let availableTags: string[] = [];
  export let availableCategories: string[] = [];
  export let sortBy = 'title';
  export let sortOrder: 'asc' | 'desc' = 'asc';

  const dispatch = createEventDispatcher<{
    filter: {
      searchQuery: string;
      difficulty: string;
      category: string;
      tags: string[];
      sortBy: string;
      sortOrder: 'asc' | 'desc';
    };
    clear: void;
  }>();

  const difficultyOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'estimatedTime', label: 'Duration' },
    { value: 'createdAt', label: 'Created Date' }
  ];

  function handleSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery = target.value;
    emitFilter();
  }

  function handleDifficultyChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedDifficulty = target.value;
    emitFilter();
  }

  function handleCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedCategory = target.value;
    emitFilter();
  }

  function handleSortChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    sortBy = target.value;
    emitFilter();
  }

  function toggleSortOrder() {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    emitFilter();
  }

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(t => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
    emitFilter();
  }

  function clearAllFilters() {
    searchQuery = '';
    selectedDifficulty = 'all';
    selectedCategory = 'all';
    selectedTags = [];
    sortBy = 'title';
    sortOrder = 'asc';
    dispatch('clear');
  }

  function emitFilter() {
    dispatch('filter', {
      searchQuery,
      difficulty: selectedDifficulty,
      category: selectedCategory,
      tags: selectedTags,
      sortBy,
      sortOrder
    });
  }

  $: activeFiltersCount = (
    (searchQuery ? 1 : 0) +
    (selectedDifficulty !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedTags.length
  );
</script>

<div class="exercise-filters bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
  <!-- Filter Header -->
  <button
    class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-t-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    on:click={() => isOpen = !isOpen}
    aria-expanded={isOpen}
    aria-controls="filter-content"
  >
    <div class="flex items-center gap-2">
      <Icon icon="mdi:filter-variant" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
      <span class="font-medium text-gray-900 dark:text-white">Filters</span>
      {#if activeFiltersCount > 0}
        <span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
          {activeFiltersCount}
        </span>
      {/if}
    </div>
    <Icon 
      icon="mdi:chevron-down" 
      class="h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform {isOpen ? 'rotate-180' : ''}"
    />
  </button>

  <!-- Filter Content -->
  {#if isOpen}
    <div 
      id="filter-content"
      class="px-4 pb-4 border-t border-gray-200 dark:border-gray-700"
      transition:slide={{ duration: 200 }}
    >
      <!-- Search -->
      <div class="mb-4">
        <label for="search-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search
        </label>
        <div class="relative">
          <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            on:input={handleSearchInput}
            placeholder="Search exercises..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <!-- Filter Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <!-- Difficulty Filter -->
        <div>
          <label for="difficulty-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty
          </label>
          <select
            id="difficulty-select"
            value={selectedDifficulty}
            on:change={handleDifficultyChange}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {#each difficultyOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>

        <!-- Category Filter -->
        <div>
          <label for="category-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            on:change={handleCategoryChange}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            {#each availableCategories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
        </div>

        <!-- Sort By -->
        <div>
          <label for="sort-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort By
          </label>
          <select
            id="sort-select"
            value={sortBy}
            on:change={handleSortChange}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {#each sortOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>

        <!-- Sort Order -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Order
          </label>
          <button
            on:click={toggleSortOrder}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex items-center justify-center gap-2"
          >
            <Icon icon={sortOrder === 'asc' ? 'mdi:sort-ascending' : 'mdi:sort-descending'} class="h-4 w-4" />
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      <!-- Tags Filter -->
      {#if availableTags.length > 0}
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div class="flex flex-wrap gap-2">
            {#each availableTags as tag}
              <button
                on:click={() => toggleTag(tag)}
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-colors
                  {selectedTags.includes(tag)
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }"
              >
                {tag}
                {#if selectedTags.includes(tag)}
                  <Icon icon="mdi:check" class="ml-1 h-3 w-3" />
                {/if}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Clear Filters -->
      {#if activeFiltersCount > 0}
        <div class="flex justify-end">
          <button
            on:click={clearAllFilters}
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Clear All Filters
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .exercise-filters {
    margin-bottom: 1.5rem;
  }
</style>
