<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { logout } from '$lib/authService.js';

  // Navigation items for the admin sidebar
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: 'fa-tachometer-alt',
      exact: true
    },
    { 
      name: 'Users', 
      path: '/admin/users', 
      icon: 'fa-users'
    },
    { 
      name: 'Courses', 
      path: '/admin/courses', 
      icon: 'fa-graduation-cap'
    },
    { 
      name: 'Analytics', 
      path: '/admin/statistics', 
      icon: 'fa-chart-bar'
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: 'fa-cog'
    }
  ];

  // Check if a nav item is active
  function isActive(item: { path: string, exact?: boolean }): boolean {
    const currentPath = $page.url.pathname;
    
    if (item.exact) {
      return currentPath === item.path;
    }
    
    return currentPath.startsWith(item.path);
  }

  // Handle logout
  async function handleLogout() {
    try {
      await logout();
      goto('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
</script>

<aside class="w-64 bg-gray-800 text-white flex flex-col h-screen sticky top-0">
  <!-- Header -->
  <div class="h-16 flex items-center px-4 bg-gray-900">
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
        <i class="fas fa-shield-alt"></i>
      </div>
      <span class="text-lg font-semibold">Admin Portal</span>
    </div>
  </div>

  <!-- Navigation -->
  <nav class="flex-1 overflow-y-auto py-4 px-2">
    <ul class="space-y-1">
      {#each navItems as item}
        <li>
          <a
            href={item.path}
            class="flex items-center px-4 py-3 rounded-md transition duration-150 {isActive(item) 
              ? 'bg-indigo-700 text-white' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'}"
          >
            <i class="fas {item.icon} w-5 mr-3 text-center"></i>
            <span>{item.name}</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <!-- Footer -->
  <div class="p-4 border-t border-gray-700">
    <a href="/" class="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition duration-150">
      <i class="fas fa-home w-5 mr-3 text-center"></i>
      <span>Back to Site</span>
    </a>
    <button 
      on:click={handleLogout} 
      class="w-full mt-2 flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition duration-150"
    >
      <i class="fas fa-sign-out-alt w-5 mr-3 text-center"></i>
      <span>Log Out</span>
    </button>
  </div>
</aside> 