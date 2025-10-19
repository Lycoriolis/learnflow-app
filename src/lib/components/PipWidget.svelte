<script lang="ts">
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { pipVisible, activeTool } from '$lib/stores/pipStores';
  import { onMount, tick, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  
  // Import the tool components
  import PipTimer from './pip/PipTimer.svelte';
  import PipTodo from './pip/PipTodo.svelte';
  import PipNotes from './pip/PipNotes.svelte';
  import PipCalculator from './pip/PipCalculator.svelte';
  import PipFlashcards from './pip/PipFlashcards.svelte';
  import PipDictionary from './pip/PipDictionary.svelte';
  
  // Tools configuration - Updated for Dark Theme
  const tools = [
    { id: 'timer', name: 'Timer', icon: 'fa-stopwatch', bgClass: 'bg-indigo-800', textClass: 'text-indigo-100', hoverClass: 'hover:bg-indigo-700' },
    { id: 'todo', name: 'Todo', icon: 'fa-list-check', bgClass: 'bg-green-800', textClass: 'text-green-100', hoverClass: 'hover:bg-green-700' },
    { id: 'notes', name: 'Notes', icon: 'fa-sticky-note', bgClass: 'bg-yellow-800', textClass: 'text-yellow-100', hoverClass: 'hover:bg-yellow-700' },
    { id: 'calculator', name: 'Calculator', icon: 'fa-calculator', bgClass: 'bg-red-800', textClass: 'text-red-100', hoverClass: 'hover:bg-red-700' },
    { id: 'flashcards', name: 'Flashcards', icon: 'fa-layer-group', bgClass: 'bg-orange-800', textClass: 'text-orange-100', hoverClass: 'hover:bg-orange-700' },
    { id: 'dictionary', name: 'Dictionary', icon: 'fa-book', bgClass: 'bg-cyan-800', textClass: 'text-cyan-100', hoverClass: 'hover:bg-cyan-700' }
  ];
  
  let minimized = false;
  let widgetElement: HTMLElement | null = null;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;
  
  // Use these variables for CSS instead of direct style manipulation
  let widgetLeft = 'auto';
  let widgetTop = 'auto';
  let widgetBottom = '1rem';
  let widgetRight = '1rem';
  let widgetCursor = 'grab';
  let widgetUserSelect = 'auto';
  
  // Safely close the pip widget
  function closePip() {
    if (browser) {
      pipVisible.set(false);
      minimized = false;
    }
  }
  
  // Toggle minimized state
  function minimizePip() {
    minimized = !minimized;
  }
  
  // Switch between tools
  function setTool(id: string) {
    activeTool.set(id);
    minimized = false;
  }
  
  // Draggable functionality
  function handleMouseDown(e: MouseEvent) {
    if (!browser || !widgetElement) return;
    
    // Only drag via the header (check if the event target is within the header)
    const header = widgetElement.querySelector('.pip-header');
    if (!header || !header.contains(e.target as Node)) return;

    // Prevent dragging if clicking on buttons inside the header
    if (e.target instanceof Element && e.target.closest('button')) return; 

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    
    const rect = widgetElement.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    // Style changes for dragging state
    widgetCursor = 'grabbing';
    widgetUserSelect = 'none'; // Prevent text selection
    widgetBottom = 'auto'; // Ensure absolute positioning takes over
    widgetRight = 'auto';
    
    // Set explicit position
    widgetLeft = `${initialLeft}px`;
    widgetTop = `${initialTop}px`;
  }
  
  function handleMouseMove(e: MouseEvent) {
    if (!browser || !isDragging) return;
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    widgetLeft = `${initialLeft + dx}px`;
    widgetTop = `${initialTop + dy}px`;
  }
  
  function handleMouseUp() {
    if (!browser) return;
    
    if (isDragging) {
      isDragging = false;
      widgetCursor = 'grab';
      widgetUserSelect = 'auto'; // Re-enable text selection
    }
  }
  
  // Keep track of event listeners to clean up properly
  let mouseMoveListener: ((e: MouseEvent) => void) | null = null;
  let mouseUpListener: (() => void) | null = null;
  
  onMount(() => {
    if (!browser) return;
    
    // Add event listeners to document for reliable drag tracking
    mouseMoveListener = handleMouseMove;
    mouseUpListener = handleMouseUp;
    
    document.addEventListener('mousemove', mouseMoveListener);
    document.addEventListener('mouseup', mouseUpListener);
  });
  
  // Ensure cleanup of event listeners when component is destroyed
  onDestroy(() => {
    if (!browser) return;
    
    if (mouseMoveListener) {
      document.removeEventListener('mousemove', mouseMoveListener);
    }
    
    if (mouseUpListener) {
      document.removeEventListener('mouseup', mouseUpListener);
    }
  });
  
  // Function for keyboard accessibility
  async function handleKeyDown(e: KeyboardEvent) {
    if (!browser || !widgetElement) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // We need to create a synthetic MouseEvent for handleMouseDown
      // First, wait for the DOM to be updated
      await tick();
      
      const rect = widgetElement.getBoundingClientRect();
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + 20, // Position in the header
        bubbles: true
      });
      handleMouseDown(mouseEvent);
    }
  }
</script>

{#if browser && $pipVisible}
  <div
    bind:this={widgetElement}
    class="pip-widget {minimized ? 'minimized' : ''} bg-gray-800 text-gray-100 rounded-2xl overflow-hidden shadow-lg fixed squircle"
    style="position: fixed; bottom: {widgetBottom}; right: {widgetRight}; left: {widgetLeft}; top: {widgetTop}; cursor: {widgetCursor}; user-select: {widgetUserSelect};"
    role="region" 
    aria-label="Quick Tools Widget"
    transition:fly={{ y: 20, duration: 300, easing: quintOut }}
  >
    <div 
      class="pip-header bg-indigo-600 text-white p-2 flex justify-between items-center cursor-grab" 
      on:mousedown={handleMouseDown}
      role="button" 
      tabindex="0"
      aria-label="Drag quick tools widget"
      on:keydown={handleKeyDown}
    >
      <h3 class="font-medium text-sm pl-2">Quick Tools</h3>
      <div>
        <button 
          on:click={minimizePip} 
          class="p-1 text-indigo-100 hover:bg-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={minimized ? 'Expand widget' : 'Minimize widget'}
        >
          <i class="fas {minimized ? 'fa-expand' : 'fa-window-minimize'} w-3 h-3"></i>
        </button>
        <button 
          on:click={closePip} 
          class="p-1 text-indigo-100 hover:bg-indigo-500 rounded-full ml-1 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close widget"
        >
          <i class="fas fa-times w-3 h-3"></i>
        </button>
      </div>
    </div>
    
    {#if !minimized}
      <div class="p-3 border-b border-gray-700">
        <div class="grid grid-cols-4 gap-2">
          {#each tools as tool}
            <button
              on:click={() => setTool(tool.id)}
              class="p-2 {tool.bgClass} rounded-lg {tool.textClass} {tool.hoverClass} flex flex-col items-center text-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 { $activeTool === tool.id ? 'ring-2 ring-white' : 'ring-0' }"
              aria-label={`Open ${tool.name} tool`}
            >
              <i class="fas {tool.icon} text-base mb-1"></i>
              <span class="text-xs font-medium">{tool.name}</span>
            </button>
          {/each}
        </div>
      </div>
      
      <div class="p-2 tool-content-area">
        {#if $activeTool === 'timer'}
          <PipTimer />
        {:else if $activeTool === 'todo'}
          <PipTodo />
        {:else if $activeTool === 'notes'}
          <PipNotes />
        {:else if $activeTool === 'calculator'}
          <PipCalculator />
        {:else if $activeTool === 'flashcards'}
          <PipFlashcards />
        {:else if $activeTool === 'dictionary'}
          <PipDictionary />
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style lang="postcss">
  .pip-widget {
    width: 280px; /* Adjust width as needed */
    will-change: transform;
    transition: width 0.2s ease-out, height 0.2s ease-out;
  }
  .pip-widget.minimized {
     height: 44px; /* Adjust to match header height */
     width: auto; /* Or a fixed minimized width */
     overflow: hidden;
  }
  .tool-content-area {
      min-height: 150px; /* Give it some default height */
  }

  /* Custom scrollbar for the content area - Dark Theme */
  .tool-content-area ::-webkit-scrollbar {
      width: 6px;
  }
  .tool-content-area ::-webkit-scrollbar-track {
      background: transparent;
  }
  .tool-content-area ::-webkit-scrollbar-thumb {
      background-color: rgba(156, 163, 175, 0.4); /* gray-400 with opacity */
      border-radius: 3px;
      border: 1px solid transparent;
      background-clip: content-box;
  }
  .tool-content-area ::-webkit-scrollbar-thumb:hover {
      background-color: rgba(156, 163, 175, 0.6);
  }

  /* Add explicit Tailwind color classes for purging */
  .bg-indigo-50 { --tw-bg-opacity: 1; background-color: rgb(239 246 255 / var(--tw-bg-opacity)); }
  .text-indigo-700 { --tw-text-opacity: 1; color: rgb(67 56 202 / var(--tw-text-opacity)); }
  .hover\:bg-indigo-100:hover { --tw-bg-opacity: 1; background-color: rgb(224 231 255 / var(--tw-bg-opacity)); }
  .focus\:ring-indigo-400:focus { --tw-ring-color: rgb(129 140 248 / var(--tw-ring-opacity)); }
  .border-indigo-100 { --tw-border-opacity: 1; border-color: rgb(224 231 255 / var(--tw-border-opacity)); }
  .hover\:border-indigo-200:hover { --tw-border-opacity: 1; border-color: rgb(199 210 254 / var(--tw-border-opacity)); }

  .bg-green-50 { --tw-bg-opacity: 1; background-color: rgb(240 253 244 / var(--tw-bg-opacity)); }
  .text-green-700 { --tw-text-opacity: 1; color: rgb(21 128 61 / var(--tw-text-opacity)); }
  .hover\:bg-green-100:hover { --tw-bg-opacity: 1; background-color: rgb(220 252 231 / var(--tw-bg-opacity)); }
  .focus\:ring-green-400:focus { --tw-ring-color: rgb(74 222 128 / var(--tw-ring-opacity)); }
  .border-green-100 { --tw-border-opacity: 1; border-color: rgb(220 252 231 / var(--tw-border-opacity)); }
  .hover\:border-green-200:hover { --tw-border-opacity: 1; border-color: rgb(187 247 208 / var(--tw-border-opacity)); }

  .bg-blue-50 { --tw-bg-opacity: 1; background-color: rgb(239 246 255 / var(--tw-bg-opacity)); }
  .text-blue-700 { --tw-text-opacity: 1; color: rgb(29 78 216 / var(--tw-text-opacity)); }
  .hover\:bg-blue-100:hover { --tw-bg-opacity: 1; background-color: rgb(219 234 254 / var(--tw-bg-opacity)); }
  .focus\:ring-blue-400:focus { --tw-ring-color: rgb(96 165 250 / var(--tw-ring-opacity)); }
  .border-blue-100 { --tw-border-opacity: 1; border-color: rgb(219 234 254 / var(--tw-border-opacity)); }
  .hover\:border-blue-200:hover { --tw-border-opacity: 1; border-color: rgb(191 219 254 / var(--tw-border-opacity)); }

  .bg-purple-50 { --tw-bg-opacity: 1; background-color: rgb(250 245 255 / var(--tw-bg-opacity)); }
  .text-purple-700 { --tw-text-opacity: 1; color: rgb(126 34 206 / var(--tw-text-opacity)); }
  .hover\:bg-purple-100:hover { --tw-bg-opacity: 1; background-color: rgb(243 232 255 / var(--tw-bg-opacity)); }
  .focus\:ring-purple-400:focus { --tw-ring-color: rgb(192 132 252 / var(--tw-ring-opacity)); }
  .border-purple-100 { --tw-border-opacity: 1; border-color: rgb(243 232 255 / var(--tw-border-opacity)); }
  .hover\:border-purple-200:hover { --tw-border-opacity: 1; border-color: rgb(233 213 255 / var(--tw-border-opacity)); }

  .bg-orange-50 { --tw-bg-opacity: 1; background-color: rgb(255 237 213 / var(--tw-bg-opacity)); }
  .text-orange-700 { --tw-text-opacity: 1; color: rgb(234 88 12 / var(--tw-text-opacity)); }
  .hover\:bg-orange-100:hover { --tw-bg-opacity: 1; background-color: rgb(255 229 200 / var(--tw-bg-opacity)); }
  .focus\:ring-orange-400:focus { --tw-ring-color: rgb(251 146 60 / var(--tw-ring-opacity)); }
  .border-orange-100 { --tw-border-opacity: 1; border-color: rgb(255 229 200 / var(--tw-border-opacity)); }
  .hover\:border-orange-200:hover { --tw-border-opacity: 1; border-color: rgb(255 215 170 / var(--tw-border-opacity)); }
</style>