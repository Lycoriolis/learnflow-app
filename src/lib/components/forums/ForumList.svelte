<script lang="ts">
  import { onMount } from 'svelte';

  export let topics = []; // Initialize with empty array

  // Remove the onMount fetch logic as the parent page now handles it
  // onMount(async () => {
  //   try {
  //     const response = await fetch('/api/forums/topics');
  //     if (response.ok) {
  //       topics = await response.json();
  //     } else {
  //       console.error('Failed to fetch topics:', response.statusText);
  //       // Optionally, display an error message to the user
  //     }
  //   } catch (error) {
  //     console.error('Error fetching topics:', error);
  //     // Optionally, display an error message to the user
  //   }
  // });
</script>

<div class="forum-list p-4">
  <h2 class="text-2xl font-bold mb-4">Forum Topics</h2>
  {#if topics.length > 0}
    <ul>
      {#each topics as topic}
        <li class="mb-2 p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <a href={`/forums/${topic.id}`} class="text-blue-600 dark:text-blue-400 hover:underline">
            {topic.title}
          </a>
          <p class="text-sm text-gray-600 dark:text-gray-400">Started by {topic.author} on {new Date(topic.createdAt).toLocaleDateString()}</p>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No topics found.</p>
  {/if}

  <!-- TODO: Add link/button to create a new topic -->
</div>