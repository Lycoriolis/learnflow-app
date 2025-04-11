<script lang="ts">
  import '../app.css'; // Ensure this is imported at the very top
  import '@splidejs/splide/dist/css/splide.min.css'; // Changed from '@splidejs/splide/css'
  import { onMount } from 'svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Header from '$lib/components/Header.svelte';
  import PipWidget from '$lib/components/PipWidget.svelte';
  import CourseModal from '$lib/components/CourseModal.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { pipVisible } from '$lib/stores/pipStores.js';
  import { initAuth } from '$lib/authService.js'; // Import Firebase auth initializer
  import { isAuthenticated, user } from '$lib/stores/authStore.js';

  // Initialize Firebase Authentication
  onMount(() => {
    console.log('Root layout mounted - initializing Firebase authentication');
    initAuth();
    
    // Set up subscription to auth state for debugging
    const unsubAuth = isAuthenticated.subscribe(value => {
      console.log('Auth state changed in root layout:', value ? 'Authenticated' : 'Not authenticated');
    });
    
    const unsubUser = user.subscribe(value => {
      console.log('User state changed in root layout:', value ? 
        { email: value.email, displayName: value.displayName, uid: value.uid } : 
        'No user');
    });
    
    return () => {
      // Cleanup subscriptions
      unsubAuth();
      unsubUser();
      console.log('Root layout unmounted - cleaned up auth subscriptions');
    };
  });

  // Toggle PIP widget visibility
  const togglePip = () => {
    pipVisible.update((v: boolean) => !v);
  };
</script>

<svelte:head>
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  
  <!-- Inter Font -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
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
  
  :global(.card-hover) {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  
  :global(.card-hover:hover) {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
</style>
