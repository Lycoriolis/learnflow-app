import { Timestamp } from 'firebase/firestore';

export interface BaseContentNode {
  id: string;
  title: string;
  type: string;
  slug?: string;
  path?: string;
  description?: string;
  children?: BaseContentNode[];
}

export interface ContentNode extends BaseContentNode {
  markdownContent?: string;
  contentLoadingError?: string;
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    author: string;
    tags?: string[];
    category?: string;
  };
}

export interface ContentManifestItem {
  id: string;
  title: string;
  type: string;
  slug?: string;
  path?: string;
  description?: string;
  children?: ContentManifestItem[];
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    author: string;
    tags?: string[];
    category?: string;
  };
}

export interface ServiceResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface ContentMetadata {
  createdAt: Date;
  updatedAt: Date;
  author: string;
  tags?: string[];
  category?: string;
}

export interface ContentResponse {
  id: string;
  title: string;
  content: string;
  metadata: ContentMetadata;
  related: string[];
}

export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  enrolledCount: number;
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: number;
  completedCount: number;
  category?: string;
  tags?: string[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    author: string;
  };
}

export interface ExerciseFilterOptions {
  difficulty?: string;
  category?: string;
  tags?: string[];
  searchTerm?: string;
  sortBy?: 'newest' | 'oldest' | 'difficulty' | 'popularity';
  limit?: number;
  preferCategories?: string[];
  difficultyRange?: {
    min?: number;
    max?: number;
  };
}

export interface ScoredExercise {
  exercise: Exercise;
  score: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: number;
  order: number;
  exercises: string[];
  prerequisites: string[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    author: string;
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
  duration: number;
  prerequisites: string[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    author: string;
  };
}

export interface CourseStructure {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalDuration: number;
  enrolledCount: number;
  category?: string;
  tags?: string[];
  modules: Module[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    author: string;
  };
}

export interface ForumCategory {
  id: string;
  title: string;
  description: string;
  slug: string;
  order: number;
  topicCount: number;
  postCount: number;
  lastActivity?: Timestamp;
  metadata?: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    author: string;
  };
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  slug: string;
  viewCount: number;
  replyCount: number;
  isPinned: boolean;
  isLocked: boolean;
  lastActivity?: Timestamp;
  tags?: string[];
  metadata?: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
}

export interface ForumPost {
  id: string;
  content: string;
  topicId: string;
  authorId: string;
  authorName: string;
  parentId?: string;
  isAnswer: boolean;
  upvotes: number;
  downvotes: number;
  metadata?: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
}

export interface UserProgress {
  userId: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  exerciseId?: string;
  status: 'notStarted' | 'inProgress' | 'completed';
  score?: number;
  lastAccessed: Timestamp;
  metadata?: {
    timeSpent: number;
    attempts: number;
    completionDate?: Timestamp;
  };
}

export interface UserPreferences {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
  };
  accessibility: {
    fontSize: number;
    highContrast: boolean;
    reducedMotion: boolean;
  };
  metadata?: {
    lastUpdated: Timestamp;
  };
} 