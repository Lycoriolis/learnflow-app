<script lang="ts">
  import type { ContentManifestItem } from '$lib/types/shared';
  export let data: { items: ContentManifestItem[] };
  const items = data.items;
</script>

<svelte:head>
  <title>LearnFlow | Category: {data.slug || ''}</title>
</svelte:head>

{#if items.length > 0}
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Category: {data.slug || ''}</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each items as item}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-2">{item.title}</h2>
          {#if item.description}
            <p class="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
          {/if}
          <a
            href="/courses/{item.slug || item.id}"
            class="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View Course →
          </a>
        </div>
      {/each}
    </div>
  </div>
{:else}
  <div class="flex justify-center items-center min-h-[60vh]">
    <div class="text-gray-500">No items found in this category</div>
  </div>
{/if}