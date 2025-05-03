import { writable, derived } from 'svelte/store';
import type { ContentNode } from '$lib/services/courses/courseService';
import { fetchCourses, fetchCourseCategories } from '$lib/services/courses/courseService';
import { browser } from '$app/environment';

// Create stores
export const courseItems = writable<ContentNode[]>([]);
export const courseCategories = writable<any[]>([]);
export const selectedCourse = writable<ContentNode | null>(null);
export const isLoading = writable(false);
export const error = writable<string | null>(null);

// Initialize the store data
export async function initCourseStore() {
  if (!browser) return; // Don't run on server
  
  isLoading.set(true);
  error.set(null);
  
  try {
    const [courses, categories] = await Promise.all([
      fetchCourses(),
      fetchCourseCategories()
    ]);
    
    courseItems.set(courses);
    courseCategories.set(categories);
  } catch (err) {
    console.error('Error initializing course store:', err);
    error.set('Failed to load courses. Please try again later.');
  } finally {
    isLoading.set(false);
  }
}

// Filter courses by category
export function filterCoursesByCategory(categoryId: string) {
  isLoading.set(true);
  
  return derived(courseItems, ($courseItems) => {
    isLoading.set(false);
    if (!categoryId || categoryId === 'all') {
      return $courseItems;
    }
    return $courseItems.filter(course => course.category === categoryId);
  });
}

// Select a course
export function selectCourse(course: ContentNode) {
  selectedCourse.set(course);
}

// Clear selection
export function clearSelection() {
  selectedCourse.set(null);
}
