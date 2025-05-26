<script lang="ts">
  import { onMount } from 'svelte';
  import { currentTopic, posts, loadTopic, isLoading, error } from '$lib/stores/forumStore';
  import Icon from '@iconify/svelte';
  import EnhancedMarkdownRenderer from '$lib/components/EnhancedMarkdownRenderer.svelte';
  import type { ForumPost } from '$lib/types/forumTypes';
  import { createForumPost } from '$lib/services/forums/forumService';
  import { getAuth } from 'firebase/auth';
  
  export let topicId: string;
  
  let newPostContent = '';
  let isSubmitting = false;
  let submitError: string | null = null;
  let isAuthenticated = false;
  
  onMount(() => {
    const auth = getAuth();
    isAuthenticated = !!auth.currentUser;
    
    loadTopic(topicId);
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      isAuthenticated = !!user;
    });
    
    return unsubscribe;
  });
  
  async function handleSubmitPost() {
    if (!newPostContent.trim() || !isAuthenticated) return;
    
    isSubmitting = true;
    submitError = null;
    
    try {
      const newPost = await createForumPost({
        topic_id: topicId,
        content: newPostContent,
      } as Omit<ForumPost, 'id' | 'created_at'>);
      
      if (newPost) {
        newPostContent = '';
        // Reload the topic to get the new post
        await loadTopic(topicId);
      } else {
        submitError = 'Failed to create post. Please try again.';
      }
    } catch (err) {
      console.error('Error submitting post:', err);
      submitError = 'An error occurred while submitting your post.';
    } finally {
      isSubmitting = false;
    }
  }
  
  function formatDate(date: Date | undefined): string {
    if (!date) return 'Unknown date';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 24 hours
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      
      if (hours < 1) {
        const minutes = Math.floor(diff / (60 * 1000));
        return minutes < 1 ? 'Just now' : `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      }
      
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Less than 7 days
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    // Default to formatted date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<!-- Placeholder for ForumTopic.svelte -->

<div class="forum-topic">
  {#if $isLoading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cherry-500"></div>
    </div>
  {:else if $error}
    <div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6">
      <p>{$error}</p>
    </div>
  {:else if $currentTopic}
    <div class="mb-6">
      <a href="/forums/category/{$currentTopic.category_id}" class="inline-flex items-center text-cherry-600 dark:text-cherry-400 hover:underline mb-4">
        <Icon icon="mdi:arrow-left" class="w-5 h-5 mr-1" />
        Back to Forum
      </a>
      
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{$currentTopic.title}</h1>
      
      <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
        <span class="flex items-center">
          <Icon icon="mdi:account" class="w-4 h-4 mr-1" />
          {$currentTopic.author?.name || 'Unknown'}
        </span>
        <span class="mx-2">•</span>
        <span>{formatDate($currentTopic.created_at)}</span>
        <span class="mx-2">•</span>
        <span class="flex items-center">
          <Icon icon="mdi:eye-outline" class="w-4 h-4 mr-1" />
          {$currentTopic.views} view{$currentTopic.views !== 1 ? 's' : ''}
        </span>
        <span class="mx-2">•</span>
        <span class="flex items-center">
          <Icon icon="mdi:comment-outline" class="w-4 h-4 mr-1" />
          {$currentTopic.post_count} repl{$currentTopic.post_count !== 1 ? 'ies' : 'y'}
        </span>
      </div>
      
      {#if $currentTopic.tags && $currentTopic.tags.length > 0}
        <div class="flex flex-wrap gap-2 mb-4">
          {#each $currentTopic.tags as tag}
            <a href="/forums/tag/{tag}" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              {tag}
            </a>
          {/each}
        </div>
      {/if}
      
      <!-- TODO: Forum topic content should be displayed from the first post -->
      <!-- <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-6">
        <div class="prose dark:prose-invert max-w-none">
          <EnhancedMarkdownRenderer content={$currentTopic.content} />
        </div>
      </div> -->
      
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Replies ({$posts.length})
      </h2>
      
      {#if $posts.length === 0}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <Icon icon="mdi:comment-text-outline" class="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p class="text-gray-600 dark:text-gray-400">No replies yet. Be the first to reply!</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each $posts as post}
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div class="p-5">
                <div class="flex items-start">
                  <div class="flex-shrink-0 mr-4">
                    <!-- Forum posts don't have avatars in current schema -->
                    <div class="w-10 h-10 rounded-full bg-cherry-100 dark:bg-cherry-900/30 flex items-center justify-center">
                      <span class="text-cherry-600 dark:text-cherry-400 text-lg font-medium">
                        {post.author_name?.charAt(0) || 'A'}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-medium text-gray-900 dark:text-white">{post.author_name || 'Unknown'}</span>
                      <span class="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.created_at)}</span>
                    </div>
                    
                    <div class="prose dark:prose-invert max-w-none">
                      <EnhancedMarkdownRenderer content={post.content} />
                    </div>
                    
                    {#if post.is_answer}
                      <div class="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                        <Icon icon="mdi:check-circle" class="w-4 h-4 mr-1" />
                        Accepted Answer
                      </div>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
      
      {#if !$currentTopic.is_locked}
        <div class="mt-8">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Your Reply</h3>
          
          {#if isAuthenticated}
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
              <textarea
                bind:value={newPostContent}
                placeholder="Write your reply here... (Markdown supported)"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400 min-h-[150px]"
                disabled={isSubmitting}
              ></textarea>
              
              {#if submitError}
                <div class="text-red-600 dark:text-red-400 text-sm mt-2">{submitError}</div>
              {/if}
              
              <div class="flex justify-end mt-4">
                <button 
                  on:click={handleSubmitPost}
                  disabled={isSubmitting || !newPostContent.trim()}
                  class="px-4 py-2 bg-cherry-600 text-white rounded-md hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Post Reply'}
                </button>
              </div>
            </div>
          {:else}
            <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-5 text-center">
              <p class="text-gray-700 dark:text-gray-300 mb-3">You need to be logged in to reply to this topic.</p>
              <a href="/login" class="inline-block px-4 py-2 bg-cherry-600 text-white rounded-md hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 transition-colors">
                Log In to Reply
              </a>
            </div>
          {/if}
        </div>
      {:else}
        <div class="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center text-yellow-800 dark:text-yellow-400">
          <Icon icon="mdi:lock" class="w-5 h-5 inline-block mr-2" />
          This topic is locked. New replies are not allowed.
        </div>
      {/if}
    </div>
  {:else if !$isLoading}
    <div class="text-center py-12">
      <Icon icon="mdi:alert-circle-outline" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Topic not found</h3>
      <p class="text-gray-600 dark:text-gray-400">The topic you're looking for doesn't exist or has been removed.</p>
      <a href="/forums" class="inline-block mt-4 px-4 py-2 bg-cherry-600 text-white rounded-md hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 transition-colors">
        Back to Forums
      </a>
    </div>
  {/if}
</div>