<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { user } from '$lib/stores/authStore.js';

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
  };

  // Mock forum categories
  const forumCategories: ForumCategory[] = [
    {
      id: 'general',
      name: 'General Discussion',
      description: 'General discussions about learning and the platform',
      icon: 'fa-comments',
      color: 'blue',
      topicsCount: 42,
      postsCount: 156
    },
    {
      id: 'introductions',
      name: 'Introductions',
      description: 'New to LearnFlow? Introduce yourself here!',
      icon: 'fa-user-plus',
      color: 'green',
      topicsCount: 24,
      postsCount: 89
    },
    {
      id: 'help',
      name: 'Help & Support',
      description: 'Get help with course content or technical issues',
      icon: 'fa-life-ring',
      color: 'purple',
      topicsCount: 37,
      postsCount: 104
    },
    {
      id: 'webdev',
      name: 'Web Development',
      description: 'Discussions about HTML, CSS, JavaScript, and web technologies',
      icon: 'fa-code',
      color: 'orange',
      topicsCount: 56,
      postsCount: 218
    },
    {
      id: 'datascience',
      name: 'Data Science',
      description: 'Discuss data analysis, machine learning, and AI topics',
      icon: 'fa-chart-bar',
      color: 'indigo',
      topicsCount: 29,
      postsCount: 112
    },
    {
      id: 'design',
      name: 'Design & UI/UX',
      description: 'Share design concepts, UI/UX ideas, and resources',
      icon: 'fa-paint-brush',
      color: 'pink',
      topicsCount: 18,
      postsCount: 84
    }
  ];

  // Mock forum topics
  const recentTopics: ForumTopic[] = [
    {
      id: 'topic-1',
      title: 'Tips for learning JavaScript more effectively?',
      category: 'webdev',
      author: {
        id: 'user-1',
        name: 'Alex Johnson',
        avatar: '/images/avatars/user-1.jpg'
      },
      lastPost: {
        author: {
          id: 'user-5',
          name: 'Maya Rodriguez',
          avatar: '/images/avatars/user-5.jpg'
        },
        date: '2023-04-10T13:45:00'
      },
      createdAt: '2023-04-08T09:30:00',
      repliesCount: 12,
      viewsCount: 89,
      tags: ['javascript', 'learning', 'tips']
    },
    {
      id: 'topic-2',
      title: 'How to set up a proper study schedule for data science courses?',
      category: 'datascience',
      author: {
        id: 'user-2',
        name: 'Emily Chen',
        avatar: '/images/avatars/user-2.jpg'
      },
      lastPost: {
        author: {
          id: 'user-3',
          name: 'David Kim',
          avatar: '/images/avatars/user-3.jpg'
        },
        date: '2023-04-11T10:15:00'
      },
      createdAt: '2023-04-09T14:20:00',
      repliesCount: 8,
      viewsCount: 64,
      tags: ['data-science', 'study-plan', 'organization']
    },
    {
      id: 'topic-3',
      title: 'Official announcement: New forum guidelines',
      category: 'general',
      author: {
        id: 'admin-1',
        name: 'LearnFlow Team',
        avatar: '/images/avatars/admin.jpg'
      },
      createdAt: '2023-04-07T11:00:00',
      repliesCount: 5,
      viewsCount: 143,
      isPinned: true,
      tags: ['announcement', 'guidelines']
    },
    {
      id: 'topic-4',
      title: 'Hello from Sydney! New to web development',
      category: 'introductions',
      author: {
        id: 'user-4',
        name: 'James Wilson',
        avatar: '/images/avatars/user-4.jpg'
      },
      lastPost: {
        author: {
          id: 'user-6',
          name: 'Sarah Lee',
          avatar: '/images/avatars/user-6.jpg'
        },
        date: '2023-04-09T18:30:00'
      },
      createdAt: '2023-04-09T16:45:00',
      repliesCount: 7,
      viewsCount: 42,
      tags: ['introduction', 'beginner', 'web-dev']
    },
    {
      id: 'topic-5',
      title: 'Best color palette tools for web design?',
      category: 'design',
      author: {
        id: 'user-6',
        name: 'Sarah Lee',
        avatar: '/images/avatars/user-6.jpg'
      },
      lastPost: {
        author: {
          id: 'user-2',
          name: 'Emily Chen',
          avatar: '/images/avatars/user-2.jpg'
        },
        date: '2023-04-10T21:10:00'
      },
      createdAt: '2023-04-10T14:30:00',
      repliesCount: 9,
      viewsCount: 56,
      tags: ['design', 'colors', 'tools']
    }
  ];

  // Filter and sorting
  let filterCategory = 'all';
  let searchQuery = '';
  let sortOption = 'latest';

  // Filtered topics
  $: filteredTopics = recentTopics
    .filter(topic => {
      const matchesCategory = filterCategory === 'all' || topic.category === filterCategory;
      const matchesSearch = searchQuery === '' ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (topic.tags && topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      // Pinned topics always come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      if (sortOption === 'latest') {
        // Sort by last post date if available, otherwise by creation date
        const dateA = a.lastPost ? new Date(a.lastPost.date) : new Date(a.createdAt);
        const dateB = b.lastPost ? new Date(b.lastPost.date) : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      } else if (sortOption === 'popular') {
        return b.viewsCount - a.viewsCount;
      } else if (sortOption === 'most-replies') {
        return b.repliesCount - a.repliesCount;
      } else if (sortOption === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  // Helper functions
  function getCategoryById(id: string): ForumCategory | undefined {
    return forumCategories.find(cat => cat.id === id);
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

  // Loading state
  let loading = true;

  onMount(() => {
    // Simulate loading
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
          <a
            href="/forums/new"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium flex items-center"
          >
            <i class="fas fa-plus mr-2"></i>
            New Topic
          </a>
          <a
            href="/forums/subscribed"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm font-medium flex items-center"
          >
            <i class="fas fa-bell mr-2"></i>
            My Subscriptions
          </a>
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
            <div class="relative">
              <select
                class="appearance-none pl-4 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                bind:value={filterCategory}
              >
                <option value="all">All Categories</option>
                {#each forumCategories as category}
                  <option value={category.id}>{category.name}</option>
                {/each}
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>

            <div class="relative">
              <select
                class="appearance-none pl-4 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                bind:value={sortOption}
              >
                <option value="latest">Latest Activity</option>
                <option value="created">Created</option>
                <option value="popular">Most Viewed</option>
                <option value="most-replies">Most Replies</option>
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
                    <div class="flex items-start">
                      <!-- Avatar -->
                      <div class="hidden sm:block mr-3 flex-shrink-0 mt-1">
                        <img
                          src={topic.author.avatar || '/images/default-avatar.jpg'}
                          alt={topic.author.name}
                          class="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                      </div>

                      <!-- Topic Content -->
                      <div class="flex-1 min-w-0">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                          <a
                            href={`/forums/topic/${topic.id}`}
                            class="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
                          >
                            {#if topic.isPinned}
                              <i class="fas fa-thumbtack text-indigo-500 mr-1 text-sm opacity-75"></i>
                            {/if}
                            {#if topic.isLocked}
                              <i class="fas fa-lock text-orange-500 mr-1 text-sm opacity-75"></i>
                            {/if}
                            {topic.title}
                          </a>
                          {#if topic.lastPost}
                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0 sm:ml-2 whitespace-nowrap">
                              {formatDate(topic.lastPost.date)}
                            </div>
                          {:else}
                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0 sm:ml-2 whitespace-nowrap">
                              {formatDate(topic.createdAt)}
                            </div>
                          {/if}
                        </div>

                        <div class="flex flex-wrap items-center gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>By <a href="/profile/{topic.author.id}" class="hover:underline font-medium text-gray-700 dark:text-gray-300">{topic.author.name}</a></span>
                          {#if topic.category}
                            {@const category = getCategoryById(topic.category)}
                            {#if category}
                              <span class="text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColorClass(category.color)}">
                                {category.name}
                              </span>
                            {/if}
                          {/if}
                        </div>
                        
                        {#if topic.tags && topic.tags.length > 0}
                          <div class="flex flex-wrap gap-1 mb-2">
                            {#each topic.tags as tag}
                              <div class="px-1.5 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                #{tag}
                              </div>
                            {/each}
                          </div>
                        {/if}
                      </div>

                      <!-- Stats -->
                      <div class="hidden md:flex ml-4 text-sm text-right text-gray-500 dark:text-gray-400 space-x-4 flex-shrink-0">
                        <div class="flex flex-col items-center">
                          <span class="font-semibold">{topic.repliesCount}</span>
                          <span>replies</span>
                        </div>
                        <div class="flex flex-col items-center">
                          <span class="font-semibold">{topic.viewsCount}</span>
                          <span>views</span>
                        </div>
                      </div>

                      <!-- Last Post Info (if available) -->
                      {#if topic.lastPost}
                        <div class="hidden lg:flex ml-4 text-right flex-shrink-0 w-40">
                          <div class="flex items-center justify-end">
                            <div class="text-xs text-gray-500 dark:text-gray-400 text-right">
                              <div>{topic.lastPost.author.name}</div>
                              <div>{formatDate(topic.lastPost.date)}</div>
                            </div>
                            <img
                              src={topic.lastPost.author.avatar || '/images/default-avatar.jpg'}
                              alt={topic.lastPost.author.name}
                              class="w-8 h-8 rounded-full object-cover ml-2 border border-gray-200 dark:border-gray-700"
                            />
                          </div>
                        </div>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        <!-- Sidebar: Categories and Stats -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Categories -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white px-4 py-3 border-b border-gray-200 dark:border-gray-700">Categories</h3>
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <button
                class={`w-full px-4 py-3 text-left text-sm flex justify-between items-center transition-colors ${filterCategory === 'all' ? 'bg-gray-50 dark:bg-gray-700/50 text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                on:click={() => filterCategory = 'all'}
              >
                <span>All Categories</span>
                <span class="text-xs px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600">{recentTopics.length}</span>
              </button>
              {#each forumCategories as category}
                <button
                  class={`w-full px-4 py-3 text-left text-sm flex justify-between items-center transition-colors ${filterCategory === category.id ? 'bg-gray-50 dark:bg-gray-700/50 text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                  on:click={() => filterCategory = category.id}
                >
                  <div class="flex items-center">
                    <i class={`fas ${category.icon} mr-2 ${getCategoryColorClass(category.color, false)}`}></i>
                    {category.name}
                  </div>
                  <span class="text-xs px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600">{category.topicsCount}</span>
                </button>
              {/each}
            </div>
          </div>

          <!-- Forum Stats -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Forum Stats</h3>
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex justify-between">
                <span>Total Topics:</span>
                <span class="font-medium">{forumCategories.reduce((total, cat) => total + cat.topicsCount, 0)}</span>
              </div>
              <div class="flex justify-between">
                <span>Total Posts:</span>
                <span class="font-medium">{forumCategories.reduce((total, cat) => total + cat.postsCount, 0)}</span>
              </div>
              <!-- Add Active Users / Members Count if available -->
            </div>
          </div>
          
          <!-- Quick Links / Guidelines -->
           <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="/help/forum-guidelines" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"><i class="fas fa-book-open mr-2"></i>Forum Guidelines</a></li>
              <li><a href="/forums/my-topics" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"><i class="fas fa-edit mr-2"></i>My Topics</a></li>
              <li><a href="/forums/my-posts" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"><i class="fas fa-reply mr-2"></i>My Posts</a></li>
            </ul>
          </div>
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