import { persistentStore } from './persistentStore.js';
import { writable, derived } from 'svelte/store';
import type { ForumCategory, ForumTopic, ForumPost } from '$lib/types/forumTypes';
import { 
  getCategories, 
  getTopics, 
  getTopic,
  getPostsByTopicId
} from '$lib/services/forums/forumService';
import { browser } from '$app/environment';

// Store list of subscribed topic IDs
export const subscribedTopics = persistentStore<string[]>('learnflow-subscribed-topics', []);

// Create stores
export const categories = writable<ForumCategory[]>([]);
export const topics = writable<ForumTopic[]>([]);
export const currentTopic = writable<ForumTopic | null>(null);
export const posts = writable<ForumPost[]>([]);
export const isLoading = writable<boolean>(false);
export const error = writable<string | null>(null);
export const activeTagFilter = writable<string | null>(null);
export const forumCategories = writable<ForumCategory[]>([]);
export const selectedCategory = writable<ForumCategory | null>(null);

// Initialize categories
export async function loadCategories(): Promise<void> {
  if (!browser) return;
  
  isLoading.set(true);
  error.set(null);
  
  try {
    const result = await getCategories();
    categories.set(result);
  } catch (err) {
    console.error('Error loading forum categories:', err);
    error.set('Failed to load forum categories');
  } finally {
    isLoading.set(false);
  }
}

// Load topics for a category
export async function loadTopics(categoryId?: string): Promise<void> {
  if (!browser) return;
  
  isLoading.set(true);
  error.set(null);
  
  try {
    // Call getTopics without parameter if categoryId is undefined
    const result = await getTopics();
    
    // If there's a category ID, filter client-side
    const filteredTopics = categoryId 
      ? result.filter(topic => topic.category_id === categoryId)
      : result;
      
    topics.set(filteredTopics);
  } catch (err) {
    console.error('Error loading forum topics:', err);
    error.set('Failed to load forum topics');
  } finally {
    isLoading.set(false);
  }
}

// Load a specific topic and its posts
export async function loadTopic(topicId: string): Promise<void> {
  if (!browser) return;
  
  isLoading.set(true);
  error.set(null);
  currentTopic.set(null);
  posts.set([]);
  
  try {
    const [topicResult, postsResult] = await Promise.all([
      getTopic(topicId),
      getPostsByTopicId(topicId)
    ]);
    
    if (topicResult) {
      currentTopic.set(topicResult);
      posts.set(postsResult);
    } else {
      error.set('Topic not found');
    }
  } catch (err) {
    console.error(`Error loading topic ${topicId}:`, err);
    error.set('Failed to load topic');
  } finally {
    isLoading.set(false);
  }
}

// Filter topics by tag
export async function filterTopicsByTag(tag: string): Promise<void> {
  if (!browser) return;
  
  isLoading.set(true);
  error.set(null);
  activeTagFilter.set(tag);
  
  try {
    // Use getTopics and filter client-side instead of using a non-existent getTopicsByTag function
    const allTopics = await getTopics();
    const filteredTopics = allTopics.filter(topic => topic.tags?.includes(tag));
    topics.set(filteredTopics);
  } catch (err) {
    console.error(`Error loading topics with tag ${tag}:`, err);
    error.set('Failed to load topics with the selected tag');
  } finally {
    isLoading.set(false);
  }
}

// Clear tag filter
export function clearTagFilter(): void {
  activeTagFilter.set(null);
  loadTopics();
}

// Derived store for pinned topics
export const pinnedTopics = derived(topics, $topics => {
  return $topics.filter(topic => topic.is_pinned);
});

// Derived store for recent topics
export const recentTopics = derived(topics, $topics => {
  return $topics
    .filter(topic => !topic.is_pinned)
    .sort((a, b) => {
      const dateA = a.updated_at || a.created_at;
      const dateB = b.updated_at || b.created_at;
      if (!dateA || !dateB) return 0;
      return (dateB instanceof Date ? dateB.getTime() : 0) - 
             (dateA instanceof Date ? dateA.getTime() : 0);
    })
    .slice(0, 10);
});

// Get category by ID
export function getCategoryById(id: string): ForumCategory | undefined {
  let result: ForumCategory | undefined;
  
  categories.subscribe(cats => {
    result = cats.find(cat => cat.id === id);
  })();
  
  return result;
}