<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { categories, topics, loadCategories, loadTopics, isLoading, error, getCategoryById } from '$lib/stores/forumStore';
  import CreateTopicForm from '$lib/components/forums/CreateTopicForm.svelte';
  import Icon from '@iconify/svelte';
  
  let categoryId = $page.params.id;
  let searchQuery = '';
  let filteredTopics: typeof $topics = [];
  let showCreateForm = false;
  let category: ReturnType<typeof getCategoryById>;
  
  $: {
    // Filter topics based on search query
    filteredTopics = searchQuery ? 
      $topics.filter(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchQuery.toLowerCase())
      ) : 
      $topics;
  }
  
  $: {
    category = getCategoryById(categoryId);
  }
  
  onMount(async () => {
    await loadCategories();
    await loadTopics(categoryId);
  });
  
  function toggleCreateForm() {
    showCreateForm = !showCreateForm;
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6">
    <a href="/forums" class="inline-flex items-center text-cherry-600 dark:text-cherry-400 hover:underline mb-4">
      <Icon icon="mdi:arrow-left" class="w-5 h-5 mr-1" />
      Back to Forums
    </a>
    
    {#if category}
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">{category.description}</p>
    {:else if !$isLoading}
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Category</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Loading category details...</p>
    {/if}
  </div>
  
  <div class="flex justify-between items-center mb-6">
    <div class="relative">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search topics..."
        class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"
      />
      <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
    
    <button 
      on:click={toggleCreateForm}
      class="px-4 py-2 bg-cherry-600 text-white rounded-md hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 transition-colors"
    >
      {showCreateForm ? 'Cancel' : 'Create New Topic'}
    </button>
  </div>
  
  {#if showCreateForm}
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <CreateTopicForm {categoryId} />
    </div>
  {/if}
  
  {#if $isLoading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cherry-500"></div>
    </div>
  {:else if $error}
    <div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6">
      <p>{$error}</p>
    </div>
  {:else if filteredTopics.length === 0}
    <div class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <Icon icon="mdi:forum-outline" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No topics found</h3>
      {#if searchQuery}
        <p class="text-gray-600 dark:text-gray-400">No topics match your search criteria.</p>
      {:else}
        <p class="text-gray-600 dark:text-gray-400">There are no topics in this category yet. Be the first to create one!</p>
      {/if}
    </div>
  {:else}
    <div class="space-y-4">
      {#each filteredTopics as topic}
        <a href="/forums/topic/{topic.id}" class="block">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow {topic.isPinned ? 'border-l-4 border-cherry-500 dark:border-cherry-400' : ''}">
            <div class="p-4">
              <div class="flex items-start">
                {#if topic.isPinned}
                  <div class="flex-shrink-0 mr-3">
                    <Icon icon="mdi:pin" class="w-5 h-5 text-cherry-600 dark:text-cherry-400" />
                  </div>
                {/if}
                
                <div class="flex-1">
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-1">{topic.title}</h4>
                  
                  <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>{topic.authorName || 'Unknown'}</span>
                    <span class="mx-2">•</span>
                    <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                    <span class="mx-2">•</span>
                    <span class="flex items-center">
                      <Icon icon="mdi:eye-outline" class="w-4 h-4 mr-1" />
                      {topic.viewCount}
                    </span>
                    <span class="mx-2">•</span>
                    <span class="flex items-center">
                      <Icon icon="mdi:comment-outline" class="w-4 h-4 mr-1" />
                      {topic.replyCount}
                    </span>
                  </div>
                  
                  {#if topic.tags && topic.tags.length > 0}
                    <div class="flex flex-wrap gap-2">
                      {#each topic.tags as tag}
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          {tag}
                        </span>
                      {/each}
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>