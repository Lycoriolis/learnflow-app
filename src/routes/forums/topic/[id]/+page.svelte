<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { user } from '$lib/stores/authStore.js';

  // Types (Consider moving these to a shared types file later)
  type ForumTopic = {
    id: string;
    title: string;
    content: string; // Assuming topic content is markdown or similar
    category: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    createdAt: string;
    repliesCount: number;
    viewsCount: number;
    isPinned?: boolean;
    isLocked?: boolean;
    tags?: string[];
  };

  type ForumPost = {
    id: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    content: string; // Assuming post content is markdown or similar
    createdAt: string;
    isEdited?: boolean;
    editedAt?: string;
  };

  let topic: ForumTopic | null = null;
  let posts: ForumPost[] = [];
  let loading = true;
  let error: string | null = null;

  const topicId = $page.params.id;

  onMount(async () => {
    loading = true;
    error = null;
    try {
      // --- Placeholder for fetching topic data ---
      console.log(`Fetching data for topic ID: ${topicId}`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data for now
      topic = {
        id: topicId,
        title: `Sample Topic Title for ID ${topicId}`,
        content: `This is the main content for the forum topic with ID **${topicId}**. \n\nIt can contain *markdown* formatting. \n\n```javascript\nconsole.log('Hello, world!');\n````,
        category: 'webdev', // Example category
        author: {
          id: 'user-1',
          name: 'Alex Johnson',
          avatar: '/images/avatars/user-1.jpg'
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        repliesCount: 5,
        viewsCount: 120,
        tags: ['sample', 'sveltekit', 'forum']
      };

      // --- Placeholder for fetching post/reply data ---
      posts = [
        {
          id: 'post-1',
          author: {
            id: 'user-2',
            name: 'Emily Chen',
            avatar: '/images/avatars/user-2.jpg'
          },
          content: 'This is the first reply to the topic.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        },
        {
          id: 'post-2',
          author: {
            id: 'user-3',
            name: 'David Kim',
            avatar: '/images/avatars/user-3.jpg'
          },
          content: 'Great topic! Looking forward to the discussion.',
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
        }
      ];
      // --- End Placeholder ---

    } catch (err) {
      console.error('Error fetching topic data:', err);
      error = 'Failed to load topic data. Please try again later.';
    } finally {
      loading = false;
    }
  });

  function formatDate(dateString: string): string {
    // Basic date formatting (reuse or enhance from +page.svelte if needed)
    return new Date(dateString).toLocaleString();
  }

</script>

<svelte:head>
  <title>{loading ? 'Loading Topic...' : topic ? topic.title : 'Topic Not Found'} | LearnFlow Forums</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="loader"></div> <!-- Make sure you have a CSS loader defined -->
      <p class="ml-4 text-gray-600 dark:text-gray-400">Loading topic...</p>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{error}</span>
    </div>
  {:else if topic}
    <div in:fade={{ duration: 300 }}>
      <!-- Topic Header -->
      <div class="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{topic.title}</h1>
        <div class="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-x-4 gap-y-1">
          <span>Posted by <a href="/profile/{topic.author.id}" class="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">{topic.author.name}</a></span>
          <span>on {formatDate(topic.createdAt)}</span>
          {#if topic.category}
            <span>in <a href="/forums?category={topic.category}" class="font-medium hover:underline">{topic.category}</a></span>
          {/if}
          <span>{topic.viewsCount} views</span>
          <span>{topic.repliesCount} replies</span>
        </div>
        {#if topic.tags && topic.tags.length > 0}
          <div class="mt-2 flex flex-wrap gap-1">
            {#each topic.tags as tag}
              <span class="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">#{tag}</span>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Topic Content (Post 0) -->
      <div class="flex gap-4 mb-8">
        <div class="flex-shrink-0 w-12 pt-1">
          <img src={topic.author.avatar || '/images/default-avatar.jpg'} alt={topic.author.name} class="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700">
        </div>
        <div class="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
          <div class="flex justify-between items-center mb-2">
            <span class="font-semibold text-gray-800 dark:text-gray-200">{topic.author.name}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">{formatDate(topic.createdAt)}</span>
          </div>
          <div class="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <!-- Render topic.content here (potentially using a Markdown component) -->
            {@html topic.content.replace(/\n/g, '<br>') /* Basic rendering, replace with Markdown */}
          </div>
        </div>
      </div>

      <!-- Replies -->
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Replies ({posts.length})</h2>
      <div class="space-y-6">
        {#each posts as post (post.id)}
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-12 pt-1">
              <img src={post.author.avatar || '/images/default-avatar.jpg'} alt={post.author.name} class="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700">
            </div>
            <div class="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <div class="flex justify-between items-center mb-2">
                <span class="font-semibold text-gray-800 dark:text-gray-200">{post.author.name}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</span>
              </div>
              <div class="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <!-- Render post.content here -->
                {@html post.content.replace(/\n/g, '<br>') /* Basic rendering, replace with Markdown */}
              </div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Reply Form (Placeholder) -->
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Post a Reply</h3>
        {#if $user}
          <form on:submit|preventDefault={() => console.log('Submit reply...')}>
            <textarea class="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4" rows="5" placeholder="Write your reply here..."></textarea>
            <button type="submit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium">
              Submit Reply
            </button>
          </form>
        {:else}
          <p class="text-gray-600 dark:text-gray-400">You must be <a href="/login?redirect=/forums/topic/{topicId}" class="text-indigo-600 dark:text-indigo-400 hover:underline">logged in</a> to post a reply.</p>
        {/if}
      </div>
    </div>
  {:else}
    <div class="text-center py-16">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Topic Not Found</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">The topic you are looking for does not exist or may have been removed.</p>
      <a href="/forums" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium">
        Back to Forums
      </a>
    </div>
  {/if}
</div>

<style>
  /* Add any component-specific styles here */
  .loader {
    border: 4px solid #f3f3f3; /* Light grey */
    border-top: 4px solid #4f46e5; /* Indigo */
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>

<script>
  /** @type {import('./$types').PageData} */
  export let data;

  // No need for mock data here anymore
  // const topic = {
  //   id: 'topic-1',
  //   title: 'Getting Started with SvelteKit',
  //   author: 'Alice',
  //   date: '2023-10-26',
  //   content: 'SvelteKit is awesome! Here is how to start...',
  //   replies: [
  //     { author: 'Bob', date: '2023-10-27', content: 'Great introduction!' },
  //     { author: 'Charlie', date: '2023-10-28', content: 'I agree, SvelteKit simplifies a lot!' }
  //   ]
  // };
</script>

<div class="container mx-auto px-4 py-8">
  <a href="/forums" class="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Forums</a>

  <article class="bg-white shadow-md rounded-lg p-6 mb-6">
    <h1 class="text-3xl font-bold mb-2">{data.topic.title}</h1>
    <p class="text-gray-600 text-sm mb-4">
      Posted by <span class="font-semibold">{data.topic.author}</span> on {new Date(data.topic.date).toLocaleDateString()}
    </p>
    <div class="prose max-w-none">
      <!-- TODO: Render actual markdown content safely -->
      <p>{data.topic.content}</p>
    </div>
  </article>

  <section>
    <h2 class="text-2xl font-semibold mb-4">Replies ({data.topic.replies.length})</h2>
    {#if data.topic.replies.length > 0}
      <ul class="space-y-4">
        {#each data.topic.replies as reply}
          <li class="bg-gray-50 shadow-sm rounded-lg p-4">
            <p class="text-gray-600 text-sm mb-2">
              <span class="font-semibold">{reply.author}</span> replied on {new Date(reply.date).toLocaleDateString()}
            </p>
            <div class="prose prose-sm max-w-none">
              <!-- TODO: Render actual markdown content safely -->
              <p>{reply.content}</p>
            </div>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-gray-500">No replies yet. Be the first to reply!</p>
    {/if}

    <!-- TODO: Add a reply form -->
    <div class="mt-6">
      <h3 class="text-xl font-semibold mb-2">Post a Reply</h3>
      <form class="bg-white shadow-md rounded-lg p-4">
        <textarea class="w-full border rounded p-2 mb-2" rows="4" placeholder="Write your reply..."></textarea>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">Submit Reply</button>
      </form>
    </div>
  </section>
</div>