<!-- src/lib/components/search/SearchBox.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    performSearch, 
    searchQuery, 
    searchLoading, 
    recentSearches
  } from '$lib/services/searchService';
  
  export let placeholder = 'Search for courses and exercises...';
  export let minQueryLength = 2;
  export let showRecentSearches = true;
  export let onSearch: (query: string) => void = () => {};
  export let value = '';
  export let compact = false; // Add compact option for header integration
  
  // Local state
  let query = value || '';
  let inputEl: HTMLInputElement;
  let isFocused = false;
  let recentSearchesList: string[] = [];
  
  // Subscribe to the store
  recentSearches.subscribe(searches => {
    recentSearchesList = searches;
  });
  
  // Update query when searchQuery store changes
  searchQuery.subscribe(newQuery => {
    query = newQuery;
  });
  
  function handleSearch() {
    if (query.trim().length >= minQueryLength) {
      performSearch(query);
      onSearch(query);
      isFocused = false;
    }
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }
  
  function handleFocus() {
    isFocused = true;
  }
  
  function handleBlur() {
    // Delay hiding the recent searches to allow for clicking them
    setTimeout(() => {
      isFocused = false;
    }, 200);
  }
  
  function selectRecentSearch(search: string) {
    query = search;
    handleSearch();
  }
  
  function clearRecentSearches() {
    recentSearches.set([]);
  }
  
  onMount(() => {
    // Initialize with any existing search query
    searchQuery.subscribe(value => {
      query = value;
    });
  });
</script>

<div class="relative {compact ? 'compact-mode' : ''}">
  <div class="search-box">
    <div class="search-input-container">
      {#if compact}
        <div class="icon-container">
          <i class="fas fa-search"></i>
        </div>
      {/if}
      <input
        bind:this={inputEl}
        bind:value={query}
        on:keydown={handleKeyDown}
        on:focus={handleFocus}
        on:blur={handleBlur}
        type="text"
        class="search-input {compact ? 'compact-input' : ''}"
        {placeholder}
        aria-label="Search"
      />
      
      {#if query.length > 0}
        <button
          type="button"
          class="clear-button {compact ? 'compact-button' : ''}"
          aria-label="Clear search"
          on:click={() => {
            query = '';
            inputEl.focus();
          }}
        >
          <i class="fas fa-times"></i>
        </button>
      {/if}
      
      {#if !compact}
        <button
          type="button"
          class="search-button"
          aria-label="Search"
          on:click={handleSearch}
          disabled={query.trim().length < minQueryLength}
        >
          {#if $searchLoading}
            <i class="fas fa-spinner fa-spin"></i>
          {:else}
            <i class="fas fa-search"></i>
          {/if}
        </button>
      {/if}
    </div>
    
    {#if showRecentSearches && isFocused && recentSearchesList.length > 0}
      <div class="recent-searches {compact ? 'compact-recent' : ''}">
        <div class="recent-searches-header">
          <span>Recent Searches</span>
          <button
            type="button"
            class="clear-recents-button"
            on:click={clearRecentSearches}
          >
            Clear
          </button>
        </div>
        <ul class="recent-searches-list">
          {#each recentSearchesList as search}
            <li>
              <button
                type="button"
                class="recent-search-item"
                on:click={() => selectRecentSearch(search)}
              >
                <i class="fas fa-history"></i>
                <span>{search}</span>
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</div>

<style>
  .search-box {
    position: relative;
  }
  
  .search-input-container {
    display: flex;
    position: relative;
    align-items: center;
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem 3rem 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    background-color: #ffffff;
    color: #1a202c;
    transition: all 0.3s ease;
  }
  
  .search-input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
    border-color: #4299e1;
  }
  
  :global(.dark) .search-input {
    background-color: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  :global(.dark) .search-input:focus {
    border-color: #4299e1;
  }
  
  .search-button {
    position: absolute;
    right: 0.5rem;
    padding: 0.5rem;
    background: transparent;
    border: none;
    color: #4a5568;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color 0.2s ease;
  }
  
  .search-button:hover {
    color: #2b6cb0;
  }
  
  .search-button:disabled {
    color: #a0aec0;
    cursor: not-allowed;
  }
  
  :global(.dark) .search-button {
    color: #a0aec0;
  }
  
  :global(.dark) .search-button:hover {
    color: #63b3ed;
  }
  
  .clear-button {
    position: absolute;
    right: 2.5rem;
    padding: 0.5rem;
    background: transparent;
    border: none;
    color: #a0aec0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color 0.2s ease;
  }
  
  .clear-button:hover {
    color: #4a5568;
  }
  
  :global(.dark) .clear-button {
    color: #718096;
  }
  
  :global(.dark) .clear-button:hover {
    color: #e2e8f0;
  }
  
  .recent-searches {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.25rem;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 50;
  }
  
  .compact-recent {
    width: 300px;
  }
  
  /* Compact mode styles */
  .compact-mode .search-input-container {
    background-color: #f7fafc;
    border-radius: 0.375rem;
    border: 1px solid #e2e8f0;
  }
  
  :global(.dark) .compact-mode .search-input-container {
    background-color: #2d3748;
    border-color: #4a5568;
  }
  
  .icon-container {
    display: flex;
    align-items: center;
    padding-left: 0.75rem;
    color: #a0aec0;
  }
  
  .compact-input {
    background-color: transparent;
    border: none;
    box-shadow: none;
    padding-left: 0.5rem;
  }
  
  .compact-input:focus {
    box-shadow: none;
    border: none;
  }
  
  .compact-button {
    right: 0.5rem;
  }
  
  :global(.dark) .recent-searches {
    background-color: #2d3748;
    border-color: #4a5568;
  }
  
  .recent-searches-header {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
  }
  
  :global(.dark) .recent-searches-header {
    color: #a0aec0;
    border-color: #4a5568;
  }
  
  .clear-recents-button {
    background: transparent;
    border: none;
    color: #3182ce;
    cursor: pointer;
    font-size: 0.875rem;
    transition: color 0.2s ease;
  }
  
  .clear-recents-button:hover {
    color: #2b6cb0;
    text-decoration: underline;
  }
  
  :global(.dark) .clear-recents-button {
    color: #63b3ed;
  }
  
  :global(.dark) .clear-recents-button:hover {
    color: #4299e1;
  }
  
  .recent-searches-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .recent-search-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    text-align: left;
    font-size: 0.875rem;
    color: #1a202c;
    transition: background-color 0.2s ease;
    cursor: pointer;
  }
  
  .recent-search-item:hover {
    background-color: #f7fafc;
  }
  
  :global(.dark) .recent-search-item {
    color: #e2e8f0;
  }
  
  :global(.dark) .recent-search-item:hover {
    background-color: #4a5568;
  }
  
  .recent-search-item i {
    margin-right: 0.5rem;
    color: #a0aec0;
  }
  
  :global(.dark) .recent-search-item i {
    color: #718096;
  }
</style>
