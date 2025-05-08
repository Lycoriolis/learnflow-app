<!-- filepath: /home/linux/learnflow-app/learnflow-app/src/lib/components/CourseFlashcardGenerator.svelte -->
<script lang="ts">
  import { flashcards } from '$lib/stores/pipStores';
  
  export let content: string = '';
  export let courseName: string = '';
  let generating = false;
  let generatedCards: Array<{front: string, back: string}> = [];
  
  // Simple content parsing to generate flashcards
  function generateCards() {
    generating = true;
    generatedCards = [];
    
    // Split content into sections by headers
    const sections = content.split(/#{2,3}\s+/);
    
    sections.forEach(section => {
      const lines = section.split('\n').filter(l => l.trim());
      if (lines.length < 2) return;
      
      // First line after header is usually a concept/term
      const term = lines[0].trim();
      
      // Next few lines usually contain the explanation
      const explanation = lines.slice(1, 4).join('\n').trim();
      
      if (term && explanation) {
        generatedCards.push({
          front: term,
          back: explanation
        });
      }
      
      // Look for lists that might be definitions
      const lists = section.match(/[-*]\s+(.+?):\s+(.+)/g);
      if (lists) {
        lists.forEach(item => {
          const [, term, def] = item.match(/[-*]\s+(.+?):\s+(.+)/) || [];
          if (term && def) {
            generatedCards.push({
              front: term,
              back: def
            });
          }
        });
      }
    });
    
    generating = false;
  }
  
  function addSelectedCards() {
    const selectedCards = generatedCards.filter(card => 
      !$flashcards.some(existing => 
        existing.front === card.front && existing.back === card.back
      )
    );
    
    if (selectedCards.length === 0) return;
    
    flashcards.update(cards => [
      ...cards,
      ...selectedCards.map(card => ({
        id: crypto.randomUUID(),
        front: card.front,
        back: card.back,
        level: 0,
        tags: [courseName.toLowerCase()]
      }))
    ]);
    
    generatedCards = [];
  }
</script>

<div class="space-y-4">
  <div class="flex justify-between items-center">
    <button
      on:click={generateCards}
      class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
      disabled={generating || !content}
    >
      {#if generating}
        <i class="fas fa-spinner fa-spin mr-2"></i>
      {:else}
        <i class="fas fa-magic mr-2"></i>
      {/if}
      Generate Flashcards
    </button>
    
    {#if generatedCards.length > 0}
      <button
        on:click={addSelectedCards}
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Add {generatedCards.length} Cards
      </button>
    {/if}
  </div>
  
  {#if generatedCards.length > 0}
    <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Generated Cards</h4>
      <div class="space-y-2">
        {#each generatedCards as card}
          <div class="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
            <div class="font-medium text-gray-900 dark:text-white">{card.front}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">{card.back}</div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>