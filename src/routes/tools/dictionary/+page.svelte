<!-- filepath: /home/linux/learnflow-app/learnflow-app/src/routes/tools/dictionary/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { persistentStore } from '$lib/stores/persistentStore';

  interface DictionaryEntry {
    word: string;
    timestamp: number;
  }

  const searchHistory = persistentStore<DictionaryEntry[]>('learnflow-dictionary-history', []);
  let searchTerm = '';
  let searching = false;
  let result: any = null;
  let error: string | null = null;
  let audioUrl: string | null = null;
  let synonyms: string[] = [];
  let antonyms: string[] = [];

  async function searchWord(term: string) {
    if (!term.trim()) return;
    
    searching = true;
    error = null;
    result = null;
    audioUrl = null;
    synonyms = [];
    antonyms = [];
    
    try {
      // Dictionary lookup
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error('Word not found');
      const data = await response.json();
      result = data[0];
      
      // Get audio URL if available
      const phonetics = result.phonetics || [];
      for (const phonetic of phonetics) {
        if (phonetic.audio) {
          audioUrl = phonetic.audio;
          break;
        }
      }
      
      // Add to search history
      searchHistory.update(history => {
        const newHistory = [
          { word: term, timestamp: Date.now() },
          ...history.filter(entry => entry.word !== term)
        ].slice(0, 10); // Keep only last 10 searches
        return newHistory;
      });
      
      // Try to get synonyms and antonyms
      try {
        const thesaurusResponse = await fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(term)}`);
        const synData = await thesaurusResponse.json();
        synonyms = synData.slice(0, 5).map((s: { word: string }) => s.word);
        
        const antonymResponse = await fetch(`https://api.datamuse.com/words?rel_ant=${encodeURIComponent(term)}`);
        const antData = await antonymResponse.json();
        antonyms = antData.slice(0, 5).map((a: { word: string }) => a.word);
      } catch (e) {
        console.error('Error fetching synonyms/antonyms:', e);
      }
      
    } catch (e: any) {
      error = e.message;
    } finally {
      searching = false;
    }
  }

  function playAudio() {
    if (audioUrl) {
      new Audio(audioUrl).play();
    }
  }

  function handleSubmit() {
    if (searchTerm.trim()) {
      searchWord(searchTerm);
    }
  }

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }

  // Handle keyboard shortcuts
  function handleKeydown(event: KeyboardEvent) {
    // Ctrl/Cmd + / to focus search
    if ((event.ctrlKey || event.metaKey) && event.key === '/') {
      event.preventDefault();
      const searchInput = document.querySelector<HTMLInputElement>('#word-search');
      if (searchInput) {
        searchInput.focus();
      }
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<svelte:head>
  <title>Dictionary & Reference | LearnFlow</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-10">
  <div class="flex justify-between items-start mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
        <i class="fas fa-book mr-3 text-cyan-500"></i> Dictionary & Reference
      </h1>
      <p class="text-gray-600 dark:text-gray-400">Look up definitions, pronunciations, and related words</p>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
    <!-- Main Search and Results -->
    <div class="lg:col-span-3">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <form on:submit|preventDefault={handleSubmit}>
          <div class="flex gap-2">
            <div class="flex-1 relative">
              <input
                id="word-search"
                type="text"
                bind:value={searchTerm}
                placeholder="Enter a word to look up..."
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
              <div class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <kbd class="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600">Ctrl</kbd>
                <span class="mx-1">+</span>
                <kbd class="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600">/</kbd>
              </div>
            </div>
            <button
              type="submit"
              class="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition flex items-center disabled:opacity-50"
              disabled={searching || !searchTerm.trim()}
            >
              {#if searching}
                <i class="fas fa-spinner fa-spin mr-2"></i> Searching...
              {:else}
                <i class="fas fa-search mr-2"></i> Search
              {/if}
            </button>
          </div>
        </form>
      </div>

      {#if error}
        <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
          <i class="fas fa-exclamation-circle text-3xl text-red-500 mb-4"></i>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Word Not Found</h3>
          <p class="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      {:else if result}
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div class="flex items-baseline gap-4 mb-6">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">{result.word}</h2>
            {#if result.phonetic}
              <div class="flex items-center gap-2">
                <span class="text-lg text-gray-500 dark:text-gray-400">{result.phonetic}</span>
                {#if audioUrl}
                  <button
                    on:click={playAudio}
                    class="p-2 text-cyan-600 hover:text-cyan-700 transition"
                    title="Listen to pronunciation"
                    aria-label="Listen to pronunciation"
                  >
                    <i class="fas fa-volume-up"></i>
                  </button>
                {/if}
              </div>
            {/if}
          </div>

          {#if result.meanings?.length > 0}
            <div class="space-y-6">
              {#each result.meanings as meaning}
                <div>
                  <h3 class="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-3">
                    {meaning.partOfSpeech}
                  </h3>
                  <ul class="space-y-4">
                    {#each meaning.definitions as def, i}
                      <li>
                        <div class="flex gap-2">
                          <span class="text-gray-400 shrink-0">{i + 1}.</span>
                          <div>
                            <p class="text-gray-900 dark:text-gray-100">{def.definition}</p>
                            {#if def.example}
                              <p class="text-gray-600 dark:text-gray-400 italic mt-1">"{def.example}"</p>
                            {/if}
                          </div>
                        </div>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/each}
            </div>
          {/if}

          {#if synonyms.length > 0 || antonyms.length > 0}
            <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              {#if synonyms.length > 0}
                <div class="mb-4">
                  <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Synonyms</h3>
                  <div class="flex flex-wrap gap-2">
                    {#each synonyms as syn}
                      <button
                        class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                        on:click={() => {
                          searchTerm = syn;
                          searchWord(syn);
                        }}
                      >
                        {syn}
                      </button>
                    {/each}
                  </div>
                </div>
              {/if}

              {#if antonyms.length > 0}
                <div>
                  <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Antonyms</h3>
                  <div class="flex flex-wrap gap-2">
                    {#each antonyms as ant}
                      <button
                        class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                        on:click={() => {
                          searchTerm = ant;
                          searchWord(ant);
                        }}
                      >
                        {ant}
                      </button>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {:else}
        <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
          <i class="fas fa-search text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to Look Up Words</h3>
          <p class="text-gray-600 dark:text-gray-400">Enter a word in the search box above to get started</p>
        </div>
      {/if}
    </div>

    <!-- Search History Sidebar -->
    <div class="lg:col-span-1">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg sticky top-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Searches</h3>
        {#if $searchHistory.length === 0}
          <p class="text-gray-500 dark:text-gray-400 text-sm">No recent searches</p>
        {:else}
          <div class="space-y-3">
            {#each $searchHistory as entry}
              <button
                class="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition group"
                on:click={() => {
                  searchTerm = entry.word;
                  searchWord(entry.word);
                }}
              >
                <div class="text-gray-900 dark:text-gray-100 font-medium group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                  {entry.word}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(entry.timestamp)}
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>