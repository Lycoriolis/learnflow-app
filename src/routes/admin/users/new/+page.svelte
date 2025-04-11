<script lang="ts">
  import { goto } from '$app/navigation';
  import { fly } from 'svelte/transition';
  import { auth } from '$lib/firebase.js';
  import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
  import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
  
  let displayName = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let role = 'student';
  let isLoading = false;
  let errorMessage = '';
  let successMessage = '';
  
  async function handleSubmit() {
    // Reset messages
    errorMessage = '';
    successMessage = '';
    
    // Form validation
    if (!displayName || !email || !password || !confirmPassword) {
      errorMessage = 'All fields are required';
      return;
    }
    
    if (password !== confirmPassword) {
      errorMessage = 'Passwords do not match';
      return;
    }
    
    if (password.length < 6) {
      errorMessage = 'Password must be at least 6 characters long';
      return;
    }
    
    isLoading = true;
    
    /* Real Firebase implementation would be:
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Set display name
      await updateProfile(user, { displayName });
      
      // Add to Firestore with role and metadata
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        displayName,
        role,
        joinedAt: serverTimestamp(),
        createdBy: 'admin', // or current admin user ID
        createdAt: serverTimestamp()
      });
      
      successMessage = `User "${displayName}" created successfully!`;
      
      // Reset form
      displayName = '';
      email = '';
      password = '';
      confirmPassword = '';
      role = 'student';
      
      // Navigate back to user list after 2 seconds
      setTimeout(() => {
        goto('/admin/users');
      }, 2000);
    } catch (error) {
      console.error('Error creating user:', error);
      errorMessage = error.message || 'Failed to create user';
    } finally {
      isLoading = false;
    }
    */
    
    // Simulate API call
    setTimeout(() => {
      successMessage = `User "${displayName}" created successfully!`;
      
      // Reset form
      displayName = '';
      email = '';
      password = '';
      confirmPassword = '';
      role = 'student';
      
      isLoading = false;
      
      // Navigate back to user list after 2 seconds
      setTimeout(() => {
        goto('/admin/users');
      }, 2000);
    }, 1500);
  }
  
  function cancel() {
    goto('/admin/users');
  }
</script>

<svelte:head>
  <title>Admin | Add New User | LearnFlow</title>
</svelte:head>

<div in:fly={{ y: 20, duration: 300 }}>
  <div class="mb-6 flex items-center">
    <a 
      href="/admin/users" 
      class="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
    >
      <i class="fas fa-arrow-left"></i>
    </a>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add New User</h1>
  </div>
  
  <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
    <div class="p-6">
      {#if errorMessage}
        <div class="mb-6 bg-red-100 border-l-4 border-red-500 dark:bg-red-900 dark:border-red-700 p-4 rounded">
          <div class="flex items-center">
            <i class="fas fa-exclamation-circle text-red-500 dark:text-red-400 mr-3"></i>
            <p class="text-sm text-red-700 dark:text-red-200">{errorMessage}</p>
          </div>
        </div>
      {/if}
      
      {#if successMessage}
        <div class="mb-6 bg-green-100 border-l-4 border-green-500 dark:bg-green-900 dark:border-green-700 p-4 rounded">
          <div class="flex items-center">
            <i class="fas fa-check-circle text-green-500 dark:text-green-400 mr-3"></i>
            <p class="text-sm text-green-700 dark:text-green-200">{successMessage}</p>
          </div>
        </div>
      {/if}
      
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="displayName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input 
              type="text" 
              id="displayName" 
              bind:value={displayName}
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={isLoading}
              required
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              bind:value={email}
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={isLoading}
              required
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              id="password" 
              bind:value={password}
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={isLoading}
              required
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Must be at least 6 characters long</p>
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              bind:value={confirmPassword}
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={isLoading}
              required
            />
          </div>
        </div>
        
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
          <select 
            id="role" 
            bind:value={role}
            class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            disabled={isLoading}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Be careful when assigning admin privileges. Admins have full access to manage all users and content.
          </p>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            type="button" 
            on:click={cancel}
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="flex justify-center items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            disabled={isLoading}
          >
            {#if isLoading}
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating User...
            {:else}
              Create User
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
</div> 