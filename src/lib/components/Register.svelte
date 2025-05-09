<script lang="ts">
  import { register, loginWithGoogle } from '$lib/services/authService.js';
  import { loading, authError } from '$lib/stores/authStore.js';
  
  let displayName = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let localError = '';
  
  async function handleRegister() {
    localError = '';
    
    // Form validation
    if (!displayName || !email || !password || !confirmPassword) {
      localError = 'Please fill in all fields';
      return;
    }
    
    if (password !== confirmPassword) {
      localError = 'Passwords do not match';
      return;
    }
    
    if (password.length < 6) {
      localError = 'Password must be at least 6 characters long';
      return;
    }
    
    try {
      await register(email, password, displayName);
      // Registration successful - redirect will be handled by the auth state listener
    } catch (err) {
      // Error is already handled and set in the authError store
    }
  }
  
  async function handleGoogleLogin() {
    try {
      await loginWithGoogle();
      // Login successful - redirect will be handled by the auth state listener
    } catch (err) {
      // Error is already handled and set in the authError store
    }
  }
</script>

<div class="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Create an Account</h2>
  
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
  
  <form on:submit|preventDefault={handleRegister} class="space-y-4">
    <div>
      <label for="displayName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
      <input 
        type="text" 
        id="displayName" 
        bind:value={displayName} 
        class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>
    
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input 
        type="email" 
        id="email" 
        bind:value={email} 
        class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>
    
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
      <input 
        type="password" 
        id="password" 
        bind:value={password} 
        class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        required
      />
      <p class="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
    </div>
    
    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
      <input 
        type="password" 
        id="confirmPassword" 
        bind:value={confirmPassword} 
        class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        required
      />
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
        Sign Up
      </button>
    </div>
  </form>
  
  <div class="mt-4">
    <button 
      on:click={handleGoogleLogin} 
      class="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      disabled={$loading}
    >
      <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24">
        <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.607,1.972-2.101,3.467-4.26,3.866c-3.431,0.589-6.663-1.727-7.253-5.157c-0.589-3.431,1.727-6.663,5.157-7.253c2.136-0.367,4.296,0.317,5.743,1.878l2.72-2.72c-2.099-2.099-5.271-2.853-8.135-1.879C8.234,3.708,4.766,6.152,3.032,9.686c-2.734,5.63,0.01,12.44,5.639,15.174c5.63,2.734,12.44-0.01,15.174-5.639c1.06-2.17,1.369-4.652,0.845-7.036h-9.687C13.25,12.151,12.545,12.151,12.545,12.151z" fill="#F44336"/>
        <path d="M12.545,12.151v-3.89h9.687c0.521,2.169,0.246,4.432-0.769,6.406c-0.217,0.436-0.453,0.853-0.725,1.241h-6.284C13.4,15.909,12.545,14.055,12.545,12.151z" fill="#2196F3"/>
      </svg>
      Continue with Google
    </button>
  </div>
  
  <div class="mt-4 text-center">
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Already have an account? 
      <a href="/login" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
        Log in
      </a>
    </p>
  </div>
</div>