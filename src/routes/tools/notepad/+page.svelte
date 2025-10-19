<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { notepadContent } from '$lib/stores/pipStores';
  import EnhancedMarkdownRenderer from '$lib/components/EnhancedMarkdownRenderer.svelte';
  import { logStart, logEnd } from '$lib/services/activityService';

  // Bind directly to the persistent store
  let note = '';
  const unsubscribe = notepadContent.subscribe(value => note = value);

  let saved = false;
  let showSaveAnim = false;
  let notepadViewId: string | null = null;
  let showPreview = true;

  onMount(async () => {
    notepadViewId = await logStart('view_notepad', 'notepad');
  });

  onDestroy(() => {
    if (notepadViewId) logEnd(notepadViewId);
    unsubscribe();
  });

  function saveNote() {
    notepadContent.set(note);
    saved = true;
    showSaveAnim = true;
    setTimeout(() => showSaveAnim = false, 1200);
    setTimeout(() => saved = false, 2000);
  }

  function clearNote() {
    note = '';
    notepadContent.set('');
  }

  function handleInput() {
    saved = false;
  }

  function togglePreview() {
    showPreview = !showPreview;
  }
</script>

<svelte:head>
  <title>Notepad | LearnFlow</title>
</svelte:head>

<div class="flex flex-col h-[85vh] max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden mt-6 border border-gray-200 dark:border-gray-800">
  <!-- Header -->
  <div class="bg-gradient-to-br from-indigo-50/80 via-red-50/50 dark:from-indigo-950/30 dark:via-red-950/20 to-white dark:to-gray-900 p-6 border-b border-gray-200 dark:border-gray-800">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 flex items-center">
        <i class="fas fa-sticky-note mr-3"></i> Notepad
      </h1>
      <div class="flex gap-2">
        <button 
          class="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          on:click={saveNote}
          title="Save notes"
        >
          <i class="fas fa-save"></i>
        </button>
        <button 
          class="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
          on:click={clearNote}
          title="Clear all notes"
        >
          <i class="fas fa-eraser"></i>
        </button>
        <button 
          class="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
          on:click={togglePreview}
          title={showPreview ? "Hide preview" : "Show preview"}
        >
          <i class="fas fa-eye{showPreview ? '' : '-slash'}"></i>
        </button>
        {#if showSaveAnim}
          <span class="ml-2 animate-bounce text-green-500 text-xl">✔️</span>
        {/if}
        {#if saved && !showSaveAnim}
          <span class="ml-2 text-green-500 text-sm">Saved!</span>
        {/if}
      </div>
    </div>
    <p class="text-gray-600 dark:text-gray-300 mt-2">Jot down notes, ideas, or summaries. Supports <span class="font-semibold text-indigo-600 dark:text-indigo-400">Markdown</span> with live preview!</p>
  </div>

  <!-- Main Content -->
  <div class="flex-1 overflow-hidden">
    <div class="grid grid-cols-1 md:grid-cols-2 h-full gap-0">
      <!-- Editor Panel -->
      <div class="p-6 bg-gradient-to-br from-white via-indigo-50/30 dark:from-gray-900 dark:via-indigo-950/10 to-red-50/20 dark:to-red-950/5 border-r border-gray-200 dark:border-gray-800">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
          <div class="flex items-center justify-between mb-4">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center">
              <i class="fas fa-edit mr-2 text-indigo-500"></i> Your Notes
            </label>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {note.length} characters
            </div>
          </div>
          <textarea
            id="notepad"
            class="flex-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 font-mono text-base shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 resize-none transition"
            bind:value={note}
            on:input={handleInput}
            placeholder="Write your notes here..."
          ></textarea>
        </div>
      </div>

      <!-- Preview Panel -->
      {#if showPreview}
        <div class="p-6 bg-gradient-to-br from-indigo-50/50 via-red-50/30 dark:from-indigo-950/20 dark:via-red-950/10 to-white dark:to-gray-900">
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
            <label class="mb-4 text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center">
              <i class="fas fa-eye mr-2 text-red-500"></i> Live Preview
            </label>
            <div class="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-auto shadow-inner prose dark:prose-invert max-w-none">
              <EnhancedMarkdownRenderer content={note} />
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .animate-bounce {
    animation: bounce 0.7s infinite alternate;
  }
  @keyframes bounce {
    0% { transform: translateY(0); }
    100% { transform: translateY(-10px); }
  }
</style>
