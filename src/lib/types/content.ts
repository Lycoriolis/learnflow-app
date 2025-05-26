// Content-related type definitions for the LearnFlow app

// Timestamped interface
export interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

// Base interface for all content items
export interface BaseContent {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  isPublished: boolean;
  order?: number;
  metadata?: {
    version?: string;
    lastModifiedBy?: string;
    tags?: string[];
  };
}

// Course interface
export interface Course extends BaseContent {
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  featured?: boolean;
  imageUrl?: string;
  duration: number; // in minutes
  modules: string[]; // IDs of modules
  enrollmentCount: number;
  rating?: number;
  prerequisites?: string[]; // IDs of prerequisite courses
  tags: string[];
  slug: string;
}

// Module interface
export interface Module extends BaseContent {
  courseId: string;
  lessons: string[]; // IDs of lessons
  duration: number; // in minutes
  prerequisites?: string[]; // IDs of prerequisite modules
}

// Lesson interface
export interface Lesson extends BaseContent {
  moduleId: string;
  courseId: string; // Denormalized for easier querying
  contentType: 'mdx' | 'video' | 'quiz';
  contentPath?: string; // For MDX content
  videoUrl?: string; // For video content
  duration: number; // in minutes
  exercises: string[]; // IDs of exercises
  prerequisites?: string[]; // IDs of prerequisite lessons
}

// Exercise interface
export interface Exercise extends BaseContent {
  lessonId: string;
  moduleId: string; // Denormalized for easier querying
  courseId: string; // Denormalized for easier querying
  type: 'multiple-choice' | 'coding' | 'fill-in-the-blanks';
  question: string;
  options?: string[]; // For multiple-choice
  correctAnswer: string | string[];
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// User progress tracking
export interface UserProgress {
  userId: string;
  itemId: string; // Can be courseId, moduleId, lessonId, or exerciseId
  itemType: 'course' | 'module' | 'lesson' | 'exercise';
  status: 'not-started' | 'in-progress' | 'completed';
  score?: number; // For exercises/quizzes
  lastAccessedAt: Date;
  completedAt?: Date;
  attempts?: number;
  metadata?: {
    timeSpent?: number; // in minutes
    lastScore?: number;
    notes?: string;
  };
}

// User activity tracking
export interface UserActivity {
  userId: string;
  activityType: 'view_lesson' | 'attempt_exercise' | 'complete_course' | 'post_forum_reply';
  itemId: string;
  itemType: 'course' | 'module' | 'lesson' | 'exercise' | 'forum_post';
  timestamp: Date;
  details: {
    score?: number;
    duration?: number;
    success?: boolean;
    [key: string]: any; // For additional activity-specific data
  };
}

// Category interface
export interface Category {
  id: string;
  title: string;
  description?: string;
  slug: string;
  parentId?: string;
  order?: number;
  courseCount: number;
  metadata?: {
    icon?: string;
    color?: string;
  };
}

// Attachment interface
export interface Attachment {
  id?: string;
  name: string;
  url: string;
  type: string;
  size?: number;
}

// User Profile interface
export interface UserProfile extends Timestamped {
  id?: string;
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  interests?: string[];
  role: 'student' | 'instructor' | 'admin';
  enrolledCourses?: string[]; // IDs of enrolled courses
  completedCourses?: string[]; // IDs of completed courses
  achievements?: Achievement[];
  preferences?: UserPreferences;
}

// Achievement interface
export interface Achievement {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  earnedAt: any; // FirebaseFirestore.Timestamp
}

// User Preferences interface
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  language?: string;
}

// Forum Post interface
export interface ForumPost extends Timestamped {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  courseId?: string;
  lessonId?: string;
  tags?: string[];
  views?: number;
  upvotes?: number;
  downvotes?: number;
  replies?: ForumReply[];
  pinned?: boolean;
}

// Forum Reply interface
export interface ForumReply extends Timestamped {
  id?: string;
  postId: string;
  content: string;
  authorId: string;
  upvotes?: number;
  downvotes?: number;
  accepted?: boolean;
}