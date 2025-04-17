<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/authStore.js';
  import { subscribedTopics } from '$lib/stores/forumStore';
  import { goto } from '$app/navigation';

  export let data;
  let topics = data.topics;
  let categories = data.categories;
  let categoryId = $page.params.categoryId;
  let category = categories.find(c => c.id === categoryId);

  // Filter topics by category
  $: filteredTopics = topics.filter(t => t.category === categoryId);

  function handleBack() {
    goto('/forums');
  }
</script>

<svelte:head>
  <title>{category ? category.name : 'Category'} | Forums</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-7xl">
  <button class="mb-4 text-indigo-600 hover:underline" on:click={handleBack}>&larr; Back to Forums</button>
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{category ? category.name : 'Category'}</h1>
  <p class="text-gray-600 dark:text-gray-400 mb-6">{category?.description}</p>

  {#if filteredTopics.length === 0}
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
      <div class="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mx-auto flex items-center justify-center mb-4">
        <i class="fas fa-comments text-indigo-600 dark:text-indigo-400 text-2xl"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No discussions found in this category</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">Be the first to start a discussion!</p>
      <a href="/forums" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors">Back to Forums</a>
    </div>
  {:else}
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        {#each filteredTopics as topic (topic.id)}
          <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex justify-between items-start">
            <div class="flex-1">
              <a href="/forums/{topic.id}" class="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{topic.title}</a>
              <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Started by {topic.author.name} · {new Date(topic.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div class="ml-4 flex flex-col items-end gap-2">
              {#if $subscribedTopics.includes(topic.id)}
                <button class="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800">
                  <i class="fas fa-bell-slash mr-1"></i> Unsubscribe
                </button>
              {:else}
                <button class="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800">
                  <i class="fas fa-bell mr-1"></i> Subscribe
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
