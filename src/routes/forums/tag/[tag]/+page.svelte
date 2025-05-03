<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { topics, filterTopicsByTag, clearTagFilter, isLoading, error, activeTagFilter } from '$lib/stores/forumStore';
  import Icon from '@iconify/svelte';
  
  let tag = $page.params.tag;
  
  onMount(() => {
    filterTopicsByTag(tag);
    
    return () => {
      clearTagFilter();
    };
  });
</script>

<div class="container mx-auto px-4 py-8">
  <div class="mb-6">
    <a href="/forums" class="inline-flex items-center text-cherry-600 dark:text-cherry-400 hover:underline mb-4">
      <Icon icon="mdi:arrow-left" class="w-5 h-5 mr-1" />
      Back to Forums
    </a>
    
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
      <span>Topics tagged:</span> 
      <span class="ml-2 px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
        {tag}
      </span>
    </h1>
  </div>
  
  {#if $isLoading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cherry-500"></div>
    </div>
  {:else if $error}
    <div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6">
      <p>{$error}</p>
    </div>
  {:else if $topics.length === 0}
    <div class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <Icon icon="mdi:tag-outline" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No topics found</h3>
      <p class="text-gray-600 dark:text-gray-400">There are no topics with the tag "{tag}".</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each $topics as topic}
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
              
              <div class="flex flex-wrap gap-2">
                {#each topic.tags || [] as topicTag}
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {topicTag === tag ? 'bg-cherry-100 dark:bg-cherry-900/30 text-cherry-800 dark:text-cherry-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}">
                    {topicTag}
                  </span>
                {/each}
              </div>
            </div>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div>