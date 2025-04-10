<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  // Import auth state
  import { isAuthenticated, user, loading } from '$lib/stores/authStore.js';
  import { login } from '$lib/authService.js'; // Import login function if needed for a button
  import PersistentMusicPlayer from '$lib/components/PersistentMusicPlayer.svelte'; // Import player
  import type { User } from '@auth0/auth0-spa-js'; // Import User type

  // Reactive variable to check if the user is an admin
  $: isAdmin = $user ? ($user['https://learnflow.com/roles'] as string[])?.includes('admin') : false;

  type NavItem = {
    name: string;
    href: string;
    icon: string;
    authRequired: boolean; // Add a flag to indicate if auth is required
  };
  
  type NavCategory = {
    title: string;
    items: NavItem[];
  };
  
  const navigation: NavCategory[] = [
    {
      title: 'Dashboard',
      items: [
        { name: 'Home', href: '/', icon: 'fa-home', authRequired: false },
        { name: 'My Courses', href: '/courses', icon: 'fa-book-open', authRequired: true },
        { name: 'Exercises', href: '/exercises', icon: 'fa-tasks', authRequired: true },
        { name: 'Progress', href: '/progress', icon: 'fa-chart-line', authRequired: true },
        { name: 'Statistics', href: '/statistics', icon: 'fa-chart-pie', authRequired: true },
        { name: 'Chat Assistant', href: '/chat', icon: 'fa-robot', authRequired: false },
        { name: 'Useful Links', href: '/links', icon: 'fa-link', authRequired: false },
        { name: 'Zen Space', href: '/zen', icon: 'fa-spa', authRequired: false }
      ]
    },
    {
      title: 'Explore', // Renamed from Categories for clarity
      items: [
        { name: 'Computer Science', href: '/category/cs', icon: 'fa-laptop-code', authRequired: false },
        { name: 'Mathematics', href: '/category/math', icon: 'fa-square-root-alt', authRequired: false },
        { name: 'Languages', href: '/category/languages', icon: 'fa-language', authRequired: false },
        { name: 'Science', href: '/category/science', icon: 'fa-flask', authRequired: false }
      ]
    }
  ];
  
  let mobileMenuOpen = false;
  let sidebarElement: HTMLElement;
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    if (sidebarElement) {
      sidebarElement.classList.toggle('open');
    }
  }
  
  $: path = $page.url.pathname;
  
  onMount(() => {
    sidebarElement = document.getElementById('sidebar') as HTMLElement;
  });
</script>

<!-- Mobile Menu Button -->
<div class="lg:hidden fixed top-4 left-4 z-50">
  <button 
    id="mobileMenuBtn"
    on:click={toggleMobileMenu} 
    class="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    aria-label="Toggle mobile menu"
  >
    <i class="fas fa-bars"></i>
  </button>
</div>

<!-- Sidebar -->
<div id="sidebar" class="sidebar w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg fixed h-full z-30 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out">
  <!-- Use Flexbox column for vertical layout -->
  <div class="flex flex-col h-full p-4">
    <!-- Top Logo/Title (Shrink 0) -->
    <div class="flex items-center mb-6 pt-2 pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
        <i class="fas fa-graduation-cap text-white"></i>
      </div>
      <h1 class="text-xl font-bold text-gray-800 dark:text-indigo-300">LearnFlow</h1>
    </div>
    
    <!-- Navigation Links (Grow & Scrollable) -->
    <div class="flex-grow overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
      {#each navigation as category}
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{category.title}</h2>
          </div>
          <ul>
            {#each category.items as item}
              <!-- Conditionally render based on authRequired flag -->
              {#if !item.authRequired || $isAuthenticated}
                <li class="mb-1">
                  <a 
                    href={item.href} 
                    class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out {path === item.href 
                      ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'}"
                  >
                    <i class="fas {item.icon} mr-3 w-5 text-center"></i>
                    <span>{item.name}</span>
                  </a>
                </li>
              {/if}
            {/each}
          </ul>
        </div>
      {/each}
      
      <!-- Conditional Admin Section -->
      {#if isAdmin}
        <!-- ... admin navigation ... -->
      {/if}
    </div> <!-- End Scrollable Area -->
    
    <!-- Music Player (Shrink 0, placed above account section) -->
    <div class="mb-4 flex-shrink-0">
      <PersistentMusicPlayer />
    </div>

    <!-- Bottom Account Section (Shrink 0) -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-4 flex-shrink-0">
      {#if $loading}
        <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          </div>
          <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        </div>
      {:else if $isAuthenticated && $user}
        <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center mb-3">
            {#if $user.picture}
              <img src={$user.picture} alt="{$user.name ?? 'User'}'s profile" class="w-8 h-8 rounded-full mr-2 object-cover"/>
            {:else}
              <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center mr-2 text-white text-sm font-medium">
                {$user.name?.charAt(0).toUpperCase() ?? 'U'}
              </div>
            {/if}
            <span class="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">{$user.nickname ?? $user.name ?? 'User'}</span>
          </div>
          <a href="/settings" class="w-full py-2 px-3 bg-gray-200 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 block text-center transition duration-150">
            Account Settings
          </a>
        </div>
      {:else}
         <!-- Logged Out View -->
         <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
           <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">Log in to track your progress and access personalized features.</p>
           <button 
             class="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium text-white transition duration-150"
             on:click={login}
            >
             Log In / Sign Up
           </button>
         </div>
      {/if}
    </div>
  </div>
</div>

<style>
  /* Add styles for mobile menu */
  @media (max-width: 1023px) {
    .sidebar {
      /* Start hidden off-screen */
    }
    .sidebar.open {
      transform: translateX(0);
    }
  }

  /* Ensure scrollbar style targets the correct element if needed */
  .scrollbar-thin::-webkit-scrollbar { width: 5px; }
  .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
  .scrollbar-thin::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.4); border-radius: 10px; border: 1px solid transparent; background-clip: content-box; }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover { background-color: rgba(156, 163, 175, 0.6); }
</style>