<script lang="ts">
  import { persistentStore } from '../../stores/persistentStore';
  import { browser } from '$app/environment';

  interface Flashcard {
    id: string;
    front: string;
    back: string;
    lastReviewed?: number;
    nextReview?: number;
    level: number; // 0-5 for spaced repetition
  }

  const flashcards = persistentStore<Flashcard[]>('learnflow-flashcards', []);
  let currentCard: Flashcard | null = null;
  let showingFront = true;
  let newCardFront = '';
  let newCardBack = '';

  // Get next card based on spaced repetition algorithm
  function getNextCard(): Flashcard | null {
    const now = Date.now();
    const cards = $flashcards.filter(card => !card.nextReview || card.nextReview <= now);
    if (cards.length === 0) return null;
    return cards[Math.floor(Math.random() * cards.length)];
  }

  function addCard() {
    if (!newCardFront.trim() || !newCardBack.trim()) return;
    
    // Generate UUID in a browser-safe way
    const id = browser && window.crypto ? 
      crypto.randomUUID() : 
      `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const card: Flashcard = {
      id,
      front: newCardFront,
      back: newCardBack,
      level: 0
    };
    
    flashcards.update(cards => [...cards, card]);
    newCardFront = '';
    newCardBack = '';
  }

  function flipCard() {
    showingFront = !showingFront;
  }

  function reviewCard(success: boolean) {
    if (!currentCard) return;
    
    const now = Date.now();
    let nextLevel = success ? currentCard.level + 1 : Math.max(0, currentCard.level - 1);
    nextLevel = Math.min(5, nextLevel);
    
    // Calculate next review time using spaced repetition
    const intervals = [
      1000 * 60 * 30,        // 30 minutes
      1000 * 60 * 60 * 4,    // 4 hours
      1000 * 60 * 60 * 24,   // 1 day
      1000 * 60 * 60 * 24 * 3,  // 3 days
      1000 * 60 * 60 * 24 * 7,  // 1 week
      1000 * 60 * 60 * 24 * 14  // 2 weeks
    ];

    // Fix: Safely access currentCard properties with null check
    const cardId = currentCard?.id;
    if (cardId) {
      flashcards.update(cards => 
        cards.map(card => 
          card.id === cardId 
            ? {
                ...card,
                level: nextLevel,
                lastReviewed: now,
                nextReview: now + intervals[nextLevel]
              }
            : card
        )
      );
    }

    // Move to next card
    currentCard = getNextCard();
    showingFront = true;
  }

  function handleCardKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      flipCard();
    }
  }

  // Start reviewing only in browser environment
  $: if (browser && !currentCard && $flashcards.length > 0) {
    currentCard = getNextCard();
  }
</script>

<div class="bg-gray-700 p-2 rounded-lg">
  <h4 class="text-xs font-medium text-orange-300 uppercase mb-2">Flashcards</h4>

  {#if $flashcards.length === 0}
    <!-- Add first card form -->
    <div class="text-center p-4">
      <p class="text-gray-300 text-sm mb-4">Create your first flashcard:</p>
      <div class="space-y-2">
        <input
          type="text"
          bind:value={newCardFront}
          placeholder="Front side..."
          class="w-full p-2 rounded bg-gray-600 text-gray-100 text-sm border border-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        />
        <textarea
          bind:value={newCardBack}
          placeholder="Back side..."
          rows="2"
          class="w-full p-2 rounded bg-gray-600 text-gray-100 text-sm border border-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
        ></textarea>
        <button
          on:click={addCard}
          class="w-full py-2 bg-orange-600 text-white rounded font-medium hover:bg-orange-700 transition"
        >
          Add Card
        </button>
      </div>
    </div>
  {:else}
    <!-- Review interface -->
    {#if currentCard}
      <div class="p-4">
        <div
          role="button"
          tabindex="0"
          class="min-h-[120px] p-4 bg-gray-800 rounded-lg shadow-inner flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.02] select-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          on:click={flipCard}
          on:keydown={handleCardKeydown}
        >
          <p class="text-gray-100 text-center">
            {showingFront ? currentCard.front : currentCard.back}
          </p>
        </div>
        
        <div class="flex justify-between mt-4">
          <button
            on:click={() => reviewCard(false)}
            class="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition"
            aria-label="Mark card as difficult"
          >
            Again
          </button>
          <button
            on:click={() => reviewCard(true)}
            class="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition"
            aria-label="Mark card as known"
          >
            Good
          </button>
        </div>
      </div>
    {:else}
      <div class="text-center p-4">
        <p class="text-gray-300">No cards due for review!</p>
      </div>
    {/if}

    <!-- Add new card button -->
    <div class="mt-2 border-t border-gray-600 pt-2">
      <details class="text-sm">
        <summary class="text-gray-300 cursor-pointer hover:text-gray-100">Add New Card</summary>
        <div class="mt-2 space-y-2">
          <input
            type="text"
            bind:value={newCardFront}
            placeholder="Front side..."
            class="w-full p-2 rounded bg-gray-600 text-gray-100 text-sm border border-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
          <textarea
            bind:value={newCardBack}
            placeholder="Back side..."
            rows="2"
            class="w-full p-2 rounded bg-gray-600 text-gray-100 text-sm border border-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          ></textarea>
          <button
            on:click={addCard}
            class="w-full py-2 bg-orange-600 text-white rounded font-medium hover:bg-orange-700 transition"
          >
            Add Card
          </button>
        </div>
      </details>
    </div>
  {/if}
</div>