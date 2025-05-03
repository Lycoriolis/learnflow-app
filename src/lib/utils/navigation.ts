import { goto } from '$app/navigation';

/**
 * Navigation utility functions for LearnFlow app
 * Centralizes common navigation patterns to reduce code duplication
 */

/**
 * Navigate to the login page
 * @param returnUrl Optional URL to return to after login
 */
export function navigateToLogin(returnUrl?: string): void {
  const url = returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login';
  goto(url);
}

/**
 * Navigate to a course page
 * @param courseId The ID or slug of the course
 */
export function navigateToCourse(courseId: string): void {
  goto(`/courses/${courseId}`);
}

/**
 * Navigate to a specific module within a course
 * @param courseId The ID or slug of the course
 * @param moduleId The ID or slug of the module
 */
export function navigateToModule(courseId: string, moduleId: string): void {
  goto(`/courses/${courseId}/${moduleId}`);
}

/**
 * Navigate to a specific lesson within a module
 * @param courseId The ID or slug of the course
 * @param moduleId The ID or slug of the module
 * @param lessonId The ID or slug of the lesson
 */
export function navigateToLesson(courseId: string, moduleId: string, lessonId: string): void {
  goto(`/courses/${courseId}/${moduleId}/${lessonId}`);
}

/**
 * Navigate to an exercise
 * @param exerciseId The ID of the exercise
 */
export function navigateToExercise(exerciseId: string): void {
  goto(`/exercises/${exerciseId}`);
}

/**
 * Navigate back to previous page
 */
export function navigateBack(): void {
  window.history.back();
}

/**
 * Navigate to the register/signup page
 * @param returnUrl Optional URL to return to after registration
 */
export function navigateToRegister(returnUrl?: string): void {
  const url = returnUrl ? `/register?returnUrl=${encodeURIComponent(returnUrl)}` : '/register';
  goto(url);
}

/**
 * Navigate to user dashboard/home
 */
export function navigateToDashboard(): void {
  goto('/');
}