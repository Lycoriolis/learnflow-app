<script lang="ts">
  import { onMount } from 'svelte';
  import { categories, loadCategories, isLoading, error } from '$lib/stores/forumStore';
  import { createCategory, deleteCategory } from '$lib/services/forums/forumService';
  import type { ForumCategory } from '$lib/types/forumTypes';
  import Icon from '@iconify/svelte';
  
  let showCreateForm = false;
  let newCategoryName = '';
  let newCategoryDescription = '';
  let newCategoryImageUrl = '';
  
  let isCreating = false;
  let createError: string | null = null;
  let createSuccess: string | null = null;
  
  onMount(() => {
    loadCategories();
  });
  
  function toggleCreateForm() {
    showCreateForm = !showCreateForm;
    if (!showCreateForm) {
      newCategoryName = '';
      newCategoryDescription = '';
      newCategoryImageUrl = '';
      createError = null;
      createSuccess = null;
    }
  }
  
  async function handleCreateCategory() {
    if (!newCategoryName.trim() || !newCategoryDescription.trim()) {
      createError = 'Name and description are required';
      return;
    }
    
    isCreating = true;
    createError = null;
    createSuccess = null;
    
    try {
      const newCategory = await createCategory({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim(),
        ...(newCategoryImageUrl ? { imageUrl: newCategoryImageUrl.trim() } : {})
      });
      
      if (newCategory) {
        createSuccess = 'Category created successfully!';
        newCategoryName = '';
        newCategoryDescription = '';
        newCategoryImageUrl = '';
        
        // Reload categories to include the new one
        await loadCategories();
        
        setTimeout(() => {
          showCreateForm = false;
          createSuccess = null;
        }, 1500);
      } else {
        createError = 'Failed to create category. Please try again.';
      }
    } catch (err) {
      console.error('Error creating category:', err);
      createError = 'An error occurred while creating the category.';
    } finally {
      isCreating = false;
    }
  }
  
  async function handleDeleteCategory(categoryId: string) {
    if (!confirm('Are you sure you want to delete this category? This will also delete all topics in this category and cannot be undone.')) {
      return;
    }
    
    try {
      const result = await deleteCategory(categoryId);
      
      if (result) {
        await loadCategories();
      } else {
        alert('Failed to delete category. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('An error occurred while deleting the category.');
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Forum Administration</h1>
    
    <button 
      on:click={toggleCreateForm}
      class="px-4 py-2 bg-cherry-600 text-white rounded-md hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 transition-colors"
    >
      {showCreateForm ? 'Cancel' : 'Create Category'}
    </button>
  </div>
  
  {#if showCreateForm}
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create New Category</h2>
      
      {#if createError}
        <div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6">
          <p>{createError}</p>
        </div>
      {/if}
      
      {#if createSuccess}
        <div class="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-md mb-6">
          <p>{createSuccess}</p>
        </div>
      {/if}
      
      <div class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            bind:value={newCategoryName}
            placeholder="e.g., General Discussion"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"
            disabled={isCreating}
          />
        </div>
        
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            bind:value={newCategoryDescription}
            placeholder="A short description of what this category is for."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400 min-h-[100px]"
            disabled={isCreating}
          ></textarea>
        </div>
        
        <div>
          <label for="imageUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL (optional)
          </label>
          <input
            type="text"
            id="imageUrl"
            bind:value={newCategoryImageUrl}
            placeholder="https://example.com/image.jpg"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"
            disabled={isCreating}
          />
        </div>
        
        <div class="flex justify-end">
          <button 
            on:click={handleCreateCategory}
            disabled={isCreating || !newCategoryName.trim() || !newCategoryDescription.trim()}
            class="px-4 py-2 bg-cherry-600 text-white rounded-md hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </div>
    </div>
  {/if}
  
  <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Forum Categories</h2>
  
  {#if $isLoading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cherry-500"></div>
    </div>
  {:else if $error}
    <div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6">
      <p>{$error}</p>
    </div>
  {:else if $categories.length === 0}
    <div class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <Icon icon="mdi:forum-outline" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories found</h3>
      <p class="text-gray-600 dark:text-gray-400">
        There are no forum categories yet. Create your first category to get started.
      </p>
    </div>
  {:else}
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Topics
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Order
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {#each $categories as category}
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-750">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {category.name}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 truncate max-w-[300px]">
                {category.description}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {category.topicCount || 0}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {category.order ?? 'N/A'}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <a 
                    href="/admin/forums/category/{category.id}/edit" 
                    class="text-cherry-600 dark:text-cherry-400 hover:text-cherry-900 dark:hover:text-cherry-300"
                    title="Edit category"
                  >
                    <Icon icon="mdi:pencil" class="w-5 h-5" />
                  </a>
                  <button 
                    on:click={() => handleDeleteCategory(category.id)}
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    title="Delete category"
                  >
                    <Icon icon="mdi:delete" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>