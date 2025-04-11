<!-- src/routes/admin/users/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
  import { app } from '$lib/firebase.js';
  
  let isLoading = true;
  let users = [];
  let filteredUsers = [];
  let searchQuery = '';
  let currentFilter = 'all';
  let currentPage = 1;
  let itemsPerPage = 10;
  let totalPages = 1;
  
  // User actions
  let selectedUser = null;
  let showUserModal = false;
  let processingAction = false;
  let actionSuccess = '';
  let actionError = '';
  
  onMount(async () => {
    // Simulating API call to fetch users
    setTimeout(() => {
      // This would be replaced with actual Firebase fetch in production
      users = [
        {
          id: 'user1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          role: 'student',
          status: 'active',
          createdAt: '2023-05-10T08:30:00Z',
          lastLogin: '2023-09-15T14:22:10Z',
          coursesEnrolled: 3,
          profileComplete: true
        },
        {
          id: 'user2',
          name: 'Emma Johnson',
          email: 'emma.johnson@example.com',
          role: 'instructor',
          status: 'active',
          createdAt: '2023-04-22T10:15:00Z',
          lastLogin: '2023-09-14T09:45:30Z',
          coursesCreated: 2,
          profileComplete: true
        },
        {
          id: 'user3',
          name: 'Michael Brown',
          email: 'michael.brown@example.com',
          role: 'student',
          status: 'inactive',
          createdAt: '2023-06-05T15:20:00Z',
          lastLogin: '2023-08-28T11:10:45Z',
          coursesEnrolled: 1,
          profileComplete: false
        },
        {
          id: 'user4',
          name: 'Sarah Davis',
          email: 'sarah.davis@example.com',
          role: 'instructor',
          status: 'active',
          createdAt: '2023-03-18T12:40:00Z',
          lastLogin: '2023-09-13T16:30:20Z',
          coursesCreated: 5,
          profileComplete: true
        },
        {
          id: 'user5',
          name: 'James Wilson',
          email: 'james.wilson@example.com',
          role: 'admin',
          status: 'active',
          createdAt: '2023-02-10T09:00:00Z',
          lastLogin: '2023-09-15T10:05:15Z',
          profileComplete: true
        },
        {
          id: 'user6',
          name: 'Lisa Taylor',
          email: 'lisa.taylor@example.com',
          role: 'student',
          status: 'active',
          createdAt: '2023-07-12T11:25:00Z',
          lastLogin: '2023-09-10T13:40:50Z',
          coursesEnrolled: 4,
          profileComplete: true
        },
        {
          id: 'user7',
          name: 'Robert Anderson',
          email: 'robert.anderson@example.com',
          role: 'student',
          status: 'suspended',
          createdAt: '2023-06-28T14:15:00Z',
          lastLogin: '2023-08-05T15:20:30Z',
          coursesEnrolled: 2,
          profileComplete: true
        }
      ];
      
      // Initial filter
      filterUsers();
      isLoading = false;
    }, 1000);
  });
  
  function filterUsers() {
    let result = [...users];
    
    // Apply status filter
    if (currentFilter !== 'all') {
      result = result.filter(user => user.status === currentFilter);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    }
    
    // Update pagination
    totalPages = Math.ceil(result.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = 1;
    
    // Slice for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    filteredUsers = result.slice(startIndex, startIndex + itemsPerPage);
  }
  
  function handleSearch() {
    currentPage = 1;
    filterUsers();
  }
  
  function clearSearch() {
    searchQuery = '';
    currentPage = 1;
    filterUsers();
  }
  
  function setFilter(filter) {
    currentFilter = filter;
    currentPage = 1;
    filterUsers();
  }
  
  function changePage(page) {
    currentPage = page;
    filterUsers();
  }
  
  function openUserDetails(user) {
    selectedUser = { ...user };
    showUserModal = true;
  }
  
  function closeUserModal() {
    showUserModal = false;
    setTimeout(() => {
      selectedUser = null;
      actionSuccess = '';
      actionError = '';
    }, 300);
  }
  
  async function updateUserStatus(userId, newStatus) {
    processingAction = true;
    actionSuccess = '';
    actionError = '';
    
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production this would update Firestore
      // const db = getFirestore(app);
      // await updateDoc(doc(db, "users", userId), { status: newStatus });
      
      // Update local state
      users = users.map(user => {
        if (user.id === userId) {
          const updatedUser = { ...user, status: newStatus };
          if (selectedUser && selectedUser.id === userId) {
            selectedUser = updatedUser;
          }
          return updatedUser;
        }
        return user;
      });
      
      filterUsers();
      actionSuccess = `User status updated to ${newStatus}`;
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        actionSuccess = '';
      }, 3000);
    } catch (error) {
      console.error('Error updating user status:', error);
      actionError = 'Failed to update user status. Please try again.';
    } finally {
      processingAction = false;
    }
  }
  
  async function changeUserRole(userId, newRole) {
    processingAction = true;
    actionSuccess = '';
    actionError = '';
    
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production this would update Firestore
      // const db = getFirestore(app);
      // await updateDoc(doc(db, "users", userId), { role: newRole });
      
      // Update local state
      users = users.map(user => {
        if (user.id === userId) {
          const updatedUser = { ...user, role: newRole };
          if (selectedUser && selectedUser.id === userId) {
            selectedUser = updatedUser;
          }
          return updatedUser;
        }
        return user;
      });
      
      filterUsers();
      actionSuccess = `User role changed to ${newRole}`;
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        actionSuccess = '';
      }, 3000);
    } catch (error) {
      console.error('Error changing user role:', error);
      actionError = 'Failed to change user role. Please try again.';
    } finally {
      processingAction = false;
    }
  }
  
  function formatDate(dateString) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
  
  function getStatusColor(status) {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }
  
  function getRoleColor(role) {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'instructor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'student': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }
</script>

<svelte:head>
  <title>Admin | User Management | LearnFlow</title>
</svelte:head>

<div in:fly={{ y: 20, duration: 300 }}>
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
    <p class="text-gray-600 dark:text-gray-400 mt-1">View and manage user accounts</p>
  </div>
  
  {#if isLoading}
    <div class="flex justify-center items-center h-64">
      <div class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
    </div>
  {:else}
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div class="p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-3 md:space-y-0">
          <!-- Search -->
          <div class="w-full md:w-auto md:flex-1 md:mr-4">
            <div class="relative">
              <input
                type="text"
                bind:value={searchQuery}
                on:keyup={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by name or email..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
              />
              {#if searchQuery}
                <button
                  type="button"
                  on:click={clearSearch}
                  class="absolute right-10 top-2.5 text-gray-400 hover:text-gray-500"
                >
                  <i class="fas fa-times"></i>
                </button>
              {/if}
              <button
                type="button"
                on:click={handleSearch}
                class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-500"
              >
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          
          <!-- Filter buttons -->
          <div class="flex space-x-2">
            <button
              type="button"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md {currentFilter === 'all' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' : 'text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'}"
              on:click={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md {currentFilter === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'}"
              on:click={() => setFilter('active')}
            >
              Active
            </button>
            <button
              type="button"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md {currentFilter === 'inactive' ? 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200' : 'text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'}"
              on:click={() => setFilter('inactive')}
            >
              Inactive
            </button>
            <button
              type="button"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md {currentFilter === 'suspended' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'}"
              on:click={() => setFilter('suspended')}
            >
              Suspended
            </button>
          </div>
        </div>
        
        <!-- User table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {#if filteredUsers.length === 0}
                <tr>
                  <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No users found matching your filters
                  </td>
                </tr>
              {:else}
                {#each filteredUsers as user}
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" on:click={() => openUserDetails(user)}>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <span class="text-gray-600 dark:text-gray-300 text-sm font-medium">{user.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getRoleColor(user.role)}">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getStatusColor(user.status)}">
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.createdAt)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        on:click|stopPropagation={() => openUserDetails(user)}
                        class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-2"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      {#if user.status === 'active'}
                        <button
                          on:click|stopPropagation={() => updateUserStatus(user.id, 'suspended')}
                          class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <i class="fas fa-ban"></i>
                        </button>
                      {:else if user.status === 'suspended'}
                        <button
                          on:click|stopPropagation={() => updateUserStatus(user.id, 'active')}
                          class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <i class="fas fa-check-circle"></i>
                        </button>
                      {/if}
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        {#if totalPages > 1}
          <div class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  Showing
                  <span class="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                  to
                  <span class="font-medium">{Math.min(currentPage * itemsPerPage, users.length)}</span>
                  of
                  <span class="font-medium">{users.length}</span>
                  results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    on:click={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  
                  {#each Array(totalPages) as _, i}
                    <button
                      on:click={() => changePage(i + 1)}
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium {currentPage === i + 1 ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}"
                    >
                      {i + 1}
                    </button>
                  {/each}
                  
                  <button
                    on:click={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<!-- User Detail Modal -->
{#if showUserModal && selectedUser}
  <div class="fixed inset-0 overflow-y-auto z-20" on:click|self={closeUserModal}>
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
      </div>
      
      <div 
        in:fly={{ y: 20, duration: 300 }}
        out:fly={{ y: 20, duration: 200 }}
        class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="flex-1">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                User Details
              </h3>
              
              {#if actionSuccess}
                <div class="mb-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 p-2 rounded-md">
                  <p class="text-sm font-medium text-green-800 dark:text-green-300">{actionSuccess}</p>
                </div>
              {/if}
              
              {#if actionError}
                <div class="mb-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 p-2 rounded-md">
                  <p class="text-sm font-medium text-red-800 dark:text-red-300">{actionError}</p>
                </div>
              {/if}
              
              <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <div class="flex items-center mb-4">
                  <div class="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xl font-medium text-gray-600 dark:text-gray-300">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-medium text-gray-900 dark:text-white">{selectedUser.name}</h4>
                    <p class="text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                    <div class="flex space-x-2 mt-1">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getRoleColor(selectedUser.role)}">
                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      </span>
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getStatusColor(selectedUser.status)}">
                        {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-gray-500 dark:text-gray-400">Created</p>
                    <p class="font-medium text-gray-900 dark:text-white">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 dark:text-gray-400">Last Login</p>
                    <p class="font-medium text-gray-900 dark:text-white">{formatDate(selectedUser.lastLogin)}</p>
                  </div>
                  
                  {#if selectedUser.role === 'student'}
                    <div>
                      <p class="text-gray-500 dark:text-gray-400">Courses Enrolled</p>
                      <p class="font-medium text-gray-900 dark:text-white">{selectedUser.coursesEnrolled || 0}</p>
                    </div>
                  {/if}
                  
                  {#if selectedUser.role === 'instructor'}
                    <div>
                      <p class="text-gray-500 dark:text-gray-400">Courses Created</p>
                      <p class="font-medium text-gray-900 dark:text-white">{selectedUser.coursesCreated || 0}</p>
                    </div>
                  {/if}
                  
                  <div>
                    <p class="text-gray-500 dark:text-gray-400">Profile Complete</p>
                    <p class="font-medium text-gray-900 dark:text-white">
                      {selectedUser.profileComplete ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">User Actions</h4>
                
                <!-- Role Management -->
                <div class="mb-4">
                  <label for="userRole" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Change Role
                  </label>
                  <div class="flex items-center space-x-2">
                    <select 
                      id="userRole" 
                      value={selectedUser.role}
                      disabled={processingAction}
                      class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md disabled:opacity-50"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      type="button"
                      disabled={processingAction}
                      on:click={() => changeUserRole(selectedUser.id, document.getElementById('userRole').value)}
                      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </div>
                </div>
                
                <!-- Status Management -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    User Status
                  </label>
                  <div class="flex space-x-2">
                    <button
                      type="button"
                      disabled={processingAction || selectedUser.status === 'active'}
                      on:click={() => updateUserStatus(selectedUser.id, 'active')}
                      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Activate
                    </button>
                    <button
                      type="button"
                      disabled={processingAction || selectedUser.status === 'inactive'}
                      on:click={() => updateUserStatus(selectedUser.id, 'inactive')}
                      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Deactivate
                    </button>
                    <button
                      type="button"
                      disabled={processingAction || selectedUser.status === 'suspended'}
                      on:click={() => updateUserStatus(selectedUser.id, 'suspended')}
                      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suspend
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            on:click={closeUserModal}
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-200 dark:bg-gray-600 text-base font-medium text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
{/if} 