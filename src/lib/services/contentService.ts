import type { Timestamp } from 'firebase/firestore';
import type { ContentMetadata, ContentManifestItem, CourseStructure } from '$lib/types/contentTypes';

export { ContentMetadata, ContentManifestItem, CourseStructure };

// Define the ContentNode type which represents courses and exercises
export interface ContentNode {
  id: string;
  title: string;
  description?: string;
  category?: string;
  categories?: string[];
  tags?: string[];
  content?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isPublished?: boolean;
  order?: number;
  type?: 'course' | 'exercise' | 'module';
  contentType?: 'courses' | 'exercises'; // Added for better type safety
  prerequisites?: string[];
  children?: ContentNode[];
  parentId?: string;
  slug?: string;
  metadata?: {
    dateAdded?: Timestamp;
    popularity?: number;
    difficulty?: number;
    completionTime?: number;
    viewCount?: number;
    rating?: number;
  };
}

// Define content metadata interface for admin views
export interface ContentMetadata {
  id: string;
  title: string;
  type: 'course' | 'exercise' | 'module';
  status: 'published' | 'draft' | 'archived';
  author: string;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  completionCount: number;
  averageRating: number;
}

// Define the Category interface
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
  parentId?: string;
  slug?: string;
}

// Cache for content data
let courseCache: Record<string, ContentNode[]> = {};
let exerciseCache: Record<string, ContentNode[]> = {};
let categoryCache: Record<string, Category[]> = {};

/**
 * Fetches content from the specified path
 */
export async function fetchContent(type: 'courses' | 'exercises', path?: string): Promise<ContentNode[]> {
  // If we have cached data, return it
  if (type === 'courses' && courseCache[path || 'root']) {
    return courseCache[path || 'root'];
  }
  if (type === 'exercises' && exerciseCache[path || 'root']) {
    return exerciseCache[path || 'root'];
  }

  try {
    // Build the path to fetch
    const basePath = `/content/${type}`;
    const fullPath = path ? `${basePath}/${path}/index.json` : `${basePath}/index.json`;
    
    const response = await fetch(fullPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`);
    }
    
    const data = await response.json();
    let result: ContentNode[] = [];
    
    if (Array.isArray(data)) {
      result = data;
    } else if (data.items && Array.isArray(data.items)) {
      result = data.items;
    } else {
      console.warn('Unexpected content format:', data);
      result = [];
    }
    
    // Cache the result
    if (type === 'courses') {
      courseCache[path || 'root'] = result;
    } else {
      exerciseCache[path || 'root'] = result;
    }
    
    return result;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return [];
  }
}

/**
 * Fetches categories for the specified content type
 */
export async function fetchCategories(type: 'courses' | 'exercises'): Promise<Category[]> {
  if (categoryCache[type]) {
    return categoryCache[type];
  }
  
  try {
    const response = await fetch(`/content/${type}/categories.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    
    const data = await response.json();
    categoryCache[type] = data;
    return data;
  } catch (error) {
    console.error(`Error fetching ${type} categories:`, error);
    return [];
  }
}

/**
 * Fetches a specific content item by ID
 */
export async function fetchContentById(type: 'courses' | 'exercises', id: string): Promise<ContentNode | null> {
  try {
    const response = await fetch(`/content/${type}/${id}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${type} by ID:`, error);
    return null;
  }
}

/**
 * Fetches a specific content item by slug
 */
export async function fetchContentBySlug(type: 'courses' | 'exercises', slug: string): Promise<ContentNode | null> {
  try {
    // First get all items
    const items = await fetchContent(type);
    
    // Find the item with matching slug
    const item = items.find(item => item.slug === slug);
    if (item) {
      return item;
    }
    
    // If not found in the main list, try fetching directly
    const response = await fetch(`/content/${type}/by-slug/${slug}.json`);
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${type} by slug:`, error);
    return null;
  }
}

/**
 * Clear content caches
 */
export function clearContentCache() {
  courseCache = {};
  exerciseCache = {};
  categoryCache = {};
}

/**
 * Lists content based on type and optional category identifier
 */
export async function listContent(type: string, categoryIdentifier?: string): Promise<ContentMetadata[]> {
  // Implementation based on type and optional categoryIdentifier
  // Return properly typed content metadata
  return []; // Placeholder
}

/**
 * Fetches content by slug
 */
export async function getContent(slug: string): Promise<ContentManifestItem | null> {
  if (!slug) return null;
  // Implementation to fetch content by slug
  return null; // Placeholder
}

/**
 * Fetches course structure by slug
 */
export async function getCourseStructure(slug: string): Promise<CourseStructure | null> {
  if (!slug) return null;
  // Implementation to fetch course structure
  return null; // Placeholder
}

/**
 * Gets course gradient based on difficulty
 */
export function getCourseGradient(difficulty?: string): string {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'from-green-400 to-green-600';
    case 'intermediate':
      return 'from-blue-400 to-blue-600';
    case 'advanced':
      return 'from-purple-400 to-purple-600';
    case 'expert':
      return 'from-red-400 to-red-600';
    default:
      return 'from-gray-400 to-gray-600';
  }
}

/**
 * Finds the next lesson in a course structure
 */
export function findNextLesson(course: CourseStructure, currentLessonSlug: string): ContentManifestItem | null {
  if (!course?.sections) return null;
  
  let foundCurrent = false;
  
  for (const section of course.sections) {
    for (const lesson of section.lessons) {
      if (foundCurrent) {
        return lesson;
      }
      if (lesson.slug === currentLessonSlug) {
        foundCurrent = true;
      }
    }
  }
  
  return null;
}
