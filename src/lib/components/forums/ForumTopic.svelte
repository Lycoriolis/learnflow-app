<script lang="ts">
  import NewPostForm from './NewPostForm.svelte';
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/authStore.js';
  import MarkdownRenderer from '../MarkdownRenderer.svelte';

  // Define types
  type Post = {
    id: string;
    author_name: string;
    author_avatar?: string;
    created_at?: string;
    content: string;
  };
  type Topic = {
    id: string;
    title: string;
    content: string;
    author: { id: string; name: string; avatar?: string } | string;
    createdAt: string;
  };

  export let topic: Topic = { id: '', title: 'Loading...', content: '', author: '', createdAt: new Date().toISOString() };
  let posts: Post[] = [];
  let loadingReplies = true;
  let repliesError = '';
  let repliesPerPage = 10;
  let currentPage = 1;
  $: paginatedPosts = posts.slice(0, repliesPerPage * currentPage);
  let hasMoreReplies = posts.length > paginatedPosts.length;

  $: currentUser = $user;

  async function fetchReplies() {
    loadingReplies = true;
    repliesError = '';
    try {
      const res = await fetch(`/api/forum/posts?topic_id=${topic.id}`);
      if (res.ok) {
        posts = await res.json();
      } else {
        repliesError = 'Failed to load replies.';
      }
    } catch (e) {
      repliesError = 'Error loading replies.';
    } finally {
      loadingReplies = false;
    }
  }

  function loadMoreReplies() {
    currentPage += 1;
  }

  onMount(() => {
    if (topic.id) fetchReplies();
  });

  async function handleNewPost(event: CustomEvent) {
    const content = event.detail.content;
    if (!currentUser || !currentUser.uid) {
      alert('You must be logged in to reply.');
      return;
    }
    try {
      const res = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: topic.id,
          author_id: currentUser.uid,
          content
        })
      });
      if (res.ok) {
        const newPost = await res.json();
        posts = [...posts, newPost];
      } else {
        alert('Failed to post reply.');
      }
    } catch (e) {
      alert('Error posting reply.');
    }
  }
</script>

<div class="forum-topic p-4">
  <h1 class="text-3xl font-bold mb-2">{topic.title}</h1>
  <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Started by {topic.author} on {new Date(topic.createdAt).toLocaleString()}</p>
  
  <div class="topic-content mb-6 p-4 border rounded bg-gray-50 dark:bg-gray-800">
    <p>{topic.content}</p>
  </div>

  <h2 class="text-2xl font-semibold mb-4">Replies</h2>
  {#if loadingReplies}
    <p>Loading replies...</p>
  {:else if repliesError}
    <p class="text-red-500">{repliesError}</p>
  {:else if posts.length > 0}
    <ul class="space-y-4">
      {#each paginatedPosts as post}
        <li class="post p-3 border rounded bg-white dark:bg-gray-700 shadow-sm">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">By {post.author_name} on {new Date(post.created_at || 0).toLocaleString()}</p>
          <div class="post-content">
            <MarkdownRenderer content={post.content} />
          </div>
        </li>
      {/each}
    </ul>
    {#if hasMoreReplies}
      <div class="flex justify-center mt-4">
        <button class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm font-medium" on:click={loadMoreReplies}>
          Load more replies
        </button>
      </div>
    {/if}
  {:else}
    <p>No replies yet.</p>
  {/if}

  <div class="mt-8">
    <h3 class="text-xl font-semibold mb-3">Add a Reply</h3>
    <NewPostForm on:newPost={handleNewPost} />
  </div>
</div>