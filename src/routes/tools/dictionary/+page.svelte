<!-- filepath: /home/linux/learnflow-app/learnflow-app/src/routes/tools/dictionary/+page.svelte -->
<script lang="ts">
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
        synonyms = synData.slice(0, 5).map(s => s.word);
        
        const antonymResponse = await fetch(`https://api.datamuse.com/words?rel_ant=${encodeURIComponent(term)}`);
        const antData = await antonymResponse.json();
        antonyms = antData.slice(0, 5).map(a => a.word);
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

<div class="flex flex-col h-[85vh] max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden mt-6 border border-gray-200 dark:border-gray-800">
  <!-- Header -->
  <div class="bg-gradient-to-br from-cyan-50/80 via-blue-50/50 dark:from-cyan-950/30 dark:via-blue-950/20 to-white dark:to-gray-900 p-6 border-b border-gray-200 dark:border-gray-800">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 flex items-center">
        <i class="fas fa-book mr-3"></i> Dictionary & Reference
      </h1>
      <div class="flex gap-2">
        <button 
          class="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
          on:click={handleSubmit}
          title="Search word"
          aria-label="Search word"
        >
          <i class="fas fa-search"></i>
        </button>
        {#if audioUrl}
          <button 
            class="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
            on:click={playAudio}
            title="Play pronunciation"
            aria-label="Play pronunciation"
          >
            <i class="fas fa-volume-up"></i>
          </button>
        {/if}
      </div>
    </div>
    <p class="text-gray-600 dark:text-gray-300 mt-2">Look up definitions, pronunciations, and related words</p>
  </div>

  <!-- Main Content -->
  <div class="flex-1 overflow-hidden">
    <div class="grid grid-cols-1 lg:grid-cols-3 h-full gap-0">
      <!-- Main Search and Results -->
      <div class="lg:col-span-2 p-6 bg-gradient-to-br from-white via-cyan-50/30 dark:from-gray-900 dark:via-cyan-950/10 to-blue-50/20 dark:to-blue-950/5">
        <!-- Search Form -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
          <form on:submit|preventDefault={handleSubmit}>
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <input
                  id="word-search"
                  type="text"
                  bind:value={searchTerm}
                  placeholder="Enter a word to look up..."
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                >
                <div class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                  <kbd class="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600">Enter</kbd>
                </div>
              </div>
              <button
                type="submit"
                class="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-semibold shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 flex items-center disabled:opacity-50"
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

        <!-- Results -->
        {#if error}
          <div class="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-6"></i>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Word Not Found</h3>
            <p class="text-gray-600 dark:text-gray-400 text-lg">{error}</p>
          </div>
        {:else if result}
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div class="flex items-baseline gap-4 mb-6">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white">{result.word}</h2>
              {#if result.phonetic}
                <div class="flex items-center gap-2">
                  <span class="text-lg text-gray-500 dark:text-gray-400">{result.phonetic}</span>
                  {#if audioUrl}
                    <button
                      on:click={playAudio}
                      class="p-2 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/50"
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
                  <div class="border-l-4 border-cyan-500 pl-4">
                    <h3 class="text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-3 capitalize">
                      {meaning.partOfSpeech}
                    </h3>
                    <ul class="space-y-4">
                      {#each meaning.definitions as def, i}
                        <li class="flex gap-3">
                          <span class="text-cyan-500 font-semibold shrink-0">{i + 1}.</span>
                          <div class="flex-1">
                            <p class="text-gray-900 dark:text-white mb-2">{def.definition}</p>
                            {#if def.example}
                              <p class="text-gray-600 dark:text-gray-400 italic text-sm pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                "{def.example}"
                              </p>
                            {/if}
                            {#if def.synonyms?.length > 0}
                              <div class="mt-2">
                                <span class="text-sm font-medium text-green-600 dark:text-green-400">Synonyms:</span>
                                <div class="flex flex-wrap gap-1 mt-1">
                                  {#each def.synonyms.slice(0, 3) as synonym}
                                    <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs">{synonym}</span>
                                  {/each}
                                </div>
                              </div>
                            {/if}
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
                    <h4 class="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Synonyms</h4>
                    <div class="flex flex-wrap gap-2">
                      {#each synonyms.slice(0, 8) as synonym}
                        <button
                          on:click={() => { searchTerm = synonym; handleSubmit(); }}
                          class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-800 transition"
                        >
                          {synonym}
                        </button>
                      {/each}
                    </div>
                  </div>
                {/if}
                {#if antonyms.length > 0}
                  <div>
                    <h4 class="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Antonyms</h4>
                    <div class="flex flex-wrap gap-2">
                      {#each antonyms.slice(0, 8) as antonym}
                        <button
                          on:click={() => { searchTerm = antonym; handleSubmit(); }}
                          class="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-800 transition"
                        >
                          {antonym}
                        </button>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {/if}
        </div>
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
        </div>
    </div>

      <!-- Search History Sidebar -->
      <div class="lg:col-span-1 p-6 bg-gradient-to-br from-cyan-50/50 via-blue-50/30 dark:from-cyan-950/20 dark:via-blue-950/10 to-white dark:to-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <i class="fas fa-history mr-2 text-cyan-500"></i> Recent Searches
          </h3>
          {#if $searchHistory.length === 0}
            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
              <i class="fas fa-search text-2xl mb-2 text-gray-300 dark:text-gray-600"></i>
              <p class="text-sm">No recent searches</p>
            </div>
          {:else}
            <div class="space-y-2">
              {#each $searchHistory as entry}
                <button
                  class="w-full text-left p-3 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/50 transition group border border-transparent hover:border-cyan-200 dark:hover:border-cyan-800"
                  on:click={() => {
                    searchTerm = entry.word;
                    searchWord(entry.word);
                  }}
                >
                  <div class="text-gray-900 dark:text-white font-medium group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                    {entry.word}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(entry.timestamp)}
                  </div>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>