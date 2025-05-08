<!-- filepath: /home/linux/learnflow-app/learnflow-app/src/lib/components/pip/PipDictionary.svelte -->
<script lang="ts">
  interface Definition {
    definition: string;
    example?: string;
  }

  interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
  }

  interface DictionaryResult {
    word: string;
    phonetic?: string;
    meanings: Meaning[];
  }

  let searchTerm = '';
  let searching = false;
  let result: DictionaryResult | null = null;
  let error: string | null = null;

  async function lookupWord(term: string): Promise<void> {
    if (!term.trim()) return;
    
    searching = true;
    error = null;
    result = null;
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error('Word not found');
      const data = await response.json();
      result = data[0] as DictionaryResult;
    } catch (e: any) {
      error = e.message;
    } finally {
      searching = false;
    }
  }

  function handleSubmit() {
    if (searchTerm.trim()) {
      lookupWord(searchTerm);
    }
  }
</script>

<div class="bg-gray-700 p-2 rounded-lg">
  <h4 class="text-xs font-medium text-cyan-300 uppercase mb-2">Dictionary</h4>
  
  <form on:submit|preventDefault={handleSubmit} class="mb-3">
    <div class="flex gap-2">
      <input
        type="text"
        bind:value={searchTerm}
        placeholder="Enter a word..."
        class="flex-1 px-3 py-1.5 bg-gray-800 text-gray-100 rounded border border-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
      >
      <button
        type="submit"
        class="px-3 py-1.5 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition disabled:opacity-50"
        disabled={searching || !searchTerm.trim()}
      >
        {#if searching}
          <i class="fas fa-spinner fa-spin"></i>
        {:else}
          <i class="fas fa-search"></i>
        {/if}
      </button>
    </div>
  </form>

  {#if error}
    <div class="text-center p-4 text-red-400">
      <i class="fas fa-exclamation-circle mb-2 text-xl"></i>
      <p class="text-sm">{error}</p>
    </div>
  {:else if result}
    <div class="space-y-3">
      <div>
        <div class="flex items-baseline gap-2 mb-1">
          <h3 class="text-lg font-bold text-gray-100">{result.word}</h3>
          {#if result.phonetic}
            <span class="text-sm text-gray-400">{result.phonetic}</span>
          {/if}
        </div>
        {#if result.meanings?.[0]?.definitions?.[0]}
          <p class="text-sm text-gray-300">{result.meanings[0].definitions[0].definition}</p>
        {/if}
      </div>

      {#if result.meanings?.length > 0}
        <div class="border-t border-gray-600 pt-2">
          {#each result.meanings.slice(0, 2) as meaning}
            <div class="mb-2">
              <span class="text-xs font-medium text-cyan-400">{meaning.partOfSpeech}</span>
              <ul class="mt-1 space-y-1">
                {#each meaning.definitions.slice(0, 2) as def}
                  <li class="text-sm text-gray-300">• {def.definition}</li>
                  {#if def.example}
                    <li class="text-xs text-gray-400 italic ml-4">"{def.example}"</li>
                  {/if}
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {:else}
    <div class="text-center p-4 text-gray-400">
      <i class="fas fa-book mb-2 text-xl"></i>
      <p class="text-sm">Search for a word to see its definition</p>
    </div>
  {/if}
</div>