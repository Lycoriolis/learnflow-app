<script lang="ts">
  import { onMount } from 'svelte';
  import { categories, loadCategories } from '$lib/stores/forumStore';
  import { createForumTopic } from '$lib/services/forums/forumService';
  import type { ForumTopic } from '$lib/types/forumTypes';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  
  export let categoryId: string | null = null;
  
  let title = '';
  let content = '';
  let selectedCategoryId = categoryId;
  let tags: string[] = [];
  let newTag = '';
  
  let isSubmitting = false;
  let error: string | null = null;
  
  onMount(() => {
    loadCategories();
  });
  
  function addTag() {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      tags = [...tags, newTag.trim()];
      newTag = '';
    }
  }
  
  function removeTag(tag: string) {
    tags = tags.filter(t => t !== tag);
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
  }
  
  async function handleSubmit() {
    if (!title.trim() || !content.trim() || !selectedCategoryId) {
      error = 'Please fill in all required fields';
      return;
    }
    
    isSubmitting = true;
    error = null;
    
    try {
      const newTopic = await createForumTopic({
        title: title.trim(),
        content: content.trim(),
        category_id: selectedCategoryId,
        tags: tags.length > 0 ? tags : undefined
      } as Omit<ForumTopic, 'id' | 'created_at' | 'views' | 'post_count' | 'updated_at'>);
      
      if (newTopic) {
        goto(`/forums/topic/${newTopic.id}`);
      } else {
        error = 'Failed to create topic. Please try again.';
      }
    } catch (err) {
      console.error('Error creating topic:', err);
      error = 'An error occurred while creating your topic.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<!-- Placeholder for CreateTopicForm.svelte -->

<div class="create-topic-form">
  <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Create New Topic</h2>
  
  <div class="space-y-6">
    {#if error}
      <div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md">
        <p>{error}</p>
      </div>
    {/if}
    
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Title *
      </label>
      <input
        type="text"
        id="title"
        bind:value={title}
        placeholder="Enter a descriptive title for your topic"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"
        disabled={isSubmitting}
      />
    </div>
    
    <div>
      <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Category *
      </label>
      <select
        id="category"
        bind:value={selectedCategoryId}
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"
        disabled={isSubmitting || !!categoryId}
      >
        <option value="" disabled>Select a category</option>
        {#each $categories as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    </div>
    
    <div>
      <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Content *
      </label>
      <textarea
        id="content"
        bind:value={content}
        placeholder="Write your topic content here... (Markdown supported)"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400 min-h-[200px]"
        disabled={isSubmitting}
      ></textarea>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        You can use Markdown formatting to structure your content.
      </p>
    </div>
    
    <div>
      <label for="tags-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Tags
      </label>
      <div class="flex">
        <input
          id="tags-input"
          type="text"
          bind:value={newTag}
          on:keydown={handleKeydown}
          placeholder="Add tags (press Enter to add)"
          class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"
          disabled={isSubmitting}
          aria-label="Add new tag"
        />
        <button
          on:click={addTag}
          type="button"
          class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 border-l-0 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          disabled={isSubmitting || !newTag.trim()}
        >
          Add
        </button>
      </div>
      
      {#if tags.length > 0}
        <div class="flex flex-wrap gap-2 mt-2">
          {#each tags as tag}
            <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
              {tag}
              <button
                on:click={() => removeTag(tag)}
                type="button"
                class="ml-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                disabled={isSubmitting}
                aria-label={`Remove tag ${tag}`}
              >
                <Icon icon="mdi:close" class="w-4 h-4" />
              </button>
            </div>
          {/each}
        </div>
      {/if}
    </div>
    
    <div class="flex justify-end">
      <button
        on:click={handleSubmit}
        disabled={isSubmitting || !title.trim() || !content.trim() || !selectedCategoryId}
        class="px-4 py-2 bg-cherry-600 text-white rounded-md hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Creating Topic...' : 'Create Topic'}
      </button>
    </div>
  </div>
</div>