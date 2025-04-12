<script>
  export let error, status;
</script>

<svelte:head>
  <title>{status} - Something went wrong</title>
</svelte:head>

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-4">
  <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">{status}</h1>
  <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">{error.message}</p>
  <a href="/" class="btn btn-primary">Go Home</a>
</div>

<style lang="postcss">
  /* Removed unused CSS selectors */
</style>