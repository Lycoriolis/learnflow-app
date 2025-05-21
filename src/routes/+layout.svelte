<script lang="ts">
  import { sidebarCollapsed } from '$lib/stores/sidebarStore.js';
  let collapsed = false;
  sidebarCollapsed.subscribe(v => collapsed = v);
  import '../app.css';
  import '@splidejs/splide/dist/css/splide.min.css';
  import { onMount, onDestroy } from 'svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import PipWidget from '$lib/components/PipWidget.svelte';
  import CourseModal from '$lib/components/courses/CourseModal.svelte';
  import { pipVisible } from '$lib/stores/pipStores.js';
  import { initAuth, cleanupAuth } from '$lib/authService.js';
  import { isAuthenticated, user } from '$lib/stores/authStore.js';
  import { storeCsrfToken } from '$lib/utils/csrf.client.js';
  import ActivityTracker from '$lib/components/user/ActivityTracker.svelte';

  export let data;

  onMount(async () => {
    console.log('Root layout mounted - initializing authentication and CSRF protection');
    
    // Store CSRF token from server
    if (data.csrfToken) {
      storeCsrfToken(data.csrfToken);
    }
    
    try {
      // Initialize Firebase authentication with error handling
      initAuth();
      
      // Set up subscription to auth state for debugging
      const unsubAuth = isAuthenticated.subscribe(value => {
        console.log('Auth state changed in root layout:', value ? 'Authenticated' : 'Not authenticated');
      });

      const unsubUser = user.subscribe(u => {
        if (u) console.log('User state changed in root layout:', u);
      });

      return () => {
        unsubAuth();
        unsubUser();
      };
    } catch (error) {
      console.error('Error during auth initialization:', error);
    }
  });
  
  onDestroy(() => {
    // Clean up auth listener when component is destroyed
    cleanupAuth();
  });

  function togglePip() {
    pipVisible.update(v => !v);
  }
</script>

<svelte:head>
  <meta name="csrf-token" content={data.csrfToken}>
  
  <!-- Preload commonly used Font Awesome fonts with correct MIME type -->
  <link 
    rel="preload" 
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin="anonymous"
  />
  <link 
    rel="preload" 
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-regular-400.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin="anonymous"
  />
  
  <!-- Font Awesome with font-display swap -->
  <link 
    rel="stylesheet" 
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
    integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" 
    crossorigin="anonymous" 
    referrerpolicy="no-referrer"
  />
  
  <!-- Inter Font with font-display swap -->
  <link 
    rel="preconnect" 
    href="https://fonts.googleapis.com"
  />
  <link 
    rel="preconnect" 
    href="https://fonts.gstatic.com" 
    crossorigin="anonymous"
  />
  <link 
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
    rel="stylesheet"
  />
</svelte:head>

<div class="app-container">
  <div class="main-app-content">
    <Sidebar />
    <div class={`flex-1 transition-all duration-300 ${collapsed ? 'lg:ml-0' : 'lg:ml-64'}`}>
      <main>
        <ActivityTracker />
        <slot />
      </main>
    </div>
    
    <PipWidget />
    <CourseModal />
  </div>
</div>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-app-content {
    flex-grow: 1;
    /* This area will contain the content from nested layouts/pages */
    /* The body background is set in app.html, so this can be transparent or have its own */
  }

  /* Optional: Global styles can go here or in a separate app.css */
  :global(body) {
    background-color: #f4f6f8; /* Ensure this is set from previous step or here */
    color: #333;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    line-height: 1.6;
  }

  :global(a) {
    /* color: #007bff; */ /* Example global link color, can be overridden */
    /* text-decoration: none; */
  }

  :global(a:hover) {
    /* text-decoration: underline; */
  }

  /* Basic styles to ensure things are working */
  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    margin: 0;
    padding: 0;
  }
  
  /* Improve Font Awesome rendering */
  :global(.fas), :global(.fa), :global(.fa-solid), :global(.fa-regular), :global(.fa-brands) {
    font-display: swap !important;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  
  :global(.card-hover) {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  
  :global(.card-hover:hover) {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
</style>
