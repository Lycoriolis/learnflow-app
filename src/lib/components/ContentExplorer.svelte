<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// Define the expected structure for items passed as props
	// This should align with the ContentManifestItem interface in contentService.ts
	interface ContentItem {
		id: string;
		title: string;
		path: string; // Full path from the content type root
		type: 'category' | 'course' | 'module' | 'lesson' | 'exercise' | 'topic' | string; // Allow other types
		description?: string;
		// Add other relevant fields displayed by the explorer
		tags?: string[];
		difficulty?: string;
	}

	// Accept items as a prop instead of fetching internally
	export let items: ContentItem[] = [];
	export let contentType: 'courses' | 'exercises'; // To construct correct navigation paths

	const dispatch = createEventDispatcher();

	function onItemClick(item: ContentItem) {
		// Dispatch a 'navigate' event with the item's path
		// The parent page (+page.svelte) will handle the actual navigation using goto()
		dispatch('navigate', { path: item.path });
	}

	// Function to determine the icon based on item type (example)
	function getIcon(type: string): string {
		switch (type) {
			case 'category':
			case 'topic':
				return '📁'; // Folder icon for categories/topics
			case 'course':
				return '📚'; // Book icon for courses
			case 'module':
				return '📦'; // Box icon for modules
			case 'lesson':
				return '📄'; // Page icon for lessons
			case 'exercise':
				return '✏️'; // Pencil icon for exercises
			default:
				return '❓'; // Default icon
		}
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
	{#if items && items.length > 0}
		{#each items as item (item.id)}
			<!-- Use a button or anchor for interaction -->
			<button
				on:click={() => onItemClick(item)}
				class="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 text-left w-full transition-colors duration-150 ease-in-out"
			>
				<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					<span class="mr-2">{getIcon(item.type)}</span>
					{item.title}
				</h5>
				{#if item.description}
					<p class="font-normal text-gray-700 dark:text-gray-400 mb-3">{item.description}</p>
				{/if}
				<!-- Optional: Display tags or other metadata -->
				{#if item.tags && item.tags.length > 0}
					<div class="flex flex-wrap gap-2 mt-2">
						{#each item.tags as tag}
							<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{tag}</span>
						{/each}
					</div>
				{/if}
				{#if item.difficulty}
				 <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Difficulty: {item.difficulty}</p>
				{/if}
			</button>
		{:else}
			<p class="text-gray-500 dark:text-gray-400 col-span-full">No items found in this section.</p>
		{/each}
	{:else}
		 <p class="text-gray-500 dark:text-gray-400 col-span-full">Loading content...</p> <!-- Or handle empty state explicitly -->
	{/if}
</div>