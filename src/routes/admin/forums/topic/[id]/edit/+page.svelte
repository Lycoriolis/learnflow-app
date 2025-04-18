<script lang="ts">
  import { fade } from 'svelte/transition';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  export let data: { topic: any, categories: any[] };
  let { topic, categories } = data;
  
  let title = topic.title;
  let content = topic.content;
  let categoryId = topic.category;
  let isPinned = topic.is_pinned || false;
  let isLocked = topic.is_locked || false;
  let saving = false;
  let errorMessage = '';
  let successMessage = '';
  
  async function handleSubmit() {
    saving = true;
    errorMessage = '';
    successMessage = '';
    
    try {
      const response = await fetch(`/api/forum/topics/${topic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: topic.id,
          title,
          content,
          category_id: categoryId,
          is_pinned: isPinned,
          is_locked: isLocked
        })
      });
      
      if (response.ok) {
        successMessage = 'Topic updated successfully!';
        setTimeout(() => goto('/admin/forums'), 1500);
      } else {
        const error = await response.json();
        errorMessage = error.message || 'Failed to update topic.';
      }
    } catch (error) {
      errorMessage = 'An unexpected error occurred.';
      console.error(error);
    } finally {
      saving = false;
    }
  }
  
  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this topic? This cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/forum/topics/${topic.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        goto('/admin/forums');
      } else {
        const error = await response.json();
        errorMessage = error.message || 'Failed to delete topic.';
      }
    } catch (error) {
      errorMessage = 'An unexpected error occurred.';
      console.error(error);
    }
  }
</script>

<svelte:head>
  <title>Edit Topic | Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8" in:fade>
  <a href="/admin/forums" class="text-blue-600 hover:underline mb-4 inline-block">
    &larr; Back to Forum Management
  </a>
  
  <h1 class="text-2xl font-bold mb-6">Edit Topic</h1>
  
  {#if errorMessage}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {errorMessage}
    </div>
  {/if}
  
  {#if successMessage}
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {successMessage}
    </div>
  {/if}
  
  <form on:submit|preventDefault={handleSubmit} class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <div class="mb-4">
      <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
      <input
        id="title"
        type="text"
        bind:value={title}
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        required
      />
    </div>
    
    <div class="mb-4">
      <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
      <select
        id="category"
        bind:value={categoryId}
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        required
      >
        {#each categories as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    </div>
    
    <div class="mb-4">
      <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
      <textarea
        id="content"
        bind:value={content}
        rows="10"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        required
      ></textarea>
    </div>
    
    <div class="mb-4 flex items-center">
      <input
        id="is-pinned"
        type="checkbox"
        bind:checked={isPinned}
        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
      />
      <label for="is-pinned" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
        Pin this topic
      </label>
    </div>
    
    <div class="mb-6 flex items-center">
      <input
        id="is-locked"
        type="checkbox"
        bind:checked={isLocked}
        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
      />
      <label for="is-locked" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
        Lock this topic (prevent new replies)
      </label>
    </div>
    
    <div class="flex justify-between">
      <button
        type="submit"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:opacity-50"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
      
      <button
        type="button"
        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
        on:click={handleDelete}
      >
        Delete Topic
      </button>
    </div>
  </form>
</div>