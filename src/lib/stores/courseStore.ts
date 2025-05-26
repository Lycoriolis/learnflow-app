import { writable, derived } from 'svelte/store';
import type { ContentNode } from '$lib/services/courses/courseService'; // Corrected path
import { browser } from '$app/environment';
// Import fetchCourses and fetchCourseCategories instead of CourseContentService
import { fetchCourses, fetchCourseCategories } from '$lib/services/courses/courseService'; 

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
    // Use the imported functions directly
    const coursesResponse = await fetchCourses();
    const categoriesResponse = await fetchCourseCategories();
    
    if (coursesResponse.data) { // Check data directly
      courseItems.set(coursesResponse.data);
    } else if (coursesResponse.error) {
      console.error('Error fetching courses:', coursesResponse.error);
      error.set('Failed to load courses. Please try again later.');
    }

    if (categoriesResponse.data) { // Check data directly
      courseCategories.set(categoriesResponse.data);
    } else if (categoriesResponse.error) {
      console.error('Error fetching categories:', categoriesResponse.error);
      // Optionally set a different error or append to existing
      error.set('Failed to load course categories. Please try again later.');
    }
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
