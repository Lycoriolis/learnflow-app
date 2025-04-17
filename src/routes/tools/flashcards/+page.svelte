<!-- filepath: /home/linux/learnflow-app/learnflow-app/src/routes/tools/flashcards/+page.svelte -->
<script lang="ts">
  import { writable } from 'svelte/store';
  import { persistentStore } from '$lib/stores/persistentStore';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  interface Flashcard {
    id: string;
    front: string;
    back: string;
    lastReviewed?: number;
    nextReview?: number;
    level: number;
    tags: string[];
  }

  const flashcards = persistentStore<Flashcard[]>('learnflow-flashcards', []);
  let currentCard: Flashcard | null = null;
  let showingFront = true;
  let newCardFront = '';
  let newCardBack = '';
  let newCardTags = '';
  let filterTag = '';
  let sortBy: 'nextReview' | 'level' | 'created' = 'nextReview';
  let showStats = false;

  $: filteredCards = filterTag 
    ? $flashcards.filter(card => card.tags.includes(filterTag))
    : $flashcards;

  $: sortedCards = [...filteredCards].sort((a, b) => {
    if (sortBy === 'nextReview') {
      return (a.nextReview || 0) - (b.nextReview || 0);
    } else if (sortBy === 'level') {
      return b.level - a.level;
    } else {
      return (a.lastReviewed || 0) - (b.lastReviewed || 0);
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
      tags: newCardTags.split(',').map(t => t.trim()).filter(t => t)
    };
    
    flashcards.update(cards => [...cards, card]);
    newCardFront = '';
    newCardBack = '';
    newCardTags = '';
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

  // Get all unique tags
  $: uniqueTags = Array.from(new Set($flashcards.flatMap(c => c.tags)));

  // Start reviewing
  $: if (!currentCard) {
    currentCard = getNextCard();
  }
</script>

<svelte:head>
  <title>Flashcards | LearnFlow</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-10">
  <div class="flex justify-between items-start mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
        <i class="fas fa-layer-group mr-3 text-orange-500"></i> Flashcards
      </h1>
      <p class="text-gray-600 dark:text-gray-400">Study smarter with spaced repetition flashcards</p>
    </div>
    <button 
      class="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      on:click={() => showStats = !showStats}
    >
      <i class="fas fa-chart-bar mr-2"></i> Stats
    </button>
  </div>

  {#if showStats}
    <div 
      class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8"
      transition:fade
    >
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="text-sm text-gray-500 dark:text-gray-400">Total Cards</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="text-sm text-gray-500 dark:text-gray-400">Mastered</div>
        <div class="text-2xl font-bold text-green-600">{stats.mastered}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="text-sm text-gray-500 dark:text-gray-400">Due Today</div>
        <div class="text-2xl font-bold text-orange-500">{stats.dueToday}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div class="text-sm text-gray-500 dark:text-gray-400">Average Level</div>
        <div class="text-2xl font-bold text-indigo-500">{stats.avgLevel}</div>
      </div>
    </div>
  {/if}

  <!-- Controls -->
  <div class="flex flex-wrap gap-4 mb-8">
    <select
      bind:value={filterTag}
      class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
    >
      <option value="">All Tags</option>
      {#each uniqueTags as tag}
        <option value={tag}>{tag}</option>
      {/each}
    </select>

    <select
      bind:value={sortBy}
      class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
    >
      <option value="nextReview">Sort by Due Date</option>
      <option value="level">Sort by Level</option>
      <option value="created">Sort by Created</option>
    </select>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
    <!-- Study Area -->
    <div class="lg:col-span-3">
      {#if currentCard}
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div class="mb-4 flex justify-between items-center">
            <div class="flex gap-2">
              {#each currentCard.tags as tag}
                <span class="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded text-xs">{tag}</span>
              {/each}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Level: {currentCard.level}/5
            </div>
          </div>

          <div
            class="min-h-[200px] p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner flex items-center justify-center cursor-pointer select-none mb-6"
            on:click={flipCard}
            transition:fade
          >
            <div class="prose dark:prose-invert max-w-none text-center">
              {showingFront ? currentCard.front : currentCard.back}
            </div>
          </div>

          <div class="flex justify-between">
            <button
              on:click={() => reviewCard(false)}
              class="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center"
            >
              <i class="fas fa-times mr-2"></i> Again
            </button>
            <button
              on:click={() => deleteCard(currentCard.id)}
              class="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
            <button
              on:click={() => reviewCard(true)}
              class="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center"
            >
              <i class="fas fa-check mr-2"></i> Good
            </button>
          </div>
        </div>
      {:else}
        <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
          <i class="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">All Caught Up!</h3>
          <p class="text-gray-600 dark:text-gray-400">No cards due for review. Add new cards or check back later.</p>
        </div>
      {/if}
    </div>

    <!-- Add New Card -->
    <div class="lg:col-span-2">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New Card</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Front</label>
            <textarea
              bind:value={newCardFront}
              rows="3"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg"
              placeholder="Question or term..."
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Back</label>
            <textarea
              bind:value={newCardBack}
              rows="3"
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg"
              placeholder="Answer or definition..."
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
            <input
              type="text"
              bind:value={newCardTags}
              class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg"
              placeholder="math, history, etc (comma separated)"
            />
          </div>
          <button
            on:click={addCard}
            class="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition"
            disabled={!newCardFront.trim() || !newCardBack.trim()}
          >
            <i class="fas fa-plus mr-2"></i> Add Card
          </button>
        </div>
      </div>
    </div>
  </div>
</div>