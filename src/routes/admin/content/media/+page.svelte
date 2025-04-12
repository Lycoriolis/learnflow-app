<script lang="ts">
  import { fade } from 'svelte/transition';
</script>

<div in:fade={{ duration: 200 }} class="space-y-6">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h1>
    <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium">
      Upload Files
    </button>
  </div>
  
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex justify-center items-center py-16">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mb-4">
          <i class="fas fa-images text-indigo-600 dark:text-indigo-400 text-2xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Media Library</h3>
        <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          This section is under development. You'll be able to upload and manage media files here.
        </p>
      </div>
    </div>
  </div>
</div> 