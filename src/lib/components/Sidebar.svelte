<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  // Import auth state
  import { isAuthenticated, user, loading } from '$lib/stores/authStore.js';
  import { login } from '$lib/authService.js'; // Import login function if needed for a button
  import { goto } from '$app/navigation';

  // --- Temporary Admin Check (Replace with proper role check) ---
  const ADMIN_EMAIL = 'admin@example.com'; // <-- !!! REPLACE with your test admin email !!!
  $: isAdmin = $isAuthenticated && $user?.email === ADMIN_EMAIL;
  // --------------------------------------------------------------

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
        { name: 'Statistics', href: '/statistics', icon: 'fa-chart-pie', authRequired: true }
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
  
  // Add Admin navigation section
  const adminNavigation: NavCategory[] = [
      {
        title: 'Management',
        items: [
           { name: 'Manage Courses', href: '/admin/courses', icon: 'fa-chalkboard-teacher', authRequired: true },
           { name: 'Manage Users', href: '/admin/users', icon: 'fa-users-cog', authRequired: true },
           { name: 'Site Settings', href: '/admin/settings', icon: 'fa-cog', authRequired: true },
           { name: 'Site Statistics', href: '/admin/statistics', icon: 'fa-chart-bar', authRequired: true }
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
  
  function navigateToLogin() {
    goto('/login');
  }
  
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
  <div class="p-4">
    <div class="flex items-center mb-6 pt-2 pb-4 border-b border-gray-200 dark:border-gray-700">
      <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
        <i class="fas fa-graduation-cap text-white"></i>
      </div>
      <h1 class="text-xl font-bold text-gray-800 dark:text-indigo-300">LearnFlow</h1>
    </div>
    
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
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
             {#each adminNavigation as category}
              <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                  <h2 class="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider">Admin: {category.title}</h2>
                </div>
                <ul>
                  {#each category.items as item}
                      <li class="mb-1">
                        <a 
                          href={item.href} 
                          class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out {path === item.href 
                            ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' 
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'}"
                        >
                          <i class="fas {item.icon} mr-3 w-5 text-center"></i>
                          <span>{item.name}</span>
                        </a>
                      </li>
                  {/each}
                </ul>
              </div>
            {/each}
        </div>
    {/if}
    
    <!-- Bottom Account Section (Conditional) -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
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
            <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center mr-2 text-white text-sm font-medium">
              {$user.displayName?.charAt(0).toUpperCase() ?? $user.email?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <span class="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">{$user.displayName ?? $user.email ?? 'User'}</span>
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
             on:click={navigateToLogin}
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
</style>