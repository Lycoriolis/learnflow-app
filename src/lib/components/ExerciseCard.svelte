<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Exercise } from '$lib/services/courses/exerciseService';
  import { getAuth, type Auth, type User } from 'firebase/auth';
  import { doc, getDoc, getFirestore, type Firestore } from 'firebase/firestore';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  // Accept all Exercise properties as props
  export let id: string;
  export let title: string;
  export let description: string | null = null;
  export let difficulty: 'beginner' | 'intermediate' | 'advanced' | null = null;
  export let category: string | null = null;
  export let tags: string[] = [];
  export let estimatedTime: string | null = null;
  export let points: number = 0;
  export let href: string | undefined = undefined;
  export let onClick: (() => void) | undefined = undefined;
  export let progressStatus: 'completed' | 'inProgress' | 'notStarted' | undefined = undefined;
  
  const dispatch = createEventDispatcher<{
    click: { id: string };
  }>();
  
  let isCompleted = progressStatus === 'completed';
  let isInProgress = progressStatus === 'inProgress';
  let isLoading = !progressStatus && browser;
  let auth: Auth | null = null;
  let db: Firestore | null = null;
  let user: User | null = null;
  
  onMount(async () => {
    if (!browser) return;
    
    // Only check progress if not explicitly set through props
    if (progressStatus === undefined) {
      try {
        auth = getAuth();
        db = getFirestore();
        user = auth.currentUser;
        
        if (user) {
          await checkUserProgress();
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        isLoading = false;
      }
    } else {
      isLoading = false;
    }
  });
  
  async function checkUserProgress() {
    if (!browser || !db || !user) return;
    
    try {
      const userProgressRef = doc(db, 'users', user.uid, 'progress', 'exercises');
      
      const userProgressDoc = await getDoc(userProgressRef);
      if (userProgressDoc.exists()) {
        const data = userProgressDoc.data();
        
        if (data.completed && data.completed[id]) {
          isCompleted = true;
        } else if (data.inProgress && data.inProgress[id]) {
          isInProgress = true;
        }
      }
    } catch (err) {
      console.error('Error checking exercise progress:', err);
    }
  }
  
  function getDifficultyColor() {
    if (!difficulty) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  }
  
  function handleClick() {
    if (onClick) {
      onClick();
    } else {
      dispatch('click', { id });
    }
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }
</script>

{#if href}
  <a
    {href}
    class="exercise-card relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full"
    tabindex="0"
    aria-label={`Exercise: ${title}`}
  >
    <div class="card-content">
      {#if isCompleted}
        <div class="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center" aria-label="Completed">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
      {:else if isInProgress}
        <div class="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-blue-500 border-dashed animate-spin-slow" aria-label="In progress"></div>
      {:else if isLoading}
        <div class="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-gray-300 border-dashed animate-spin-slow" aria-label="Loading"></div>
      {/if}
      
      <!-- Card content -->
      <div class="p-5 flex-grow">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 pr-6">{title}</h3>
        
        {#if description}
          <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{description}</p>
        {/if}
        
        <div class="flex flex-wrap gap-2 mb-3">
          {#if difficulty}
            <span class={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getDifficultyColor()}`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          {/if}
          
          {#if category}
            <span class="text-xs font-medium bg-cherry-100 text-cherry-800 dark:bg-cherry-900/30 dark:text-cherry-300 px-2.5 py-0.5 rounded-full">
              {category}
            </span>
          {/if}
        </div>
        
        {#if tags.length > 0}
          <div class="flex flex-wrap gap-1 mb-3">
            {#each tags.slice(0, 3) as tag}
              <span class="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            {/each}
            {#if tags.length > 3}
              <span class="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                +{tags.length - 3} more
              </span>
            {/if}
          </div>
        {/if}
      </div>
      
      <div class="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-900/30">
        {#if estimatedTime}
          <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {estimatedTime}
          </div>
        {:else}
          <div></div>
        {/if}
        
        {#if points > 0}
          <div class="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {points} pts
          </div>
        {/if}
      </div>
    </div>
  </a>
{:else}
  <button
    class="exercise-card relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full text-left w-full"
    on:click={handleClick}
    on:keydown={handleKeyDown}
    aria-label={`Exercise: ${title}`}
  >
    <div class="card-content">
      {#if isCompleted}
        <div class="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center" aria-label="Completed">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
      {:else if isInProgress}
        <div class="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-blue-500 border-dashed animate-spin-slow" aria-label="In progress"></div>
      {:else if isLoading}
        <div class="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-gray-300 border-dashed animate-spin-slow" aria-label="Loading"></div>
      {/if}
      
      <!-- Card content -->
      <div class="p-5 flex-grow">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 pr-6">{title}</h3>
        
        {#if description}
          <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{description}</p>
        {/if}
        
        <div class="flex flex-wrap gap-2 mb-3">
          {#if difficulty}
            <span class={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getDifficultyColor()}`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          {/if}
          
          {#if category}
            <span class="text-xs font-medium bg-cherry-100 text-cherry-800 dark:bg-cherry-900/30 dark:text-cherry-300 px-2.5 py-0.5 rounded-full">
              {category}
            </span>
          {/if}
        </div>
        
        {#if tags.length > 0}
          <div class="flex flex-wrap gap-1 mb-3">
            {#each tags.slice(0, 3) as tag}
              <span class="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            {/each}
            {#if tags.length > 3}
              <span class="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                +{tags.length - 3} more
              </span>
            {/if}
          </div>
        {/if}
      </div>
      
      <div class="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-900/30">
        {#if estimatedTime}
          <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {estimatedTime}
          </div>
        {:else}
          <div></div>
        {/if}
        
        {#if points > 0}
          <div class="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {points} pts
          </div>
        {/if}
      </div>
    </div>
  </button>
{/if}

<style>
  .exercise-card {
    cursor: pointer;
  }
  
  .exercise-card:focus {
    outline: 2px solid #ef4444;
    outline-offset: 2px;
  }
  
  :global(.animate-spin-slow) {
    animation: spin 3s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Using standard CSS with line-clamp property */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 2; /* Standard property for future compatibility */
  }
</style>