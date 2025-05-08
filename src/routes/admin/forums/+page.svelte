<script lang="ts">
  export let data: { topics: import('$lib/services/forumService').getAllTopics extends (...args:any)=>Promise<infer R> ? R : any, categories: import('$lib/services/forumService').getAllCategories extends (...args:any)=>Promise<infer R> ? R : any };
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { secureFetch } from '$lib/utils/secureFetch';
  let { topics, categories } = data;
  let showNewCategoryForm = false;
  
  // For new category form
  let newCategory = {
    name: '',
    description: '',
    icon: 'fa-folder',
    color: 'blue'
  };
  let saving = false;
  let errorMessage = '';
  let successMessage = '';
  
  // Available options for new category
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

  function editTopic(id: string) {
    goto(`/admin/forums/topic/${id}/edit`);
  }
  
  async function deleteTopic(id: string) {
    if (!confirm('Delete topic?')) return;
    
    try {
      await secureFetch(`/api/forum/topics/${id}`, {
        method: 'DELETE'
      });
      
      topics = topics.filter(t => t.id !== id);
      showFeedback('Topic deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting topic:', error);
      showFeedback(error.message || 'Error deleting topic', 'error');
    }
  }
  
  function editCategory(id: string) {
    goto(`/admin/forums/category/${id}/edit`);
  }
  
  async function deleteCategory(id: string) {
    if (!confirm('Delete category? This will also delete all topics in this category.')) return;
    
    try {
      await secureFetch(`/api/forum/categories/${id}`, {
        method: 'DELETE'
      });
      
      categories = categories.filter(c => c.id !== id);
      // Also remove topics in this category
      topics = topics.filter(t => t.category !== id);
      showFeedback('Category deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting category:', error);
      showFeedback(error.message || 'Error deleting category', 'error');
    }
  }
  
  async function createNewCategory() {
    saving = true;
    errorMessage = '';
    successMessage = '';
    
    try {
      // Validate input
      if (!newCategory.name || !newCategory.description) {
        throw new Error('Name and description are required');
      }
      
      const category = await secureFetch('/api/forum/categories', {
        method: 'POST',
        body: newCategory
      });
      
      categories = [...categories, category];
      showFeedback('Category created successfully!', 'success');
      resetNewCategoryForm();
    } catch (error) {
      console.error('Error creating category:', error);
      showFeedback(error.message || 'An unexpected error occurred', 'error');
    } finally {
      saving = false;
    }
  }
  
  function resetNewCategoryForm() {
    newCategory = {
      name: '',
      description: '',
      icon: 'fa-folder',
      color: 'blue'
    };
    showNewCategoryForm = false;
  }
  
  function showFeedback(message: string, type: 'success' | 'error') {
    if (type === 'success') {
      successMessage = message;
      setTimeout(() => { successMessage = ''; }, 3000);
    } else {
      errorMessage = message;
      setTimeout(() => { errorMessage = ''; }, 5000);
    }
  }
</script>

<svelte:head><title>Manage Forums | Admin</title></svelte:head>
<div class="container mx-auto p-4" in:fade>
  <h1 class="text-2xl font-bold mb-4">Forum Management</h1>
  
  {#if errorMessage}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
      <span class="block sm:inline">{errorMessage}</span>
      <button class="absolute top-0 right-0 px-4 py-3" on:click={() => errorMessage = ''}>
        <i class="fas fa-times"></i>
      </button>
    </div>
  {/if}
  
  {#if successMessage}
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 relative">
      <span class="block sm:inline">{successMessage}</span>
      <button class="absolute top-0 right-0 px-4 py-3" on:click={() => successMessage = ''}>
        <i class="fas fa-times"></i>
      </button>
    </div>
  {/if}
  
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-xl font-semibold">Categories</h2>
    <button 
      class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
      on:click={() => showNewCategoryForm = true}
    >
      <i class="fas fa-plus mr-1"></i> New Category
    </button>
  </div>
  
  {#if showNewCategoryForm}
    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <h3 class="text-lg font-medium mb-3">Create New Category</h3>
      <form on:submit|preventDefault={createNewCategory}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name</label>
            <input
              id="name"
              type="text"
              bind:value={newCategory.name}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input
              id="description"
              type="text"
              bind:value={newCategory.description}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          
          <div>
            <label for="icon" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
            <div class="flex items-center space-x-2">
              <select
                id="icon"
                bind:value={newCategory.icon}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {#each iconOptions as option}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </select>
              <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded-md">
                <i class={`fas ${newCategory.icon} text-${newCategory.color}-500`}></i>
              </div>
            </div>
          </div>
          
          <div>
            <label for="color" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
            <select
              id="color"
              bind:value={newCategory.color}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {#each colorOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </div>
        </div>
        
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            on:click={resetNewCategoryForm}
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  {/if}
  
  <table class="min-w-full bg-white dark:bg-gray-800 mb-6">
    <thead><tr>
      <th class="px-4 py-2">ID</th>
      <th class="px-4 py-2">Name</th>
      <th class="px-4 py-2">Description</th>
      <th class="px-4 py-2">Actions</th>
    </tr></thead>
    <tbody>
      {#each categories as c}
      <tr class="hover:bg-gray-100 dark:hover:bg-gray-700">
        <td class="border px-4 py-2 text-sm">{c.id}</td>
        <td class="border px-4 py-2 text-sm">{c.name}</td>
        <td class="border px-4 py-2 text-sm">{c.description}</td>
        <td class="border px-4 py-2 text-sm space-x-2">
          <button class="text-blue-600 hover:underline" on:click={() => editCategory(c.id)}>Edit</button>
          <button class="text-red-600 hover:underline" on:click={() => deleteCategory(c.id)}>Delete</button>
        </td>
      </tr>
      {/each}
    </tbody>
  </table>

  <h2 class="text-xl font-semibold mt-6 mb-2">Topics</h2>
  <table class="min-w-full bg-white dark:bg-gray-800">
    <thead><tr>
      <th class="px-4 py-2">Title</th>
      <th class="px-4 py-2">Category</th>
      <th class="px-4 py-2">Author</th>
      <th class="px-4 py-2">Created</th>
      <th class="px-4 py-2">Actions</th>
    </tr></thead>
    <tbody>
      {#each topics as t}
      <tr class="hover:bg-gray-100 dark:hover:bg-gray-700">
        <td class="border px-4 py-2 text-sm">{t.title}</td>
        <td class="border px-4 py-2 text-sm">{categories.find(c=>c.id===t.category)?.name || t.category}</td>
        <td class="border px-4 py-2 text-sm">{t.author.name}</td>
        <td class="border px-4 py-2 text-sm">{new Date(t.createdAt).toLocaleDateString()}</td>
        <td class="border px-4 py-2 text-sm space-x-2">
          <button class="text-blue-600 hover:underline" on:click={() => editTopic(t.id)}>Edit</button>
          <button class="text-red-600 hover:underline" on:click={() => deleteTopic(t.id)}>Delete</button>
        </td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>