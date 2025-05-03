// Content-related type definitions for the LearnFlow app

// Base interface for timestamps
export interface Timestamped {
  createdAt?: any; // FirebaseFirestore.Timestamp
  updatedAt?: any; // FirebaseFirestore.Timestamp
}

// Course interface
export interface Course extends Timestamped {
  id?: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  featured?: boolean;
  imageUrl?: string;
  duration?: number; // in minutes
  authorId: string;
  tags?: string[];
  lessons?: string[]; // IDs of lessons
  enrollmentCount?: number;
  rating?: number;
  published?: boolean;
}

// Lesson interface
export interface Lesson extends Timestamped {
  id?: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  duration?: number; // in minutes
  videoUrl?: string;
  attachments?: Attachment[];
  quizzes?: string[]; // IDs of quizzes
}

// Exercise interface
export interface Exercise extends Timestamped {
  id?: string;
  title: string;
  description: string;
  lessonId?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple-choice' | 'code' | 'written';
  content: string;
  solution?: string;
  hints?: string[];
  points?: number;
}

// User Progress interface
export interface UserProgress extends Timestamped {
  id?: string;
  userId: string;
  courseId: string;
  completedLessons: string[]; // IDs of completed lessons
  completedExercises: string[]; // IDs of completed exercises
  progress: number; // Percentage completed (0-100)
  lastActivity: any; // FirebaseFirestore.Timestamp
  quizScores?: { [quizId: string]: number };
  certificationEarned?: boolean;
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