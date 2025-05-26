import type { Timestamp } from 'firebase/firestore';
import type { ContentManifestItem as CMItem, CourseStructure as CStruct } from '$lib/types/contentTypes'; // Aliased imports

// Define ContentMetadata locally if it's different from the one in contentTypes.ts
// or ensure the imported one matches the usage here.
// For now, assuming it's intended to be distinct or there was a naming conflict.
interface ContentMetadata {
    id: string;
    title: string;
    type: string; // e.g., 'course', 'lesson', 'exercise'
    category?: string;
    tags?: string[];
    filePath?: string; 
    // Add other relevant fields
}

export { type CMItem as ContentManifestItem, type CStruct as CourseStructure, type ContentMetadata }; // Export with aliases and local definition

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
  contentPath?: string; // Added contentPath property
  metadata?: {
    dateAdded?: Timestamp;
    popularity?: number;
    difficulty?: number;
    completionTime?: number;
    viewCount?: number;
    rating?: number;
  };
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

// Cache for content data by ID
let courseIdCache: Record<string, ContentNode> = {};
let exerciseIdCache: Record<string, ContentNode> = {};

// Cache for content data by slug
let courseSlugCache: Record<string, ContentNode> = {};
let exerciseSlugCache: Record<string, ContentNode> = {};

// Cache for content data by contentPath
let contentPathCache: Record<string, ContentNode> = {};

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
    throw error;
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
    throw error;
  }
}

/**
 * Fetches a specific content item by ID
 */
export async function fetchContentById(type: 'courses' | 'exercises', id: string): Promise<ContentNode | null> {
  // Check cache first
  if (type === 'courses' && courseIdCache[id]) {
    return courseIdCache[id];
  }
  if (type === 'exercises' && exerciseIdCache[id]) {
    return exerciseIdCache[id];
  }

  try {
    const response = await fetch(`/content/${type}/${id}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch content by ID: ${id}, Status: ${response.statusText}`);
    }
    const data = await response.json() as ContentNode;

    // Cache the result
    if (type === 'courses') {
      courseIdCache[id] = data;
    } else {
      exerciseIdCache[id] = data;
    }
    return data;
  } catch (error) {
    console.error(`Error fetching ${type} by ID (${id}):`, error);
    throw error;
  }
}

/**
 * Fetches a specific content item by its full contentPath.
 * @param contentPath The exact content path (e.g., 'exercises/maths/mpsi-maths/calculus-basics' or 'courses/physics/intro_index').
 * @returns A ContentNode or null if not found.
 */
export async function fetchContentByContentPath(contentPath: string): Promise<ContentNode | null> {
  if (!contentPath) return null;

  const normalizedPath = ('/' + contentPath).replace(/\/+/g, '/').replace(/^\//, ''); // Ensure no leading slash for API call

  if (contentPathCache[normalizedPath]) {
    return contentPathCache[normalizedPath];
  }

  try {
    // The API endpoint is /api/content/[...segments]
    // segments should not start with a slash, e.g., 'exercises/maths/mpsi-maths/calculs-algebriques'
    const response = await fetch(`/api/content/${normalizedPath}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`[client/contentService] Content not found via API for path: ${normalizedPath}`);
        return null;
      }
      throw new Error(`[client/contentService] Failed to fetch content by path: ${normalizedPath}, Status: ${response.statusText}`);
    }

    const data = await response.json() as ContentNode;
    
    if (data) {
      contentPathCache[normalizedPath] = data; // Cache with the normalized path used for fetching
      // Also cache by slug if available, to keep caches consistent
      if (data.slug) {
        if (data.contentType === 'courses') {
          courseSlugCache[data.slug] = data;
        } else if (data.contentType === 'exercises') {
          exerciseSlugCache[data.slug] = data;
        }
      }
      return data;
    } else {
      // Should be caught by !response.ok, but as a fallback
      console.warn(`[client/contentService] No data returned for path: ${normalizedPath}`);
      return null;
    }

  } catch (error) {
    console.error(`[client/contentService] Error fetching content by path (${normalizedPath}):`, error);
    return null; 
  }
}

/**
 * Fetches a specific content item by slug
 */
export async function fetchContentBySlug(type: 'courses' | 'exercises', slug: string): Promise<ContentNode | null> {
  console.warn(`[client/contentService] fetchContentBySlug: This function is being deprecated. Consider using contentPath-based fetching. Slug: ${slug}, Type: ${type}`);
  
  // Try to map slug to a contentPath
  const potentialContentPath = `/${type}/${slug}`.replace(/\/+/g, '/'); // Corrected regex

  // Check cache first (using slug for slugCache, contentPath for contentPathCache)
  if (type === 'courses' && courseSlugCache[slug]) {
    return courseSlugCache[slug];
  }
  if (type === 'exercises' && exerciseSlugCache[slug]) {
    return exerciseSlugCache[slug];
  }
  if (contentPathCache[potentialContentPath]) {
    return contentPathCache[potentialContentPath];
  }

  // Attempt to use the new fetchContentByContentPath
  const contentFromPath = await fetchContentByContentPath(potentialContentPath);
  if (contentFromPath) {
    contentPathCache[potentialContentPath] = contentFromPath;
    if (type === 'courses') courseSlugCache[slug] = contentFromPath;
    else exerciseSlugCache[slug] = contentFromPath;
    return contentFromPath;
  }
  
  console.log(`[client/contentService] fetchContentBySlug: Falling back to old slug fetching logic for slug '${slug}' as contentPath fetch failed or is not implemented.`);

  try {
    const directResponse = await fetch(`/content/${type}/by-slug/${slug}.json`);
    if (directResponse.ok) {
      const data = await directResponse.json() as ContentNode;
      if (type === 'courses') courseSlugCache[slug] = data;
      else exerciseSlugCache[slug] = data;
      if (data.contentPath) contentPathCache[data.contentPath] = data;
      return data;
    }

    const items = await fetchContent(type);
    const item = items.find(item => item.slug === slug);

    if (item) {
      if (type === 'courses') courseSlugCache[slug] = item;
      else exerciseSlugCache[slug] = item;
      if (item.contentPath) contentPathCache[item.contentPath] = item;
      return item;
    }
    
    return null; 
  } catch (error) {
    console.error(`[client/contentService] Error fetching ${type} by slug (${slug}):`, error);
    return null; // Return null on error
  }
}

/**
 * Clear content caches
 */
export function clearContentCache() {
  courseCache = {};
  exerciseCache = {};
  categoryCache = {};
  courseIdCache = {};
  exerciseIdCache = {};
  courseSlugCache = {};
  exerciseSlugCache = {};
  contentPathCache = {};
}

/**
 * Lists content based on type and optional category identifier
 */
export async function listContent(_type: string, _categoryIdentifier?: string): Promise<ContentMetadata[]> {
  return [];
}

/**
 * Fetches content by slug
 */
export async function getContent(slug: string): Promise<CMItem | null> {
  if (!slug) return null;
  return null; // Placeholder
}

/**
 * Fetches course structure by slug
 */
export async function getCourseStructure(slug: string): Promise<CStruct | null> {
  if (!slug) return null;
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
export function findNextLesson(course: CStruct, currentLessonSlug: string): CMItem | null {
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
