// Course service using Firebase database
import type { Course } from '$lib/types/content'; 
import { 
  createDocument, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  queryDocuments 
} from '$lib/firebase/databaseUtils';

const COLLECTION_NAME = 'courses';

/**
 * Create a new course
 * @param courseData The course data to store
 * @returns The ID of the created course
 */
export async function createCourse(courseData: Partial<Course>): Promise<string> {
  return createDocument(COLLECTION_NAME, courseData);
}

/**
 * Get a course by ID
 * @param courseId The ID of the course
 * @returns The course data or null if not found
 */
export async function getCourse(courseId: string): Promise<Course | null> {
  return getDocument(COLLECTION_NAME, courseId) as Promise<Course | null>;
}

/**
 * Update a course by ID
 * @param courseId The ID of the course
 * @param courseData The course data to update
 */
export async function updateCourse(courseId: string, courseData: Partial<Course>): Promise<void> {
  return updateDocument(COLLECTION_NAME, courseId, courseData);
}

/**
 * Delete a course by ID
 * @param courseId The ID of the course
 */
export async function deleteCourse(courseId: string): Promise<void> {
  return deleteDocument(COLLECTION_NAME, courseId);
}

/**
 * Get all courses
 * @returns Array of all courses
 */
export async function getAllCourses(): Promise<Course[]> {
  return queryDocuments(COLLECTION_NAME) as Promise<Course[]>;
}

/**
 * Get courses by category
 * @param category The category to filter by
 * @returns Array of courses in the category
 */
export async function getCoursesByCategory(category: string): Promise<Course[]> {
  return queryDocuments(
    COLLECTION_NAME,
    [{ field: 'category', operator: '==', value: category }]
  ) as Promise<Course[]>;
}

/**
 * Get featured courses
 * @param limit Maximum number of courses to return
 * @returns Array of featured courses
 */
export async function getFeaturedCourses(limit: number = 5): Promise<Course[]> {
  return queryDocuments(
    COLLECTION_NAME,
    [{ field: 'featured', operator: '==', value: true }],
    'createdAt',
    'desc',
    limit
  ) as Promise<Course[]>;
}

/**
 * Search courses by title or description
 * Note: This is a simple implementation. For more advanced search, 
 * consider using Firebase Extensions like Algolia or ElasticSearch
 * @param searchTerm The search term
 * @returns Array of courses matching the search term
 */
export async function searchCourses(searchTerm: string): Promise<Course[]> {
  // Get all courses - in a real app you would want to implement proper search
  const courses = await getAllCourses();
  
  // Filter courses that match the search term in title or description
  return courses.filter(course => 
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
}