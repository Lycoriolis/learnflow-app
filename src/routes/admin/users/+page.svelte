<!-- src/routes/admin/users/+page.svelte -->
<script lang="ts">
  // In real app, load users via API in +page.ts
  const mockUsers = [
    { id: 'auth0|user1', name: 'Alice Wonderland', email: 'alice@example.com', role: 'student', joined: '2024-03-15' },
    { id: 'auth0|user2', name: 'Bob The Builder', email: 'bob@example.com', role: 'student', joined: '2024-04-01' },
    { id: 'auth0|admin1', name: 'Admin User', email: 'admin@example.com', role: 'admin', joined: '2024-01-10' }
    // Filter/sort based on real data
  ];
</script>

<svelte:head>
  <title>Admin | Manage Users</title>
</svelte:head>

<div class="mb-6 flex justify-between items-center">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
  <!-- Optional: Add User button -->
  <!-- <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition duration-150">+ Add User</button> -->
</div>

<p class="mb-6 text-sm text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-gray-700 p-3 rounded-md border border-orange-200 dark:border-orange-600">
  <i class="fas fa-exclamation-triangle mr-2"></i>
  Note: User management requires backend integration with your authentication provider (Auth0) to fetch users and modify roles or details. This table shows mock data.
</p>

<div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    <thead class="bg-gray-50 dark:bg-gray-700">
      <tr>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
        <th scope="col" class="relative px-6 py-3">
          <span class="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      {#each mockUsers as user}
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
          <td class="px-6 py-4 whitespace-nowrap">
             <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        {user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}">
                {user.role}
             </span>
          </td>
           <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.joined}</td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-3" title="Edit Role (Requires Backend)">Edit Role</button>
            <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200" title="Delete User (Requires Backend)">Delete</button>
          </td>
        </tr>
      {/each}
      {#if mockUsers.length === 0}
        <tr>
            <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No users found.</td>
        </tr>
      {/if}
    </tbody>
  </table>
</div> 