<script lang="ts">
  import '../app.css';
  import '@splidejs/splide/dist/css/splide.min.css';
  import { onMount } from 'svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Header from '$lib/components/Header.svelte';
  import PipWidget from '$lib/components/PipWidget.svelte';
  import CourseModal from '$lib/components/CourseModal.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { pipVisible } from '$lib/stores/pipStores.js';
  import { initAuth } from '$lib/authService.js';
  import { isAuthenticated, user } from '$lib/stores/authStore.js';
  import { storeCsrfToken } from '$lib/utils/csrf.client.js';

  export let data;

  onMount(async () => {
    console.log('Root layout mounted - initializing authentication and CSRF protection');
    
    // Store CSRF token from server
    if (data.csrfToken) {
      storeCsrfToken(data.csrfToken);
    }
    
    // Initialize Firebase authentication
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

<div class="min-h-screen">
  <Sidebar />
  
  <div class="lg:ml-64">
    <Header onTogglePip={togglePip} />
    
    <main>
      <slot />
    </main>
    
    <Footer />
  </div>
  
  <PipWidget />
  <CourseModal />
</div>

<style>
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
