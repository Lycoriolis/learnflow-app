import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';
import { getCurrentUser } from './authService';
import { loadCourseStructure, loadLesson } from './enhancedContentService';
import type { CourseStructure, Lesson } from './enhancedContentService';

// Progress tracking store
export const userProgress = writable<{
  courses: Record<string, CourseProgress>;
  exercises: Record<string, ExerciseProgress>;
}>({
  courses: {},
  exercises: {}
});

// Progress types
export interface CourseProgress {
  courseId: string;
  startedAt: string;
  lastAccessedAt: string;
  completedAt?: string;
  modules: Record<string, ModuleProgress>;
  progress: number; // 0-100
}

export interface ModuleProgress {
  moduleId: string;
  startedAt: string;
  lastAccessedAt: string;
  completedAt?: string;
  lessons: Record<string, LessonProgress>;
  progress: number; // 0-100
}

export interface LessonProgress {
  lessonId: string;
  startedAt: string;
  lastAccessedAt: string;
  completedAt?: string;
  completed: boolean;
  quizzes?: Record<string, QuizProgress>;
}

export interface QuizProgress {
  quizId: string;
  completed: boolean;
  score?: number;
  attempts: number;
}

export interface ExerciseProgress {
  exerciseId: string;
  category: string;
  startedAt: string;
  lastAccessedAt: string;
  completedAt?: string;
  completed: boolean;
  attempts: number;
  solution?: string;
}

// Local storage key
const PROGRESS_STORAGE_KEY = 'learnflow_user_progress';

/**
 * Initialize user progress from local storage or cloud
 */
export async function initUserProgress(): Promise<void> {
  if (!browser) return;

  try {
    // Try to load from local storage first
    const storedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (storedProgress) {
      userProgress.set(JSON.parse(storedProgress));
    }

    // If user is logged in, try to sync with cloud
    const user = getCurrentUser();
    if (user) {
      // TODO: Implement cloud sync
      // This would fetch progress from a database and merge with local
    }
  } catch (error) {
    console.error('Failed to initialize user progress:', error);
  }
}

/**
 * Save progress to local storage and cloud if logged in
 */
function saveProgress(): void {
  if (!browser) return;

  try {
    const progress = get(userProgress);
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));

    // If user is logged in, save to cloud
    const user = getCurrentUser();
    if (user) {
      // TODO: Implement cloud sync
    }
  } catch (error) {
    console.error('Failed to save user progress:', error);
  }
}

/**
 * Start or update a course progress
 */
export function trackCourseView(courseId: string): void {
  if (!browser) return;

  const progress = get(userProgress);
  const now = new Date().toISOString();

  if (!progress.courses[courseId]) {
    // Initialize new course progress
    progress.courses[courseId] = {
      courseId,
      startedAt: now,
      lastAccessedAt: now,
      modules: {},
      progress: 0
    };
  } else {
    // Update last accessed time
    progress.courses[courseId].lastAccessedAt = now;
  }

  userProgress.set(progress);
  saveProgress();
}

/**
 * Start or update a module progress
 */
export function trackModuleView(courseId: string, moduleId: string): void {
  if (!browser) return;

  // Ensure course is being tracked
  trackCourseView(courseId);

  const progress = get(userProgress);
  const now = new Date().toISOString();

  if (!progress.courses[courseId].modules[moduleId]) {
    // Initialize new module progress
    progress.courses[courseId].modules[moduleId] = {
      moduleId,
      startedAt: now,
      lastAccessedAt: now,
      lessons: {},
      progress: 0
    };
  } else {
    // Update last accessed time
    progress.courses[courseId].modules[moduleId].lastAccessedAt = now;
  }

  userProgress.set(progress);
  saveProgress();
  updateCourseProgress(courseId);
}

/**
 * Start or update a lesson progress
 */
export function trackLessonView(courseId: string, moduleId: string, lessonId: string): void {
  if (!browser) return;

  // Ensure module is being tracked
  trackModuleView(courseId, moduleId);

  const progress = get(userProgress);
  const now = new Date().toISOString();

  if (!progress.courses[courseId].modules[moduleId].lessons[lessonId]) {
    // Initialize new lesson progress
    progress.courses[courseId].modules[moduleId].lessons[lessonId] = {
      lessonId,
      startedAt: now,
      lastAccessedAt: now,
      completed: false
    };
  } else {
    // Update last accessed time
    progress.courses[courseId].modules[moduleId].lessons[lessonId].lastAccessedAt = now;
  }

  userProgress.set(progress);
  saveProgress();
}

/**
 * Mark a lesson as completed
 */
export function completeLessonView(courseId: string, moduleId: string, lessonId: string): void {
  if (!browser) return;

  // Ensure lesson is being tracked
  trackLessonView(courseId, moduleId, lessonId);

  const progress = get(userProgress);
  const now = new Date().toISOString();

  // Mark lesson as completed
  progress.courses[courseId].modules[moduleId].lessons[lessonId].completed = true;
  progress.courses[courseId].modules[moduleId].lessons[lessonId].completedAt = now;

  userProgress.set(progress);
  saveProgress();
  
  // Update module and course progress
  updateModuleProgress(courseId, moduleId);
}

/**
 * Track quiz attempt and completion
 */
export function trackQuizProgress(
  courseId: string, 
  moduleId: string, 
  lessonId: string, 
  quizId: string, 
  completed: boolean, 
  score?: number
): void {
  if (!browser) return;

  // Ensure lesson is being tracked
  trackLessonView(courseId, moduleId, lessonId);

  const progress = get(userProgress);
  
  // Initialize quizzes object if needed
  if (!progress.courses[courseId].modules[moduleId].lessons[lessonId].quizzes) {
    progress.courses[courseId].modules[moduleId].lessons[lessonId].quizzes = {};
  }
  
  const quizzes = progress.courses[courseId].modules[moduleId].lessons[lessonId].quizzes!;
  
  if (!quizzes[quizId]) {
    quizzes[quizId] = {
      quizId,
      completed,
      score,
      attempts: 1
    };
  } else {
    quizzes[quizId].completed = completed;
    if (score !== undefined) quizzes[quizId].score = score;
    quizzes[quizId].attempts++;
  }

  userProgress.set(progress);
  saveProgress();
}

/**
 * Update module progress based on lessons completion
 */
export function updateModuleProgress(courseId: string, moduleId: string): void {
  if (!browser) return;

  const progress = get(userProgress);
  const moduleProgress = progress.courses[courseId].modules[moduleId];
  
  // Get total lessons and completed lessons
  let totalLessons = 0;
  let completedLessons = 0;
  
  Object.values(moduleProgress.lessons).forEach(lesson => {
    totalLessons++;
    if (lesson.completed) completedLessons++;
  });
  
  // Calculate progress percentage
  const progressPercentage = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100) 
    : 0;
  
  moduleProgress.progress = progressPercentage;
  
  // Check if module is completed
  if (progressPercentage === 100 && !moduleProgress.completedAt) {
    moduleProgress.completedAt = new Date().toISOString();
  }
  
  userProgress.set(progress);
  saveProgress();
  updateCourseProgress(courseId);
}

/**
 * Update course progress based on modules completion
 */
export function updateCourseProgress(courseId: string): void {
  if (!browser) return;

  const progress = get(userProgress);
  const courseProgress = progress.courses[courseId];
  
  // Get total modules and completed modules
  const modules = Object.values(courseProgress.modules);
  const totalModules = modules.length;
  const moduleProgressSum = modules.reduce((sum, module) => sum + module.progress, 0);
  
  // Calculate course progress
  const progressPercentage = totalModules > 0 
    ? Math.round(moduleProgressSum / totalModules) 
    : 0;
  
  courseProgress.progress = progressPercentage;
  
  // Check if course is completed
  if (progressPercentage === 100 && !courseProgress.completedAt) {
    courseProgress.completedAt = new Date().toISOString();
  }
  
  userProgress.set(progress);
  saveProgress();
}

/**
 * Track exercise view and progress
 */
export function trackExerciseView(category: string, exerciseId: string): void {
  if (!browser) return;

  const progress = get(userProgress);
  const now = new Date().toISOString();
  const exerciseKey = `${category}/${exerciseId}`;

  if (!progress.exercises[exerciseKey]) {
    // Initialize new exercise progress
    progress.exercises[exerciseKey] = {
      exerciseId,
      category,
      startedAt: now,
      lastAccessedAt: now,
      completed: false,
      attempts: 1
    };
  } else {
    // Update last accessed time
    progress.exercises[exerciseKey].lastAccessedAt = now;
    progress.exercises[exerciseKey].attempts++;
  }

  userProgress.set(progress);
  saveProgress();
}

/**
 * Complete an exercise
 */
export function completeExercise(category: string, exerciseId: string, solution?: string): void {
  if (!browser) return;

  // Ensure exercise is being tracked
  trackExerciseView(category, exerciseId);

  const progress = get(userProgress);
  const now = new Date().toISOString();
  const exerciseKey = `${category}/${exerciseId}`;

  // Mark exercise as completed
  progress.exercises[exerciseKey].completed = true;
  progress.exercises[exerciseKey].completedAt = now;
  if (solution) progress.exercises[exerciseKey].solution = solution;

  userProgress.set(progress);
  saveProgress();
}

/**
 * Get course progress
 */
export function getCourseProgress(courseId: string): CourseProgress | null {
  if (!browser) return null;

  const progress = get(userProgress);
  return progress.courses[courseId] || null;
}

/**
 * Get module progress
 */
export function getModuleProgress(courseId: string, moduleId: string): ModuleProgress | null {
  if (!browser) return null;

  const courseProgress = getCourseProgress(courseId);
  if (!courseProgress) return null;
  
  return courseProgress.modules[moduleId] || null;
}

/**
 * Get lesson progress
 */
export function getLessonProgress(courseId: string, moduleId: string, lessonId: string): LessonProgress | null {
  if (!browser) return null;

  const moduleProgress = getModuleProgress(courseId, moduleId);
  if (!moduleProgress) return null;
  
  return moduleProgress.lessons[lessonId] || null;
}

/**
 * Get exercise progress
 */
export function getExerciseProgress(category: string, exerciseId: string): ExerciseProgress | null {
  if (!browser) return null;

  const progress = get(userProgress);
  const exerciseKey = `${category}/${exerciseId}`;
  
  return progress.exercises[exerciseKey] || null;
}

/**
 * Clear all progress data (for logout/testing)
 */
export function clearUserProgress(): void {
  if (!browser) return;

  userProgress.set({ courses: {}, exercises: {} });
  localStorage.removeItem(PROGRESS_STORAGE_KEY);
}

// Initialize progress on import
if (browser) {
  initUserProgress();
}
