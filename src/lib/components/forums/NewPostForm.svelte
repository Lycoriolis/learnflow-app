<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { user } from '$lib/stores/authStore.js';
  let content = '';
  const dispatch = createEventDispatcher();

  // Track current user for conditional rendering
  // Use $user to access the store value reactively
  $: currentUser = $user;

  function submit() {
    if (!content.trim()) return;
    dispatch('newPost', { content: content.trim() });
    content = '';
  }
</script>

{#if currentUser?.uid}
  <div class="new-post-form">
    <textarea
      bind:value={content}
      class="w-full p-3 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      rows="4"
      placeholder="Write your reply here..."
    />
    <button
      on:click|preventDefault={submit}
      class="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!content.trim()}
    >
      Post Reply
    </button>
  </div>
{:else}
  <p class="text-gray-600 dark:text-gray-400">
    You must be <a href="/login" class="text-indigo-600 hover:underline">logged in</a> to post a reply.
  </p>
{/if}

<!-- Placeholder for NewPostForm.svelte -->