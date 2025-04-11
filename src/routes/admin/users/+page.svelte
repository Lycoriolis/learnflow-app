<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { getFirestore, collection, getDocs, doc, updateDoc, query, orderBy, where, writeBatch } from 'firebase/firestore';
  import { app } from '$lib/firebase.js';
  import { Timestamp } from 'firebase/firestore';

  interface UserProfile {
    id: string; // Firestore document ID (matches auth UID)
    email: string;
    displayName?: string;
    role: 'student' | 'instructor' | 'admin';
    status?: 'active' | 'inactive' | 'suspended'; // Optional status field
    createdAt?: Timestamp;
    lastLogin?: Timestamp;
    // Add other relevant fields stored in Firestore
  }

  let isLoading = true;
  let users: UserProfile[] = [];
  let filteredUsers: UserProfile[] = [];
  let searchQuery = '';
  let filterRole = 'all';
  let filterStatus = 'all';

  let showModal = false;
  let currentUser: UserProfile | null = null;
  let isSaving = false;
  let saveError = '';

  // Note: Deleting users directly often requires Firebase Functions for proper cleanup 
  // (Auth record, associated data etc.). We'll focus on role/status updates here.

  const db = getFirestore(app);
  const usersCollection = collection(db, 'users');

  onMount(async () => {
    await loadUsers();
  });

  async function loadUsers() {
    isLoading = true;
    try {
      // Basic query - more complex filtering might be needed
      const q = query(usersCollection, orderBy('createdAt', 'desc')); 
      const querySnapshot = await getDocs(q);
      users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserProfile));
      filterUsers();
      console.log('Users loaded:', users);
    } catch (error) {
      console.error('Error loading users:', error);
      // Handle error display
    } finally {
      isLoading = false;
    }
  }

  function filterUsers() {
    filteredUsers = users.filter(user => {
      const searchMatch = searchQuery.trim() === '' ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.displayName && user.displayName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const roleMatch = filterRole === 'all' || user.role === filterRole;
      
      const statusMatch = filterStatus === 'all' || (user.status && user.status === filterStatus);

      return searchMatch && roleMatch && statusMatch;
    });
  }

  function openEditModal(user: UserProfile) {
    currentUser = { ...user }; // Clone user data
    saveError = '';
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    currentUser = null;
  }

  async function saveUserChanges() {
    if (!currentUser || !currentUser.id) return;
    isSaving = true;
    saveError = '';
    try {
      console.log('Updating user:', currentUser.id, { role: currentUser.role, status: currentUser.status });
      const userRef = doc(db, 'users', currentUser.id);
      
      // Prepare update data - only include fields being managed here
      const updateData: Partial<UserProfile> = {
        role: currentUser.role,
        status: currentUser.status, // Update status if it exists
        updatedAt: Timestamp.now() // Add/update an updatedAt timestamp
      };
      
      // Remove undefined fields if status is not being managed
      if (updateData.status === undefined) {
        delete updateData.status;
      }

      await updateDoc(userRef, updateData);
      
      console.log('User updated successfully');
      closeModal();
      await loadUsers(); // Reload users after saving
    } catch (error: any) {
      console.error('Error saving user changes:', error);
      saveError = error.message || 'Failed to save user changes. Please try again.';
    } finally {
      isSaving = false;
    }
  }

  function formatDate(timestamp?: Timestamp): string {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString();
  }
  
  function getStatusColor(status?: string): string {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'; // Default/Unknown status
    }
  }
  
  function getRoleColor(role: string): string {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'instructor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'student': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }
</script>

<svelte:head>
  <title>Admin | Manage Users | LearnFlow</title>
</svelte:head>

<div in:fly={{ y: 20, duration: 300 }}>
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
    <p class="text-gray-600 dark:text-gray-400 mt-1">View and manage user roles and status.</p>
  </div>

  <!-- Filters -->
  <div class="mb-6 flex flex-col sm:flex-row gap-4">
    <input 
      type="text" 
      placeholder="Search by email or name..."
      bind:value={searchQuery}
      on:input={filterUsers}
      class="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
    />
    <select bind:value={filterRole} on:change={filterUsers} class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
      <option value="all">All Roles</option>
      <option value="admin">Admin</option>
      <option value="instructor">Instructor</option>
      <option value="student">Student</option>
    </select>
    <select bind:value={filterStatus} on:change={filterUsers} class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
      <option value="all">All Statuses</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
      <option value="suspended">Suspended</option>
    </select>
  </div>

  {#if isLoading}
    <div class="flex justify-center items-center h-64">
      <div class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
    </div>
  {:else}
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {#if filteredUsers.length === 0}
              <tr>
                <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  No users match the current filters.
                </td>
              </tr>
            {:else}
              {#each filteredUsers as userProfile}
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{userProfile.displayName || '(No Name)'}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{userProfile.email}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                     <span class={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(userProfile.role)}`}>
                      {userProfile.role}
                    </span>
                  </td>
                   <td class="px-6 py-4 whitespace-nowrap">
                    <span class={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(userProfile.status)}`}>
                      {userProfile.status || 'Unknown'}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(userProfile.createdAt)}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      on:click={() => openEditModal(userProfile)}
                      class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                      aria-label="Edit user"
                    >
                      <i class="fas fa-user-edit"></i>
                    </button>
                    <!-- Add delete/suspend buttons here if implementing that functionality -->
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<!-- Edit User Modal -->
{#if showModal && currentUser}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center z-30" on:click|self={closeModal}>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6 mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4 border-b pb-3 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Edit User: {currentUser.displayName || currentUser.email}</h3>
        <button on:click={closeModal} class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <form on:submit|preventDefault={saveUserChanges} class="space-y-4">
        {#if saveError}
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span class="block sm:inline">Error: {saveError}</span>
          </div>
        {/if}

        <div>
          <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
          <select id="role" bind:value={currentUser.role} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white">
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <!-- Only show status if the field exists in your Firestore model -->
        {#if currentUser.status !== undefined}
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select id="status" bind:value={currentUser.status} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        {/if}

        <div class="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
          <button type="button" on:click={closeModal} class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150">
            Cancel
          </button>
          <button type="submit" disabled={isSaving} class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-50">
            {#if isSaving}
              <span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Saving...
            {:else}
              Update User
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if} 