<script lang="ts">
  import { register, loginWithGoogle } from '$lib/authService.js';
  import { loading, authError, isAuthenticated } from '$lib/stores/authStore.js';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  
  // Accept redirect parameter to forward users after registration
  export let redirectTo = '/';
  
  let displayName = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let localError = '';
  let isSubmitting = false;
  let rememberMe = true;
  let validationErrors: {displayName?: string; email?: string; password?: string; confirmPassword?: string} = {};
  
  onMount(() => {
    if (browser && $isAuthenticated) {
      // Already logged in, redirect
      goto(redirectTo);
    }
    
    // Clear any previous auth errors when component mounts
    authError.set('');
  });
  
  // Email validation
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
  
  // Display name validation
  function validateDisplayName(name: string): boolean {
    const isValid = name.trim().length >= 2;
    
    if (!isValid) {
      validationErrors.displayName = 'Name must be at least 2 characters';
    } else {
      validationErrors.displayName = undefined;
    }
    
    validationErrors = validationErrors;
    return isValid;
  }
  
  // Password validation
  function validatePassword(password: string): boolean {
    let isValid = true;
    validationErrors.password = undefined;
    
    if (password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    // Check for password complexity if needed
    // const hasUpperCase = /[A-Z]/.test(password);
    // const hasNumber = /\d/.test(password);
    // if (!hasUpperCase || !hasNumber) {
    //   validationErrors.password = 'Password must contain at least one uppercase letter and one number';
    //   isValid = false;
    // }
    
    validationErrors = validationErrors;
    validateConfirmPassword(confirmPassword, password);
    return isValid;
  }
  
  // Confirm password validation
  function validateConfirmPassword(confirmPwd: string, pwd: string = password): boolean {
    const isValid = confirmPwd === pwd && confirmPwd.length > 0;
    
    if (!isValid) {
      validationErrors.confirmPassword = 'Passwords do not match';
    } else {
      validationErrors.confirmPassword = undefined;
    }
    
    validationErrors = validationErrors;
    return isValid;
  }
  
  // Validate all form fields at once
  function validateForm(): boolean {
    const isDisplayNameValid = validateDisplayName(displayName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    return isDisplayNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;
  }
  
  async function handleRegister(e: CustomEvent<SubmitEvent>) {
    if (!browser) return;
    
    e.preventDefault();
    isSubmitting = true;
    localError = '';
    authError.set('');
    
    // Validate the entire form
    if (!validateForm()) {
      isSubmitting = false;
      return;
    }
    
    try {
      await register(email, password, displayName, rememberMe);
      // Registration successful - redirect will be handled by the auth state listener
    } catch (err) {
      // Handle specific error messages
      if (err instanceof Error) {
        const errorMessage = err.message;
        if (errorMessage.includes('email-already-in-use')) {
          localError = 'This email is already in use. Try logging in instead.';
        } else if (errorMessage.includes('weak-password')) {
          localError = 'Password is too weak. Please choose a stronger password.';
        } else if (errorMessage.includes('invalid-email')) {
          localError = 'Please enter a valid email address.';
        } else {
          localError = 'Registration failed. Please try again later.';
        }
      } else {
        localError = 'An unexpected error occurred. Please try again later.';
      }
    } finally {
      isSubmitting = false;
    }
  }
  
  async function handleGoogleLogin() {
    if (!browser) return;
    
    isSubmitting = true;
    localError = '';
    authError.set('');
    
    try {
      await loginWithGoogle(rememberMe);
      // Login successful - redirect will be handled by the auth state listener
    } catch (err) {
      // Handle specific Google auth errors
      if (err instanceof Error) {
        const errorMessage = err.message;
        if (errorMessage.includes('popup-closed-by-user')) {
          localError = 'Google sign-in was cancelled. Please try again.';
        } else {
          localError = 'Google sign-in failed. Please try again later.';
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
  <h2 class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Create an Account</h2>
  
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
  
  <form on:submit={handleRegister} class="space-y-4">
    <div>
      <label for="displayName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
      <input 
        type="text" 
        id="displayName" 
        bind:value={displayName}
        on:blur={() => validateDisplayName(displayName)}
        class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 {validationErrors.displayName ? 'border-red-500' : ''}"
        required
        autocomplete="name"
        aria-invalid={validationErrors.displayName ? 'true' : 'false'}
        aria-describedby={validationErrors.displayName ? 'name-error' : undefined}
      />
      {#if validationErrors.displayName}
        <p id="name-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.displayName}</p>
      {/if}
    </div>
    
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
        aria-describedby={validationErrors.email ? 'email-error' : undefined}
      />
      {#if validationErrors.email}
        <p id="email-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
      {/if}
    </div>
    
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
      <input 
        type="password" 
        id="password" 
        bind:value={password}
        on:blur={() => validatePassword(password)}
        class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 {validationErrors.password ? 'border-red-500' : ''}"
        required
        autocomplete="new-password"
        aria-invalid={validationErrors.password ? 'true' : 'false'}
        aria-describedby="password-requirements"
      />
      <p id="password-requirements" class="text-xs text-gray-500 dark:text-gray-400 mt-1">Password must be at least 6 characters long</p>
      {#if validationErrors.password}
        <p id="password-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
      {/if}
    </div>
    
    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
      <input 
        type="password" 
        id="confirmPassword" 
        bind:value={confirmPassword}
        on:blur={() => validateConfirmPassword(confirmPassword)}
        class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 {validationErrors.confirmPassword ? 'border-red-500' : ''}"
        required
        autocomplete="new-password"
        aria-invalid={validationErrors.confirmPassword ? 'true' : 'false'}
        aria-describedby={validationErrors.confirmPassword ? 'confirm-password-error' : undefined}
      />
      {#if validationErrors.confirmPassword}
        <p id="confirm-password-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.confirmPassword}</p>
      {/if}
    </div>
    
    <div class="flex items-center">
      <input 
        id="remember-me" 
        name="remember-me" 
        type="checkbox" 
        bind:checked={rememberMe}
        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      >
      <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
        Stay signed in after registration
      </label>
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
          <span>Creating account...</span>
        {:else}
          Sign Up
        {/if}
      </button>
    </div>
  </form>
  
  <div class="mt-6 relative">
    <div class="absolute inset-0 flex items-center">
      <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
    </div>
    <div class="relative flex justify-center text-sm">
      <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
    </div>
  </div>
  
  <div class="mt-6">
    <button 
      type="button"
      on:click={handleGoogleLogin} 
      class="w-full flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={$loading || isSubmitting}
      aria-busy={$loading || isSubmitting}
    >
      {#if $loading || isSubmitting}
        <span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 dark:border-gray-200 mr-2" aria-hidden="true"></span>
      {:else}
        <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.607,1.972-2.101,3.467-4.26,3.866c-3.431,0.589-6.663-1.727-7.253-5.157c-0.589-3.431,1.727-6.663,5.157-7.253c2.136-0.367,4.296,0.317,5.743,1.878l2.72-2.72c-2.099-2.099-5.271-2.853-8.135-1.879C8.234,3.708,4.766,6.152,3.032,9.686c-2.734,5.63,0.01,12.44,5.639,15.174c5.63,2.734,12.44-0.01,15.174-5.639c1.06-2.17,1.369-4.652,0.845-7.036h-9.687C13.25,12.151,12.545,12.151,12.545,12.151z" fill="#F44336"/>
          <path d="M12.545,12.151v-3.89h9.687c0.521,2.169,0.246,4.432-0.769,6.406c-0.217,0.436-0.453,0.853-0.725,1.241h-6.284C13.4,15.909,12.545,14.055,12.545,12.151z" fill="#2196F3"/>
        </svg>
        Continue with Google
      {/if}
    </button>
  </div>
  
  <div class="mt-6 text-center">
    <p class="text-sm text-gray-600 dark:text-gray-400">
      Already have an account? 
      <a href="/login" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
        Log in
      </a>
    </p>
  </div>
  
  <div class="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
    By creating an account, you agree to our 
    <a href="/terms" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Terms of Service</a> and 
    <a href="/privacy" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Privacy Policy</a>.
  </div>
</div>