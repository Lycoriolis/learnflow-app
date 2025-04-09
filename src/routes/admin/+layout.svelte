<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { isAuthenticated, user, loading } from '$lib/stores/authStore.js';
  import { onMount } from 'svelte';

  // --- Temporary Admin Check (Must match the one in Sidebar) ---
  const ADMIN_EMAIL = 'admin@example.com'; // <-- !!! REPLACE with your test admin email !!!
  $: isAdmin = $isAuthenticated && $user?.email === ADMIN_EMAIL;
  // --------------------------------------------------------------

  let checked = false;

  $: if (!$loading && !checked) {
      checked = true;
      if (!isAdmin) {
          console.warn('Non-admin user attempting to access admin area.');
          // Option 1: Redirect to home
          goto('/'); 
          // Option 2: Show an error page (Requires creating routes/+error.svelte or similar)
          // throw error(403, 'Access Denied'); 
      }
  }

</script>

{#if $loading || !checked}
  <!-- Show loading indicator while checking auth/admin status -->
  <div class="flex justify-center items-center min-h-screen">
    <div class="text-4xl text-indigo-500">
       <i class="fas fa-spinner fa-spin"></i>
    </div>
  </div>
{:else if isAdmin}
  <!-- Render the specific admin page content -->
  <div class="admin-layout p-4 sm:p-6 lg:p-8">
     <slot />
  </div>
{:else}
   <!-- Fallback if redirect hasn't happened yet (or if not redirecting) -->
   <div class="flex flex-col justify-center items-center min-h-screen">
     <h1 class="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
     <p class="text-gray-600">You do not have permission to view this page.</p>
     <a href="/" class="mt-6 text-indigo-600 hover:underline">Go to Homepage</a>
   </div>
{/if} 