// Define forum-related types
export interface ForumCategory {
  id: string;
  name: string;
  description?: string;
  order?: number;
  icon?: string;
  created_at?: Date;
  updated_at?: Date;
  topic_count?: number;
}

export interface ForumTopic {
  id: string;
  title: string;
  category_id: string;
  author_id: string;
  is_pinned?: boolean;
  is_locked?: boolean;
  views?: number;
  votes?: number;
  created_at?: Date;
  updated_at?: Date;
  tags?: string[];
  category_name?: string; // Joined from categories table
  post_count?: number;    // Count of related posts
  author_name?: string;   // Joined from users table
}

export interface ForumPost {
  id: string;
  topic_id: string;
  author_id: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
  is_answer?: boolean;
  likes?: number;
  author_name?: string;   // Joined from users table
}

export interface TopicVote {
  topic_id: string;
  user_id: string;
  vote_type: 1 | -1;      // 1 for upvote, -1 for downvote
  created_at?: Date;
}

export interface PostLike {
  post_id: string;
  user_id: string;
  created_at?: Date;
}

// Additional interfaces for view models
export interface ForumTopicWithDetails extends ForumTopic {
  posts?: ForumPost[];
  category?: ForumCategory;
  userVote?: 1 | -1 | null;
}

export interface ExerciseFilterOptions {
  difficulty?: string;
  category?: string;
  tag?: string;
  searchQuery?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  createdAt: Date;
  updatedAt?: Date;
  tags?: string[];
}

export interface Post {
  id: string;
  content: string;
  topicId: string;
  authorId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ForumLike {
  id: string;
  userId: string;
  targetId: string; // Either topic ID or post ID
  targetType: 'topic' | 'post';
  createdAt: Date;
}
