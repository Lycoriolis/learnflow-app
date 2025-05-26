<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { slide } from 'svelte/transition';
  import type { SlideParams } from 'svelte/transition';
  import { isAuthenticated, user, loading } from '$lib/stores/authStore.js';
  import { userProfile } from '$lib/stores/userProfileStore.js'; // Import userProfile store
  import { signOutUser } from '$lib/authService.js'; // Import signOutUser
  import { browser } from '$app/environment';
  import { navigateToLogin } from '$lib/utils/navigation';
  import { pipVisible } from '$lib/stores/pipStores.js'; // Import pipVisible
  
  // Accept class prop from parent
  let className = '';
  export { className as class };
  
  type NavItem = {
    name: string;
    href: string;
    icon: string;
    authRequired: boolean;
  };
  
  type NavCategory = {
    title: string;
    items: NavItem[];
  };
  
  const navigation: NavCategory[] = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', href: '/', icon: 'fa-home', authRequired: false },
        { name: 'Courses', href: '/courses', icon: 'fa-book', authRequired: false },
        { name: 'Exercises', href: '/exercises', icon: 'fa-pencil-alt', authRequired: false },
        { name: 'My Learning', href: '/my-learning', icon: 'fa-graduation-cap', authRequired: true },
        { name: 'Statistics', href: '/statistics', icon: 'fa-chart-line', authRequired: true },
        { name: 'Calendar', href: '/calendar', icon: 'fa-calendar', authRequired: true }
      ]
    },
    {
      title: 'Community',
      items: [
        { name: 'Discussion Forums', href: '/forums', icon: 'fa-comments', authRequired: false },
        { name: 'User Groups', href: '/groups', icon: 'fa-users', authRequired: true },
        { name: 'Events', href: '/events', icon: 'fa-calendar-alt', authRequired: false }
      ]
    },
    {
      title: 'Resources',
      items: [
        { name: 'Help Center', href: '/help', icon: 'fa-question-circle', authRequired: false },
        { name: 'Contact Support', href: '/support', icon: 'fa-headset', authRequired: false }
      ]
    },
    {
      title: 'Tools',
      items: [
        { name: 'Workspace', href: '/tools/workspace', icon: 'fa-tools', authRequired: false },
        { name: 'Notepad', href: '/tools/notepad', icon: 'fa-sticky-note', authRequired: false },
        { name: 'Tasks', href: '/tools/tasks', icon: 'fa-list-check', authRequired: false },
        { name: 'AI Study Chat', href: '/tools/chat', icon: 'fa-robot', authRequired: false }
      ]
    }
  ];
  
  let mobileMenuOpen = false;
  let path = '';
  let expanded: Record<string, boolean> = {};
  let pageUnsubscribe: () => void;
  let userProfileUnsubscribe: () => void; // Declare userProfileUnsubscribe
  
  let handleOutsideClick: ((event: MouseEvent) => void) | null = null;
  
  function handleKeyDown(event: KeyboardEvent): void {
    if (!browser) return;
    if (event.key === 'Escape' && mobileMenuOpen) {
      toggleMobileMenu();
    }
  }
  
  onMount(() => {
    if (browser) {
      pageUnsubscribe = page.subscribe(value => {
        path = value.url.pathname;
        // Initialize expanded state after path is set
        navigation.forEach(category => {
          if (category && category.items && Array.isArray(category.items)) {
            expanded[category.title] = category.items.some(item => item && isActive(item.href));
          }
        });
        mobileMenuOpen = false; // Close mobile menu on navigation
      });
      
      userProfileUnsubscribe = userProfile.subscribe(profile => {
        if (profile) {
          console.log('User premium status in Sidebar:', profile.isPremium);
        }
      });

      handleOutsideClick = (event: MouseEvent) => {
        const sidebarEl = document.getElementById('sidebar');
        const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
        const target = event.target as Node;
        if (mobileMenuOpen && sidebarEl && !sidebarEl.contains(target) && mobileToggleBtn && !mobileToggleBtn.contains(target)) {
          mobileMenuOpen = false;
        }
      };
      
      document.addEventListener('click', handleOutsideClick, true); // Use capture phase
      document.addEventListener('keydown', handleKeyDown);
    }
  });
  
  onDestroy(() => {
    if (browser) {
      if (handleOutsideClick) {
        document.removeEventListener('click', handleOutsideClick, true);
      }
      document.removeEventListener('keydown', handleKeyDown);
      if (pageUnsubscribe) {
        pageUnsubscribe();
      }
      if (userProfileUnsubscribe) {
        userProfileUnsubscribe();
      }
    }
  });

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    if (mobileMenuOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }
  
  function toggleCategory(categoryTitle: string) {
    expanded = { ...expanded, [categoryTitle]: !expanded[categoryTitle] };
  }
  
  function isActive(href: string): boolean {
    if (href === '/') {
      return path === '/'; // Exact match for homepage
    }
    return path === href || path.startsWith(href + '/');
  }

  async function handleLogout() {
    try {
      await signOutUser();
      // Optionally navigate to home or login page after sign out
      // import { goto } from '$app/navigation';
      // goto('/');
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error (e.g., show a notification to the user)
    }
  }

  // Toggle Pip widget visibility
  function togglePip() {
    pipVisible.update(v => !v);
  }
</script>

<!-- Mobile Menu Button -->
<div class="lg:hidden fixed top-4 left-4 z-50">
  <button 
    id="mobile-menu-toggle" 
    on:click={toggleMobileMenu} 
    class="p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    aria-label="Toggle menu"
    aria-expanded={mobileMenuOpen}
    aria-controls="sidebar"
  >
    <i class="fas fa-bars"></i>
  </button>
</div>

<!-- Overlay for mobile -->
{#if mobileMenuOpen}
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" 
    aria-hidden="true"
    on:click={toggleMobileMenu}
  ></div>
{/if}

<!-- Sidebar -->
<nav 
  id="sidebar"
  class="peer sidebar fixed left-0 top-0 h-full bg-[#0F172A] text-slate-200 flex flex-col justify-between z-40 group/sidebar transition-transform lg:transition-all duration-300 ease-in-out transform -translate-x-full lg:translate-x-0 w-72 lg:w-[80px] lg:hover:w-[280px] shadow-xl border-r border-slate-700/50"
  class:translate-x-0={mobileMenuOpen}
  aria-label="Main navigation"
>
  <!-- Logo/Header -->
  <div class="p-4 flex items-center shrink-0 h-[68px] 
              lg:px-0 lg:group-hover/sidebar:px-4 
              lg:justify-center lg:group-hover/sidebar:justify-start 
              transition-all duration-300 ease-in-out border-b border-slate-700/50">
    <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center 
                lg:w-9 lg:h-9 lg:group-hover/sidebar:w-10 lg:group-hover/sidebar:h-10 
                transition-all duration-300 ease-in-out shrink-0
                lg:mx-0 lg:group-hover/sidebar:mr-3">
      <i class="fas fa-graduation-cap text-white text-xl lg:text-lg lg:group-hover/sidebar:text-xl transition-all duration-300 ease-in-out"></i>
    </div>
    <h1 class="text-xl font-bold text-indigo-300 ml-3 
               lg:hidden lg:group-hover/sidebar:inline-block lg:group-hover/sidebar:opacity-100
               transition-all duration-200 lg:delay-100 ease-in-out whitespace-nowrap overflow-hidden">
      LearnFlow
    </h1>
  </div>

  <!-- Scrollable Navigation -->
  <div class="flex-1 overflow-y-auto overflow-x-hidden pt-2 lg:pt-3">
    {#each (navigation || []) as category (category.title)}
      {#if category && category.title}
      <div class="mb-2 lg:mb-1 px-2 lg:px-0 lg:group-hover/sidebar:px-2 transition-all duration-300 ease-in-out">
        <button
          class="w-full flex items-center 
                 px-3 py-2.5 lg:px-0 lg:group-hover/sidebar:px-3 
                 lg:justify-center lg:group-hover/sidebar:justify-between
                 text-xs font-semibold uppercase text-slate-400 hover:text-slate-200 tracking-wider 
                 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-md
                 transition-all duration-150 ease-in-out"
          on:click={() => toggleCategory(category.title)}
          aria-expanded={expanded[category.title] || false}
          aria-controls={`category-${category.title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <span class="whitespace-nowrap overflow-hidden transition-opacity duration-200 lg:delay-100 
                       lg:hidden lg:group-hover/sidebar:inline-block lg:group-hover/sidebar:opacity-100">
            {category.title}
          </span>
          <i class={`fas ${expanded[category.title] ? 'fa-chevron-down' : 'fa-chevron-right'} 
                     text-slate-500 
                     lg:mx-0 lg:group-hover/sidebar:mx-0 
                     transition-all duration-300 ease-in-out category-chevron-icon`}></i>
        </button>
        
        {#if expanded[category.title]}
          <ul 
            id={`category-${category.title.toLowerCase().replace(/\s+/g, '-')}`}
            in:slide={{ duration: 200 } as SlideParams} 
            out:slide={{ duration: 200 } as SlideParams}
            class="mt-1 space-y-1 lg:group-hover/sidebar:pl-0 lg:pl-0"
            role="menu"
          >
            {#each (category.items || []) as item (item.href)}
              {#if !item.authRequired || $isAuthenticated}
                <li role="none" class="relative">
                  <a
                    href={item.href}
                    data-sveltekit-preload-data="hover"
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    class={`flex items-center px-3 py-2.5 lg:py-3 rounded-md text-sm font-medium transition-all duration-150 ease-in-out overflow-hidden whitespace-nowrap
                            lg:w-full lg:justify-center lg:group-hover/sidebar:justify-start lg:px-0 lg:group-hover/sidebar:px-3
                            ${isActive(item.href) 
                              ? 'bg-indigo-600/30 text-indigo-200 dark:bg-indigo-500/40 dark:text-indigo-100' 
                              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700/80'
                            }`}
                    role="menuitem"
                    title={item.name} 
                  >
                    <i 
                      class={`fas ${item.icon} w-5 h-5 flex items-center justify-center shrink-0 
                              lg:mx-0 lg:group-hover/sidebar:mr-3 
                              transition-all duration-300 ease-in-out text-lg
                              ${isActive(item.href) ? 'text-indigo-300' : 'text-slate-500 group-hover:text-slate-300'}`} 
                      aria-hidden="true"
                    ></i>
                    <span class="whitespace-nowrap overflow-hidden transition-opacity duration-200 lg:delay-100 
                                 lg:hidden lg:group-hover/sidebar:inline-block lg:group-hover/sidebar:opacity-100">
                      {item.name}
                    </span>
                  </a>
                </li>
              {/if}
            {/each}
          </ul>
        {/if}
      </div>
      {/if}
    {/each}
  </div>

  <!-- Quick Tools Button -->
  <div class="p-3 lg:px-0 lg:group-hover/sidebar:px-3">
    <button on:click={togglePip}
      class="w-full flex items-center justify-center px-3 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-md hover:from-indigo-400 hover:to-pink-400 transition duration-200">
      <i class="fas fa-magic mr-2"></i>
      <span>Quick Tools</span>
    </button>
  </div>

  <!-- Account Section -->
  <div class="p-3 border-t border-slate-700/50 shrink-0 
              lg:px-0 lg:group-hover/sidebar:px-3 
              transition-all duration-300 ease-in-out">
    {#if browser && $loading}
      <div class="p-2 lg:h-[60px] lg:group-hover/sidebar:h-auto lg:p-0 lg:group-hover/sidebar:p-2 bg-slate-700/30 rounded-lg animate-pulse flex items-center 
                  lg:w-full lg:justify-center lg:group-hover/sidebar:justify-start">
        <div class="w-8 h-8 rounded-full bg-slate-600/50 shrink-0 lg:mx-0 lg:group-hover/sidebar:mr-2"></div>
        <div class="w-full ml-2 
                    lg:hidden lg:group-hover/sidebar:block">
          <div class="h-3 bg-slate-600/50 rounded w-3/4 mb-1.5"></div>
          <div class="h-3 bg-slate-600/50 rounded w-1/2"></div>
        </div>
      </div>
    {:else if browser && $isAuthenticated && $user}
      <div class="p-2 lg:p-0 lg:group-hover/sidebar:p-2 bg-slate-700/40 rounded-lg flex 
                  lg:w-full lg:justify-center lg:group-hover/sidebar:justify-start">
        <div class="flex items-center lg:justify-center lg:group-hover/sidebar:justify-start w-full">
          <a href="/profile" class="flex items-center grow group/profilelink 
                                    lg:w-full lg:justify-center lg:group-hover/sidebar:justify-start">
            <div class="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-base font-medium shrink-0 ring-2 ring-slate-600/50 group-hover/profilelink:ring-indigo-400 transition-all
                                lg:mx-0 lg:group-hover/sidebar:mr-2.5">
              {$user.displayName?.charAt(0).toUpperCase() ?? $user.email?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div class="overflow-hidden grow ml-2.5 
                        lg:hidden lg:group-hover/sidebar:block">
              <span class="font-medium text-sm text-slate-100 truncate block group-hover/profilelink:text-indigo-300 transition-colors">
                {$user.displayName ?? $user.email ?? 'User'}
              </span>
              {#if $userProfile && $userProfile.isPremium}
                <span class="text-xs bg-yellow-400 text-yellow-800 px-1.5 py-0.5 rounded-full font-semibold">Premium</span>
              {/if}
              <span class="text-xs text-slate-400 block group-hover/profilelink:text-slate-300 transition-colors">View Profile</span>
            </div>
          </a>
          <button 
            on:click={handleLogout}
            title="Logout"
            aria-label="Logout"
            class="ml-2 p-2 rounded-md text-slate-400 hover:text-indigo-300 hover:bg-slate-600/50 transition-all duration-150 shrink-0 lg:hidden lg:group-hover/sidebar:inline-flex items-center justify-center"
          >
            <i class="fas fa-sign-out-alt text-lg"></i>
          </button>
        </div>
      </div>
    {:else if browser && !$isAuthenticated}
      <div class="p-2 lg:p-0 lg:group-hover/sidebar:p-2 flex flex-col items-stretch">
        <button 
          on:click={() => navigateToLogin()} 
          class="w-full flex items-center justify-center lg:group-hover/sidebar:justify-start px-3 py-2.5 mb-1.5 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors duration-150 ease-in-out whitespace-nowrap"
        >
          <i class="fas fa-sign-in-alt w-5 h-5 shrink-0 lg:mx-0 lg:group-hover/sidebar:mr-2.5 transition-all duration-300 ease-in-out"></i>
          <span class="lg:hidden lg:group-hover/sidebar:inline-block transition-opacity duration-200 lg:delay-100">Login</span>
        </button>
        <button 
          on:click={() => navigateToLogin('/auth/register')} 
          class="w-full flex items-center justify-center lg:group-hover/sidebar:justify-start px-3 py-2 rounded-md text-sm font-medium bg-slate-600 hover:bg-slate-500 text-white transition-colors duration-150 ease-in-out whitespace-nowrap"
        >
          <i class="fas fa-user-plus w-5 h-5 shrink-0 lg:mx-0 lg:group-hover/sidebar:mr-2.5 transition-all duration-300 ease-in-out"></i>
          <span class="lg:hidden lg:group-hover/sidebar:inline-block transition-opacity duration-200 lg:delay-100">Sign Up</span>
        </button>
      </div>
    {/if}
  </div>
</nav>

<style>
  :global(body.sidebar-open) {
    overflow: hidden;
  }

  /* Custom scrollbar for webkit browsers */
  #sidebar div::-webkit-scrollbar {
    width: 5px;
  }
  #sidebar div::-webkit-scrollbar-track {
    background: transparent;
  }
  #sidebar div::-webkit-scrollbar-thumb {
    background: #374151; /* Tailwind gray-700 */
    border-radius: 10px;
  }
  #sidebar div::-webkit-scrollbar-thumb:hover {
    background: #4b5563; /* Tailwind gray-600 */
  }

  @media (min-width: 1024px) { /* lg breakpoint */
    .group\/sidebar:not(:hover) .lg\:hidden {
      /* When sidebar is collapsed (not hovered) and on large screens, truly hide elements meant to be hidden */
      display: none !important; 
    }
    .group\/sidebar:hover .lg\:hidden {
      /* When sidebar is expanded (hovered) and on large screens, revert to original display */
      display: inline-block !important; 
    }

    /* Specific adjustments for category chevrons in collapsed state */
    .group\/sidebar:not(:hover) .category-chevron-icon {
      margin-left: auto; 
      margin-right: auto; 
    }
  }
</style>