<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { notepadContent } from '$lib/stores/pipStores';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';

  // Bind directly to the persistent store
  let note = '';
  const unsubscribe = notepadContent.subscribe(value => note = value);

  let saved = false;
  let showSaveAnim = false;

  function saveNote() {
    notepadContent.set(note);
    saved = true;
    showSaveAnim = true;
    setTimeout(() => showSaveAnim = false, 1200);
    setTimeout(() => saved = false, 2000);
  }

  function clearNote() {
    note = '';
    saveNote();
  }

  // Clean up subscription
  onDestroy(() => {
    unsubscribe();
  });
</script>

<svelte:head>
  <title>Notepad | LearnFlow</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-10">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
    <i class="fas fa-sticky-note mr-3 text-yellow-400"></i> Notepad
  </h1>
  <p class="text-gray-600 dark:text-gray-300 mb-6">Jot down notes, ideas, or summaries. Supports <span class="font-semibold">Markdown</span> with live preview!</p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="flex flex-col">
      <label class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200" for="notepad">Your Notes</label>
      <textarea
        id="notepad"
        class="w-full h-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 font-mono text-base shadow focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical transition"
        bind:value={note}
        placeholder="Write your notes here..."
      ></textarea>
      <div class="flex space-x-2 mt-4">
        <button class="px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold shadow hover:bg-indigo-700 transition" on:click={saveNote}>
          <i class="fas fa-save mr-2"></i> Save
        </button>
        <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold shadow hover:bg-gray-300 transition" on:click={clearNote}>
          <i class="fas fa-eraser mr-2"></i> Clear
        </button>
        {#if showSaveAnim}
          <span class="ml-2 animate-bounce text-green-500 text-xl">✔️</span>
        {/if}
        {#if saved && !showSaveAnim}
          <span class="ml-2 text-green-500 text-sm">Saved!</span>
        {/if}
      </div>
    </div>
    <div>
      <label class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200 block">Live Preview</label>
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-64 overflow-auto shadow-inner prose dark:prose-invert">
        <MarkdownRenderer content={note} />
      </div>
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
