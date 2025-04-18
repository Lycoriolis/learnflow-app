<script lang="ts">
  // Removing PageData type import due to module resolution issues
  export let data: any;
  import { fade } from 'svelte/transition';
  import { user } from '$lib/stores/authStore.js';
  import { subscribedTopics } from '$lib/stores/forumStore.js';
  import ForumHeader from '$lib/components/forums/ForumHeader.svelte';
  import ForumList from '$lib/components/forums/ForumList.svelte';
  import ForumSidebar from '$lib/components/forums/ForumSidebar.svelte';
  import CreateTopicForm from '$lib/components/forums/CreateTopicForm.svelte';

  let topics = data.topics;
  let categories = data.categories;
  let selectedTag = data.selectedTag;
  let showCreateTopic = false;
  let showSubscriptions = false;

  function handleNewTopicClick() {
    showCreateTopic = true;
  }

  function handleToggleSubscriptions() {
    showSubscriptions = !showSubscriptions;
  }

  function handleTopicCreated(event: CustomEvent) {
    topics = [event.detail, ...topics];
  }

  function handleSubscribe(id: string) {
    if (!$subscribedTopics.includes(id)) subscribedTopics.update((ids: string[]) => [...ids, id]);
  }

  function handleUnsubscribe(id: string) {
    subscribedTopics.update((ids: string[]) => ids.filter(i => i !== id));
  }

  function handleVote(id: string, type: 'up' | 'down') {
    fetch(`/api/forum/topics/${id}/vote`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: $user?.uid, vote_type: type === 'up' ? 1 : -1 })
    }).then(res => { if (!res.ok) throw new Error('Vote failed'); }).catch(console.error);
  }
</script>

<svelte:head>
  <title>Tag: {selectedTag} | LearnFlow Forums</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-7xl">
  <ForumHeader on:newTopic={handleNewTopicClick} on:toggleSubscriptions={handleToggleSubscriptions} />

  {#if showCreateTopic}
    <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" on:click={() => showCreateTopic = false}>&times;</button>
        <CreateTopicForm categories={categories} on:topicCreated={handleTopicCreated} />
      </div>
    </div>
  {/if}

  <div in:fade={{ duration: 300 }} class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div class="lg:col-span-9">
      <h2 class="text-2xl font-bold mb-4">Tag: {selectedTag}</h2>
      <ForumList
        topics={topics}
        categories={categories}
        on:subscribe={({ detail }) => handleSubscribe(detail)}
        on:unsubscribe={({ detail }) => handleUnsubscribe(detail)}
        on:vote={({ detail }) => handleVote(detail.id, detail.type)}
      />
    </div>
    <div class="lg:col-span-3">
      <ForumSidebar categories={categories} filterCategory="all" />
    </div>
  </div>
</div>