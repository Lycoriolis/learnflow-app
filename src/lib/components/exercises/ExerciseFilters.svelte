<!-- src/lib/components/exercises/ExerciseFilters.svelte -->
<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  
  // Event dispatcher for filter changes
  const dispatch = createEventDispatcher<{
    change: {
      status: string[];
      type: string[];
      difficulty: string[];
      tags: string[];
      sortBy: string;
    }
  }>();
  
  // Filter properties
  export let includeStatus = true;
  export let includeType = true;
  export let includeDifficulty = true;
  export let includeTags = true;
  export let includeSorting = true;
  export let availableTags: string[] = [];
  
  // Filter states
  let selectedStatus: string[] = [];
  let selectedTypes: string[] = [];
  let selectedDifficulty: string[] = [];
  let selectedTags: string[] = [];
  let sortBy = 'newest';
  
  // Available filter options
  const statusOptions = [
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'not-started', label: 'Not Started' }
  ];
  
  const typeOptions = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'coding', label: 'Coding Challenge' },
    { value: 'written', label: 'Written Response' },
    { value: 'interactive', label: 'Interactive' }
  ];
  
  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest-rated', label: 'Highest Rated' },
    { value: 'most-completed', label: 'Most Completed' },
    { value: 'recently-viewed', label: 'Recently Viewed' },
  ];
  
  // Filter state management
  let isExpanded = false;
  let activeFiltersCount = 0;
  
  // Helper to get user's saved preferences
  function getSavedPreferences() {
    if (typeof localStorage === 'undefined') return null;
    
    try {
      const savedPrefs = localStorage.getItem('exercise-filters');
      return savedPrefs ? JSON.parse(savedPrefs) : null;
    } catch (error) {
      console.error('Error loading filter preferences', error);
      return null;
    }
  }
  
  // Helper to save user preferences
  function savePreferences() {
    if (typeof localStorage === 'undefined') return;
    
    try {
      const preferences = {
        status: selectedStatus,
        types: selectedTypes,
        difficulty: selectedDifficulty,
        tags: selectedTags,
        sort: sortBy
      };
      
      localStorage.setItem('exercise-filters', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving filter preferences', error);
    }
  }
  
  // Count active filters for UI display
  function countActiveFilters() {
    return selectedStatus.length + selectedTypes.length + selectedDifficulty.length + selectedTags.length + (sortBy !== 'newest' ? 1 : 0);
  }
  
  // Reset all filters
  function resetFilters() {
    selectedStatus = [];
    selectedTypes = [];
    selectedDifficulty = [];
    selectedTags = [];
    sortBy = 'newest';
    
    savePreferences();
    notifyFilterChange();
  }
  
  // Notify parent component about filter changes
  function notifyFilterChange() {
    dispatch('change', {
      status: selectedStatus,
      type: selectedTypes,
      difficulty: selectedDifficulty,
      tags: selectedTags,
      sortBy
    });
    
    // Update active filters count
    activeFiltersCount = countActiveFilters();
  }
  
  // Initialize from saved preferences on mount
  onMount(() => {
    const saved = getSavedPreferences();
    
    if (saved) {
      selectedStatus = saved.status || [];
      selectedTypes = saved.types || [];
      selectedDifficulty = saved.difficulty || [];
      selectedTags = saved.tags || [];
      sortBy = saved.sort || 'newest';
    }
    
    // Initial count and notification
    activeFiltersCount = countActiveFilters();
    notifyFilterChange();
  });
  
  // Watch for changes to filter state
  $: {
    // Whenever any filter changes, save preferences and notify parent
    const _ = [selectedStatus, selectedTypes, selectedDifficulty, selectedTags, sortBy];
    if (typeof window !== 'undefined') {
      savePreferences();
      notifyFilterChange();
    }
  }
</script>

<div class="exercise-filters my-4">
  <div class="filter-header flex justify-between items-center">
    <button 
      class="filter-toggle flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
      on:click={() => isExpanded = !isExpanded}
      aria-expanded={isExpanded}
    >
      <i class="fas fa-filter mr-2"></i>
      Filters
      {#if activeFiltersCount > 0}
        <span class="ml-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full px-2 py-0.5 text-xs">
          {activeFiltersCount}
        </span>
      {/if}
      <i class="fas fa-chevron-{isExpanded ? 'up' : 'down'} ml-2"></i>
    </button>
    
    {#if activeFiltersCount > 0}
      <button 
        class="reset-filters text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
        on:click={resetFilters}
      >
        Clear all
      </button>
    {/if}
  </div>
  
  {#if isExpanded}
    <div class="filter-content mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg" transition:fade={{ duration: 200 }}>
      <div class="filter-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Completion Status -->
        {#if includeStatus}
          <div class="filter-group">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Completion Status</h3>
            <div class="space-y-2">
              {#each statusOptions as option}
                <label class="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    bind:group={selectedStatus} 
                    value={option.value}
                    class="form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                </label>
              {/each}
            </div>
          </div>
        {/if}
        
        <!-- Exercise Type -->
        {#if includeType}
          <div class="filter-group">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Exercise Type</h3>
            <div class="space-y-2">
              {#each typeOptions as option}
                <label class="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    bind:group={selectedTypes} 
                    value={option.value}
                    class="form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                </label>
              {/each}
            </div>
          </div>
        {/if}
        
        <!-- Difficulty Level -->
        {#if includeDifficulty}
          <div class="filter-group">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty Level</h3>
            <div class="space-y-2">
              {#each difficultyOptions as option}
                <label class="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    bind:group={selectedDifficulty} 
                    value={option.value}
                    class="form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                </label>
              {/each}
            </div>
          </div>
        {/if}
        
        <!-- Tags -->
        {#if includeTags && availableTags.length > 0}
          <div class="filter-group">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h3>
            <div class="flex flex-wrap gap-2">
              {#each availableTags as tag}
                <label class="inline-flex px-2 py-1 rounded-full text-xs font-medium 
                  {selectedTags.includes(tag) 
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'} 
                  cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors">
                  <input 
                    type="checkbox" 
                    bind:group={selectedTags} 
                    value={tag}
                    class="sr-only"
                  />
                  {tag}
                </label>
              {/each}
            </div>
          </div>
        {/if}
        
        <!-- Sort Options -->
        {#if includeSorting}
          <div class="filter-group">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</h3>
            <select 
              bind:value={sortBy}
              class="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
            >
              {#each sortOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </div>
        {/if}
      </div>
      
      <!-- Active filters summary -->
      {#if activeFiltersCount > 0}
        <div class="active-filters mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active Filters:</h3>
          <div class="flex flex-wrap gap-2">
            {#each selectedStatus as status}
              <div class="filter-tag bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full px-3 py-1 text-xs flex items-center">
                {statusOptions.find(o => o.value === status)?.label || status}
                <button 
                  class="ml-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200" 
                  on:click={() => selectedStatus = selectedStatus.filter(s => s !== status)}
                  aria-label="Remove filter"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            {/each}
            
            {#each selectedTypes as type}
              <div class="filter-tag bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full px-3 py-1 text-xs flex items-center">
                {typeOptions.find(o => o.value === type)?.label || type}
                <button 
                  class="ml-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200" 
                  on:click={() => selectedTypes = selectedTypes.filter(t => t !== type)}
                  aria-label="Remove filter"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            {/each}
            
            {#each selectedDifficulty as diff}
              <div class="filter-tag bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full px-3 py-1 text-xs flex items-center">
                {difficultyOptions.find(o => o.value === diff)?.label || diff}
                <button 
                  class="ml-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200" 
                  on:click={() => selectedDifficulty = selectedDifficulty.filter(d => d !== diff)}
                  aria-label="Remove filter"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            {/each}
            
            {#if sortBy !== 'newest'}
              <div class="filter-tag bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full px-3 py-1 text-xs flex items-center">
                Sort: {sortOptions.find(o => o.value === sortBy)?.label || sortBy}
                <button 
                  class="ml-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200" 
                  on:click={() => sortBy = 'newest'}
                  aria-label="Reset sort order"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
