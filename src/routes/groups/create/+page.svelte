<script lang="ts">
  import { goto } from '$app/navigation';
  let name = '';
  let description = '';
  let topic = '';
  let image = '';
  let isPublic = true;
  let error = '';
  let loading = false;
  let success = false;

  async function createGroup() {
    error = '';
    success = false;
    // Client-side validation
    if (!name.trim() || !description.trim() || !topic.trim()) {
      error = 'Please fill in all required fields.';
      return;
    }
    loading = true;
    try {
      const res = await fetch('/api/groups/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, topic, image, is_public: isPublic })
      });
      if (res.ok) {
        success = true;
        setTimeout(() => goto('/groups'), 1200);
      } else {
        const data = await res.json().catch(() => ({}));
        error = data?.error || 'Failed to create group.';
      }
    } catch (e) {
      error = 'Failed to create group.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Create New Group | LearnFlow</title>
</svelte:head>

<div class="max-w-xl mx-auto py-10 px-4">
  <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Create a New Group</h1>
  <form on:submit|preventDefault={createGroup} class="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div>
      <label class="block text-sm font-medium mb-1">Group Name</label>
      <input class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" bind:value={name} required />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Description</label>
      <textarea class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" bind:value={description} rows="3" required></textarea>
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Topic</label>
      <input class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" bind:value={topic} required />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Image URL (optional)</label>
      <input class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" bind:value={image} />
    </div>
    <div class="flex items-center gap-2">
      <input type="checkbox" id="isPublic" bind:checked={isPublic} />
      <label for="isPublic" class="text-sm">Public group (anyone can join)</label>
    </div>
    {#if error}
      <div class="text-red-500">{error}</div>
    {/if}
    {#if success}
      <div class="text-green-600 font-semibold">Group created successfully! Redirecting...</div>
    {/if}
    <div class="flex gap-4">
      <button type="submit" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md" disabled={loading}>
        {loading ? 'Creating...' : 'Create Group'}
      </button>
      <a href="/groups" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md">Cancel</a>
    </div>
  </form>
</div>
