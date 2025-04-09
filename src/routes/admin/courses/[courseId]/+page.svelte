<!-- src/routes/admin/courses/[courseId]/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  // In real app, load existing course data in +page.ts based on $page.params.courseId
  // For now, just using placeholder values based on ID
  let courseId = $page.params.courseId;
  let courseTitle = courseId.includes('algebra') ? 'Algebra Basics' : 'Introduction to Python';
  let courseCategory = courseId.includes('algebra') ? 'Mathematics' : 'Computer Science';
  let courseDescription = courseId.includes('algebra') ? 'Master the fundamentals...' : 'Learn Python basics...';

  function handleSubmit() {
      console.log(`Updating course ${courseId} (Placeholder):`, { 
          title: courseTitle, 
          category: courseCategory, 
          description: courseDescription 
      });
      alert(`Course ${courseId} updated (Placeholder)! Check console.`);
  }
  
  function handleDelete() {
      if (confirm(`Are you sure you want to delete course ${courseId}?`)) {
          console.log(`Deleting course ${courseId} (Placeholder)`);
          alert(`Course ${courseId} deleted (Placeholder)!`);
          // In real app: Call delete API, redirect to courses list
      }
  }
</script>

<svelte:head>
  <title>Admin | Edit Course: {courseTitle}</title>
</svelte:head>

<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Course: {courseTitle}</h1>

<!-- Re-use the same form structure as the 'new' page, pre-filled -->
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
  </div>

  <div>
    <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
    <textarea id="description" rows="4" bind:value={courseDescription} 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"></textarea>
  </div>

  <!-- Placeholder for Lessons/Modules Management -->
   <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Lessons / Pages</h2>
      <p class="text-sm text-gray-500 mb-4">Lesson management (adding content, reordering, editing Markdown/PDFs) would go here.</p>
      <!-- Add UI for listing/adding/editing lessons here -->
      <button type="button" class="px-3 py-1.5 border border-dashed border-gray-400 text-gray-500 text-sm font-medium rounded-md hover:border-indigo-500 hover:text-indigo-600">
          + Manage Lessons (Placeholder)
      </button>
  </div>

  <div class="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6">
      <div>
          <button type="button" on:click={handleDelete} class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Delete Course
          </button>
      </div>
      <div class="flex space-x-3">
           <a href="/admin/courses" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
          </a>
          <button type="submit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Save Changes
          </button>
      </div>
  </div>
</form> 