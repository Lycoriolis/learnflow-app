<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { user } from '$lib/stores/authStore.js';

  interface Category {
    id: string; // Or number, depending on your data model
    name: string;
  }
  export let categories: Category[] = [];

  let title = '';
  let content = '';
  let category_id = '';
  let isLoading = false;
  let errorMessage = '';
  const dispatch = createEventDispatcher();

  $: currentUser = $user;

  async function handleSubmit() {
    if (!title.trim() || !content.trim() || !category_id) {
      errorMessage = 'Please enter title, content, and select a category.';
      return;
    }
    if (!currentUser || !currentUser.uid) {
      errorMessage = 'You must be logged in to create a topic.';
      return;
    }
    isLoading = true;
    errorMessage = '';
    const newTopicData = {
      title: title.trim(),
      content: content.trim(),
      category_id,
      author_id: currentUser.uid
    };
    try {
      const response = await fetch('/api/forum/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTopicData)
      });
      if (response.ok) {
        const createdTopic = await response.json();
        dispatch('topicCreated', createdTopic);
        title = '';
        content = '';
        category_id = '';
        alert('Topic created successfully!');
      } else {
        const errorData = await response.json();
        errorMessage = `Failed to create topic: ${errorData.error || response.statusText}. Please try again.`;
      }
    } catch (error) {
      errorMessage = 'An unexpected error occurred. Please check the console and try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="create-topic-form p-4 border rounded shadow-md">
  <h3 class="text-xl font-semibold mb-4">Create New Topic</h3>
  <form on:submit|preventDefault={handleSubmit}>
    {#if errorMessage}
      <div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {errorMessage}
      </div>
    {/if}
    <div class="mb-4">
      <label for="topic-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
      <input 
        type="text" 
        id="topic-title" 
        bind:value={title} 
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        required
        disabled={isLoading}
      />
    </div>
    <div class="mb-4">
      <label for="topic-category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
      <select
        id="topic-category"
        bind:value={category_id}
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        required
        disabled={isLoading}
      >
        <option value="" disabled selected>Select a category</option>
        {#each categories as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    </div>
    <div class="mb-4">
      <label for="topic-content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
      <textarea 
        id="topic-content" 
        bind:value={content} 
        rows="5" 
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        required
        disabled={isLoading}
      ></textarea>
    </div>
    <button 
      type="submit" 
      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isLoading}
    >
      {#if isLoading}
        Creating...
      {:else}
        Create Topic
      {/if}
    </button>
  </form>
</div>