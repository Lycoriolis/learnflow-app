<!-- src/routes/admin/settings/+page.svelte -->
<script lang="ts">
  // In real app, load settings via API in +page.ts
  let siteName = 'LearnFlow';
  let defaultTheme = 'system'; // Example setting
  let allowSignups = true;

  function handleSettingsSubmit() {
      console.log('Saving site settings (Placeholder):', {
          siteName,
          defaultTheme,
          allowSignups
      });
       alert('Site settings saved (Placeholder)! Check console.');
  }

</script>

<svelte:head>
  <title>Admin | Site Settings</title>
</svelte:head>

<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Site Settings</h1>

<p class="mb-6 text-sm text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-gray-700 p-3 rounded-md border border-orange-200 dark:border-orange-600">
  <i class="fas fa-exclamation-triangle mr-2"></i>
  Note: Saving site settings requires a backend API and database to persist these values globally. This form currently logs to the console.
</p>

<form on:submit|preventDefault={handleSettingsSubmit} class="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow max-w-2xl">
  <div>
    <label for="siteName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Name</label>
    <input type="text" id="siteName" bind:value={siteName} required 
           class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
  </div>

  <div>
    <label for="defaultTheme" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Theme</label>
    <select id="defaultTheme" bind:value={defaultTheme} 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
      <option value="system">System Preference</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </div>

  <div class="relative flex items-start">
    <div class="flex h-5 items-center">
      <input id="allowSignups" type="checkbox" bind:checked={allowSignups} 
             class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:checked:bg-indigo-500">
    </div>
    <div class="ml-3 text-sm">
      <label for="allowSignups" class="font-medium text-gray-700 dark:text-gray-300">Allow New User Sign-ups</label>
      <p class="text-gray-500 dark:text-gray-400">Control whether new users can register.</p>
    </div>
  </div>

   <!-- Add more settings fields as needed -->

  <div class="flex justify-end border-t border-gray-200 dark:border-gray-700 pt-6">
      <button type="submit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Save Settings
      </button>
  </div>
</form> 