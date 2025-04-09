<!-- src/routes/admin/courses/new/+page.svelte -->
<script lang="ts">
  let courseTitle = '';
  let courseCategory = '';
  let courseDescription = '';

  function handleSubmit() {
      console.log('Submitting new course (Placeholder):', { 
          title: courseTitle, 
          category: courseCategory, 
          description: courseDescription 
      });
      // In real app: Call API, handle response, redirect or show message
      alert('New course submitted (Placeholder)! Check console.');
  }
</script>

<svelte:head>
  <title>Admin | Add New Course</title>
</svelte:head>

<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Course</h1>

<form on:submit|preventDefault={handleSubmit} class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
  <div>
    <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Course Title</label>
    <input type="text" id="title" bind:value={courseTitle} required 
           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
  </div>

   <div>
    <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
    <input type="text" id="category" bind:value={courseCategory} required 
           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
           <!-- Could be a <select> dropdown populated from API -->
  </div>

  <div>
    <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
    <textarea id="description" rows="4" bind:value={courseDescription} 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"></textarea>
  </div>

  <!-- Placeholder for Lessons/Modules -->
  <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Lessons / Pages</h2>
      <p class="text-sm text-gray-500 mb-4">Lesson management (Markdown/PDF upload) would go here. Requires backend integration.</p>
      <button type="button" class="px-3 py-1.5 border border-dashed border-gray-400 text-gray-500 text-sm font-medium rounded-md hover:border-indigo-500 hover:text-indigo-600">
          + Add Lesson/Page (Placeholder)
      </button>
  </div>

  <div class="flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 pt-6">
      <a href="/admin/courses" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancel
      </a>
      <button type="submit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Save Course
      </button>
  </div>
</form> 