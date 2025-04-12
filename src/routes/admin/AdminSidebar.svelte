<script lang="ts">
  import { page } from '$app/stores';
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import { user } from '$lib/stores/authStore.js';
  
  const dispatch = createEventDispatcher();
  
  // Sidebar data structure with categories and items
  const sidebarData = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'fa-tachometer-alt',
      path: '/admin',
      badge: null
    },
    {
      id: 'courses',
      title: 'Courses',
      icon: 'fa-graduation-cap',
      items: [
        { id: 'course-list', title: 'All Courses', path: '/admin/courses' },
        { id: 'course-new', title: 'Add New Course', path: '/admin/courses/new' },
        { id: 'course-categories', title: 'Categories', path: '/admin/courses/categories' },
        { id: 'course-reviews', title: 'Reviews', path: '/admin/courses/reviews', badge: { text: '3', variant: 'warning' } }
      ],
      collapsed: true
    },
    {
      id: 'users',
      title: 'Users',
      icon: 'fa-users',
      items: [
        { id: 'user-list', title: 'All Users', path: '/admin/users' },
        { id: 'user-new', title: 'Add New User', path: '/admin/users/new' },
        { id: 'user-roles', title: 'Roles & Permissions', path: '/admin/users/roles' }
      ],
      collapsed: true
    },
    {
      id: 'content',
      title: 'Content',
      icon: 'fa-book',
      items: [
        { id: 'content-lessons', title: 'Lessons', path: '/admin/content/lessons' },
        { id: 'content-quizzes', title: 'Quizzes', path: '/admin/content/quizzes' },
        { id: 'content-media', title: 'Media Library', path: '/admin/content/media' }
      ],
      collapsed: true
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: 'fa-chart-bar',
      items: [
        { id: 'reports-enrollment', title: 'Enrollment', path: '/admin/reports/enrollment' },
        { id: 'reports-completion', title: 'Completion', path: '/admin/reports/completion' },
        { id: 'reports-revenue', title: 'Revenue', path: '/admin/reports/revenue' }
      ],
      collapsed: true
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'fa-cog',
      items: [
        { id: 'settings-general', title: 'General', path: '/admin/settings' },
        { id: 'settings-appearance', title: 'Appearance', path: '/admin/settings/appearance' },
        { id: 'settings-notifications', title: 'Notifications', path: '/admin/settings/notifications' },
        { id: 'settings-integrations', title: 'Integrations', path: '/admin/settings/integrations' }
      ],
      collapsed: true
    }
  ];
  
  // Reactive state
  $: currentPath = $page.url.pathname;
  $: darkMode = false;
  
  // Track categories expansion state
  let categories = sidebarData.map(category => ({
    id: category.id,
    collapsed: category.collapsed || false
  }));
  
  // Toggle category collapse state
  function toggleCategory(categoryId) {
    categories = categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, collapsed: !cat.collapsed } 
        : cat
    );
  }
  
  // Check if a category is currently collapsed
  function isCategoryCollapsed(categoryId) {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.collapsed : true;
  }
  
  // Check if a menu item is active based on current path
  function isActive(path) {
    if (path === '/admin' && currentPath === '/admin') {
      return true;
    }
    return path !== '/admin' && currentPath.startsWith(path);
  }
  
  // Determine if any item in a category is active
  function isCategoryActive(category) {
    if (category.path && isActive(category.path)) return true;
    if (category.items) {
      return category.items.some(item => isActive(item.path));
    }
    return false;
  }
  
  // Handle logout click
  function handleLogout() {
    dispatch('showLogoutConfirm');
  }
</script>

<aside class="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
  <!-- Logo and Brand -->
  <div class="p-4 border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-center">
      <img src="/images/logo.svg" alt="LearnFlow Logo" class="h-8 w-auto" />
      <span class="ml-2 text-lg font-semibold text-gray-900 dark:text-white">LearnFlow</span>
    </div>
  </div>
  
  <!-- Sidebar Navigation -->
  <nav class="flex-1 overflow-y-auto py-4 px-2">
    <ul class="space-y-1">
      {#each sidebarData as category}
        <li>
          {#if !category.items}
            <!-- Single item without dropdown -->
            <a 
              href={category.path} 
              class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                {isActive(category.path) 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}"
            >
              <i class="fas {category.icon} w-5 h-5 mr-3"></i>
              <span>{category.title}</span>
              
              {#if category.badge}
                <span class="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                  {category.badge.variant === 'warning'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'}">
                  {category.badge.text}
                </span>
              {/if}
            </a>
          {:else}
            <!-- Category with dropdown -->
            <div>
              <button 
                type="button"
                on:click={() => toggleCategory(category.id)}
                class="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                  {isCategoryActive(category)
                    ? 'bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}"
              >
                <div class="flex items-center">
                  <i class="fas {category.icon} w-5 h-5 mr-3"></i>
                  <span>{category.title}</span>
                </div>
                <i class="fas {!isCategoryCollapsed(category.id) ? 'fa-chevron-down' : 'fa-chevron-right'} w-4 h-4"></i>
              </button>
              
              {#if !isCategoryCollapsed(category.id)}
                <ul transition:slide={{ duration: 200 }} class="mt-1 ml-7 space-y-1">
                  {#each category.items as item}
                    <li>
                      <a
                        href={item.path}
                        class="flex items-center px-3 py-2 rounded-md text-sm transition-colors duration-150 ease-in-out
                          {isActive(item.path)
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}"
                      >
                        <span class="relative flex items-center">
                          <span 
                            class="absolute -left-5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full 
                              {isActive(item.path) ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}"
                          ></span>
                          {item.title}
                        </span>
                        
                        {#if item.badge}
                          <span class="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                            {item.badge.variant === 'warning'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'}">
                            {item.badge.text}
                          </span>
                        {/if}
                      </a>
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  </nav>
  
  <!-- Footer with User Profile and Logout -->
  <div class="p-4 border-t border-gray-200 dark:border-gray-700">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div class="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold uppercase">
          {$user?.displayName?.charAt(0) || 'A'}
        </div>
      </div>
      <div class="ml-3 flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
          {$user?.displayName || 'Admin User'}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
          {$user?.email || 'admin@example.com'}
        </p>
      </div>
      <button 
        on:click={handleLogout}
        class="ml-2 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white focus:outline-none"
      >
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>
  </div>
</aside> 