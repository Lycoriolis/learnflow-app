<script lang="ts">
  export let data: { slug: string, categoryName: string };
</script>

<svelte:head>
  <title>LearnFlow | Category: {data.categoryName}</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Category: {data.categoryName}</h1>
  <p class="text-gray-600 dark:text-gray-300">Courses and content related to '{data.slug}' will be listed here. (Placeholder)</p>
  <!-- Add category content listing logic here -->
</div> 