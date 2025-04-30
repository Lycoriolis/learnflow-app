<script lang="ts">
  import { resetPassword } from '../authService.js';
  import { loading, authError } from '../stores/authStore.js';
  
  let email = '';
  let localError = '';
  let successMessage = '';
  
  async function handleResetPassword() {
    localError = '';
    successMessage = '';
    
    if (!email) {
      localError = 'Please enter your email address';
      return;
    }
    
    try {
      await resetPassword(email);
      successMessage = 'Password reset email sent. Check your inbox.';
      email = ''; // Clear form after successful submission
    } catch (err) {
      // Error is already handled and set in the authError store
    }
  }
</script>

<div class="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Reset Password</h2>
  
  {#if $authError}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
      <span class="block sm:inline">{$authError}</span>
    </div>
  {/if}
  
  {#if localError}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
      <span class="block sm:inline">{localError}</span>
    </div>
  {/if}
  
  {#if successMessage}
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
      <span class="block sm:inline">{successMessage}</span>
    </div>
  {/if}
  
  <form on:submit|preventDefault={handleResetPassword} class="space-y-4">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input 
        type="email" 
        id="email" 
        bind:value={email} 
        class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        required
      />
      <p class="text-xs text-gray-500 mt-1">We'll send you a link to reset your password</p>
    </div>
    
    <div>
      <button 
        type="submit" 
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={$loading}
      >
        {#if $loading}
          <span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
        {/if}
        Send Reset Link
      </button>
    </div>
  </form>
  
  <div class="mt-4 text-center">
    <a href="/login" class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
      Back to login
    </a>
  </div>
</div> 