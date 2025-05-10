<!-- src/routes/search/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import SearchBox from '$lib/components/search/SearchBox.svelte';
  import SearchResults from '$lib/components/search/SearchResults.svelte';
  import { searchQuery, performSearch, searchResults, recentSearches } from '$lib/services/searchService';
  import { fly } from 'svelte/transition';

  let query = '';
  let searchOptions = {
    pageSize: 10,
    sortBy: 'relevance' as 'relevance' | 'date' | 'title',
    filterTags: [] as string[]
  };
  
  // Optional types filter
  let selectedTypes: ('course' | 'exercise')[] = [];
  let availableTags: string[] = [];
  
  // Extract search parameters from URL on mount
  onMount(() => {
    // Get search parameters from URL
    const urlParams = new URLSearchParams($page.url.search);
    const urlQuery = urlParams.get('q');
    const urlTypes = urlParams.get('types')?.split(',') as ('course' | 'exercise')[];
    const urlTags = urlParams.get('tags')?.split(',');
    const urlSort = urlParams.get('sort') as 'relevance' | 'date' | 'title';
    const urlPage = urlParams.get('page');
    
    // Apply URL parameters if present
    if (urlQuery) {
      query = urlQuery;
      searchOptions = {
        ...searchOptions,
        page: urlPage ? parseInt(urlPage) : 1,
        sortBy: urlSort || 'relevance'
      };
      
      if (urlTypes?.length) {
        selectedTypes = urlTypes;
        searchOptions.types = urlTypes;
      }
      
      if (urlTags?.length) {
        searchOptions.filterTags = urlTags;
      }
      
      // Perform search with URL parameters
      performSearch(query, searchOptions);
    }
  });
  
  // Update URL when search is performed
  function handleSearch(searchText: string) {
    query = searchText;
    updateUrl();
    performSearch(query, { 
      ...searchOptions, 
      types: selectedTypes.length > 0 ? selectedTypes : undefined 
    });
  }
  
  // When filter changes, update search
  function handleFilterChange() {
    searchOptions = {
      ...searchOptions,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      page: 1 // Reset to first page when filters change
    };
    updateUrl();
    performSearch(query, searchOptions);
  }
  
  // When sort option changes
  function handleSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    searchOptions.sortBy = select.value as 'relevance' | 'date' | 'title';
    updateUrl();
    performSearch(query, searchOptions);
  }
  
  // Add or remove a tag filter
  function toggleTagFilter(tag: string) {
    const tagIndex = searchOptions.filterTags.indexOf(tag);
    if (tagIndex > -1) {
      searchOptions.filterTags.splice(tagIndex, 1);
    } else {
      searchOptions.filterTags.push(tag);
    }
    searchOptions = { ...searchOptions }; // Trigger reactivity
    updateUrl();
    performSearch(query, searchOptions);
  }
  
  // Extract unique tags from search results for filter options
  $: {
    const tags = new Set<string>();
    $searchResults.items.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => tags.add(tag));
      }
    });
    availableTags = Array.from(tags);
  }
  
  // Update URL with current search parameters
  function updateUrl() {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedTypes.length > 0) params.set('types', selectedTypes.join(','));
    if (searchOptions.filterTags.length > 0) params.set('tags', searchOptions.filterTags.join(','));
    if (searchOptions.sortBy !== 'relevance') params.set('sort', searchOptions.sortBy);
    if (searchOptions.page && searchOptions.page > 1) params.set('page', searchOptions.page.toString());
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.pushState(null, '', newUrl);
  }
</script>

<svelte:head>
  <title>{query ? `${query} - Search` : 'Search'} | LearnFlow</title>
  <meta name="description" content="Search for courses, exercises, and learning resources" />
</svelte:head>

<div class="search-page container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Search</h1>
  
  <div class="search-container mb-8">
    <SearchBox 
      placeholder="Search for courses, exercises, and more..." 
      value={query}
      onSearch={handleSearch} 
      minQueryLength={2}
    />
    
    {#if $recentSearches.length > 0 && !query}
      <div class="recent-searches mt-3" transition:fly={{ y: 20, duration: 200 }}>
        <h3 class="text-sm text-gray-500 mb-2">Recent searches:</h3>
        <div class="flex flex-wrap gap-2">
          {#each $recentSearches as recentQuery}
            <button 
              class="recent-search-tag px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200" 
              on:click={() => handleSearch(recentQuery)}
            >
              {recentQuery}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  
  {#if query}
    <div class="search-content grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Filters sidebar -->
      <div class="filters md:col-span-1 p-4 bg-gray-50 rounded-lg">
        <h2 class="text-lg font-semibold mb-4">Filters</h2>
        
        <!-- Content type filter -->
        <div class="filter-group mb-6">
          <h3 class="text-md font-medium mb-2">Content type</h3>
          <div class="space-y-2">
            <label class="flex items-center">
              <input 
                type="checkbox" 
                value="course" 
                bind:group={selectedTypes} 
                on:change={handleFilterChange} 
                class="mr-2"
              />
              Courses
            </label>
            <label class="flex items-center">
              <input 
                type="checkbox" 
                value="exercise" 
                bind:group={selectedTypes} 
                on:change={handleFilterChange} 
                class="mr-2"
              />
              Exercises
            </label>
          </div>
        </div>
        
        <!-- Sort options -->
        <div class="filter-group mb-6">
          <h3 class="text-md font-medium mb-2">Sort by</h3>
          <select 
            class="w-full p-2 border rounded" 
            value={searchOptions.sortBy} 
            on:change={handleSortChange}
          >
            <option value="relevance">Relevance</option>
            <option value="date">Most recent</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
        
        <!-- Tags filter -->
        {#if availableTags.length > 0}
          <div class="filter-group">
            <h3 class="text-md font-medium mb-2">Tags</h3>
            <div class="flex flex-wrap gap-2">
              {#each availableTags as tag}
                <button 
                  class="tag-filter px-3 py-1 rounded-full text-sm border {searchOptions.filterTags.includes(tag) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300 hover:bg-gray-100'}" 
                  on:click={() => toggleTagFilter(tag)}
                >
                  {tag}
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>
      
      <!-- Search results -->
      <div class="results md:col-span-3">
        <SearchResults options={searchOptions} />
      </div>
    </div>
  {/if}
</div>

<style>
  .search-page {
    min-height: calc(100vh - 200px);
  }
  
  .search-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .filters {
    height: fit-content;
    position: sticky;
    top: 2rem;
  }
</style>
