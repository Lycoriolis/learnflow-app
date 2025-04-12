<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { isAuthenticated, user, loading } from '$lib/stores/authStore.js';
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { isUserAdmin } from '$lib/authService.js';
  import { logout } from '$lib/authService.js';
  import AdminSidebar from './AdminSidebar.svelte';

  // Authentication state
  let hasChecked = false;
  let accessGranted = false;
  let errorMessage = '';

  // UI state
  let sidebarOpen = true;
  let profileMenuOpen = false;
  let currentTheme = 'light';
  
  // Handle browser resizing for responsive behavior
  let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  
  // Mobile sidebar state
  let isMobileSidebarOpen = false;
  let showLogoutConfirm = false;

  // Handle logout confirm
  function handleShowLogoutConfirm() {
    showLogoutConfirm = true;
  }
    
  // Handle actual logout
  async function handleLogout() {
    await logout();
    goto('/');
  }
  
  function handleResize() {
    windowWidth = window.innerWidth;
    if (windowWidth < 1024) {
      sidebarOpen = false;
    } else {
      sidebarOpen = true;
    }
  }
  
  onMount(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('admin-theme');
    if (savedTheme) {
      currentTheme = savedTheme;
      applyTheme(currentTheme);
    }
    
    // Close mobile sidebar when window is resized to larger than mobile
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    
    function handleMediaQueryChange(e: MediaQueryListEvent) {
      if (e.matches) {
        isMobileSidebarOpen = false;
      }
    }
    
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  });
  
  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize);
    }
  });
  
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
  
  function toggleProfileMenu() {
    profileMenuOpen = !profileMenuOpen;
  }
  
  function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('admin-theme', currentTheme);
  }
  
  function applyTheme(theme: string) {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  // Admin access check
  $: if (!$loading && !hasChecked) {
    hasChecked = true;
    console.log('--- Running Admin Layout Auth Check ---');
    console.log(`Is Authenticated: ${$isAuthenticated}`);
    console.log(`User Email: ${$user?.email || 'N/A'}`);
    
    if (!$isAuthenticated) {
      errorMessage = 'Authentication required. Redirecting to login...';
      console.warn('Not authenticated, redirecting to login.');
      goto(`/login?redirect=${encodeURIComponent($page.url.pathname)}`);
    } else if (!isUserAdmin($user?.email)) {
      errorMessage = 'Admin privileges required. Redirecting to homepage...';
      console.warn(`Not admin (Email: ${$user?.email}), redirecting to home.`);
      goto('/');
    } else {
      console.log('Admin access granted.');
      accessGranted = true;
    }
    console.log('--------------------------------------');
  }

  // Toggle mobile sidebar
  function toggleMobileSidebar() {
    isMobileSidebarOpen = !isMobileSidebarOpen;
  }

  // Define navigation structure (categories and items)
  const navigationCategories = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'fa-tachometer-alt',
      items: [
        { 
          id: 'overview', 
          label: 'Overview', 
          path: '/admin', 
          icon: 'fa-home' 
        },
        { 
          id: 'statistics', 
          label: 'Statistics', 
          path: '/admin/statistics', 
          icon: 'fa-chart-pie' 
        }
      ]
    },
    {
      id: 'courses',
      label: 'Course Management',
      icon: 'fa-graduation-cap',
      items: [
        { 
          id: 'all-courses', 
          label: 'All Courses', 
          path: '/admin/courses', 
          icon: 'fa-list' 
        },
        { 
          id: 'new-course', 
          label: 'Add New Course', 
          path: '/admin/courses/new', 
          icon: 'fa-plus' 
        },
        { 
          id: 'categories', 
          label: 'Categories', 
          path: '/admin/courses/categories', 
          icon: 'fa-folder' 
        }
      ]
    },
    {
      id: 'users',
      label: 'User Management',
      icon: 'fa-users',
      items: [
        { 
          id: 'all-users', 
          label: 'All Users', 
          path: '/admin/users', 
          icon: 'fa-user' 
        },
        { 
          id: 'new-user', 
          label: 'Add New User', 
          path: '/admin/users/new', 
          icon: 'fa-user-plus' 
        },
        { 
          id: 'roles', 
          label: 'Roles & Permissions', 
          path: '/admin/users/roles', 
          icon: 'fa-shield-alt' 
        }
      ]
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: 'fa-file-alt',
      items: [
        { 
          id: 'all-exercises', 
          label: 'Exercises', 
          path: '/admin/content/exercises', 
          icon: 'fa-tasks' 
        },
        { 
          id: 'media-library', 
          label: 'Media Library', 
          path: '/admin/content/media', 
          icon: 'fa-images' 
        }
      ]
    },
    {
      id: 'system',
      label: 'System',
      icon: 'fa-cog',
      items: [
        { 
          id: 'general-settings', 
          label: 'General Settings', 
          path: '/admin/settings', 
          icon: 'fa-sliders-h' 
        },
        { 
          id: 'themes-appearance', 
          label: 'Appearance', 
          path: '/admin/settings/appearance', 
          icon: 'fa-palette' 
        },
        { 
          id: 'backup-restore', 
          label: 'Backup & Restore', 
          path: '/admin/settings/backup', 
          icon: 'fa-hdd' 
        }
      ]
    }
  ];

  // Helper function to determine if a path is current
  function isCurrentPath(path: string): boolean {
    const currentPath = $page.url.pathname;
    return currentPath === path || currentPath.startsWith(path + '/');
  }
  
  // Determine the active category based on current path
  $: activeCategory = $page.url.pathname.split('/')[2] || 'dashboard';

  // Check if a category is expanded
  function isCategoryExpanded(categoryId: string): boolean {
    // Always expand the category containing the active path
    for (const category of navigationCategories) {
      if (category.id === categoryId) {
        for (const item of category.items) {
          if (isCurrentPath(item.path)) {
            return true;
          }
        }
      }
    }
    
    // Otherwise, expand if it's the activeCategory
    return categoryId === activeCategory;
  }
</script>

{#if $loading || !hasChecked}
  <div in:fade class="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex justify-center items-center">
    <div class="flex flex-col items-center">
      <div class="w-16 h-16 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Verifying admin access...</p>
      {#if errorMessage}
        <p class="mt-2 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      {/if}
    </div>
  </div>
{:else if accessGranted}
  <div class="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
    <!-- Mobile sidebar backdrop -->
    {#if isMobileSidebarOpen}
      <div 
        transition:fade={{ duration: 150 }} 
        class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
        on:click={toggleMobileSidebar}
      ></div>
    {/if}
    
    <!-- Mobile sidebar -->
    <div class="lg:hidden">
      <div 
        class="fixed inset-0 flex z-40 pointer-events-none"
        class:transform-none={isMobileSidebarOpen} 
        class:-translate-x-full={!isMobileSidebarOpen}
      >
        <div class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white dark:bg-gray-800 transform transition ease-in-out duration-300 pointer-events-auto">
          <div class="absolute top-0 right-0 -mr-12 pt-2">
            {#if isMobileSidebarOpen}
              <button 
                on:click={toggleMobileSidebar}
                class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span class="sr-only">Close sidebar</span>
                <i class="fas fa-times text-white text-xl"></i>
              </button>
            {/if}
          </div>
          
          <div class="h-full">
            <AdminSidebar on:showLogoutConfirm={handleShowLogoutConfirm} />
          </div>
        </div>
        
        <div class="flex-shrink-0 w-14" aria-hidden="true"></div>
      </div>
    </div>
  
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <!-- Top NavBar -->
      <header class="bg-white dark:bg-gray-800 shadow-sm z-20 relative">
        <div class="flex items-center justify-between h-16 px-4">
          <div class="flex items-center">
            <!-- Mobile menu button -->
            <button 
              on:click={toggleSidebar} 
              class="text-gray-600 dark:text-gray-300 focus:outline-none focus:text-gray-900 dark:focus:text-white"
            >
              <i class="fas {sidebarOpen ? 'fa-times' : 'fa-bars'} text-xl"></i>
            </button>
            
            <a href="/" class="flex items-center ml-4">
              <img 
                src="/favicon.png" 
                alt="LearnFlow Logo" 
                class="h-8 w-auto mr-2"
              >
              <span class="text-lg font-bold text-indigo-600 dark:text-indigo-400">LearnFlow</span>
              <span class="ml-1.5 text-gray-600 dark:text-gray-300 font-medium">Admin</span>
            </a>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
            <button
              on:click={toggleTheme}
              class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              <i class="fas {currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
            </button>
            
            <!-- Help Button -->
            <a 
              href="/admin/help" 
              class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Help"
            >
              <i class="fas fa-question-circle"></i>
            </a>
            
            <!-- Notifications Button -->
            <button 
              class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              aria-label="Notifications"
            >
              <i class="fas fa-bell"></i>
              <span class="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            
            <!-- Profile Menu -->
            <div class="relative">
              <button 
                on:click={toggleProfileMenu}
                class="flex items-center space-x-2 focus:outline-none"
              >
                <div class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                  {$user?.displayName?.charAt(0).toUpperCase() || $user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">
                  {$user?.displayName || $user?.email?.split('@')[0] || 'Admin'}
                </span>
                <i class="fas fa-chevron-down text-xs text-gray-500 dark:text-gray-400 hidden md:block"></i>
              </button>
              
              {#if profileMenuOpen}
                <div
                  in:fade={{ duration: 100 }}
                  out:fade={{ duration: 75 }}
                  class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-30"
                >
                  <div class="py-1" role="menu" aria-orientation="vertical">
                    <a 
                      href="/admin/profile" 
                      class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      <i class="fas fa-user-circle mr-2"></i> Profile
                    </a>
                    <a 
                      href="/admin/settings" 
                      class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      <i class="fas fa-cog mr-2"></i> Settings
                    </a>
                    <button 
                      on:click={handleLogout}
                      class="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      <i class="fas fa-sign-out-alt mr-2"></i> Logout
                    </button>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
        
        <!-- Breadcrumb navigation under the header -->
        <div class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-xs border-t border-gray-200 dark:border-gray-600">
          <div class="flex items-center text-gray-500 dark:text-gray-400">
            <a href="/admin" class="hover:text-indigo-600 dark:hover:text-indigo-400">Admin Dashboard</a>
            {#if $page.url.pathname !== '/admin'}
              <span class="mx-2">/</span>
              {#each $page.url.pathname.split('/').filter(Boolean).slice(1) as segment, i}
                <a 
                  href={`/${$page.url.pathname.split('/').filter(Boolean).slice(0, i + 2).join('/')}`} 
                  class="hover:text-indigo-600 dark:hover:text-indigo-400 capitalize"
                >
                  {segment.replace('-', ' ')}
                </a>
                {#if i < $page.url.pathname.split('/').filter(Boolean).length - 2}
                  <span class="mx-2">/</span>
                {/if}
              {/each}
            {/if}
          </div>
        </div>
      </header>
      
      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar -->
        <aside 
          class="bg-white dark:bg-gray-800 w-64 shadow-md transform transition-all duration-300 ease-in-out z-10 {sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative inset-y-0 left-0 overflow-y-auto"
        >
          <nav class="mt-4 px-2">
            {#each navigationCategories as category}
              <div class="mb-2">
                <div 
                  class="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  on:click={() => activeCategory = activeCategory === category.id ? '' : category.id}
                >
                  <div class="flex items-center">
                    <i class="fas {category.icon} w-5 mr-2 text-gray-500 dark:text-gray-400"></i>
                    <span>{category.label}</span>
                  </div>
                  <i class="fas {isCategoryExpanded(category.id) ? 'fa-chevron-down' : 'fa-chevron-right'} text-xs text-gray-500 dark:text-gray-400"></i>
                </div>
                
                {#if isCategoryExpanded(category.id)}
                  <div 
                    in:fly={{ y: -5, duration: 150 }}
                    class="mt-1 ml-4 space-y-1 border-l border-gray-200 dark:border-gray-700"
                  >
                    {#each category.items as item}
                      <a 
                        href={item.path}
                        class="flex items-center px-3 py-1.5 text-sm border-l-2 {isCurrentPath(item.path) 
                          ? 'border-indigo-500 text-indigo-700 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/30' 
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}"
                      >
                        <i class="fas {item.icon} w-4 mr-2 text-gray-400 dark:text-gray-500"></i>
                        <span>{item.label}</span>
                      </a>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </nav>
          
          <!-- Status indicator at the bottom -->
          <div class="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <div class="ml-2 text-xs text-gray-500 dark:text-gray-400">
                <span>System Status:</span>
                <span class="text-green-500 ml-1 font-medium">Online</span>
              </div>
            </div>
          </div>
        </aside>
        
        <!-- Sidebar backdrop for mobile -->
        {#if sidebarOpen && windowWidth < 1024}
          <div 
            on:click={toggleSidebar}
            in:fade={{ duration: 100 }}
            class="fixed inset-0 bg-gray-600 bg-opacity-50 z-0 lg:hidden"
          ></div>
        {/if}
        
        <!-- Main content area -->
        <main class="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div in:fly={{ y: 10, duration: 200 }} class="p-4 lg:p-6 max-w-7xl mx-auto">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
{:else}
  <!-- Access denied fallback -->
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
    <div in:fade class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full text-center">
      <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-lock text-red-600 dark:text-red-400 text-2xl"></i>
      </div>
      <h1 class="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Access Denied</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        An unexpected error occurred during access verification.
      </p>
      <a href="/" class="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition duration-150">
        Return to Homepage
      </a>
    </div>
  </div>
{/if} 