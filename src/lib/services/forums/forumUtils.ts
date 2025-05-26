import type { ForumCategory as SharedForumCategory, ForumTopic as SharedForumTopic, ForumPost as SharedForumPost } from '../../types/shared';
import type { ForumCategory, ForumTopic, ForumPost } from '../../types/forumTypes';
import { Timestamp } from 'firebase/firestore';

export function convertSharedCategoryToForumCategory(category: SharedForumCategory): ForumCategory {
  return {
    id: category.id,
    name: category.title,
    description: category.description,
    order: category.order || 0,
    icon: 'mdi:forum', // Default icon
    imageUrl: undefined, // Can be extended when image support is added
    color: 'gray', // Default color
    last_activity_at: category.lastActivity?.toDate(),
    created_at: category.metadata?.createdAt.toDate(),
    updated_at: category.metadata?.updatedAt.toDate(),
    topic_count: category.topicCount || 0
  };
}

export function convertSharedTopicToForumTopic(topic: SharedForumTopic, categoryName?: string): ForumTopic {
  return {
    id: topic.id,
    title: topic.title,
    category_id: topic.categoryId,
    author_id: topic.authorId,
    is_pinned: topic.isPinned || false,
    is_locked: topic.isLocked || false,
    is_resolved: false, // To be implemented in shared types
    has_code_examples: topic.content?.includes('```') || false, // Basic detection of code blocks
    difficulty: undefined, // To be implemented in shared types
    views: topic.viewCount || 0,
    votes: 0, // Initialize to 0, will be updated by voting system
    upvotes: 0,
    downvotes: 0,
    created_at: topic.metadata?.createdAt.toDate(),
    updated_at: topic.metadata?.updatedAt.toDate(),
    tags: topic.tags || [],
    resource_links: [], // To be implemented in shared types
    category_name: categoryName || topic.categoryId, // Use provided name or fallback to ID
    post_count: topic.replyCount || 0,
    author: {
      id: topic.authorId,
      name: topic.authorName,
      avatar: undefined // Can be extended when user avatars are implemented
    }
  };
}

export function convertSharedPostToForumPost(post: SharedForumPost): ForumPost {
  return {
    id: post.id,
    topic_id: post.topicId,
    author_id: post.authorId,
    content: post.content,
    created_at: post.metadata?.createdAt.toDate(),
    updated_at: post.metadata?.updatedAt.toDate(),
    is_answer: post.isAnswer || false,
    likes: post.upvotes - post.downvotes,
    author_name: post.authorName
  };
}

// Helper function for properly handling dates
export function toDateOrUndefined(timestamp: Timestamp | undefined): Date | undefined {
  return timestamp?.toDate();
}
