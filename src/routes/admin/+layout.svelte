<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { isAuthenticated, user, loading } from '$lib/stores/authStore.js';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import AdminSidebar from './AdminSidebar.svelte';

  // Admin check based on Firebase Authentication
  // In a real app, you would use Firebase custom claims or Firestore
  // to store and verify admin roles more securely
  const ADMIN_EMAIL = 'admin@example.com';
  $: isAdmin = $isAuthenticated && $user?.email === ADMIN_EMAIL;
  
  let checked = false;
  
  // Check if user has admin access
  $: if (!$loading && !checked) {
    checked = true;
    if (!isAdmin) {
      console.warn('Non-admin user attempting to access admin area.');
      goto('/');
    }
  }

  // Current section title based on route
  $: currentSection = (() => {
    const path = $page.url.pathname;
    if (path.includes('/admin/users')) return 'Manage Users';
    if (path.includes('/admin/courses')) return 'Manage Courses';
    if (path.includes('/admin/statistics')) return 'Analytics';
    if (path.includes('/admin/settings')) return 'Settings';
    return 'Admin Dashboard';
  })();
</script>

{#if $loading || !checked}
  <div in:fade class="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex justify-center items-center">
    <div class="flex flex-col items-center">
      <div class="w-16 h-16 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Verifying admin access...</p>
    </div>
  </div>
{:else if isAdmin}
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
    <!-- Admin Sidebar -->
    <AdminSidebar />
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Bar -->
      <div class="bg-white dark:bg-gray-800 shadow-sm z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                {currentSection}
              </h1>
            </div>
            <div class="flex items-center">
              {#if $user}
                <div class="flex items-center space-x-3">
                  <div class="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {$user.displayName || $user.email}
                  </div>
                  <div class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                    {$user.displayName?.charAt(0).toUpperCase() || $user.email?.charAt(0).toUpperCase() || 'A'}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900">
        <div in:fly={{ y: 20, duration: 300 }} class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
{:else}
  <!-- Access Denied Fallback -->
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
    <div in:fade class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full text-center">
      <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fas fa-lock text-red-600 dark:text-red-400 text-2xl"></i>
      </div>
      <h1 class="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Access Denied</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">You don't have permission to access the admin area.</p>
      <a href="/" class="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition duration-150">
        Return to Homepage
      </a>
    </div>
  </div>
{/if} 