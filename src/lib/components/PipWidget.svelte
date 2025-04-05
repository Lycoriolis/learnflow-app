<script lang="ts">
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { pipVisible, activeTool } from '$lib/stores/pipStores';
  import { onMount } from 'svelte';
  
  // Tools configuration - Updated for Dark Theme
  const tools = [
    { id: 'timer', name: 'Timer', icon: 'fa-stopwatch', bgClass: 'bg-indigo-800', textClass: 'text-indigo-100', hoverClass: 'hover:bg-indigo-700' },
    { id: 'todo', name: 'Todo', icon: 'fa-tasks', bgClass: 'bg-green-800', textClass: 'text-green-100', hoverClass: 'hover:bg-green-700' },
    { id: 'notes', name: 'Notes', icon: 'fa-sticky-note', bgClass: 'bg-blue-800', textClass: 'text-blue-100', hoverClass: 'hover:bg-blue-700' },
    { id: 'calculator', name: 'Calculator', icon: 'fa-calculator', bgClass: 'bg-purple-800', textClass: 'text-purple-100', hoverClass: 'hover:bg-purple-700' }
  ];
  
  let minimized = false;
  let widgetElement: HTMLElement;
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  
  function closePip() {
    pipVisible.set(false);
    minimized = false;
  }
  
  function minimizePip() {
    minimized = !minimized;
  }
  
  function setTool(id: string) {
    activeTool.set(id);
    minimized = false;
  }
  
  // Draggable functionality
  function handleMouseDown(e: MouseEvent) {
    if (e.target instanceof Element && e.target.closest('button')) return;
    
    isDragging = true;
    const rect = widgetElement.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    widgetElement.style.cursor = 'grabbing';
  }
  
  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    
    widgetElement.style.left = `${e.clientX - offsetX}px`;
    widgetElement.style.top = `${e.clientY - offsetY}px`;
    widgetElement.style.bottom = 'auto';
    widgetElement.style.right = 'auto';
  }
  
  function handleMouseUp() {
    isDragging = false;
    if (widgetElement) widgetElement.style.cursor = 'grab';
  }
  
  onMount(() => {
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Clean up
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });
</script>

{#if $pipVisible}
  <div
    bind:this={widgetElement}
    on:mousedown={handleMouseDown}
    class="pip-widget {minimized ? 'minimized' : ''} bg-gray-800 text-gray-100 rounded-2xl overflow-hidden squircle"
    transition:fly={{ y: 20, duration: 300, easing: quintOut }}
  >
    <div class="bg-indigo-600 text-white p-3 flex justify-between items-center">
      <h3 class="font-medium">Quick Tools</h3>
      <div>
        <button 
          on:click={minimizePip} 
          class="p-1 text-white hover:bg-indigo-500 rounded-full"
          aria-label="Minimize widget"
        >
          <i class="fas {minimized ? 'fa-expand' : 'fa-window-minimize'}"></i>
        </button>
        <button 
          on:click={closePip} 
          class="p-1 text-white hover:bg-indigo-500 rounded-full ml-1"
          aria-label="Close widget"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
    
    {#if !minimized}
      <div class="p-4">
        <div class="grid grid-cols-2 gap-3 mb-4">
          {#each tools as tool}
            <button
              on:click={() => setTool(tool.id)}
              class="p-3 {tool.bgClass} rounded-lg {tool.textClass} {tool.hoverClass} flex flex-col items-center"
              class:ring-2={$activeTool === tool.id}
              class:ring-indigo-400={$activeTool === tool.id}
            >
              <i class="fas {tool.icon} text-lg mb-1"></i>
              <span class="text-xs">{tool.name}</span>
            </button>
          {/each}
        </div>
        
        {#if $activeTool === 'notes'}
          <div class="bg-gray-700 p-3 rounded-lg">
            <h4 class="text-xs font-medium text-gray-400 mb-2">Quick Note</h4>
            <textarea class="w-full text-sm bg-gray-600 text-gray-100 border border-gray-500 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500" rows="2" placeholder="Take a quick note..."></textarea>
            <button class="mt-2 text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Save</button>
          </div>
        {:else if $activeTool === 'timer'}
          <div class="text-center p-3">
            <div class="text-2xl font-bold mb-2 text-gray-100">25:00</div>
            <div class="flex justify-center space-x-2">
              <button class="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Start</button>
              <button class="px-3 py-1 bg-gray-600 text-gray-200 hover:bg-gray-500 rounded text-sm">Reset</button>
            </div>
          </div>
        {:else if $activeTool === 'todo'}
          <div class="p-1">
            <div class="flex mb-2">
              <input type="text" class="flex-1 text-sm bg-gray-600 text-gray-100 border border-gray-500 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 mr-2" placeholder="New task...">
              <button class="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Add</button>
            </div>
            <ul class="space-y-1 max-h-32 overflow-y-auto">
              <li class="flex items-center text-sm p-1 text-gray-200">
                <input type="checkbox" class="mr-2 form-checkbox bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-400">
                <span>Complete JavaScript exercise</span>
              </li>
              <li class="flex items-center text-sm p-1 text-gray-200">
                <input type="checkbox" class="mr-2 form-checkbox bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-400">
                <span>Review lecture notes</span>
              </li>
            </ul>
          </div>
        {:else if $activeTool === 'calculator'}
          <div class="text-center p-2">
            <input type="text" class="w-full text-right mb-2 border-0 focus:ring-0 text-lg font-medium bg-gray-800 text-gray-100" value="0" readonly>
            <div class="grid grid-cols-4 gap-1">
              {#each ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+'] as key}
                <button class="p-2 bg-gray-700 rounded text-sm font-medium text-gray-200 hover:bg-gray-600">{key}</button>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style lang="postcss">
  .pip-widget {
    /* Ensure transform is used for positioning */
    will-change: transform;
  }
  .pip-widget.minimized {
     transition: width 0.3s ease-out, height 0.3s ease-out, border-radius 0.3s ease-out;
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

  /* Custom scrollbar for the content area - Dark Theme */
  .overflow-y-auto::-webkit-scrollbar {
      width: 6px;
  }
  .overflow-y-auto::-webkit-scrollbar-track {
      background: transparent;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      border: 1px solid transparent;
  }
  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
      background-color: rgba(255, 255, 255, 0.3);
  }

</style>