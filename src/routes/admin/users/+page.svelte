<script lang="ts">
  import { env } from '$env/dynamic/public';
  import type { PageData } from './$types';
  
  export let data: PageData;
  let users = data.users;
  const ADMIN_EMAILS = (env.PUBLIC_VITE_ADMIN_EMAILS || '').split(',').map(email => email.trim());
</script>

<svelte:head><title>Manage Users | Admin</title></svelte:head>
<div class="container mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">User Management</h1>
  
  {#if !users}
    <div class="flex justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    </div>
  {:else}
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Admin Status</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {#each users as u (u.uid)}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    {u.displayName?.charAt(0).toUpperCase() ?? u.email?.charAt(0).toUpperCase() ?? 'U'}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {u.displayName || 'No name'}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{u.email}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(u.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {#if ADMIN_EMAILS.includes(u.email)}
                  <span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Admin</span>
                {:else}
                  <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">User</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>