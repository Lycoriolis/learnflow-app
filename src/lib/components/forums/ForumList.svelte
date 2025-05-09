<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { subscribedTopics } from '$lib/stores/forumStore.js';
  import type { User as FirebaseUser } from 'firebase/auth';

  // Define types for props
  type ForumCategory = {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    topicsCount: number; 
    postsCount: number;
  };

  type ForumTopic = {
    id: string;
    title: string;
    category: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    lastPost?: {
      author: {
        id: string;
        name: string;
        avatar?: string;
      };
      date: string;
    };
    createdAt: string;
    repliesCount: number;
    viewsCount: number;
    isPinned?: boolean;
    isLocked?: boolean;
    tags?: string[];
    upvotes?: number;
    downvotes?: number;
    userVote?: 'up' | 'down' | null;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    resourceLinks?: { title: string; url: string }[];
    hasCodeExamples?: boolean;
    isResolved?: boolean;
  };

  // Props
  export let topics: ForumTopic[] = [];
  export let categories: ForumCategory[] = [];
  export let votingTopicId: string | null = null;
  export let subscribingTopicId: string | null = null;
  export let unsubscribingTopicId: string | null = null;
  export let user: FirebaseUser | null = null; // User prop

  const dispatch = createEventDispatcher();

  // Helper functions
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function getCategoryById(id: string): ForumCategory | undefined {
    return categories.find((c: ForumCategory) => c.id === id);
  }

  function getCategoryColorClass(color: string, forBg = true): string {
    const colorStyles: Record<string, {bg: string, textOnBg: string, link: string}> = {
      blue:   { bg: 'bg-blue-100 dark:bg-blue-900/30',   textOnBg: 'text-blue-800 dark:text-blue-300',   link: 'text-blue-500 dark:text-blue-400' },
      green:  { bg: 'bg-green-100 dark:bg-green-900/30', textOnBg: 'text-green-800 dark:text-green-300', link: 'text-green-500 dark:text-green-400' },
      purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', textOnBg: 'text-purple-800 dark:text-purple-300', link: 'text-purple-500 dark:text-purple-400' },
      orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', textOnBg: 'text-orange-800 dark:text-orange-300', link: 'text-orange-500 dark:text-orange-400' },
      indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', textOnBg: 'text-indigo-800 dark:text-indigo-300', link: 'text-indigo-500 dark:text-indigo-400' },
      pink:   { bg: 'bg-pink-100 dark:bg-pink-900/30',   textOnBg: 'text-pink-800 dark:text-pink-300',   link: 'text-pink-500 dark:text-pink-400' },
      gray:   { bg: 'bg-gray-100 dark:bg-gray-700',     textOnBg: 'text-gray-800 dark:text-gray-300',   link: 'text-gray-500 dark:text-gray-400' }
    };
    const selectedStyle = colorStyles[color] || colorStyles.gray;
    return forBg
      ? `${selectedStyle.bg} ${selectedStyle.textOnBg}`
      : selectedStyle.link;
  }

  function subscribe(id: string) { dispatch('subscribe', id); }
  function unsubscribe(id: string) { dispatch('unsubscribe', id); }
  function vote(id: string, type: 'up' | 'down') { dispatch('vote', { id, type }); }

</script>

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
                <a href={`/forums/topic/${topic.id}`} class="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
                  {#if topic.isPinned}<i class="fas fa-thumbtack text-indigo-500 mr-1 text-xs"></i>{/if}
                  {#if topic.isLocked}<i class="fas fa-lock text-gray-500 mr-1 text-xs"></i>{/if}
                  {topic.title}
                </a>
                <div class="flex flex-wrap gap-1 mt-1">
                  {#if topic.difficulty}
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                      {topic.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}">
                      {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                    </span>
                  {/if}
                  {#if topic.hasCodeExamples}
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      <i class="fas fa-code mr-1"></i>Code
                    </span>
                  {/if}
                  {#if topic.isResolved}
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <i class="fas fa-check-circle mr-1"></i>Resolved
                    </span>
                  {/if}
                </div>
                {#if topic.tags?.length}
                  <div class="flex flex-wrap gap-1 mt-2">
                    {#each topic.tags as tag}
                      <a href={`/forums/tag/${tag}`} class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                        #{tag}
                      </a>
                    {/each}
                  </div>
                {/if}
                {#if topic.resourceLinks?.length}
                  <div class="mt-2">
                    <span class="text-xs text-gray-500 dark:text-gray-400">Resources:</span>
                    <div class="flex flex-wrap gap-2 mt-1">
                      {#each topic.resourceLinks as link}
                        <a href={link.url} target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-xs text-indigo-600 hover:underline dark:text-indigo-400">
                          <i class="fas fa-external-link-alt mr-1"></i>{link.title}
                        </a>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
              <div class="ml-2 flex-shrink-0">
                {#if getCategoryById(topic.category)}
                  {@const cat = getCategoryById(topic.category)}
                  {#if cat}
                    <a href={`/forums/category/${topic.category}`} class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getCategoryColorClass(cat.color)}">
                      <i class={`fas ${cat.icon} mr-1`}></i> {cat.name}
                    </a>
                  {/if}
                {/if}
              </div>
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center">
                {#if topic.author.avatar}<img src={topic.author.avatar} alt={topic.author.name} class="w-5 h-5 rounded-full mr-1.5" />{/if}
                <a href={`/profile/${topic.author.id}`} class="font-medium hover:underline text-gray-700 dark:text-gray-300">{topic.author.name}</a>
                <span class="mx-1.5">·</span><span>{formatDate(topic.createdAt)}</span>
              </div>
              <div class="flex items-center ml-auto space-x-4">
                <div class="flex items-center"><i class="fas fa-eye mr-1 text-gray-400"></i><span>{topic.viewsCount}</span></div>
                <div class="flex items-center"><i class="fas fa-comment-alt mr-1 text-gray-400"></i><span>{topic.repliesCount}</span></div>
              </div>
            </div>
            {#if topic.lastPost}
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <span>Last reply by</span>
                <div class="flex items-center ml-1">
                  {#if topic.lastPost.author.avatar}<img src={topic.lastPost.author.avatar} alt={topic.lastPost.author.name} class="w-4 h-4 rounded-full mr-1" />{/if}
                  <a href={`/profile/${topic.lastPost.author.id}`} class="font-medium hover:underline text-gray-700 dark:text-gray-300">{topic.lastPost.author.name}</a>
                </div>
                <span class="mx-1">·</span><span>{formatDate(topic.lastPost.date)}</span>
              </div>
            {/if}
          </div>
          <div class="ml-4 flex flex-col items-end gap-2 flex-shrink-0">
            <!-- Voting controls -->
            <div class="flex flex-col items-center space-y-1">
              <button on:click={() => vote(topic.id, 'up')} class="text-gray-400 hover:text-green-600 {topic.userVote === 'up' ? 'text-green-600 dark:text-green-400 font-bold' : 'dark:hover:text-green-400'}" disabled={votingTopicId === topic.id || !user}>
                <i class="fas fa-arrow-up"></i>
                {#if votingTopicId === topic.id && user} <span class="ml-1 animate-spin">⏳</span> {/if}
              </button>
              <span class="text-sm text-gray-600 dark:text-gray-400">{topic.upvotes || 0}</span>
              <button on:click={() => vote(topic.id, 'down')} class="text-gray-400 hover:text-red-600 {topic.userVote === 'down' ? 'text-red-600 dark:text-red-400 font-bold' : 'dark:hover:text-red-400'}" disabled={votingTopicId === topic.id || !user}>
                <i class="fas fa-arrow-down"></i>
                {#if votingTopicId === topic.id && user} <span class="ml-1 animate-spin">⏳</span> {/if}
              </button>
              <span class="text-sm text-gray-600 dark:text-gray-400">{topic.downvotes || 0}</span>
            </div>
            <!-- Subscription controls -->
            {#if user}
              {#if $subscribedTopics.includes(topic.id)}
                <button on:click={() => unsubscribe(topic.id)} class="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 dark:bg-yellow-600/30 dark:text-yellow-200 dark:hover:bg-yellow-500/30" disabled={unsubscribingTopicId === topic.id}>
                  <i class="fas fa-bell-slash mr-1"></i>Unsubscribe
                  {#if unsubscribingTopicId === topic.id} <span class="ml-1 animate-spin">⏳</span> {/if}
                </button>
              {:else}
                <button on:click={() => subscribe(topic.id)} class="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200 dark:bg-indigo-600/30 dark:text-indigo-200 dark:hover:bg-indigo-500/30" disabled={subscribingTopicId === topic.id}>
                  <i class="fas fa-bell mr-1"></i>Subscribe
                  {#if subscribingTopicId === topic.id} <span class="ml-1 animate-spin">⏳</span> {/if}
                </button>
              {/if}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}