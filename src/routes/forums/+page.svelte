<script lang="ts">
  import ForumList from '$lib/components/forums/ForumList.svelte';
  import { onMount } from 'svelte';
  import { topics, loadTopics, isLoading, error, pinnedTopics, recentTopics } from '$lib/stores/forumStore';
  import Icon from '@iconify/svelte';
  
  let searchQuery = '';
  let filteredTopics: typeof $topics = [];
  
  onMount(() => {
    loadTopics();
  });
  
  $: {
    // Filter topics based on search query
    filteredTopics = searchQuery ? 
      $topics.filter(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchQuery.toLowerCase())
      ) : 
      $topics;
  }
</script>

<div class="container mx-auto px-4 py-8">
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div class="lg:col-span-2">
      <ForumList />
      
      {#if $topics.length > 0}
        <div class="mt-12">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Recent Discussions</h2>
            
            <div class="relative">
              <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search topics..."
                class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"
              />
              <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          {#if $isLoading}
            <div class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cherry-500"></div>
            </div>
          {:else if $error}
            <div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6">
              <p>{$error}</p>
            </div>
          {:else if searchQuery && filteredTopics.length === 0}
            <div class="text-center py-12">
              <Icon icon="mdi:search-off" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No matching topics</h3>
              <p class="text-gray-600 dark:text-gray-400">No topics match your search query. Try different keywords.</p>
            </div>
          {:else}
            {#if $pinnedTopics.length > 0 && !searchQuery}
              <div class="mb-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Pinned Topics</h3>
                
                <div class="space-y-4">
                  {#each $pinnedTopics as topic}
                    <a href="/forums/topic/{topic.id}" class="block">
                      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-cherry-500 dark:border-cherry-400">
                        <div class="p-4">
                          <div class="flex items-start">
                            <div class="flex-shrink-0 mr-3">
                              <Icon icon="mdi:pin" class="w-5 h-5 text-cherry-600 dark:text-cherry-400" />
                            </div>
                            
                            <div class="flex-1">
                              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-1">{topic.title}</h4>
                              
                              <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <span>{topic.authorName || 'Unknown'}</span>
                                <span class="mx-2">•</span>
                                <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                                <span class="mx-2">•</span>
                                <span class="flex items-center">
                                  <Icon icon="mdi:comment-outline" class="w-4 h-4 mr-1" />
                                  {topic.replyCount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  {/each}
                </div>
              </div>
            {/if}
            
            <div class="space-y-4">
              {#each (searchQuery ? filteredTopics : $recentTopics) as topic}
                <a href="/forums/topic/{topic.id}" class="block">
                  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="p-4">
                      <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-1">{topic.title}</h4>
                      
                      <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>{topic.authorName || 'Unknown'}</span>
                        <span class="mx-2">•</span>
                        <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                        <span class="mx-2">•</span>
                        <span class="flex items-center">
                          <Icon icon="mdi:eye-outline" class="w-4 h-4 mr-1" />
                          {topic.viewCount}
                        </span>
                        <span class="mx-2">•</span>
                        <span class="flex items-center">
                          <Icon icon="mdi:comment-outline" class="w-4 h-4 mr-1" />
                          {topic.replyCount}
                        </span>
                      </div>
                      
                      {#if topic.tags && topic.tags.length > 0}
                        <div class="flex flex-wrap gap-2">
                          {#each topic.tags as tag}
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                              {tag}
                            </span>
                          {/each}
                        </div>
                      {/if}
                    </div>
                  </div>
                </a>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>
    
    <div class="lg:col-span-1">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Start a Discussion</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">Have a question or want to share something with the community?</p>
        <a 
          href="/forums/create" 
          class="inline-block w-full px-4 py-2 text-center bg-cherry-600 text-white rounded-md hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 transition-colors"
        >
          Create New Topic
        </a>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Forum Guidelines</h3>
        <ul class="space-y-2 text-gray-600 dark:text-gray-400">
          <li class="flex items-start">
            <Icon icon="mdi:check-circle" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Be respectful and kind to others</span>
          </li>
          <li class="flex items-start">
            <Icon icon="mdi:check-circle" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Stay on topic and use appropriate categories</span>
          </li>
          <li class="flex items-start">
            <Icon icon="mdi:check-circle" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Search before posting to avoid duplicates</span>
          </li>
          <li class="flex items-start">
            <Icon icon="mdi:check-circle" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Use descriptive titles for your topics</span>
          </li>
          <li class="flex items-start">
            <Icon icon="mdi:check-circle" class="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>Format code properly using markdown</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>