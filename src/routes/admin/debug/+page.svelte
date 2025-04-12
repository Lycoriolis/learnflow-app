<script lang="ts">
  import { fade } from 'svelte/transition';
  import { user, isAuthenticated } from '$lib/stores/authStore.js';
  import { isUserAdmin } from '$lib/authService.js';
  import { onMount } from 'svelte';
  
  let adminEmails = '';
  let isAdminValue = false;
  let directAdminCheck = false;
  let debugData = {
    userEmail: '',
    adminList: [],
    envRaw: '',
    isAuthenticated: false
  };
  
  onMount(() => {
    // Get the raw env value
    debugData.envRaw = import.meta.env.VITE_ADMIN_EMAILS || 'Not defined';
    
    // Parse the admin emails
    debugData.adminList = debugData.envRaw?.split(',').map(email => email.trim()) || [];
    
    // Update from auth store
    debugData.userEmail = $user?.email || 'Not logged in';
    debugData.isAuthenticated = $isAuthenticated;
    
    // Check admin status
    isAdminValue = isUserAdmin($user?.email);
    
    // Direct admin check
    const userEmailLower = $user?.email?.toLowerCase() || '';
    directAdminCheck = debugData.adminList.some(email => 
      email.toLowerCase() === userEmailLower
    );
  });
</script>

<div in:fade={{ duration: 200 }} class="space-y-6">
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h1 class="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">Admin Debug Page</h1>
    
    <div class="space-y-4">
      <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
        <h2 class="text-lg font-semibold mb-2">Authentication Status</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="text-gray-600 dark:text-gray-400">Is Authenticated:</span>
            <span class="ml-2 font-medium {debugData.isAuthenticated ? 'text-green-600' : 'text-red-600'}">
              {debugData.isAuthenticated ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-400">Current User Email:</span>
            <span class="ml-2 font-medium">{debugData.userEmail}</span>
          </div>
        </div>
      </div>
      
      <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
        <h2 class="text-lg font-semibold mb-2">Admin Configuration</h2>
        <div class="space-y-2">
          <div>
            <span class="text-gray-600 dark:text-gray-400">Raw VITE_ADMIN_EMAILS:</span>
            <span class="ml-2 font-medium">{debugData.envRaw}</span>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-400">Parsed Admin Emails:</span>
            <div class="ml-2 mt-1">
              {#if debugData.adminList.length === 0}
                <span class="text-red-500">No admin emails found!</span>
              {:else}
                <ul class="list-disc pl-5">
                  {#each debugData.adminList as email}
                    <li class="text-gray-700 dark:text-gray-300">{email}</li>
                  {/each}
                </ul>
              {/if}
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
        <h2 class="text-lg font-semibold mb-2">Admin Status Check</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span class="text-gray-600 dark:text-gray-400">isUserAdmin() Result:</span>
            <span class="ml-2 font-medium {isAdminValue ? 'text-green-600' : 'text-red-600'}">
              {isAdminValue ? 'Is Admin' : 'Not Admin'}
            </span>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-400">Direct Email Comparison:</span>
            <span class="ml-2 font-medium {directAdminCheck ? 'text-green-600' : 'text-red-600'}">
              {directAdminCheck ? 'Is Admin' : 'Not Admin'}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div> 