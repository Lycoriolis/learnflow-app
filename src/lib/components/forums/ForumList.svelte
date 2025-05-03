<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { subscribedTopics, loadCategories, isLoading, error } from '$lib/stores/forumStore.js';
  import { user } from '$lib/stores/authStore.js';
  import Icon from '@iconify/svelte';
  import type { ForumCategory } from '$lib/types/forumTypes';
  import { getForumCategories } from '$lib/services/forums/forumService';

  // Helpers from parent page can be moved here
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function getCategoryById(id: string) {
    return categories.find((c: any) => c.id === id);
  }
  function getCategoryColorClass(color: string, forBg = true) {
    const base = {
      blue: ['blue-100 dark:blue-900/30','blue-800 dark:blue-300','blue-500 dark:blue-400'],
      green: ['green-100 dark:green-900/30','green-800 dark:green-300','green-500 dark:green-400'],
      gray: ['gray-100 dark:gray-700','gray-800 dark:gray-300','gray-500 dark:gray-400']
    }[color] || ['gray-100','gray-800','gray-500'];
    return forBg
      ? `bg-${base[0]} text-${base[2]} dark:bg-${base[1]} dark:text-${base[2]}`
      : `text-${base[2]} dark:text-${base[1]}`;
  }
  export let topics: any[] = [];
  export let votingTopicId: string | null = null;
  export let subscribingTopicId: string | null = null;
  export let unsubscribingTopicId: string | null = null;
  export let showHeader = true;
  export let limit: number | null = null;

  const dispatch = createEventDispatcher();
  function subscribe(id: string) { dispatch('subscribe', id); }
  function unsubscribe(id: string) { dispatch('unsubscribe', id); }
  function vote(id: string, type: string) { dispatch('vote', { id, type }); }
  $: currentUser = $user;

  let filteredCategories: ForumCategory[] = [];
  $: {
    filteredCategories = limit ? $categories.slice(0, limit) : $categories;
  }

  let categories = [];
  onMount(async () => {
    categories = await getForumCategories();
    loadCategories();
  });
</script>

<div class="forum-list">
  {#if showHeader}
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Forums</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">Join discussions, ask questions, and share knowledge</p>
    </div>
  {/if}
  
  {#if $isLoading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cherry-500"></div>
    </div>
  {:else if $error}
    <div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6">
      <p>{$error}</p>
    </div>
  {:else if filteredCategories.length === 0}
    <div class="text-center py-12">
      <Icon icon="mdi:forum-outline" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories found</h3>
      <p class="text-gray-600 dark:text-gray-400">There are no forum categories available yet.</p>
    </div>
  {:else}
    <div class="space-y-6">
      {#each filteredCategories as category}
        <a href="/forums/category/{category.id}" class="block">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-[1.01]">
            <div class="p-5">
              <div class="flex items-start">
                {#if category.imageUrl}
                  <div class="flex-shrink-0 mr-4">
                    <img src={category.imageUrl} alt={category.name} class="w-12 h-12 rounded-md object-cover" />
                  </div>
                {:else}
                  <div class="flex-shrink-0 mr-4">
                    <div class="w-12 h-12 rounded-md bg-cherry-100 dark:bg-cherry-900/30 flex items-center justify-center">
                      <Icon icon="mdi:forum" class="w-6 h-6 text-cherry-600 dark:text-cherry-400" />
                    </div>
                  </div>
                {/if}
                
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{category.description}</p>
                </div>
                
                <div class="ml-4 flex-shrink-0 text-right">
                  <div class="flex items-center text-cherry-600 dark:text-cherry-400">
                    <Icon icon="mdi:comment-multiple-outline" class="w-5 h-5 mr-1" />
                    <span class="text-sm font-medium">{category.topic_count || 0}</span>
                  </div>
                  
                  {#if category.last_activity_at}
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Last activity: {new Date(category.last_activity_at).toLocaleDateString()}
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>

<div class="forum-list">
  {#each categories as category}
    <div class="category">
      <h3>{category.name}</h3>
      <p>{category.description}</p>
    </div>
  {/each}
</div>

{#if topics.length === 0}
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
    <p class="text-gray-600 dark:text-gray-400">No discussions found.</p>
  </div>
{:else}
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    <div class="divide-y divide-gray-200 dark:divide-gray-700">
      {#each topics as topic (topic.id)}
        <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-start justify-between">
              <div>
                <a href={`/forums/${topic.id}`} class="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                  {#if topic.is_pinned}<i class="fas fa-thumbtack text-indigo-500 mr-1 text-xs"></i>{/if}
                  {#if topic.is_locked}<i class="fas fa-lock text-gray-500 mr-1 text-xs"></i>{/if}
                  {topic.title}
                </a>
                <div class="flex flex-wrap gap-1 mt-1">
                  {#if topic.difficulty}
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                      {topic.difficulty === 'beginner' ? 'bg-green-100 text-green-800' : topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
                      {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                    </span>
                  {/if}
                  {#if topic.has_code_examples}
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      <i class="fas fa-code mr-1"></i>Code
                    </span>
                  {/if}
                  {#if topic.is_resolved}
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <i class="fas fa-check-circle mr-1"></i>Resolved
                    </span>
                  {/if}
                </div>
                {#if topic.tags?.length}
                  <div class="flex flex-wrap gap-1 mt-2">
                    {#each topic.tags as tag}
                      <a href={`/forums/tag/${tag}`} class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200">
                        #{tag}
                      </a>
                    {/each}
                  </div>
                {/if}
                {#if topic.resource_links}
                  <div class="mt-2">
                    <span class="text-xs text-gray-500">Resources:</span>
                    <div class="flex flex-wrap gap-2 mt-1">
                      {#each topic.resource_links as link}
                        <a href={link.url} target="_blank" rel="noopener" class="inline-flex items-center text-xs text-indigo-600 hover:underline">
                          <i class="fas fa-external-link-alt mr-1"></i>{link.title}
                        </a>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
              <div class="ml-2">
                {#if getCategoryById(topic.category_id)}
                  {@const cat = getCategoryById(topic.category_id)}
                  <a href={`/forums/category/${topic.category_id}`} class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getCategoryColorClass(cat.color)}">
                    <i class={`fas ${cat.icon} mr-1`}></i> {cat.name}
                  </a>
                {/if}
              </div>
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <div class="flex items-center">
                {#if topic.author.avatar}<img src={topic.author.avatar} alt={topic.author.name} class="w-5 h-5 rounded-full mr-1.5" />{/if}
                <a href={`/profile/${topic.author.id}`} class="font-medium hover:underline text-gray-700">{topic.author.name}</a>
                <span class="mx-1.5">·</span><span>{formatDate(topic.created_at)}</span>
              </div>
              <div class="flex items-center ml-auto space-x-4">
                <div class="flex items-center"><i class="fas fa-eye mr-1 text-gray-400"></i><span>{topic.views}</span></div>
                <div class="flex items-center"><i class="fas fa-comment-alt mr-1 text-gray-400"></i><span>{topic.post_count}</span></div>
              </div>
            </div>
            {#if topic.last_post}
              <div class="mt-2 text-xs text-gray-500 flex items-center">
                <span>Last reply by</span>
                <div class="flex items-center ml-1">
                  {#if topic.last_post.author.avatar}<img src={topic.last_post.author.avatar} alt={topic.last_post.author.name} class="w-4 h-4 rounded-full mr-1" />{/if}
                  <a href={`/profile/${topic.last_post.author.id}`} class="font-medium hover:underline text-gray-700">{topic.last_post.author.name}</a>
                </div>
                <span class="mx-1">·</span><span>{formatDate(topic.last_post.date)}</span>
              </div>
            {/if}
          </div>
          <div class="ml-4 flex flex-col items-end gap-2">
            <!-- Voting controls -->
            <div class="flex flex-col items-center space-y-1">
              <button on:click={() => vote(topic.id, 'up')} class="text-gray-400 hover:text-green-600 {topic.user_vote === 'up' ? 'text-green-600 font-bold' : ''}" disabled={votingTopicId === topic.id}>
                <i class="fas fa-arrow-up"></i>
                {#if votingTopicId === topic.id}
                  <span class="ml-1 animate-spin">⏳</span>
                {/if}
              </button>
              <span class="text-sm text-gray-600 dark:text-gray-400">{topic.upvotes || 0}</span>
              <button on:click={() => vote(topic.id, 'down')} class="text-gray-400 hover:text-red-600 {topic.user_vote === 'down' ? 'text-red-600 font-bold' : ''}" disabled={votingTopicId === topic.id}>
                <i class="fas fa-arrow-down"></i>
                {#if votingTopicId === topic.id}
                  <span class="ml-1 animate-spin">⏳</span>
                {/if}
              </button>
              <span class="text-sm text-gray-600 dark:text-gray-400">{topic.downvotes || 0}</span>
            </div>
            {#if $subscribedTopics.includes(topic.id)}
              <button on:click={() => unsubscribe(topic.id)} class="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded" disabled={unsubscribingTopicId === topic.id}>
                <i class="fas fa-bell-slash mr-1"></i>Unsubscribe
                {#if unsubscribingTopicId === topic.id}
                  <span class="ml-1 animate-spin">⏳</span>
                {/if}
              </button>
            {:else}
              <button on:click={() => subscribe(topic.id)} class="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded" disabled={subscribingTopicId === topic.id}>
                <i class="fas fa-bell mr-1"></i>Subscribe
                {#if subscribingTopicId === topic.id}
                  <span class="ml-1 animate-spin">⏳</span>
                {/if}
              </button>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}