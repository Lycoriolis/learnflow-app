<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  let group: any = null;
  let members: any[] = [];
  let loading = true;
  let error = '';
  let groupId = '';

  $: groupId = $page.params.id;

  async function fetchGroup() {
    loading = true;
    error = '';
    try {
      const res = await fetch(`/api/groups/${groupId}`);
      if (res.ok) {
        const data = await res.json();
        group = data.group;
        members = data.members;
      } else {
        error = 'Group not found.';
      }
    } catch (e) {
      error = 'Failed to load group.';
    } finally {
      loading = false;
    }
  }

  onMount(fetchGroup);
</script>

<svelte:head>
  <title>{group ? group.name : 'Group'} | LearnFlow</title>
</svelte:head>

<div class="max-w-2xl mx-auto py-10 px-4">
  {#if loading}
    <div class="text-center text-gray-500">Loading...</div>
  {:else if error}
    <div class="text-center text-red-500">{error}</div>
  {:else if group}
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      {#if group.image}
        <img src={group.image} alt={group.name} class="w-full h-48 object-cover rounded mb-4" />
      {/if}
      <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{group.name}</h1>
      <div class="mb-2 text-gray-600 dark:text-gray-300">Topic: <span class="font-semibold">{group.topic}</span></div>
      <div class="mb-4 text-gray-600 dark:text-gray-300">{group.description}</div>
      <div class="mb-2 text-sm text-gray-500 dark:text-gray-400">{group.is_public ? 'Public' : 'Private'} group</div>
      <div class="mb-2 text-sm text-gray-500 dark:text-gray-400">Created by: {group.created_by}</div>
      <div class="mb-2 text-sm text-gray-500 dark:text-gray-400">Created at: {new Date(group.created_at).toLocaleString()}</div>
      <div class="mb-2 text-sm text-gray-500 dark:text-gray-400">Members: {members.length}</div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Members</h2>
      {#if members.length === 0}
        <div class="text-gray-500">No members yet.</div>
      {:else}
        <ul class="space-y-2">
          {#each members as m}
            <li class="text-gray-800 dark:text-gray-200">{m.user_id}</li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>
