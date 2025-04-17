<script lang="ts">
  import ForumList from '$lib/components/forums/ForumList.svelte';
  import CreateTopicForm from '$lib/components/forums/CreateTopicForm.svelte';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { user } from '$lib/stores/authStore.js';

  // Declare the data prop passed from the load function
  export let data;

  // Initialize topics and categories from the loaded data
  let topics = data.topics;
  let categories = data.categories;

  // Types
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

  // Filter and sorting
  let filterCategory = 'all';
  let searchQuery = '';
  let sortOption = 'latest';
  let difficultyFilter = 'all';
  let showResolved = true;
  let showUnresolved = true;

  // Filtered topics with enhanced filtering
  $: filteredTopics = topics
    .filter(topic => {
      const matchesCategory = filterCategory === 'all' || topic.category === filterCategory;
      const matchesSearch = searchQuery === '' ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (topic.tags && topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesDifficulty = difficultyFilter === 'all' || topic.difficulty === difficultyFilter;
      const matchesResolution = 
        (showResolved && topic.isResolved) || 
        (showUnresolved && !topic.isResolved) || 
        (topic.isResolved === undefined);
      
      return matchesCategory && matchesSearch && matchesDifficulty && matchesResolution;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      if (sortOption === 'latest') {
        const dateA = a.lastPost ? new Date(a.lastPost.date) : new Date(a.createdAt);
        const dateB = b.lastPost ? new Date(b.lastPost.date) : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      } else if (sortOption === 'popular') {
        return b.viewsCount - a.viewsCount;
      } else if (sortOption === 'most-replies') {
        return b.repliesCount - a.repliesCount;
      } else if (sortOption === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOption === 'most-upvoted') {
        return (b.upvotes || 0) - (a.upvotes || 0);
      }
      return 0;
    });

  // Helper functions
  function getCategoryById(id: string): ForumCategory | undefined {
    return categories.find(cat => cat.id === id);
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} min${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }

  function getCategoryColorClass(color: string, forBackground: boolean = true): string {
    const baseClasses: Record<string, string> = {
      blue: 'blue-100 dark:blue-900/30 blue-800 dark:blue-300 blue-500 dark:blue-400',
      green: 'green-100 dark:green-900/30 green-800 dark:green-300 green-500 dark:green-400',
      purple: 'purple-100 dark:purple-900/30 purple-800 dark:purple-300 purple-500 dark:purple-400',
      orange: 'orange-100 dark:orange-900/30 orange-800 dark:orange-300 orange-500 dark:orange-400',
      indigo: 'indigo-100 dark:indigo-900/30 indigo-800 dark:indigo-300 indigo-500 dark:indigo-400',
      pink: 'pink-100 dark:pink-900/30 pink-800 dark:pink-300 pink-500 dark:pink-400',
      gray: 'gray-100 dark:gray-700 gray-800 dark:gray-300 gray-500 dark:gray-400'
    };
    const parts = baseClasses[color]?.split(' ') || baseClasses['gray'].split(' ');
    return forBackground ? `bg-${parts[0]} dark:bg-${parts[1]} text-${parts[2]} dark:text-${parts[3]}` : `text-${parts[4]} dark:text-${parts[5]}`;
  }

  // Function to handle the 'topicCreated' event from CreateTopicForm
  function handleTopicCreated(event: CustomEvent) {
    const newTopic = event.detail;
    topics = [newTopic, ...topics];
  }

  // Voting functions for the dynamic backend
  async function handleVote(topicId: string, voteType: 'up' | 'down') {
    const topicIndex = topics.findIndex(t => t.id === topicId);
    if (topicIndex === -1) return;
    const topic = topics[topicIndex];
    const currentUser = $user;
    if (!currentUser || !currentUser.id) {
      alert('You must be logged in to vote.');
      return;
    }
    const vote_type = voteType === 'up' ? 1 : -1;
    try {
      const res = await fetch(`/api/forum/topics/${topicId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, vote_type })
      });
      if (res.ok) {
        const data = await res.json();
        topic.upvotes = data.upvotes;
        topic.downvotes = data.downvotes;
        // Toggle userVote for UI
        if (topic.userVote === voteType) {
          topic.userVote = null;
        } else {
          topic.userVote = voteType;
        }
        topics = [...topics];
      } else {
        alert('Failed to vote.');
      }
    } catch (e) {
      alert('Error voting.');
    }
  }

  // Loading state
  let loading = true;

  onMount(() => {
    setTimeout(() => {
      loading = false;
    }, 800);
  });
</script>

<svelte:head>
  <title>Forums | LearnFlow</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-7xl">
  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="loader"></div>
    </div>
  {:else}
    <div in:fade={{ duration: 300 }}>
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Community Forums</h1>
          <p class="text-gray-600 dark:text-gray-400">Discuss courses, ask questions, and connect with other learners</p>
        </div>

        <div class="mt-4 md:mt-0 flex space-x-2">
          <button
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium flex items-center"
          >
            <i class="fas fa-plus mr-2"></i>
            New Topic
          </button>
          <button
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm font-medium flex items-center"
          >
            <i class="fas fa-bell mr-2"></i>
            My Subscriptions
          </button>
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="relative flex-grow">
            <input
              type="text"
              class="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search topics..."
              bind:value={searchQuery}
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <!-- Category filter -->
            <div class="relative">
              <select
                class="appearance-none pl-4 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                bind:value={filterCategory}
              >
                <option value="all">All Categories</option>
                {#each categories as category}
                  <option value={category.id}>{category.name}</option>
                {/each}
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>

            <!-- Sort options -->
            <div class="relative">
              <select
                class="appearance-none pl-4 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                bind:value={sortOption}
              >
                <option value="latest">Latest Activity</option>
                <option value="created">Created</option>
                <option value="popular">Most Viewed</option>
                <option value="most-replies">Most Replies</option>
                <option value="most-upvoted">Most Upvoted</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
            
            <!-- Difficulty filter -->
            <div class="relative">
              <select
                class="appearance-none pl-4 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                bind:value={difficultyFilter}
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Forum Content -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Topic List -->
        <div class="lg:col-span-9">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {filterCategory === 'all' ? 'Recent Discussions' : getCategoryById(filterCategory)?.name || 'Discussions'}
            </h2>
            {#if filteredTopics.length > 0 && searchQuery}
              <span class="text-sm text-gray-600 dark:text-gray-400">{filteredTopics.length} results for "{searchQuery}"</span>
            {/if}
          </div>

          {#if filteredTopics.length === 0}
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
              <div class="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mx-auto flex items-center justify-center mb-4">
                <i class="fas fa-comments text-indigo-600 dark:text-indigo-400 text-2xl"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No discussions found</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                {#if searchQuery}
                  No discussions match your search criteria.
                {:else if filterCategory !== 'all'}
                  No discussions found in this category.
                {:else}
                  Be the first to start a discussion!
                {/if}
              </p>
              <div class="flex justify-center">
                <button
                  class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
                  on:click={() => { searchQuery = ''; filterCategory = 'all'; }}
                >
                  {searchQuery || filterCategory !== 'all' ? 'Clear Filters' : 'Start a New Topic'}
                </button>
              </div>
            </div>
          {:else}
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div class="divide-y divide-gray-200 dark:divide-gray-700">
                {#each filteredTopics as topic (topic.id)}
                  <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div class="flex">
                      <!-- Voting Column -->
                      <div class="flex flex-col items-center mr-4 pt-1">
                        <button 
                          class="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 {topic.userVote === 'up' ? 'text-indigo-600 dark:text-indigo-400' : ''}"
                          on:click={() => handleVote(topic.id, 'up')}
                          aria-label="Upvote"
                        >
                          <i class="fas fa-chevron-up"></i>
                        </button>
                        <span class="text-sm font-medium my-1">{(topic.upvotes || 0) - (topic.downvotes || 0)}</span>
                        <button 
                          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 {topic.userVote === 'down' ? 'text-gray-600 dark:text-gray-300' : ''}"
                          on:click={() => handleVote(topic.id, 'down')}
                          aria-label="Downvote"
                        >
                          <i class="fas fa-chevron-down"></i>
                        </button>
                      </div>
                      
                      <!-- Main Content -->
                      <div class="flex-1">
                        <div class="flex items-start justify-between">
                          <div>
                            <a href="/forums/{topic.id}" class="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                              {#if topic.isPinned}
                                <i class="fas fa-thumbtack text-indigo-500 mr-1 text-xs"></i>
                              {/if}
                              {#if topic.isLocked}
                                <i class="fas fa-lock text-gray-500 mr-1 text-xs"></i>
                              {/if}
                              {topic.title}
                            </a>
                            
                            <!-- Educational indicators -->
                            <div class="flex flex-wrap gap-1 mt-1">
                              {#if topic.difficulty}
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                                  {topic.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                                  topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}">
                                  {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                                </span>
                              {/if}
                              
                              {#if topic.hasCodeExamples}
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                  <i class="fas fa-code mr-1"></i> Code Examples
                                </span>
                              {/if}
                              
                              {#if topic.isResolved}
                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                  <i class="fas fa-check-circle mr-1"></i> Resolved
                                </span>
                              {/if}
                            </div>
                            
                            <!-- Tags -->
                            {#if topic.tags && topic.tags.length > 0}
                              <div class="flex flex-wrap gap-1 mt-2">
                                {#each topic.tags as tag}
                                  <a href="/forums/tag/{tag}" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                    #{tag}
                                  </a>
                                {/each}
                              </div>
                            {/if}
                            
                            <!-- Resource Links -->
                            {#if topic.resourceLinks && topic.resourceLinks.length > 0}
                              <div class="mt-2">
                                <span class="text-xs text-gray-500 dark:text-gray-400">Resources: </span>
                                <div class="flex flex-wrap gap-2 mt-1">
                                  {#each topic.resourceLinks as link}
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                                      <i class="fas fa-external-link-alt mr-1"></i> {link.title}
                                    </a>
                                  {/each}
                                </div>
                              </div>
                            {/if}
                          </div>
                          
                          <!-- Category Badge -->
                          <div class="ml-2">
                            {#if topic.category}
                              {#if getCategoryById(topic.category)}
                                {@const category = getCategoryById(topic.category)}
                                <a
                                  href="/forums/category/{topic.category}"
                                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getCategoryColorClass(category?.color || 'gray')}"
                                >
                                  <i class="fas {category?.icon} mr-1"></i>
                                  {category?.name}
                                </a>
                              {/if}
                            {/if}
                          </div>
                        </div>
                        
                        <!-- Author and Stats -->
                        <div class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <div class="flex items-center">
                            {#if topic.author.avatar}
                              <img src={topic.author.avatar} alt={topic.author.name} class="w-5 h-5 rounded-full mr-1.5" />
                            {/if}
                            <a href="/profile/{topic.author.id}" class="hover:underline font-medium text-gray-700 dark:text-gray-300">{topic.author.name}</a>
                            <span class="mx-1.5">·</span>
                            <span>{formatDate(topic.createdAt)}</span>
                          </div>
                          
                          <div class="flex items-center ml-auto space-x-4">
                            <div class="flex items-center">
                              <i class="fas fa-eye text-gray-400 mr-1"></i>
                              <span>{topic.viewsCount}</span>
                            </div>
                            <div class="flex items-center">
                              <i class="fas fa-comment-alt text-gray-400 mr-1"></i>
                              <span>{topic.repliesCount}</span>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Last Reply Info -->
                        {#if topic.lastPost}
                          <div class="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <span>Last reply by</span>
                            <div class="flex items-center ml-1">
                              {#if topic.lastPost.author.avatar}
                                <img src={topic.lastPost.author.avatar} alt={topic.lastPost.author.name} class="w-4 h-4 rounded-full mr-1" />
                              {/if}
                              <a href="/profile/{topic.lastPost.author.id}" class="hover:underline font-medium text-gray-700 dark:text-gray-300">{topic.lastPost.author.name}</a>
                            </div>
                            <span class="mx-1">·</span>
                            <span>{formatDate(topic.lastPost.date)}</span>
                          </div>
                        {/if}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <!-- Sidebar: Categories and Stats - enhanced with learning resources -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Categories - unchanged -->
          
          <!-- Forum Stats - unchanged -->
          
          <!-- Learning Resources - new section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Learning Resources</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="/resources/study-guides" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"><i class="fas fa-book mr-2"></i>Study Guides</a></li>
              <li><a href="/resources/code-examples" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"><i class="fas fa-code mr-2"></i>Code Examples</a></li>
              <li><a href="/resources/practice-exercises" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"><i class="fas fa-laptop-code mr-2"></i>Practice Exercises</a></li>
              <li><a href="/resources/community-projects" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"><i class="fas fa-project-diagram mr-2"></i>Community Projects</a></li>
            </ul>
          </div>
          
          <!-- Quick Links / Guidelines - unchanged -->
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .loader {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #4f46e5;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>