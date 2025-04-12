<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { user } from '$lib/stores/authStore.js';

  // Types
  type UserGroup = {
    id: string;
    name: string;
    description: string;
    topic: string;
    image?: string;
    memberCount: number;
    isPublic: boolean;
    createdBy: string;
    createdAt: string;
    isMember?: boolean; // Added to track if the current user is a member
  };

  // Mock user groups data
  const allGroups: UserGroup[] = [
    {
      id: 'group-1',
      name: 'JavaScript Study Buddies',
      description: 'Weekly discussions and pair programming for JavaScript learners.',
      topic: 'Web Development',
      image: '/images/groups/js-group.jpg',
      memberCount: 25,
      isPublic: true,
      createdBy: 'Alex Johnson',
      createdAt: '2023-03-15T10:00:00',
      isMember: false
    },
    {
      id: 'group-2',
      name: 'Python for Data Science',
      description: 'Collaborate on data science projects using Python.',
      topic: 'Data Science',
      image: '/images/groups/python-ds.jpg',
      memberCount: 42,
      isPublic: true,
      createdBy: 'Emily Chen',
      createdAt: '2023-03-20T14:30:00',
      isMember: true
    },
    {
      id: 'group-3',
      name: 'UI/UX Design Collective',
      description: 'Share design inspiration, feedback, and resources.',
      topic: 'Design & UI/UX',
      image: '/images/groups/uiux-collective.jpg',
      memberCount: 18,
      isPublic: false,
      createdBy: 'Elena Rodriguez',
      createdAt: '2023-04-01T09:15:00',
      isMember: false
    },
    {
      id: 'group-4',
      name: 'Frontend Frameworks Discussion',
      description: 'Discuss React, Vue, Svelte, and other frontend frameworks.',
      topic: 'Web Development',
      image: '/images/groups/frontend-frameworks.jpg',
      memberCount: 31,
      isPublic: true,
      createdBy: 'David Wilson',
      createdAt: '2023-04-05T11:00:00',
      isMember: true
    },
    {
      id: 'group-5',
      name: 'Machine Learning Enthusiasts',
      description: 'Explore ML algorithms, share papers, and work on projects.',
      topic: 'Data Science',
      memberCount: 55,
      isPublic: true,
      createdBy: 'Michael Chen',
      createdAt: '2023-04-08T16:00:00',
      isMember: false
    }
  ];

  // Filter and search state
  let searchQuery = '';
  let selectedTopic = 'all';

  // Extract unique topics for filtering
  const groupTopics = [
    'all',
    ...new Set(allGroups.map(group => group.topic))
  ];

  // Filtered and searched groups
  $: filteredGroups = allGroups.filter(group => {
    const matchesTopic = selectedTopic === 'all' || group.topic === selectedTopic;
    const matchesSearch = searchQuery === '' || 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  // Separate groups the user is a member of
  $: myGroups = allGroups.filter(group => group.isMember);
  $: discoverGroups = filteredGroups.filter(group => !group.isMember);

  // Function to handle joining/leaving a group (placeholder)
  function toggleGroupMembership(groupId: string) {
    // In a real app, this would call an API
    console.log(`Toggling membership for group ${groupId}`);
    const groupIndex = allGroups.findIndex(g => g.id === groupId);
    if (groupIndex !== -1) {
      allGroups[groupIndex].isMember = !allGroups[groupIndex].isMember;
      // Trigger reactivity
      allGroups = [...allGroups]; 
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
  <title>User Groups | LearnFlow</title>
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
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Study Groups</h1>
          <p class="text-gray-600 dark:text-gray-400">Connect, collaborate, and learn with fellow students</p>
        </div>
        
        <div class="mt-4 md:mt-0">
          <a 
            href="/groups/create" 
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium flex items-center transition-colors"
          >
            <i class="fas fa-plus mr-2"></i>
            Create New Group
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
              placeholder="Search groups by name or description..."
              bind:value={searchQuery}
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
          </div>
          
          <div class="relative">
            <select
              class="appearance-none pl-4 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[180px]"
              bind:value={selectedTopic}
            >
              {#each groupTopics as topic}
                <option value={topic}>{topic === 'all' ? 'All Topics' : topic}</option>
              {/each}
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <i class="fas fa-chevron-down text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- My Groups Section -->
      {#if myGroups.length > 0}
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Groups</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each myGroups as group (group.id)}
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                {#if group.image}
                  <img src={group.image} alt={group.name} class="w-full h-32 object-cover"/>
                {:else}
                  <div class="w-full h-32 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                     <i class="fas fa-users text-4xl text-indigo-400 dark:text-indigo-600"></i>
                  </div>
                {/if}
                <div class="p-5 flex-1 flex flex-col">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">{group.name}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Topic: {group.topic}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-1">{group.description}</p>
                  <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span><i class="fas fa-users mr-1"></i> {group.memberCount} members</span>
                    <span>{group.isPublic ? 'Public' : 'Private'}</span>
                  </div>
                  <div class="mt-auto flex gap-2">
                     <a href="/groups/{group.id}" class="flex-1 text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors">
                       View Group
                     </a>
                     <button 
                       on:click={() => toggleGroupMembership(group.id)}
                       class="px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md text-sm font-medium transition-colors"
                       title="Leave Group"
                     >
                       <i class="fas fa-sign-out-alt"></i>
                     </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Discover Groups Section -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {searchQuery || selectedTopic !== 'all' ? 'Filtered Groups' : 'Discover Groups'}
        </h2>
        {#if discoverGroups.length === 0}
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
            <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <i class="fas fa-search text-gray-400 dark:text-gray-500 text-2xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No groups found</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              {#if searchQuery || selectedTopic !== 'all'}
                Try adjusting your search or filter criteria.
              {:else}
                There are no available groups to join right now. Why not create one?
              {/if}
            </p>
            {#if searchQuery || selectedTopic !== 'all'}
              <button 
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
                on:click={() => { searchQuery = ''; selectedTopic = 'all'; }}
              >
                Clear Filters
              </button>
            {:else}
               <a 
                href="/groups/create" 
                class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                <i class="fas fa-plus mr-2"></i>
                Create New Group
              </a>
            {/if}
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each discoverGroups as group (group.id)}
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                 {#if group.image}
                  <img src={group.image} alt={group.name} class="w-full h-32 object-cover"/>
                {:else}
                  <div class="w-full h-32 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                     <i class="fas fa-users text-4xl text-indigo-400 dark:text-indigo-600"></i>
                  </div>
                {/if}
                <div class="p-5 flex-1 flex flex-col">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">{group.name}</h3>
                   <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Topic: {group.topic}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-1">{group.description}</p>
                  <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span><i class="fas fa-users mr-1"></i> {group.memberCount} members</span>
                    <span>{group.isPublic ? 'Public' : 'Private'}</span>
                  </div>
                  <div class="mt-auto">
                    {#if group.isPublic}
                      <button 
                        on:click={() => toggleGroupMembership(group.id)}
                        class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
                      >
                        <i class="fas fa-user-plus mr-2"></i>
                        Join Group
                      </button>
                    {:else}
                      <button 
                        class="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium cursor-not-allowed" disabled
                      >
                        <i class="fas fa-lock mr-2"></i>
                        Request to Join (Private)
                      </button>
                    {/if}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
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

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style> 