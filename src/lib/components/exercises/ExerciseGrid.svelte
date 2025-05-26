<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import ExerciseCard from './ExerciseCard.svelte';
  import type { ServerContentNode } from '$lib/server/contentService';
  import Icon from '@iconify/svelte';

  export let exercises: ServerContentNode[] = [];
  export let isLoading = false;
  export let error: string | null = null;
  export let viewMode: 'grid' | 'list' = 'grid';
  export let className = '';

  // Accessibility and responsive settings
  export let itemsPerPage = 12;
  export let currentPage = 1;

  $: paginatedExercises = exercises.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  $: totalPages = Math.ceil(exercises.length / itemsPerPage);

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
      scrollToTop();
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      scrollToTop();
    }
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      scrollToTop();
    }
  }

  function scrollToTop() {
    // Scroll to the grid container smoothly
    const container = document.querySelector('.exercise-grid-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Generate page numbers for pagination
  $: pageNumbers = (() => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if there's a gap
      if (start > 2) {
        pages.push('...');
      }
      
      // Add pages around current
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if there's a gap
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  })();
</script>

<div class="exercise-grid-container {className}" role="region" aria-label="Exercise list">
  <!-- Results Summary -->
  {#if !isLoading && !error}
    <div class="mb-4 flex items-center justify-between flex-wrap gap-2">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Showing {paginatedExercises.length} of {exercises.length} exercises
        {#if currentPage > 1}
          (Page {currentPage} of {totalPages})
        {/if}
      </p>
      
      <!-- View Mode Toggle -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">View:</span>
        <div class="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
          <button
            on:click={() => viewMode = 'grid'}
            class="px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
              {viewMode === 'grid' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }"
            aria-pressed={viewMode === 'grid'}
          >
            <Icon icon="mdi:view-grid" class="h-4 w-4" />
          </button>
          <button
            on:click={() => viewMode = 'list'}
            class="px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
              {viewMode === 'list' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }"
            aria-pressed={viewMode === 'list'}
          >
            <Icon icon="mdi:view-list" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Loading State -->
  {#if isLoading}
    <div class="loading-state" in:fade={{ duration: 200 }}>
      <div class="flex flex-col items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400 text-lg">Loading exercises...</p>
        <p class="text-gray-500 dark:text-gray-500 text-sm mt-2">Please wait while we fetch the content</p>
      </div>
    </div>

  <!-- Error State -->
  {:else if error}
    <div class="error-state" in:fade={{ duration: 200 }}>
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <Icon icon="mdi:alert-circle" class="h-16 w-16 text-red-500 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Unable to Load Exercises
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
          {error}
        </p>
        <button
          on:click={() => window.location.reload()}
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>

  <!-- Empty State -->
  {:else if exercises.length === 0}
    <div class="empty-state" in:fade={{ duration: 200 }}>
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <Icon icon="mdi:book-open-variant" class="h-16 w-16 text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Exercises Found
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
          We couldn't find any exercises matching your criteria. Try adjusting your filters or search terms.
        </p>
        <a
          href="/exercises"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          Browse All Exercises
        </a>
      </div>
    </div>

  <!-- Exercise Grid/List -->
  {:else}
    <div
      class="exercise-grid {viewMode === 'grid' ? 'grid-view' : 'list-view'}"
      role="list"
      in:fade={{ duration: 300, delay: 100 }}
    >
      {#each paginatedExercises as exercise, index (exercise.id)}
        <div
          role="listitem"
          in:scale={{ duration: 200, delay: index * 50, start: 0.8 }}
          animate:flip={{ duration: 300 }}
        >
          <ExerciseCard {exercise} className={viewMode === 'list' ? 'list-card' : ''} />
        </div>
      {/each}
    </div>

    <!-- Pagination -->
    {#if totalPages > 1}
      <nav class="pagination mt-8" aria-label="Exercise pagination" in:fade={{ duration: 200, delay: 300 }}>
        <div class="flex items-center justify-between">
          <!-- Previous Button -->
          <button
            on:click={prevPage}
            disabled={currentPage === 1}
            class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Go to previous page"
          >
            <Icon icon="mdi:chevron-left" class="h-4 w-4 mr-1" />
            Previous
          </button>

          <!-- Page Numbers -->
          <div class="hidden sm:flex space-x-1">
            {#each pageNumbers as pageNum}
              {#if pageNum === '...'}
                <span class="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
              {:else}
                <button
                  on:click={() => goToPage(pageNum)}
                  class="relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500
                    {currentPage === pageNum
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }"
                  aria-label="Go to page {pageNum}"
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              {/if}
            {/each}
          </div>

          <!-- Mobile Page Info -->
          <div class="sm:hidden">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <!-- Next Button -->
          <button
            on:click={nextPage}
            disabled={currentPage === totalPages}
            class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Go to next page"
          >
            Next
            <Icon icon="mdi:chevron-right" class="h-4 w-4 ml-1" />
          </button>
        </div>
      </nav>
    {/if}
  {/if}
</div>

<style>
  .exercise-grid-container {
    min-height: 400px;
  }

  .exercise-grid.grid-view {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .exercise-grid.list-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .exercise-grid.list-view :global(.list-card) {
    display: flex;
    align-items: center;
  }

  .exercise-grid.list-view :global(.list-card .p-4) {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .exercise-grid.list-view :global(.list-card .flex-col) {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  .loading-state,
  .error-state,
  .empty-state {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pagination {
    border-top: 1px solid #e5e7eb;
    padding-top: 2rem;
  }

  :global(.dark) .pagination {
    border-top-color: #374151;
  }

  @media (max-width: 640px) {
    .exercise-grid.grid-view {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .exercise-grid.grid-view {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
  }
</style>
