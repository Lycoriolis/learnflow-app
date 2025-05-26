<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import Icon from '@iconify/svelte';
  import { exerciseBookmarkService, type ExerciseBookmark, type BookmarkCollection } from '$lib/services/exercises/exerciseBookmarkService';
  import { createEventDispatcher } from 'svelte';

  export let className = '';
  export let compact = false;

  const dispatch = createEventDispatcher<{
    select: { bookmark: ExerciseBookmark };
    navigate: { url: string };
  }>();

  let bookmarks: ExerciseBookmark[] = [];
  let collections: BookmarkCollection[] = [];
  let filteredBookmarks: ExerciseBookmark[] = [];
  let selectedCollection: string | null = null;
  let searchQuery = '';
  let selectedTags: string[] = [];
  let sortBy: 'date' | 'title' | 'category' | 'difficulty' = 'date';
  let sortOrder: 'asc' | 'desc' = 'desc';
  let loading = true;
  let error: string | null = null;

  // Collection management
  let showCreateCollection = false;
  let newCollectionName = '';
  let newCollectionDescription = '';
  let editingCollection: BookmarkCollection | null = null;

  // Bulk operations
  let selectedBookmarks = new Set<string>();
  let showBulkActions = false;

  let availableTags: string[] = [];

  onMount(async () => {
    if (!browser) return;
    await loadData();
  });

  async function loadData() {
    loading = true;
    error = null;
    
    try {
      [bookmarks, collections] = await Promise.all([
        exerciseBookmarkService.getAllBookmarks(),
        exerciseBookmarkService.getAllCollections()
      ]);
      
      // Extract all unique tags
      availableTags = [...new Set(bookmarks.flatMap(b => b.tags || []))].sort();
      
      applyFilters();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load bookmarks';
      console.error('Bookmark loading error:', err);
    } finally {
      loading = false;
    }
  }

  function applyFilters() {
    let filtered = [...bookmarks];

    // Filter by collection
    if (selectedCollection) {
      const collection = collections.find(c => c.id === selectedCollection);
      if (collection) {
        filtered = filtered.filter(b => collection.bookmarkIds.includes(b.id));
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query) ||
        (b.tags || []).some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(b =>
        selectedTags.every(tag => (b.tags || []).includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
          const aDiff = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
          const bDiff = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
          comparison = aDiff - bDiff;
          break;
        case 'date':
        default:
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    filteredBookmarks = filtered;
  }

  // Reactive updates
  $: {
    if (bookmarks.length > 0) {
      applyFilters();
    }
  }

  async function createCollection() {
    if (!newCollectionName.trim()) return;

    try {
      await exerciseBookmarkService.createCollection(
        newCollectionName,
        newCollectionDescription || undefined
      );
      newCollectionName = '';
      newCollectionDescription = '';
      showCreateCollection = false;
      await loadData();
    } catch (err) {
      console.error('Failed to create collection:', err);
    }
  }

  async function deleteCollection(collectionId: string) {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      await exerciseBookmarkService.deleteCollection(collectionId);
      if (selectedCollection === collectionId) {
        selectedCollection = null;
      }
      await loadData();
    } catch (err) {
      console.error('Failed to delete collection:', err);
    }
  }

  async function addToCollection(bookmarkId: string, collectionId: string) {
    try {
      await exerciseBookmarkService.addToCollection(collectionId, bookmarkId);
      await loadData();
    } catch (err) {
      console.error('Failed to add to collection:', err);
    }
  }

  async function removeFromCollection(bookmarkId: string, collectionId: string) {
    try {
      await exerciseBookmarkService.removeFromCollection(collectionId, bookmarkId);
      await loadData();
    } catch (err) {
      console.error('Failed to remove from collection:', err);
    }
  }

  async function deleteBookmark(bookmarkId: string) {
    if (!confirm('Are you sure you want to delete this bookmark?')) return;

    try {
      await exerciseBookmarkService.removeBookmark(bookmarkId);
      await loadData();
    } catch (err) {
      console.error('Failed to delete bookmark:', err);
    }
  }

  function toggleBookmarkSelection(bookmarkId: string) {
    if (selectedBookmarks.has(bookmarkId)) {
      selectedBookmarks.delete(bookmarkId);
    } else {
      selectedBookmarks.add(bookmarkId);
    }
    selectedBookmarks = selectedBookmarks; // Trigger reactivity
    showBulkActions = selectedBookmarks.size > 0;
  }

  function selectAllBookmarks() {
    selectedBookmarks = new Set(filteredBookmarks.map(b => b.id));
    showBulkActions = true;
  }

  function clearSelection() {
    selectedBookmarks.clear();
    selectedBookmarks = selectedBookmarks;
    showBulkActions = false;
  }

  async function bulkAddToCollection(collectionId: string) {
    try {
      const promises = Array.from(selectedBookmarks).map(bookmarkId =>
        exerciseBookmarkService.addToCollection(collectionId, bookmarkId)
      );
      await Promise.all(promises);
      clearSelection();
      await loadData();
    } catch (err) {
      console.error('Failed to bulk add to collection:', err);
    }
  }

  async function bulkDelete() {
    if (!confirm(`Are you sure you want to delete ${selectedBookmarks.size} bookmarks?`)) return;

    try {
      const promises = Array.from(selectedBookmarks).map(bookmarkId =>
        exerciseBookmarkService.removeBookmark(bookmarkId)
      );
      await Promise.all(promises);
      clearSelection();
      await loadData();
    } catch (err) {
      console.error('Failed to bulk delete bookmarks:', err);
    }
  }

  function handleBookmarkClick(bookmark: ExerciseBookmark) {
    dispatch('select', { bookmark });
  }

  function handleNavigate(bookmark: ExerciseBookmark) {
    dispatch('navigate', { url: bookmark.url });
  }

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(t => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
  }

  function getDifficultyColor(difficulty?: string) {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg {className}">
  <div class="p-6 border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        Bookmark Manager
      </h2>
      <div class="flex items-center space-x-2">
        {#if showBulkActions}
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {selectedBookmarks.size} selected
          </span>
        {/if}
        <button
          on:click={() => showCreateCollection = true}
          class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Icon icon="mdi:folder-plus" class="h-4 w-4 mr-2" />
          New Collection
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="space-y-4">
      <!-- Search -->
      <div class="relative">
        <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search bookmarks..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <!-- Filters Row -->
      <div class="flex flex-wrap gap-4 items-center">
        <!-- Collection Filter -->
        <select
          bind:value={selectedCollection}
          class="block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          <option value={null}>All Collections</option>
          {#each collections as collection}
            <option value={collection.id}>{collection.name}</option>
          {/each}
        </select>

        <!-- Sort Options -->
        <select
          bind:value={sortBy}
          class="block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
          <option value="category">Sort by Category</option>
          <option value="difficulty">Sort by Difficulty</option>
        </select>

        <button
          on:click={() => sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'}
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          title="Toggle sort order"
        >
          <Icon icon={sortOrder === 'asc' ? 'mdi:sort-ascending' : 'mdi:sort-descending'} class="h-5 w-5" />
        </button>
      </div>

      <!-- Tag Filter -->
      {#if availableTags.length > 0}
        <div class="flex flex-wrap gap-2">
          {#each availableTags as tag}
            <button
              on:click={() => toggleTag(tag)}
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors {
                selectedTags.includes(tag)
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }"
            >
              <Icon icon="mdi:tag" class="h-3 w-3 mr-1" />
              {tag}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Bulk Actions Bar -->
  {#if showBulkActions}
    <div class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-6 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            on:click={clearSelection}
            class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Clear selection
          </button>
          <button
            on:click={selectAllBookmarks}
            class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Select all ({filteredBookmarks.length})
          </button>
        </div>
        <div class="flex items-center space-x-2">
          {#if collections.length > 0}
            <select
              on:change={(e) => bulkAddToCollection(e.currentTarget.value)}
              class="text-sm border border-blue-300 dark:border-blue-700 rounded px-2 py-1"
            >
              <option value="">Add to collection...</option>
              {#each collections as collection}
                <option value={collection.id}>{collection.name}</option>
              {/each}
            </select>
          {/if}
          <button
            on:click={bulkDelete}
            class="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          >
            <Icon icon="mdi:delete" class="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Content -->
  <div class="p-6">
    {#if loading}
      <div class="flex items-center justify-center h-32">
        <div class="flex items-center space-x-2">
          <Icon icon="mdi:loading" class="h-6 w-6 animate-spin text-indigo-600" />
          <span class="text-gray-600 dark:text-gray-400">Loading bookmarks...</span>
        </div>
      </div>
    {:else if error}
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
        <div class="flex">
          <Icon icon="mdi:alert-circle" class="h-5 w-5 text-red-400 mt-0.5" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-400">Error</h3>
            <p class="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    {:else if filteredBookmarks.length === 0}
      <div class="text-center py-12">
        <Icon icon="mdi:bookmark-outline" class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No bookmarks found</h3>
        <p class="text-gray-500 dark:text-gray-400">
          {bookmarks.length === 0 ? 'You haven\'t bookmarked any exercises yet.' : 'No bookmarks match your current filters.'}
        </p>
      </div>
    {:else}
      <!-- Bookmarks Grid -->
      <div class="grid grid-cols-1 {compact ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-4">
        {#each filteredBookmarks as bookmark}
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-3 flex-1">
                <input
                  type="checkbox"
                  checked={selectedBookmarks.has(bookmark.id)}
                  on:change={() => toggleBookmarkSelection(bookmark.id)}
                  class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div class="flex-1 min-w-0">
                  <button
                    on:click={() => handleBookmarkClick(bookmark)}
                    class="text-left w-full group"
                  >
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                      {bookmark.title}
                    </h3>
                  </button>
                  
                  <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="capitalize">{bookmark.category}</span>
                    {#if bookmark.difficulty}
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {getDifficultyColor(bookmark.difficulty)}">
                        {bookmark.difficulty}
                      </span>
                    {/if}
                    <span>{formatDate(bookmark.createdAt)}</span>
                  </div>

                  {#if bookmark.tags && bookmark.tags.length > 0}
                    <div class="flex flex-wrap gap-1 mt-2">
                      {#each bookmark.tags as tag}
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {tag}
                        </span>
                      {/each}
                    </div>
                  {/if}
                </div>
              </div>

              <div class="flex items-center space-x-2 ml-4">
                <button
                  on:click={() => handleNavigate(bookmark)}
                  class="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                  title="Open exercise"
                >
                  <Icon icon="mdi:open-in-new" class="h-4 w-4" />
                </button>
                <button
                  on:click={() => deleteBookmark(bookmark.id)}
                  class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  title="Delete bookmark"
                >
                  <Icon icon="mdi:delete" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Create Collection Modal -->
{#if showCreateCollection}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Collection</h3>
        <div class="space-y-4">
          <div>
            <label for="collection-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Collection Name
            </label>
            <input
              id="collection-name"
              type="text"
              bind:value={newCollectionName}
              placeholder="Enter collection name"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label for="collection-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (optional)
            </label>
            <textarea
              id="collection-description"
              bind:value={newCollectionDescription}
              placeholder="Enter collection description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>
        </div>
        <div class="flex items-center justify-end space-x-3 mt-6">
          <button
            on:click={() => showCreateCollection = false}
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            on:click={createCollection}
            disabled={!newCollectionName.trim()}
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
