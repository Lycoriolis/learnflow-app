<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { subscribedTopics, loadCategories, isLoading, error, categories as categoriesStore } from '$lib/stores/forumStore.js';
  import { user } from '$lib/stores/authStore.js';
  import Icon from '@iconify/svelte';
  import type { ForumCategory, ForumTopic } from '$lib/types/forumTypes';
  import { getForumCategories } from '$lib/services/forums/forumService';

  // Helpers from parent page can be moved here
  function formatDate(date: Date | undefined | string): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function getDifficultyClass(difficulty: string | undefined): string {
    if (!difficulty) return '';
    const classes = {
      beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return classes[difficulty as keyof typeof classes] || '';
  }

  function getCategoryColorClass(color: string | undefined, forBg = true): string {
    const colorMap = {
      blue: ['blue-100 dark:blue-900/30','blue-800 dark:blue-300','blue-500 dark:blue-400'],
      green: ['green-100 dark:green-900/30','green-800 dark:green-300','green-500 dark:green-400'],
      gray: ['gray-100 dark:gray-700','gray-800 dark:gray-300','gray-500 dark:gray-400']
    };
    const base = color ? colorMap[color as keyof typeof colorMap] : colorMap.gray;
    return forBg
      ? `bg-${base[0]} text-${base[2]} dark:bg-${base[1]} dark:text-${base[2]}`
      : `text-${base[2]} dark:text-${base[1]}`;
  }

  let categories: ForumCategory[] = [];
  let subscribedCategories: string[] = $subscribedTopics;

  onMount(async () => {
    try {
      const result = await getForumCategories();
      categories = result;
      loadCategories();
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  });

  export let topics: ForumTopic[] = [];
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
    filteredCategories = limit ? $categoriesStore.slice(0, limit) : $categoriesStore;
  }
</script>

<div class="forum-list space-y-6">
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
  {:else}
    <!-- Categories Section -->
    {#if filteredCategories.length > 0}
      <div class="space-y-4">
        {#each filteredCategories as category}
          <a href="/forums/category/{category.id}" class="block">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-[1.01]">
              <div class="p-5">
                <div class="flex items-start">
                  <div class="flex-shrink-0 mr-4">
                    {#if category.imageUrl}
                      <img src={category.imageUrl} alt={category.name} class="w-12 h-12 rounded-md object-cover" />
                    {:else}
                      <div class="w-12 h-12 rounded-md bg-cherry-100 dark:bg-cherry-900/30 flex items-center justify-center">
                        <Icon icon={category.icon || 'mdi:forum'} class="w-6 h-6 text-cherry-600 dark:text-cherry-400" />
                      </div>
                    {/if}
                  </div>
                  
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
                        Last activity: {formatDate(category.last_activity_at)}
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

    <!-- Topics Section -->
    {#if topics.length > 0}
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          {#each topics as topic (topic.id)}
            <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <div>
                    <a href={`/forums/${topic.id}`} class="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                      {#if topic.is_pinned}<Icon icon="mdi:pin" class="inline-block w-4 h-4 text-indigo-500 mr-1" />{/if}
                      {#if topic.is_locked}<Icon icon="mdi:lock" class="inline-block w-4 h-4 text-gray-500 mr-1" />{/if}
                      {topic.title}
                    </a>
                    <div class="flex flex-wrap gap-1 mt-1">
                      {#if topic.difficulty}
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {getDifficultyClass(topic.difficulty)}">
                          {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                        </span>
                      {/if}
                      {#if topic.has_code_examples}
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          <Icon icon="mdi:code-braces" class="w-3 h-3 mr-1" />Code
                        </span>
                      {/if}
                      {#if topic.is_resolved}
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <Icon icon="mdi:check-circle" class="w-3 h-3 mr-1" />Resolved
                        </span>
                      {/if}
                    </div>

                    <!-- Tags -->
                    {#if topic.tags && topic.tags.length > 0}
                      <div class="flex flex-wrap gap-1 mt-2">
                        {#each topic.tags as tag}
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            #{tag}
                          </span>
                        {/each}
                      </div>
                    {/if}

                    <!-- Links -->
                    {#if topic.resource_links && topic.resource_links.length > 0}
                      <div class="mt-2">
                        <span class="text-xs text-gray-500">Resources:</span>
                        <div class="flex flex-wrap gap-2 mt-1">
                          {#each topic.resource_links as link}
                            <a href={link.url} target="_blank" rel="noopener noreferrer" 
                               class="inline-flex items-center text-xs text-indigo-600 hover:underline dark:text-indigo-400">
                              <Icon icon="mdi:link-variant" class="w-3 h-3 mr-1" />{link.title}
                            </a>
                          {/each}
                        </div>
                      </div>
                    {/if}
                  </div>
                </div>

                <!-- Topic Metadata -->
                <div class="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {#if topic.author}
                    <div class="flex items-center">
                      {#if topic.author.avatar}
                        <img src={topic.author.avatar} alt={topic.author.name} 
                             class="w-5 h-5 rounded-full mr-1.5"
                             on:error={(e) => {
                               const img = e.currentTarget as HTMLImageElement;
                               img.src = '/images/default-avatar.png';
                             }} />
                      {/if}
                      <span class="font-medium text-gray-900 dark:text-gray-100">{topic.author.name}</span>
                    </div>
                  {/if}
                  <span class="mx-2">•</span>
                  <span>{formatDate(topic.created_at)}</span>
                  {#if topic.last_post}
                    <span class="mx-2">•</span>
                    <span>Last reply by {topic.last_post.author.name} {formatDate(topic.last_post.date)}</span>
                  {/if}
                </div>
              </div>

              <!-- Topic Stats -->
              <div class="flex items-center space-x-4 ml-4">
                <button class="flex flex-col items-center {votingTopicId === topic.id ? 'opacity-50' : ''}"
                        on:click|preventDefault={() => vote(topic.id, 'up')}
                        disabled={votingTopicId === topic.id}>
                  <Icon icon="mdi:arrow-up" class="w-5 h-5 text-gray-400 hover:text-indigo-500" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">{topic.upvotes || 0}</span>
                </button>
                <button class="flex flex-col items-center {votingTopicId === topic.id ? 'opacity-50' : ''}"
                        on:click|preventDefault={() => vote(topic.id, 'down')}
                        disabled={votingTopicId === topic.id}>
                  <Icon icon="mdi:arrow-down" class="w-5 h-5 text-gray-400 hover:text-indigo-500" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">{topic.downvotes || 0}</span>
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
        <p class="text-gray-600 dark:text-gray-400">No discussions found.</p>
      </div>
    {/if}
  {/if}
</div>