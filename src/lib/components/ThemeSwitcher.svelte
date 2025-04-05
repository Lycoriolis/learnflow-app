<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  // Create a store for the theme preference
  export const theme = writable('light');
  
  // Function to toggle theme
  function toggleTheme() {
    theme.update(current => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      
      // Update the document with the new theme
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove(current);
        document.documentElement.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
      }
      
      return newTheme;
    });
  }
  
  onMount(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    theme.set(initialTheme);
    
    document.documentElement.classList.add(initialTheme);
  });
</script>

<button 
  on:click={toggleTheme}
  class="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
  aria-label="Toggle theme"
>
  {#if $theme === 'light'}
    <i class="fas fa-moon"></i>
  {:else}
    <i class="fas fa-sun"></i>
  {/if}
</button>
