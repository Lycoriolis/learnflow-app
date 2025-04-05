<script lang="ts">
  import { pipVisible } from '$lib/stores/pipStores';
  import ThemeSwitcher from './ThemeSwitcher.svelte';
  
  export let onTogglePip = () => pipVisible.update(v => !v);
</script>

<header class="bg-white dark:bg-gray-800 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
    <div class="flex-1">
      <div class="relative max-w-xl">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fas fa-search text-gray-400"></i>
        </div>
        <input 
          type="text" 
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white" 
          placeholder="Search courses, exercises..."
        >
      </div>
    </div>
    <div class="ml-4 flex items-center space-x-2">
      <ThemeSwitcher />
      
      <button 
        class="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
        aria-label="Show notifications"
      >
        <i class="fas fa-bell"></i>
      </button>
      
      <button 
        id="pipToggle" 
        class="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
        on:click={onTogglePip}
        aria-label="Toggle learning tools widget"
      >
        <i class="fas fa-puzzle-piece"></i>
      </button>
    </div>
  </div>
</header>