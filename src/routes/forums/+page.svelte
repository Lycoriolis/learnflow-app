<script lang="ts">
  import ForumHeader from '$lib/components/forums/ForumHeader.svelte';
  import ForumFilters from '$lib/components/forums/ForumFilters.svelte';
  import ForumList from '$lib/components/forums/ForumList.svelte';
  import ForumSidebar from '$lib/components/forums/ForumSidebar.svelte';
  import CreateTopicForm from '$lib/components/forums/CreateTopicForm.svelte';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { user } from '$lib/stores/authStore.js';
  import { subscribedTopics } from '$lib/stores/forumStore.js';
  import { writable } from 'svelte/store';
  import type { User } from 'firebase/auth';

  // Declare the data prop passed from the load function
  export let data: { topics: ForumTopic[]; categories: ForumCategory[] };

  // Initialize topics and categories from the loaded data
  let topics: ForumTopic[] = data.topics;
  let categories: ForumCategory[] = data.categories;
  console.log('Loaded categories:', categories);

  // Add a test topic if not present
  const testTopicId = 'test-topic-1';
  if (!topics.some(t => t.id === testTopicId)) {
    topics = [
      {
        id: testTopicId,
        title: 'Test Topic: Welcome to the Forum!',
        category: categories[0]?.id || 'general',
        author: { id: 'test-user', name: 'Test User', avatar: '' },
        createdAt: new Date().toISOString(),
        repliesCount: 0,
        viewsCount: 0,
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        tags: ['test', 'welcome'],
        isPinned: true,
        isLocked: false,
        difficulty: 'beginner',
        resourceLinks: [],
        hasCodeExamples: false,
        isResolved: false
      },
      ...topics
    ];
  }

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
  let showCreateTopic = false;
  let showSubscriptions = false;

  // Add loading state for voting and subscribing
  let votingTopicId: string | null = null;
  let subscribingTopicId: string | null = null;
  let unsubscribingTopicId: string | null = null;
  let feedbackMessage = '';
  let feedbackType: 'success' | 'error' | '' = '';

  // Filtered topics with enhanced filtering
  $: filteredTopics = showSubscriptions
    ? topics.filter((t: ForumTopic) => $subscribedTopics.includes(t.id))
    : topics
        .filter((topic: ForumTopic) => {
          const matchesCategory = filterCategory === 'all' || topic.category === filterCategory;
          const matchesSearch = searchQuery === '' ||
            topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (topic.tags && topic.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
          const matchesDifficulty = difficultyFilter === 'all' || topic.difficulty === difficultyFilter;
          const matchesResolution = 
            (showResolved && topic.isResolved) || 
            (showUnresolved && !topic.isResolved) || 
            (topic.isResolved === undefined);
          
          return matchesCategory && matchesSearch && matchesDifficulty && matchesResolution;
        })
        .sort((a: ForumTopic, b: ForumTopic): number => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          
          if (sortOption === 'latest') {
            const dateA = a.lastPost ? new Date(a.lastPost.date) : new Date(a.createdAt);
            const dateB = b.lastPost ? new Date(b.lastPost.date) : new Date(a.createdAt);
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

  // Helper: show feedback
  function showFeedback(msg: string, type: 'success' | 'error') {
    feedbackMessage = msg;
    feedbackType = type;
    setTimeout(() => { feedbackMessage = ''; feedbackType = ''; }, 2000);
  }

  // Helper functions
  function getCategoryById(id: string): ForumCategory | undefined {
    return categories.find((cat: ForumCategory) => cat.id === id);
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
    votingTopicId = topicId;
    const topicIndex = topics.findIndex((t: ForumTopic) => t.id === topicId);
    if (topicIndex === -1) return;
    const topic = topics[topicIndex];
    const currentUser: User | null = $user;
    if (!currentUser || !currentUser.uid) {
      showFeedback('You must be logged in to vote.', 'error');
      votingTopicId = null;
      return;
    }
    const vote_type = voteType === 'up' ? 1 : -1;
    try {
      const res = await fetch(`/api/forum/topics/${topicId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.uid, vote_type })
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
        showFeedback('Vote recorded!', 'success');
      } else {
        showFeedback('Failed to vote.', 'error');
      }
    } catch (e) {
      showFeedback('Error voting.', 'error');
    } finally {
      votingTopicId = null;
    }
  }

  function handleSubscribe(topicId: string) {
    subscribingTopicId = topicId;
    if (!$subscribedTopics.includes(topicId)) {
      subscribedTopics.update((ids: string[]) => [...ids, topicId]);
      showFeedback('Subscribed!', 'success');
    }
    subscribingTopicId = null;
  }

  function handleUnsubscribe(topicId: string) {
    unsubscribingTopicId = topicId;
    subscribedTopics.update((ids: string[]) => ids.filter(id => id !== topicId));
    showFeedback('Unsubscribed!', 'success');
    unsubscribingTopicId = null;
  }

  function handleNewTopicClick() {
    console.log('New Topic button clicked');
    showCreateTopic = true;
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
      <ForumHeader
         on:newTopic={handleNewTopicClick}
         on:toggleSubscriptions={() => showSubscriptions = !showSubscriptions}
      />

      {#if showCreateTopic}
        <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" on:click={() => showCreateTopic = false} aria-label="Close create topic form">
              <i class="fas fa-times"></i>
            </button>
            <CreateTopicForm categories={categories} on:topicCreated={handleTopicCreated} />
          </div>
        </div>
      {/if}

      <ForumFilters
        {categories}
        bind:filterCategory
        bind:searchQuery
        bind:sortOption
        bind:difficultyFilter
        on:search={({ detail }) => searchQuery = detail}
        on:category={({ detail }) => filterCategory = detail}
        on:sort={({ detail }) => sortOption = detail}
        on:difficulty={({ detail }) => difficultyFilter = detail}
      />

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-9">
          <ForumList
            topics={filteredTopics}
            categories={categories}
            votingTopicId={votingTopicId}
            subscribingTopicId={subscribingTopicId}
            unsubscribingTopicId={unsubscribingTopicId}
            user={$user}
            on:subscribe={({ detail }) => handleSubscribe(detail)}
            on:unsubscribe={({ detail }) => handleUnsubscribe(detail)}
            on:vote={({ detail }) => handleVote(detail.id, detail.type)}
          />
        </div>

        <div class="lg:col-span-3">
          <ForumSidebar categories={categories} filterCategory={filterCategory} />
        </div>
      </div>

      {#if feedbackMessage}
        <div class={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${feedbackType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {feedbackMessage}
        </div>
      {/if}
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