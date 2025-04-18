<script lang="ts">
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  
  export let data: { category: any };
  let { category } = data;
  
  let name = category.name;
  let description = category.description;
  let icon = category.icon || 'fa-folder';
  let color = category.color || 'blue';
  let saving = false;
  let errorMessage = '';
  let successMessage = '';
  
  // Available colors and icons for selection
  const colorOptions = [
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'red', label: 'Red' },
    { value: 'purple', label: 'Purple' },
    { value: 'orange', label: 'Orange' },
    { value: 'indigo', label: 'Indigo' },
    { value: 'gray', label: 'Gray' }
  ];
  
  const iconOptions = [
    { value: 'fa-folder', label: 'Folder' },
    { value: 'fa-code', label: 'Code' },
    { value: 'fa-question-circle', label: 'Question' },
    { value: 'fa-book', label: 'Book' },
    { value: 'fa-graduation-cap', label: 'Education' },
    { value: 'fa-users', label: 'Users' },
    { value: 'fa-cogs', label: 'Settings' },
    { value: 'fa-laptop', label: 'Computer' },
    { value: 'fa-chart-bar', label: 'Chart' }
  ];
  
  async function handleSubmit() {
    saving = true;
    errorMessage = '';
    successMessage = '';
    
    try {
      const response = await fetch(`/api/forum/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          icon,
          color
        })
      });
      
      if (response.ok) {
        successMessage = 'Category updated successfully!';
        setTimeout(() => goto('/admin/forums'), 1500);
      } else {
        const error = await response.json();
        errorMessage = error.message || 'Failed to update category.';
      }
    } catch (error) {
      errorMessage = 'An unexpected error occurred.';
      console.error(error);
    } finally {
      saving = false;
    }
  }
  
  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this category? This cannot be undone and will fail if there are topics in this category.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/forum/categories/${category.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        goto('/admin/forums');
      } else {
        const error = await response.json();
        errorMessage = error.message || 'Failed to delete category.';
      }
    } catch (error) {
      errorMessage = 'An unexpected error occurred.';
      console.error(error);
    }
  }
</script>

<svelte:head>
  <title>Edit Category | Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8" in:fade>
  <a href="/admin/forums" class="text-blue-600 hover:underline mb-4 inline-block">
    &larr; Back to Forum Management
  </a>
  
  <h1 class="text-2xl font-bold mb-6">Edit Category</h1>
  
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
      <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name</label>
      <input
        id="name"
        type="text"
        bind:value={name}
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        required
      />
    </div>
    
    <div class="mb-4">
      <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
      <textarea
        id="description"
        bind:value={description}
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        required
      ></textarea>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label for="icon" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
        <div class="flex items-center space-x-2">
          <select
            id="icon"
            bind:value={icon}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {#each iconOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
          <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-md">
            <i class={`fas ${icon} text-${color}-500`}></i>
          </div>
        </div>
      </div>
      
      <div>
        <label for="color" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
        <select
          id="color"
          bind:value={color}
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {#each colorOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
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
        Delete Category
      </button>
    </div>
  </form>
</div>