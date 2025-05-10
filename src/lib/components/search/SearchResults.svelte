<!-- src/lib/components/search/SearchResults.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    searchResults, 
    searchQuery, 
    searchLoading, 
    highlightSearchResult, 
    changePage,
    type SearchOptions
  } from '$lib/services/searchService';
  import { fade } from 'svelte/transition';
  
  export let options: SearchOptions = {};
  
  let results = $searchResults;
  let query = $searchQuery;
  let loading = $searchLoading;
  
  // Subscribe to store changes
  searchResults.subscribe(value => {
    results = value;
  });
  
  searchQuery.subscribe(value => {
    query = value;
  });
  
  searchLoading.subscribe(value => {
    loading = value;
  });
  
  function handlePageChange(newPage: number) {
    changePage(newPage, options);
  }
</script>

<div class="search-results">
  {#if loading}
    <div class="search-loading" in:fade={{ duration: 150 }}>
      <div class="search-loading-spinner"></div>
      <p>Searching...</p>
    </div>
  {:else if query && results.totalResults === 0}
    <div class="search-empty" in:fade={{ duration: 150 }}>
      <div class="search-empty-icon">
        <i class="fas fa-search"></i>
      </div>
      <p>No results found for "{query}"</p>
      <p class="search-empty-suggestion">Try adjusting your search term or filters</p>
    </div>
  {:else if query && results.items.length > 0}
    <div class="search-results-info" in:fade={{ duration: 150 }}>
      <span>{results.totalResults} results for "{query}"</span>
    </div>
    
    <ul class="search-results-list" in:fade={{ duration: 150 }}>
      {#each results.items as item}
        <li class="search-result-item">
          <a 
            href={item.type === 'course' 
              ? `/courses/${item.id}` 
              : `/exercises/${item.slug || item.id}`
            }
            class="search-result-link"
          >
            <div class="search-result-type">
              {#if item.type === 'course'}
                <i class="fas fa-book"></i>
              {:else}
                <i class="fas fa-code"></i>
              {/if}
              <span>{item.type}</span>
            </div>
            
            <div class="search-result-content">
              <h3 class="search-result-title">
                {@html highlightSearchResult(item.title, query)}
              </h3>
              
              {#if item.description}
                <p class="search-result-description">
                  {@html highlightSearchResult(item.description, query)}
                </p>
              {/if}
              
              {#if item.tags && item.tags.length > 0}
                <div class="search-result-tags">
                  {#each item.tags.slice(0, 3) as tag}
                    <span class="search-result-tag">
                      {tag}
                    </span>
                  {/each}
                  {#if item.tags.length > 3}
                    <span class="search-result-tag-more">
                      +{item.tags.length - 3}
                    </span>
                  {/if}
                </div>
              {/if}
            </div>
          </a>
        </li>
      {/each}
    </ul>
    
    {#if results.totalPages > 1}
      <div class="search-pagination">
        <button 
          class="pagination-button"
          disabled={results.currentPage === 1}
          on:click={() => handlePageChange(results.currentPage - 1)}
          aria-label="Previous page"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        {#each Array(Math.min(5, results.totalPages)) as _, i}
          {@const page = results.currentPage <= 3 
            ? i + 1 
            : results.currentPage - 2 + i}
          
          {#if page <= results.totalPages}
            <button 
              class="pagination-button {page === results.currentPage ? 'active' : ''}"
              on:click={() => handlePageChange(page)}
              aria-label="Page {page}"
              aria-current={page === results.currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          {/if}
        {/each}
        
        {#if results.totalPages > 5 && results.currentPage < results.totalPages - 2}
          <span class="pagination-ellipsis">...</span>
          <button 
            class="pagination-button"
            on:click={() => handlePageChange(results.totalPages)}
            aria-label="Last page"
          >
            {results.totalPages}
          </button>
        {/if}
        
        <button 
          class="pagination-button"
          disabled={results.currentPage === results.totalPages}
          on:click={() => handlePageChange(results.currentPage + 1)}
          aria-label="Next page"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .search-results {
    width: 100%;
    margin-top: 1rem;
  }
  
  .search-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #4a5568;
  }
  
  :global(.dark) .search-loading {
    color: #a0aec0;
  }
  
  .search-loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid #e2e8f0;
    border-top-color: #4299e1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  :global(.dark) .search-loading-spinner {
    border-color: #4a5568;
    border-top-color: #4299e1;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .search-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    color: #4a5568;
    text-align: center;
  }
  
  :global(.dark) .search-empty {
    color: #a0aec0;
  }
  
  .search-empty-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #cbd5e0;
  }
  
  :global(.dark) .search-empty-icon {
    color: #4a5568;
  }
  
  .search-empty-suggestion {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #718096;
  }
  
  :global(.dark) .search-empty-suggestion {
    color: #718096;
  }
  
  .search-results-info {
    margin-bottom: 1rem;
    padding: 0 0.5rem;
    font-size: 0.875rem;
    color: #4a5568;
  }
  
  :global(.dark) .search-results-info {
    color: #a0aec0;
  }
  
  .search-results-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .search-result-item {
    margin-bottom: 0.5rem;
  }
  
  .search-result-link {
    display: flex;
    padding: 1rem;
    border-radius: 0.375rem;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    color: inherit;
    text-decoration: none;
    transition: all 0.2s ease;
  }
  
  .search-result-link:hover {
    border-color: #4299e1;
    box-shadow: 0 2px 8px rgba(66, 153, 225, 0.15);
  }
  
  :global(.dark) .search-result-link {
    background-color: #2d3748;
    border-color: #4a5568;
  }
  
  :global(.dark) .search-result-link:hover {
    border-color: #4299e1;
    box-shadow: 0 2px 8px rgba(66, 153, 225, 0.15);
  }
  
  .search-result-type {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 5rem;
    min-width: 5rem;
    padding: 0.5rem;
    margin-right: 1rem;
    background-color: #f7fafc;
    border-radius: 0.25rem;
    color: #4a5568;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 500;
  }
  
  :global(.dark) .search-result-type {
    background-color: #2c3748;
    color: #a0aec0;
  }
  
  .search-result-type i {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #4299e1;
  }
  
  :global(.dark) .search-result-type i {
    color: #4299e1;
  }
  
  .search-result-content {
    flex: 1;
  }
  
  .search-result-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a202c;
  }
  
  :global(.dark) .search-result-title {
    color: #e2e8f0;
  }
  
  .search-result-description {
    margin: 0 0 0.75rem 0;
    font-size: 0.875rem;
    color: #4a5568;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  :global(.dark) .search-result-description {
    color: #a0aec0;
  }
  
  .search-result-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .search-result-tag {
    padding: 0.25rem 0.5rem;
    background-color: #edf2f7;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    color: #4a5568;
  }
  
  :global(.dark) .search-result-tag {
    background-color: #4a5568;
    color: #e2e8f0;
  }
  
  .search-result-tag-more {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    color: #718096;
  }
  
  :global(.dark) .search-result-tag-more {
    color: #a0aec0;
  }
  
  .search-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1.5rem;
    gap: 0.25rem;
  }
  
  .pagination-button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.5rem;
    border: 1px solid #e2e8f0;
    background-color: #ffffff;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    color: #4a5568;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .pagination-button:hover:not(:disabled) {
    background-color: #f7fafc;
    border-color: #cbd5e0;
  }
  
  .pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .pagination-button.active {
    background-color: #4299e1;
    border-color: #4299e1;
    color: #ffffff;
  }
  
  :global(.dark) .pagination-button {
    background-color: #2d3748;
    border-color: #4a5568;
    color: #a0aec0;
  }
  
  :global(.dark) .pagination-button:hover:not(:disabled) {
    background-color: #323e54;
    border-color: #4a5568;
  }
  
  :global(.dark) .pagination-button.active {
    background-color: #4299e1;
    border-color: #4299e1;
    color: #ffffff;
  }
  
  .pagination-ellipsis {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    color: #4a5568;
  }
  
  :global(.dark) .pagination-ellipsis {
    color: #a0aec0;
  }
  
  :global(mark) {
    background-color: rgba(246, 224, 94, 0.3);
    color: inherit;
    padding: 0 2px;
    border-radius: 2px;
  }
  
  :global(.dark) :global(mark) {
    background-color: rgba(246, 224, 94, 0.2);
  }
</style>
