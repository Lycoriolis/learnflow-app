<script lang="ts">
  import { resetPassword } from '$lib/authService.js';
  import { loading, authError, isAuthenticated } from '$lib/stores/authStore.js';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  
  export let redirectTo = '/login';
  
  let email = '';
  let localError = '';
  let successMessage = '';
  let isSubmitting = false;
  let validationErrors: {email?: string} = {};
  
  onMount(() => {
    if (browser && $isAuthenticated) {
      // If already authenticated, redirect to home
      goto('/');
    }
    
    // Clear any previous auth errors when component mounts
    authError.set('');
  });
  
  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid) {
      validationErrors.email = 'Please enter a valid email address';
    } else {
      validationErrors.email = undefined;
    }
    
    validationErrors = validationErrors; // Trigger reactivity
    return isValid;
  }
  
  async function handleResetPassword(e: SubmitEvent) {
    if (!browser) return;
    
    e.preventDefault();
    isSubmitting = true;
    localError = '';
    successMessage = '';
    authError.set('');
    
    if (!validateEmail(email)) {
      isSubmitting = false;
      return;
    }
    
    try {
      await resetPassword(email);
      successMessage = 'Password reset email sent. Check your inbox for further instructions.';
      email = ''; // Clear form after successful submission
    } catch (err) {
      // Handle specific error messages
      if (err instanceof Error) {
        const errorMessage = err.message;
        if (errorMessage.includes('user-not-found')) {
          localError = 'No account found with this email address.';
        } else if (errorMessage.includes('too-many-requests')) {
          localError = 'Too many requests. Please try again later.';
        } else {
          localError = 'Failed to send reset email. Please try again later.';
        }
      } else {
        localError = 'An unexpected error occurred. Please try again later.';
      }
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Reset Password</h2>
  
  {#if $authError}
    <div class="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4" role="alert">
      <span class="block sm:inline">{$authError}</span>
    </div>
  {/if}
  
  {#if localError}
    <div class="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4" role="alert">
      <span class="block sm:inline">{localError}</span>
    </div>
  {/if}
  
  {#if successMessage}
    <div class="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-4" role="alert">
      <span class="block sm:inline">{successMessage}</span>
      <div class="mt-2">
        <a href="/login" class="font-medium text-green-700 dark:text-green-300 underline">Return to login</a>
      </div>
    </div>
  {/if}
  
  {#if !successMessage}
    <form on:submit={handleResetPassword} class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input 
          type="email" 
          id="email" 
          bind:value={email}
          on:blur={() => validateEmail(email)}
          class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 {validationErrors.email ? 'border-red-500' : ''}"
          required
          autocomplete="email"
          aria-invalid={validationErrors.email ? 'true' : 'false'}
          aria-describedby={validationErrors.email ? 'email-error' : 'email-help'}
        />
        <p id="email-help" class="text-xs text-gray-500 dark:text-gray-400 mt-1">We'll send you a link to reset your password</p>
        {#if validationErrors.email}
          <p id="email-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
        {/if}
      </div>
      
      <div>
        <button 
          type="submit" 
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={$loading || isSubmitting}
          aria-busy={$loading || isSubmitting}
        >
          {#if $loading || isSubmitting}
            <span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" aria-hidden="true"></span>
            <span>Sending...</span>
          {:else}
            Send Reset Link
          {/if}
        </button>
      </div>
    </form>
  {/if}
  
  <div class="mt-6 text-center">
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Remember your password? 
      <a href="/login" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
        Log in
      </a>
    </p>
  </div>
  
  <div class="mt-4 text-center">
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Don't have an account? 
      <a href="/register" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
        Sign up
      </a>
    </p>
  </div>
</div>