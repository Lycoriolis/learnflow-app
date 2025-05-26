<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getForumTopic, updateTopic, getCategories } from '$lib/services/forums/forumService';
  import type { ForumCategory, ForumTopic } from '$lib/types/forumTypes';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  
  const topicId = $page.params.id;
  
  let title = '';
  let content = '';
  let category_id = '';
  let is_pinned = false;
  let is_locked = false;
  let tags: string[] = [];
  let newTag = '';
  let categories: ForumCategory[] = [];
  
  let isLoading = true;
  let isSaving = false;
  let error: string | null = null;
  let success: string | null = null;
  
  onMount(async () => {
    try {
      const [topic, categoriesList] = await Promise.all([
        getForumTopic(topicId),
        getCategories()
      ]);
      
      if (!topic) {
        error = 'Topic not found';
        return;
      }
      
      title = topic.title;
      content = topic.content || '';
      category_id = topic.category_id;
      is_pinned = topic.is_pinned || false;
      is_locked = topic.is_locked || false;
      tags = topic.tags || [];
      categories = categoriesList;
    } catch (err) {
      console.error('Error loading topic data:', err);
      error = 'Failed to load topic data. Please try again.';
    } finally {
      isLoading = false;
    }
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
    if (!title.trim() || !content.trim() || !category_id) {
      error = 'Title, content, and category are required';
      return;
    }
    
    isSaving = true;
    error = null;
    success = null;
    
    try {
      const result = await updateTopic(topicId, {
        title: title.trim(),
        content: content.trim(),
        category_id,
        is_pinned,
        is_locked,
        tags: tags.length > 0 ? tags : undefined
      });
      
      if (result) {
        success = 'Topic updated successfully!';
        setTimeout(() => {
          goto(`/forums/topic/${topicId}`);
        }, 1500);
      } else {
        error = 'Failed to update topic. Please try again.';
      }
    } catch (err) {
      console.error('Error updating topic:', err);
      error = 'An error occurred while updating the topic.';
    } finally {
      isSaving = false;
    }
  }
</script>

<!-- Placeholder for admin topic edit page -->

<div class="container mx-auto px-4 py-8">
  <div class="max-w-3xl mx-auto">
    <div class="mb-6">
      <a href="/forums/topic/{topicId}" class="inline-flex items-center text-cherry-600 dark:text-cherry-400 hover:underline mb-4">
        <Icon icon="mdi:arrow-left" class="w-5 h-5 mr-1" />
        Back to Topic
      </a>
      
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Forum Topic</h1>
    </div>
    
    {#if isLoading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cherry-500"></div>
      </div>
    {:else}
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {#if error}
          <div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6">
            <p>{error}</p>
          </div>
        {/if}
        
        {#if success}
          <div class="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-md mb-6">
            <p>{success}</p>
          </div>
        {/if}
        
        <div class="space-y-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              bind:value={title}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"
              disabled={isSaving}
            />
          </div>
          
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              id="category"
              bind:value={category_id}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"
              disabled={isSaving}
            >
              <option value="" disabled>Select a category</option>
              {#each categories as category}
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
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400 min-h-[200px]"
              disabled={isSaving}
            ></textarea>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              You can use Markdown formatting to structure your content.
            </p>
          </div>
          
          <div>
            <label for="admin-tags-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div class="flex">
              <input
                id="admin-tags-input"
                type="text"
                bind:value={newTag}
                on:keydown={handleKeydown}
                placeholder="Add tags (press Enter to add)"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"
                disabled={isSaving}
                aria-label="Add new tag"
              />
              <button
                on:click={addTag}
                type="button"
                class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 border-l-0 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                disabled={isSaving || !newTag.trim()}
                aria-label="Add tag"
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
                      disabled={isSaving}
                    >
                      <Icon icon="mdi:close" class="w-4 h-4" />
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
          
          <div class="flex space-x-6">
            <div class="flex items-center">
              <input
                type="checkbox"
                id="is_pinned"
                bind:checked={is_pinned}
                class="h-4 w-4 text-cherry-600 dark:text-cherry-500 focus:ring-cherry-500 dark:focus:ring-cherry-400 border-gray-300 dark:border-gray-600 rounded"
                disabled={isSaving}
              />
              <label for="is_pinned" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Pin this topic
              </label>
            </div>
            
            <div class="flex items-center">
              <input
                type="checkbox"
                id="is_locked"
                bind:checked={is_locked}
                class="h-4 w-4 text-cherry-600 dark:text-cherry-500 focus:ring-cherry-500 dark:focus:ring-cherry-400 border-gray-300 dark:border-gray-600 rounded"
                disabled={isSaving}
              />
              <label for="is_locked" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Lock this topic (no new replies)
              </label>
            </div>
          </div>
          
          <div class="flex justify-end space-x-4">
            <a 
              href="/forums/topic/{topicId}" 
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </a>
            
            <button 
              on:click={handleSubmit}
              disabled={isSaving || !title.trim() || !content.trim() || !category_id}
              class="px-4 py-2 bg-cherry-600 text-white rounded-md hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>