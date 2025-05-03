<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  export let categories: Array<{id: string, name: string}> = [];
  export let filterCategory: string;
  export let searchQuery: string;
  export let sortOption: string;
  export let difficultyFilter: string;
  
  // Local state for SSR safety
  let initialRender = true;
  
  const dispatch = createEventDispatcher();

  function handleSearch(e: Event) {
    dispatch('search', (e.target as HTMLInputElement).value);
  }
  
  function handleCategory(e: Event) {
    dispatch('category', (e.target as HTMLSelectElement).value);
  }
  
  function handleSort(e: Event) {
    dispatch('sort', (e.target as HTMLSelectElement).value);
  }
  
  function handleDifficulty(e: Event) {
    dispatch('difficulty', (e.target as HTMLSelectElement).value);
  }
  
  onMount(() => {
    // Component is now mounted, safe to use client-side features
    initialRender = false;
  });
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-8">
  <div class="flex flex-col md:flex-row gap-4">
    <div class="relative flex-grow">
      <input
        type="text"
        class="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Search topics..."
        value={searchQuery}
        on:input={handleSearch}
      />
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <i class="fas fa-search text-gray-400"></i>
      </div>
    </div>
    <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
      <div class="relative">
        <select 
          class="appearance-none pl-4 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          value={filterCategory}
          on:change={handleCategory}
        >
          <option value="all">All Categories</option>
          {#each categories as category}
            <option value={category.id} selected={filterCategory === category.id}>{category.name}</option>
          {/each}
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <i class="fas fa-chevron-down text-gray-400"></i>
        </div>
      </div>
      <div class="relative">
        <select 
          class="appearance-none pl-4 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={sortOption}
          on:change={handleSort}
        >
          <option value="latest" selected={sortOption === "latest"}>Latest Activity</option>
          <option value="created" selected={sortOption === "created"}>Created</option>
          <option value="popular" selected={sortOption === "popular"}>Most Viewed</option>
          <option value="most-replies" selected={sortOption === "most-replies"}>Most Replies</option>
          <option value="most-upvoted" selected={sortOption === "most-upvoted"}>Most Upvoted</option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <i class="fas fa-chevron-down text-gray-400"></i>
        </div>
      </div>
      <div class="relative">
        <select 
          class="appearance-none pl-4 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={difficultyFilter}
          on:change={handleDifficulty}
        >
          <option value="all" selected={difficultyFilter === "all"}>All Levels</option>
          <option value="beginner" selected={difficultyFilter === "beginner"}>Beginner</option>
          <option value="intermediate" selected={difficultyFilter === "intermediate"}>Intermediate</option>
          <option value="advanced" selected={difficultyFilter === "advanced"}>Advanced</option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <i class="fas fa-chevron-down text-gray-400"></i>
        </div>
      </div>
    </div>
  </div>
</div>