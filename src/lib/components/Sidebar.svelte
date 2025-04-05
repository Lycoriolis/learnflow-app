<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  
  type NavItem = {
    name: string;
    href: string;
    icon: string;
  };
  
  type NavCategory = {
    title: string;
    items: NavItem[];
  };
  
  const navigation: NavCategory[] = [
    {
      title: 'Dashboard',
      items: [
        { name: 'Home', href: '/', icon: 'fa-home' },
        { name: 'My Courses', href: '/courses', icon: 'fa-book-open' },
        { name: 'Exercises', href: '/exercises', icon: 'fa-tasks' },
        { name: 'Progress', href: '/progress', icon: 'fa-chart-line' }
      ]
    },
    {
      title: 'Categories',
      items: [
        { name: 'Computer Science', href: '/category/cs', icon: 'fa-laptop-code' },
        { name: 'Mathematics', href: '/category/math', icon: 'fa-square-root-alt' },
        { name: 'Languages', href: '/category/languages', icon: 'fa-language' },
        { name: 'Science', href: '/category/science', icon: 'fa-flask' }
      ]
    }
  ];
  
  let mobileMenuOpen = false;
  let sidebarElement: HTMLElement;
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    if (sidebarElement) {
      sidebarElement.classList.toggle('open');
    }
  }
  
  $: path = $page.url.pathname;
  
  onMount(() => {
    sidebarElement = document.getElementById('sidebar') as HTMLElement;
  });
</script>

<!-- Mobile Menu Button -->
<div class="lg:hidden fixed top-4 left-4 z-50">
  <button 
    id="mobileMenuBtn"
    on:click={toggleMobileMenu} 
    class="p-2 rounded-full bg-white shadow-md"
    aria-label="Toggle mobile menu"
  >
    <i class="fas fa-bars text-indigo-600"></i>
  </button>
</div>

<!-- Sidebar -->
<div id="sidebar" class="sidebar w-64 bg-white shadow-md fixed h-full z-40">
  <div class="p-6">
    <div class="flex items-center mb-8">
      <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
        <i class="fas fa-graduation-cap text-indigo-600"></i>
      </div>
      <h1 class="text-xl font-bold text-indigo-600">LearnFlow</h1>
    </div>
    
    {#each navigation as category}
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">{category.title}</h2>
        </div>
        <ul>
          {#each category.items as item}
            <li class="mb-2">
              <a 
                href={item.href} 
                class="flex items-center px-3 py-2 rounded-lg {path === item.href ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}"
              >
                <i class="fas {item.icon} mr-3"></i>
                <span>{item.name}</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
    
    <div class="absolute bottom-0 left-0 right-0 p-6">
      <div class="p-4 bg-indigo-50 rounded-lg">
        <div class="flex items-center mb-2">
          <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
            <i class="fas fa-user text-indigo-600 text-sm"></i>
          </div>
          <span class="font-medium">Alex Morgan</span>
        </div>
        <a href="/settings" class="w-full py-2 px-4 bg-white rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-100 block text-center">
          Account Settings
        </a>
      </div>
    </div>
  </div>
</div>