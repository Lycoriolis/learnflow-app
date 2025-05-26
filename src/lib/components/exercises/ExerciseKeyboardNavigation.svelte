<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { browser } from '$app/environment';

  export let enabled = true;
  export let exercises: any[] = [];
  export let currentIndex = 0;
  export let gridColumns = 1;

  const dispatch = createEventDispatcher<{
    navigate: { direction: 'up' | 'down' | 'left' | 'right'; newIndex: number };
    select: { index: number };
    bookmark: { index: number };
    search: {};
    filter: {};
  }>();

  let keyboardHelpVisible = false;
  let announcements: string[] = [];

  function calculateNewIndex(direction: 'up' | 'down' | 'left' | 'right'): number {
    const totalExercises = exercises.length;
    if (totalExercises === 0) return 0;

    let newIndex = currentIndex;

    switch (direction) {
      case 'up':
        newIndex = currentIndex - gridColumns;
        if (newIndex < 0) {
          // Wrap to the bottom
          const remainder = currentIndex % gridColumns;
          const bottomRowStart = Math.floor((totalExercises - 1) / gridColumns) * gridColumns;
          newIndex = Math.min(bottomRowStart + remainder, totalExercises - 1);
        }
        break;
      
      case 'down':
        newIndex = currentIndex + gridColumns;
        if (newIndex >= totalExercises) {
          // Wrap to the top
          newIndex = currentIndex % gridColumns;
        }
        break;
      
      case 'left':
        newIndex = currentIndex - 1;
        if (newIndex < 0) {
          newIndex = totalExercises - 1; // Wrap to the end
        }
        break;
      
      case 'right':
        newIndex = currentIndex + 1;
        if (newIndex >= totalExercises) {
          newIndex = 0; // Wrap to the beginning
        }
        break;
    }

    return Math.max(0, Math.min(newIndex, totalExercises - 1));
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!enabled || !browser) return;

    // Don't interfere with input fields
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement || 
        event.target instanceof HTMLSelectElement) {
      return;
    }

    let handled = false;

    switch (event.code) {
      case 'ArrowUp':
      case 'KeyK':
        if (!event.shiftKey) {
          const newIndex = calculateNewIndex('up');
          dispatch('navigate', { direction: 'up', newIndex });
          announceNavigation(newIndex, 'up');
          handled = true;
        }
        break;
      
      case 'ArrowDown':
      case 'KeyJ':
        if (!event.shiftKey) {
          const newIndex = calculateNewIndex('down');
          dispatch('navigate', { direction: 'down', newIndex });
          announceNavigation(newIndex, 'down');
          handled = true;
        }
        break;
      
      case 'ArrowLeft':
      case 'KeyH':
        if (!event.shiftKey) {
          const newIndex = calculateNewIndex('left');
          dispatch('navigate', { direction: 'left', newIndex });
          announceNavigation(newIndex, 'left');
          handled = true;
        }
        break;
      
      case 'ArrowRight':
      case 'KeyL':
        if (!event.shiftKey) {
          const newIndex = calculateNewIndex('right');
          dispatch('navigate', { direction: 'right', newIndex });
          announceNavigation(newIndex, 'right');
          handled = true;
        }
        break;
      
      case 'Enter':
      case 'Space':
        dispatch('select', { index: currentIndex });
        announceSelection();
        handled = true;
        break;
      
      case 'KeyB':
        if (event.ctrlKey || event.metaKey) {
          dispatch('bookmark', { index: currentIndex });
          announceBookmark();
          handled = true;
        }
        break;
      
      case 'Slash':
        if (!event.shiftKey) {
          dispatch('search', {});
          announceAction('Search activated');
          handled = true;
        }
        break;
      
      case 'KeyF':
        if (!event.ctrlKey && !event.metaKey) {
          dispatch('filter', {});
          announceAction('Filter menu opened');
          handled = true;
        }
        break;
      
      case 'F1':
        keyboardHelpVisible = !keyboardHelpVisible;
        announceAction(keyboardHelpVisible ? 'Keyboard help opened' : 'Keyboard help closed');
        handled = true;
        break;
      
      case 'Escape':
        if (keyboardHelpVisible) {
          keyboardHelpVisible = false;
          announceAction('Keyboard help closed');
          handled = true;
        }
        break;
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function announceNavigation(newIndex: number, direction: string) {
    if (exercises[newIndex]) {
      const exercise = exercises[newIndex];
      const announcement = `Navigated ${direction} to ${exercise.title || 'exercise'} ${newIndex + 1} of ${exercises.length}. ${exercise.difficulty ? `Difficulty: ${exercise.difficulty}.` : ''} ${exercise.description ? exercise.description.slice(0, 100) + '...' : ''}`;
      addAnnouncement(announcement);
    }
  }

  function announceSelection() {
    if (exercises[currentIndex]) {
      const exercise = exercises[currentIndex];
      addAnnouncement(`Opening ${exercise.title || 'exercise'}`);
    }
  }

  function announceBookmark() {
    if (exercises[currentIndex]) {
      const exercise = exercises[currentIndex];
      addAnnouncement(`Bookmark toggled for ${exercise.title || 'exercise'}`);
    }
  }

  function announceAction(message: string) {
    addAnnouncement(message);
  }

  function addAnnouncement(message: string) {
    announcements = [...announcements, message];
    // Remove old announcements after a delay
    setTimeout(() => {
      announcements = announcements.slice(1);
    }, 3000);
  }

  onMount(() => {
    if (browser) {
      document.addEventListener('keydown', handleKeydown);
    }
  });

  onDestroy(() => {
    if (browser) {
      document.removeEventListener('keydown', handleKeydown);
    }
  });
</script>

<!-- Screen Reader Announcements -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  {#each announcements as announcement}
    <div>{announcement}</div>
  {/each}
</div>

<!-- Keyboard Help Modal -->
{#if keyboardHelpVisible}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    role="dialog"
    aria-labelledby="keyboard-help-title"
    aria-modal="true"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 id="keyboard-help-title" class="text-xl font-semibold text-gray-900 dark:text-white">
            Keyboard Shortcuts
          </h2>
          <button
            on:click={() => keyboardHelpVisible = false}
            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close keyboard help"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Navigation</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Move up</span>
                <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">↑ or K</kbd>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Move down</span>
                <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">↓ or J</kbd>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Move left</span>
                <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">← or H</kbd>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Move right</span>
                <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">→ or L</kbd>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Actions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Open exercise</span>
                <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Enter or Space</kbd>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Toggle bookmark</span>
                <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Ctrl+B</kbd>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Search</span>
                <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">/</kbd>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Filter</span>
                <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">F</kbd>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Help</h3>
            <div class="text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Show/hide this help</span>
                <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">F1</kbd>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6 text-xs text-gray-500 dark:text-gray-400">
          <p>Navigate through exercises using the keyboard for improved accessibility and efficiency.</p>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  kbd {
    box-shadow: inset 0 -2px 0 0 rgba(0, 0, 0, 0.1);
  }
</style>
