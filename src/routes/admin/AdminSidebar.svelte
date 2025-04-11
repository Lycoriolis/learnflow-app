<script lang="ts">
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
  import { logout } from '$lib/authService.js';
  import { goto } from '$app/navigation';

  let showLogoutConfirm = false;

  async function handleLogout() {
    await logout();
    goto('/'); // Redirect to home page after logout
  }

  $: currentPath = $page.url.pathname;

  // Define navigation items
  const navItems = [
    //{ icon: 'fa-tachometer-alt', label: 'Dashboard', path: '/admin' },
    { icon: 'fa-book-open', label: 'Manage Courses', path: '/admin/courses' },
    { icon: 'fa-users', label: 'Manage Users', path: '/admin/users' },
    //{ icon: 'fa-chart-bar', label: 'Analytics', path: '/admin/statistics' },
    { icon: 'fa-cog', label: 'Settings', path: '/admin/settings' },
  ];

  function isCurrent(path: string): boolean {
    // Highlight parent path if viewing a sub-route, e.g., /admin/courses/edit/some-id
    return currentPath === path || currentPath.startsWith(path + '/');
  }
</script>

<aside class="hidden lg:block w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md h-screen fixed top-0 left-0 z-20">
  <div class="p-4">
    <a href="/" class="flex items-center mb-8">
      <img src="/favicon.png" alt="LearnFlow Logo" class="h-8 w-auto mr-3">
      <span class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">LearnFlow Admin</span>
    </a>
    
    <nav class="mt-8">
      <ul>
        {#each navItems as item}
          <li>
            <a 
              href={item.path}
              class="flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition duration-150 ease-in-out 
                {isCurrent(item.path)
                  ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}"
            >
              <i class="fas {item.icon} w-5 mr-3"></i>
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  </div>
  
  <div class="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
    <button 
      on:click={() => showLogoutConfirm = true}
      class="w-full flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition duration-150 ease-in-out"
    >
      <i class="fas fa-sign-out-alt w-5 mr-3"></i>
      Logout
    </button>
  </div>
</aside>

<!-- Logout Confirmation Modal -->
{#if showLogoutConfirm}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center z-50" on:click|self={() => showLogoutConfirm = false}>
    <div in:fade={{ duration: 150 }} out:fade={{ duration: 100 }} class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6 mx-4">
      <div class="text-center">
        <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400 text-xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Confirm Logout</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to log out?
        </p>
      </div>
      <div class="flex justify-center space-x-4">
        <button 
          on:click={() => showLogoutConfirm = false}
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150"
        >
          Cancel
        </button>
        <button 
          on:click={handleLogout}
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
{/if} 