<script lang="ts">
  import '../app.css';
  import '@splidejs/splide/dist/css/splide.min.css';
  import 'katex/dist/katex.min.css';
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

  onMount(() => {
    console.log('Root layout mounted - initializing authentication and CSRF protection');
    
    if (data.csrfToken) {
      storeCsrfToken(data.csrfToken);
    }
    
    try {
      initAuth();
      
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
    cleanupAuth();
  });

  function togglePip() {
    pipVisible.update(v => !v);
  }
</script>

<svelte:head>
  <meta name="csrf-token" content={data.csrfToken}>
  
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
  
  <link 
    rel="stylesheet" 
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
    integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" 
    crossorigin="anonymous" 
    referrerpolicy="no-referrer"
  />
  
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

<div class="app-container bg-[#0D1117] dark" style='font-family: "Spline Sans", "Noto Sans", sans-serif;'>
  <div class="main-app-content flex">
    <Sidebar class="peer" />
    <div class="flex-1 transition-all duration-300 ease-in-out ml-0 md:ml-[80px] md:peer-hover:ml-[280px]">
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
  }

  :global(body) {
    margin: 0;
    line-height: 1.6;
  }
  
  :global(.fas), :global(.fa), :global(.fa-solid), :global(.fa-regular), :global(.fa-brands) {
    font-display: swap !important;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
</style>
