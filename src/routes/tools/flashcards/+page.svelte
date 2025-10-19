<script lang="ts">
  import { persistentStore } from '$lib/stores/persistentStore';
  import { fade } from 'svelte/transition';

  interface Flashcard {
    id: string;
    front: string;
    back: string;
    tags: string[];
    lastReviewed?: number;
    nextReview?: number;
    level: number;
    createdAt: number;
  }

  const flashcards = persistentStore<Flashcard[]>('learnflow-flashcards', []);
  let currentCard: Flashcard | null = null;
  let showingFront = true;
  let newCardFront = '';
  let newCardBack = '';
  let newCardTags = '';
  let filterTag = '';
  let sortBy: 'nextReview' | 'level' | 'created' = 'nextReview';

  $: filteredCards = filterTag 
    ? $flashcards.filter(card => card.tags.includes(filterTag))
    : $flashcards;

  $: sortedCards = [...filteredCards].sort((a, b) => {
    if (sortBy === 'nextReview') {
      return (a.nextReview || 0) - (b.nextReview || 0);
    } else if (sortBy === 'level') {
      return b.level - a.level;
    } else {
      return (a.createdAt || 0) - (b.createdAt || 0);
    }
  });

  $: stats = {
    total: $flashcards.length,
    mastered: $flashcards.filter(c => c.level === 5).length,
    dueToday: $flashcards.filter(c => !c.nextReview || c.nextReview <= Date.now()).length,
    avgLevel: $flashcards.length ? 
      Math.round($flashcards.reduce((sum, c) => sum + c.level, 0) / $flashcards.length * 10) / 10 
      : 0
  };

  function getNextCard(): Flashcard | null {
    const now = Date.now();
    const dueCards = sortedCards.filter(card => !card.nextReview || card.nextReview <= now);
    if (dueCards.length === 0) return null;
    return dueCards[0];
  }

  function addCard() {
    if (!newCardFront.trim() || !newCardBack.trim()) return;
    
    const card: Flashcard = {
      id: crypto.randomUUID(),
      front: newCardFront,
      back: newCardBack,
      level: 0,
      tags: newCardTags.split(',').map(t => t.trim()).filter(t => t),
      createdAt: Date.now()
    };
    
    flashcards.update(cards => [...cards, card]);
    newCardFront = '';
    newCardBack = '';
    newCardTags = '';
  }

  function flipCard() {
    showingFront = !showingFront;
  }

  async function reviewCard(success: boolean) {
    if (!currentCard) return;
    
    const now = Date.now();
    let nextLevel = success ? currentCard.level + 1 : Math.max(0, currentCard.level - 1);
    nextLevel = Math.min(5, nextLevel);
    
    const intervals = [
      1000 * 60 * 30,
      1000 * 60 * 60 * 4,
      1000 * 60 * 60 * 24,
      1000 * 60 * 60 * 24 * 3,
      1000 * 60 * 60 * 24 * 7,
      1000 * 60 * 60 * 24 * 14
    ];

    flashcards.update(cards => 
      cards.map(card => 
        card.id === currentCard.id 
          ? {
              ...card,
              level: nextLevel,
              lastReviewed: now,
              nextReview: now + intervals[nextLevel]
            }
          : card
      )
    );

    currentCard = getNextCard();
    showingFront = true;
  }

  function deleteCard(id: string) {
    if (!confirm('Are you sure you want to delete this card?')) return;
    flashcards.update(cards => cards.filter(c => c.id !== id));
    if (currentCard?.id === id) {
      currentCard = getNextCard();
      showingFront = true;
    }
  }

  function handleCardKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      flipCard();
    }
  }

  $: uniqueTags = Array.from(new Set($flashcards.flatMap(c => c.tags)));

  $: if (!currentCard) {
    currentCard = getNextCard();
  }
</script>

<svelte:head>
  <title>Flashcards | LearnFlow</title>
</svelte:head>

<div class="flex flex-col h-[85vh] max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden mt-6 border border-gray-200 dark:border-gray-800">
  <!-- Header -->
  <div class="bg-gradient-to-br from-orange-50/80 via-amber-50/50 dark:from-orange-950/30 dark:via-amber-950/20 to-white dark:to-gray-900 p-6 border-b border-gray-200 dark:border-gray-800">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 flex items-center">
        <i class="fas fa-layer-group mr-3"></i> Flashcards
      </h1>
      <div class="flex gap-2">
        <button 
          class="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
          on:click={getNextCard}
          title="Get next card"
          aria-label="Get next card"
        >
          <i class="fas fa-arrow-right"></i>
        </button>
        <button 
          class="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          on:click={addCard}
          disabled={!newCardFront.trim() || !newCardBack.trim()}
          title="Add new card"
          aria-label="Add new card"
        >
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
    <p class="text-gray-600 dark:text-gray-300 mt-2">Study smarter with spaced repetition flashcards</p>
  </div>

  <!-- Main Content -->
  <div class="flex-1 overflow-hidden">
    <div class="grid grid-cols-1 lg:grid-cols-3 h-full gap-0">
      <!-- Main Card Area -->
      <div class="lg:col-span-2 p-6 bg-gradient-to-br from-white via-orange-50/30 dark:from-gray-900 dark:via-orange-950/10 to-amber-50/20 dark:to-amber-950/5 flex items-center justify-center">
        {#if currentCard}
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl">
            <div class="mb-4 flex justify-between items-center">
              <div class="flex gap-2 flex-wrap">
                {#each currentCard.tags as tag}
                  <span class="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">{tag}</span>
                {/each}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Level: {currentCard.level}/5
              </div>
            </div>

            <div
              role="button"
              tabindex="0"
              class="min-h-[250px] p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 rounded-xl shadow-inner flex items-center justify-center cursor-pointer select-none mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500 border-2 border-dashed border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700 transition"
              on:click={flipCard}
              on:keydown={handleCardKeydown}
              transition:fade
            >
              <div class="prose dark:prose-invert max-w-none text-center">
                {showingFront ? currentCard.front : currentCard.back}
              </div>
            </div>

            <div class="flex justify-between gap-3">
              <button
                on:click={() => reviewCard(false)}
                class="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 flex items-center justify-center"
              >
                <i class="fas fa-times mr-2"></i> Again
              </button>
              <button
                on:click={() => deleteCard(currentCard.id)}
                class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                title="Delete card"
                aria-label="Delete card"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
              <button
                on:click={() => reviewCard(true)}
                class="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 flex items-center justify-center"
              >
                <i class="fas fa-check mr-2"></i> Good
              </button>
            </div>
          </div>
        {:else}
          <div class="bg-white dark:bg-gray-800 p-12 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center w-full max-w-2xl">
            <i class="fas fa-check-circle text-green-500 text-6xl mb-6"></i>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">All Caught Up!</h3>
            <p class="text-gray-600 dark:text-gray-400 text-lg">No cards due for review. Add new cards or check back later.</p>
          </div>
        {/if}
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1 p-6 bg-gradient-to-br from-orange-50/50 via-amber-50/30 dark:from-orange-950/20 dark:via-amber-950/10 to-white dark:to-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
        <div class="space-y-6">
          <!-- Stats -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <i class="fas fa-chart-bar mr-2 text-orange-500"></i> Statistics
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Total Cards</span>
                <span class="font-semibold text-orange-600 dark:text-orange-400">{stats.total}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Mastered</span>
                <span class="font-semibold text-green-600 dark:text-green-400">{stats.mastered}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Due Today</span>
                <span class="font-semibold text-red-600 dark:text-red-400">{stats.dueToday}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Avg Level</span>
                <span class="font-semibold text-blue-600 dark:text-blue-400">{stats.avgLevel}</span>
              </div>
            </div>
          </div>

          <!-- Add New Card -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <i class="fas fa-plus-circle mr-2 text-green-500"></i> Add New Card
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Front</label>
                <textarea
                  bind:value={newCardFront}
                  rows="3"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                  placeholder="Question or term..."
                  aria-label="Flashcard front side content"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Back</label>
                <textarea
                  bind:value={newCardBack}
                  rows="3"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                  placeholder="Answer or definition..."
                  aria-label="Flashcard back side content"
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                <input
                  type="text"
                  bind:value={newCardTags}
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                  placeholder="math, history, etc (comma separated)"
                />
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <i class="fas fa-filter mr-2 text-blue-500"></i> Filters
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Tag</label>
                <select
                  bind:value={filterTag}
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                >
                  <option value="">All Tags</option>
                  {#each [...new Set($flashcards.flatMap(card => card.tags))] as tag}
                    <option value={tag}>{tag}</option>
                  {/each}
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort by</label>
                <select
                  bind:value={sortBy}
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                >
                  <option value="nextReview">Next Review</option>
                  <option value="level">Level</option>
                  <option value="created">Created</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>