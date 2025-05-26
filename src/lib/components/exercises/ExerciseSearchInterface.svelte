<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { browser } from '$app/environment';
  import Icon from '@iconify/svelte';
  import { exerciseRecommendationService, type SearchResult } from '$lib/services/exercises/exerciseRecommendationService';
  import { exerciseContentService } from '$lib/services/exercises/exerciseContentService';
  import type { ServerContentNode } from '$lib/server/contentService';

  export let className = '';
  export let placeholder = 'Search exercises...';
  export let autoFocus = false;
  export let showFilters = true;
  export let showRecentSearches = true;
  export let maxResults = 20;

  const dispatch = createEventDispatcher<{
    search: { query: string; results: SearchResult[] };
    select: { exercise: ServerContentNode };
    filter: { filters: any };
  }>();

  let searchQuery = '';
  let searchResults: SearchResult[] = [];
  let recentSearches: string[] = [];
  let isSearching = false;
  let showResults = false;
  let searchInput: HTMLInputElement;
  let resultsContainer: HTMLElement;

  // Advanced search filters
  let searchFilters = {
    category: '',
    difficulty: '',
    tags: [] as string[],
    estimatedTime: { min: 0, max: 120 },
    includeCompleted: true
  };

  let availableCategories: string[] = [];
  let availableTags: string[] = [];
  let showAdvancedFilters = false;

  // Search suggestions
  let suggestions: string[] = [];
  let showSuggestions = false;
  let selectedSuggestionIndex = -1;

  // Debounce timer
  let searchTimeout: number;

  onMount(async () => {
    if (!browser) return;
    
    // Load recent searches from localStorage
    const stored = localStorage.getItem('exercise-recent-searches');
    if (stored) {
      try {
        recentSearches = JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse recent searches:', e);
      }
    }

    // Load available categories and tags
    try {
      const stats = await exerciseContentService.getStatistics();
      availableCategories = Object.keys(stats.byCategory);
      availableTags = Object.keys(stats.byTag || {});
    } catch (error) {
      console.error('Failed to load search metadata:', error);
    }

    if (autoFocus && searchInput) {
      searchInput.focus();
    }
  });

  async function performSearch(query: string = searchQuery, filters = searchFilters) {
    if (!query.trim() && !hasActiveFilters(filters)) {
      searchResults = [];
      showResults = false;
      return;
    }

    isSearching = true;
    try {
      const results = await exerciseRecommendationService.searchExercises(query.trim(), {
        category: filters.category || undefined,
        difficulty: filters.difficulty || undefined,
        tags: filters.tags.length > 0 ? filters.tags : undefined,
        minEstimatedTime: filters.estimatedTime.min > 0 ? filters.estimatedTime.min : undefined,
        maxEstimatedTime: filters.estimatedTime.max < 120 ? filters.estimatedTime.max : undefined,
        limit: maxResults
      });

      searchResults = results;
      showResults = true;
      showSuggestions = false;

      // Save search query to recent searches
      if (query.trim()) {
        saveRecentSearch(query.trim());
      }

      dispatch('search', { query: query.trim(), results });
    } catch (error) {
      console.error('Search failed:', error);
      searchResults = [];
    } finally {
      isSearching = false;
    }
  }

  function hasActiveFilters(filters: typeof searchFilters): boolean {
    return !!(
      filters.category ||
      filters.difficulty ||
      filters.tags.length > 0 ||
      filters.estimatedTime.min > 0 ||
      filters.estimatedTime.max < 120
    );
  }

  function saveRecentSearch(query: string) {
    if (!recentSearches.includes(query)) {
      recentSearches = [query, ...recentSearches.slice(0, 9)]; // Keep last 10 searches
      localStorage.setItem('exercise-recent-searches', JSON.stringify(recentSearches));
    }
  }

  function clearRecentSearches() {
    recentSearches = [];
    localStorage.removeItem('exercise-recent-searches');
  }

  function handleInput() {
    clearTimeout(searchTimeout);
    
    // Show suggestions for short queries
    if (searchQuery.length > 0 && searchQuery.length < 3) {
      showSuggestions = true;
      suggestions = generateSuggestions(searchQuery);
    } else {
      showSuggestions = false;
    }

    // Debounce search
    searchTimeout = setTimeout(() => {
      if (searchQuery.length >= 2) {
        performSearch();
      } else if (searchQuery.length === 0) {
        searchResults = [];
        showResults = false;
      }
    }, 300);
  }

  function generateSuggestions(query: string): string[] {
    const lowerQuery = query.toLowerCase();
    const categorySuggestions = availableCategories.filter(cat => 
      cat.toLowerCase().includes(lowerQuery)
    );
    const tagSuggestions = availableTags.filter(tag => 
      tag.toLowerCase().includes(lowerQuery)
    );
    const recentSuggestions = recentSearches.filter(search => 
      search.toLowerCase().includes(lowerQuery)
    );

    return [...new Set([...recentSuggestions, ...categorySuggestions, ...tagSuggestions])].slice(0, 5);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (showSuggestions && suggestions.length > 0) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedSuggestionIndex >= 0) {
            searchQuery = suggestions[selectedSuggestionIndex];
            performSearch();
          }
          break;
        case 'Escape':
          showSuggestions = false;
          selectedSuggestionIndex = -1;
          break;
      }
    } else if (showResults && searchResults.length > 0) {
      switch (event.key) {
        case 'Escape':
          showResults = false;
          searchInput?.blur();
          break;
      }
    }
  }

  function selectSuggestion(suggestion: string) {
    searchQuery = suggestion;
    showSuggestions = false;
    selectedSuggestionIndex = -1;
    performSearch();
    searchInput?.focus();
  }

  function selectResult(result: SearchResult) {
    showResults = false;
    dispatch('select', { exercise: result.exercise });
  }

  function applyFilters() {
    performSearch();
    dispatch('filter', { filters: searchFilters });
  }

  function resetFilters() {
    searchFilters = {
      category: '',
      difficulty: '',
      tags: [],
      estimatedTime: { min: 0, max: 120 },
      includeCompleted: true
    };
    performSearch();
  }

  function toggleTag(tag: string) {
    if (searchFilters.tags.includes(tag)) {
      searchFilters.tags = searchFilters.tags.filter(t => t !== tag);
    } else {
      searchFilters.tags = [...searchFilters.tags, tag];
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (resultsContainer && !resultsContainer.contains(event.target as Node)) {
      showResults = false;
      showSuggestions = false;
    }
  }

  function highlightMatch(text: string, query: string): string {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  }

  function getDifficultyColor(difficulty?: string) {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  }

  // Click outside handler
  onMount(() => {
    if (browser) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  });
</script>

<div class="relative {className}" bind:this={resultsContainer}>
  <!-- Search Input -->
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon 
        icon={isSearching ? 'mdi:loading' : 'mdi:magnify'} 
        class="h-5 w-5 text-gray-400 {isSearching ? 'animate-spin' : ''}" 
      />
    </div>
    <input
      bind:this={searchInput}
      bind:value={searchQuery}
      on:input={handleInput}
      on:keydown={handleKeydown}
      on:focus={() => {
        if (searchQuery.length > 0) {
          showResults = searchResults.length > 0;
          showSuggestions = suggestions.length > 0;
        }
      }}
      type="text"
      {placeholder}
      class="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
      aria-label="Search exercises"
      autocomplete="off"
    />
    <div class="absolute inset-y-0 right-0 flex items-center">
      {#if showFilters}
        <button
          on:click={() => showAdvancedFilters = !showAdvancedFilters}
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 {showAdvancedFilters || hasActiveFilters(searchFilters) ? 'text-indigo-600 dark:text-indigo-400' : ''}"
          title="Advanced filters"
          aria-label="Toggle advanced filters"
        >
          <Icon icon="mdi:filter" class="h-5 w-5" />
        </button>
      {/if}
      {#if searchQuery}
        <button
          on:click={() => {
            searchQuery = '';
            searchResults = [];
            showResults = false;
            showSuggestions = false;
          }}
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mr-2"
          title="Clear search"
          aria-label="Clear search"
        >
          <Icon icon="mdi:close" class="h-5 w-5" />
        </button>
      {/if}
    </div>
  </div>

  <!-- Advanced Filters -->
  {#if showAdvancedFilters}
    <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            bind:value={searchFilters.category}
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-white text-sm"
          >
            <option value="">Any Category</option>
            {#each availableCategories as category}
              <option value={category}>{category}</option>
            {/each}
          </select>
        </div>

        <!-- Difficulty Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Difficulty
          </label>
          <select
            bind:value={searchFilters.difficulty}
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-white text-sm"
          >
            <option value="">Any Difficulty</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <!-- Time Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Duration (minutes)
          </label>
          <div class="flex items-center space-x-2">
            <input
              type="number"
              bind:value={searchFilters.estimatedTime.min}
              min="0"
              max="120"
              class="block w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-white text-sm"
              placeholder="Min"
            />
            <span class="text-gray-500 dark:text-gray-400">-</span>
            <input
              type="number"
              bind:value={searchFilters.estimatedTime.max}
              min="0"
              max="120"
              class="block w-full px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:text-white text-sm"
              placeholder="Max"
            />
          </div>
        </div>

        <!-- Include Completed -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Options
          </label>
          <label class="flex items-center">
            <input
              type="checkbox"
              bind:checked={searchFilters.includeCompleted}
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Include completed</span>
          </label>
        </div>
      </div>

      <!-- Tags Filter -->
      {#if availableTags.length > 0}
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div class="flex flex-wrap gap-2">
            {#each availableTags.slice(0, 10) as tag}
              <button
                on:click={() => toggleTag(tag)}
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors {
                  searchFilters.tags.includes(tag)
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                }"
              >
                <Icon icon="mdi:tag" class="h-3 w-3 mr-1" />
                {tag}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Filter Actions -->
      <div class="flex justify-between items-center mt-4">
        <button
          on:click={resetFilters}
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          Reset filters
        </button>
        <button
          on:click={applyFilters}
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Apply Filters
        </button>
      </div>
    </div>
  {/if}

  <!-- Search Suggestions -->
  {#if showSuggestions && suggestions.length > 0}
    <div class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-600 max-h-60 overflow-auto">
      {#each suggestions as suggestion, index}
        <button
          on:click={() => selectSuggestion(suggestion)}
          class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 {
            index === selectedSuggestionIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
          }"
        >
          <div class="flex items-center">
            <Icon icon="mdi:magnify" class="h-4 w-4 text-gray-400 mr-2" />
            <span class="text-sm text-gray-900 dark:text-white">{suggestion}</span>
          </div>
        </button>
      {/each}
    </div>
  {/if}

  <!-- Search Results -->
  {#if showResults}
    <div class="absolute z-40 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-600 max-h-96 overflow-auto">
      {#if searchResults.length === 0}
        <div class="px-4 py-8 text-center">
          <Icon icon="mdi:magnify" class="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p class="text-sm text-gray-500 dark:text-gray-400">No exercises found</p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search terms or filters</p>
        </div>
      {:else}
        <div class="py-2">
          {#each searchResults as result}
            <button
              on:click={() => selectResult(result)}
              class="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {@html highlightMatch(result.exercise.title || 'Untitled', searchQuery)}
                  </h3>
                  {#if result.exercise.description}
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {@html highlightMatch(result.exercise.description, searchQuery)}
                    </p>
                  {/if}
                  <div class="flex items-center space-x-2 mt-2">
                    <span class="text-xs text-gray-400 dark:text-gray-500 capitalize">
                      {result.exercise.category}
                    </span>
                    {#if result.exercise.difficulty}
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium {getDifficultyColor(result.exercise.difficulty)}">
                        {result.exercise.difficulty}
                      </span>
                    {/if}
                    {#if result.relevanceScore}
                      <span class="text-xs text-indigo-600 dark:text-indigo-400">
                        {Math.round(result.relevanceScore * 100)}% match
                      </span>
                    {/if}
                  </div>
                </div>
                <Icon icon="mdi:chevron-right" class="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  <!-- Recent Searches (when no active search) -->
  {#if showRecentSearches && !searchQuery && !showResults && recentSearches.length > 0}
    <div class="mt-2">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Searches</span>
        <button
          on:click={clearRecentSearches}
          class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          Clear
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        {#each recentSearches.slice(0, 5) as search}
          <button
            on:click={() => {
              searchQuery = search;
              performSearch();
            }}
            class="inline-flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Icon icon="mdi:history" class="h-3 w-3 mr-1" />
            {search}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  :global(mark) {
    padding: 0 1px;
    border-radius: 2px;
  }
</style>
