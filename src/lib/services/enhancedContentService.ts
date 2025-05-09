import { browser } from '$app/environment';
import { marked } from 'marked';
import matter from 'gray-matter';
import { writable, get } from 'svelte/store';

// Cache stores
export const coursesCache = writable<Map<string, CourseStructure>>(new Map());
export const courseContentCache = writable<Map<string, string>>(new Map());
const lessonsCache = writable<Map<string, Lesson>>(new Map());
const exercisesCache = writable<Map<string, ContentItem>>(new Map());
export const courseListCache = writable<ContentMetadata[] | null>(null); // Export courseListCache
const exerciseListCache = writable<Map<string, ContentMetadata[]>>(new Map());

// Types
export interface ContentMetadata {
  id: string;
  title: string;
  type: 'course' | 'exercise';
  slug: string;
  description?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  estimatedTime?: string;
  created?: string;
  updated?: string;
  order?: number;
  modules?: string[];
  icon?: string;
  gradient?: { from: string; to: string };
  version?: string; // Added version
  author?: string;  // Added author
}

export interface ContentItem extends ContentMetadata {
  content: string;
}

export interface ModuleMetadata {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: string[];
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: LessonMetadata[];
}

export interface LessonMetadata {
  id: string;
  title: string;
  estimatedTime?: string;
  order?: number;
  frontmatter?: Record<string, any>; // Add frontmatter
}

export interface Lesson extends LessonMetadata {
  content: string;
}

export interface CourseStructure {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: { from: string; to: string };
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  modules: Module[];
  version?: string; // Added version
  author?: string;  // Added author
}

// Content directory paths
const BASE_CONTENT_PATH = '/content';
const COURSES_PATH = `${BASE_CONTENT_PATH}/courses`;
const EXERCISES_PATH = `${BASE_CONTENT_PATH}/exercises`;

/**
 * Load JSON metadata file
 */
async function loadJsonMetadata<T>(path: string): Promise<T | null> {
  if (!browser) return null;
  
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.error(`Failed to load metadata from ${path}:`, response.statusText);
      return null;
    }
    return await response.json() as T;
  } catch (error) {
    console.error(`Error loading metadata from ${path}:`, error);
    return null;
  }
}

/**
 * Load markdown content from a file with frontmatter
 */
export async function loadMarkdownWithFrontmatter(path: string): Promise<{ content: string; data: any } | null> {
  if (!browser) return null;

  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.error(`Failed to load markdown from ${path}:`, response.statusText);
      return null;
    }
    
    const rawContent = await response.text();
    const { content, data } = matter(rawContent);
    
    return { content, data };
  } catch (error) {
    console.error(`Error loading markdown from ${path}:`, error);
    return null;
  }
}

/**
 * Extract metadata from markdown content
 * This parses the first h1 as title and looks for metadata in frontmatter or content
 */
function extractMetadata(content: string, id: string, type: 'course' | 'exercise'): ContentMetadata {
  // Default metadata
  const metadata: ContentMetadata = {
    id,
    title: id,
    type,
    slug: id,
  };
  
  try {
    // Extract title from the first h1
    const titleMatch = content.match(/^# (.*$)/m);
    if (titleMatch && titleMatch[1]) {
      metadata.title = titleMatch[1].trim();
    }
    
    // Extract description from the first paragraph after the title
    const descriptionMatch = content.match(/^# .*$\s+([^#].*)/m);
    if (descriptionMatch && descriptionMatch[1]) {
      metadata.description = descriptionMatch[1].trim();
    }
    
    // Parse difficulty from content
    if (content.includes('## Difficulty:')) {
      if (content.includes('beginner')) metadata.difficulty = 'beginner';
      else if (content.includes('intermediate')) metadata.difficulty = 'intermediate';
      else if (content.includes('advanced')) metadata.difficulty = 'advanced';
    }
    
    // Extract estimated time if mentioned
    const timeMatch = content.match(/estimated time:?\s*([^\n]+)/i);
    if (timeMatch && timeMatch[1]) {
      metadata.estimatedTime = timeMatch[1].trim();
    }
    
    // Extract tags from content if mentioned
    const tagsMatch = content.match(/tags:?\s*([^\n]+)/i);
    if (tagsMatch && tagsMatch[1]) {
      metadata.tags = tagsMatch[1].split(',').map(tag => tag.trim());
    }
  } catch (error) {
    console.error('Error extracting metadata:', error);
  }
  
  return metadata;
}

/**
 * Load a single course with all its structure (modules and lessons)
 */
export async function loadCourseStructure(courseId: string): Promise<CourseStructure | null> {
  if (!browser) return null;

  const cachedCourses = get(coursesCache);
  if (cachedCourses.has(courseId)) {
    return cachedCourses.get(courseId) || null;
  }
  
  try {
    // Load course metadata
    const courseMetaPath = `${COURSES_PATH}/${courseId}/meta.json`;
    const courseMeta = await loadJsonMetadata<ContentMetadata>(courseMetaPath);
    
    if (!courseMeta) {
      console.error(`Course metadata not found for ${courseId}`);
      return null;
    }
    
    // Try to load course overview (README.md) for enhanced description
    let courseDescription = courseMeta.description || '';
    try {
      const readmePath = `${COURSES_PATH}/${courseId}/README.md`;
      const readmeData = await loadMarkdownWithFrontmatter(readmePath);
      if (readmeData && !courseDescription) {
        // If no description in meta.json, extract from README
        const descMatch = readmeData.content.match(/^# .*$\s+([^#].*)/m);
        if (descMatch && descMatch[1]) {
          courseDescription = descMatch[1].trim();
        }
      }
    } catch (e) {
      // README is optional, so we can ignore if not found
    }
    
    // Initialize course structure
    const courseStructure: CourseStructure = {
      id: courseMeta.id,
      title: courseMeta.title,
      description: courseDescription || courseMeta.description || '',
      icon: courseMeta.icon || 'fa-book',
      gradient: courseMeta.gradient || { from: 'blue-500', to: 'blue-400' },
      tags: courseMeta.tags,
      difficulty: courseMeta.difficulty,
      estimatedTime: courseMeta.estimatedTime,
      version: courseMeta.version, // Added version
      author: courseMeta.author,   // Added author
      modules: []
    };
    
    // Load modules
    if (courseMeta.modules && courseMeta.modules.length > 0) {
      for (const moduleId of courseMeta.modules) {
        const moduleMetaPath = `${COURSES_PATH}/${courseId}/modules/${moduleId}/meta.json`;
        const moduleMeta = await loadJsonMetadata<ModuleMetadata>(moduleMetaPath);
        
        if (moduleMeta) {
          const moduleWithLessons: Module = {
            ...moduleMeta,
            lessons: []
          };
          
          // Load lesson metadata for each lesson in this module
          for (const lessonFile of moduleMeta.lessons) {
            const lessonPath = `${COURSES_PATH}/${courseId}/modules/${moduleId}/lessons/${lessonFile}`;
            const lessonData = await loadMarkdownWithFrontmatter(lessonPath);
            
            if (lessonData) {
              const lessonId = lessonFile.replace(/\.md$/, '');
              const lessonMeta: LessonMetadata = {
                id: lessonId,
                title: lessonData.data.title || lessonId,
                estimatedTime: lessonData.data.estimatedTime,
                order: lessonData.data.order || 0,
                frontmatter: lessonData.data // Populate frontmatter
              };
              
              moduleWithLessons.lessons.push(lessonMeta);
            }
          }
          
          // Sort lessons by order if available
          moduleWithLessons.lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
          courseStructure.modules.push(moduleWithLessons);
        }
      }
      
      // Sort modules by order if available
      courseStructure.modules.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    
    coursesCache.update(cache => cache.set(courseId, courseStructure));
    return courseStructure;
  } catch (error) {
    console.error(`Error loading course structure for ${courseId}:`, error);
    return null;
  }
}

/**
 * Load a single lesson from a course
 */
export async function loadLesson(courseId: string, moduleId: string, lessonId: string): Promise<Lesson | null> {
  if (!browser) return null;

  const lessonKey = `${courseId}/${moduleId}/${lessonId}`;
  const cachedLessons = get(lessonsCache);
  if (cachedLessons.has(lessonKey)) {
    return cachedLessons.get(lessonKey) || null;
  }
  
  try {
    const lessonPath = `${COURSES_PATH}/${courseId}/modules/${moduleId}/lessons/${lessonId}.md`;
    const lessonData = await loadMarkdownWithFrontmatter(lessonPath);
    
    if (!lessonData) {
      console.error(`Lesson not found: ${lessonPath}`);
      return null;
    }
    
    const lesson: Lesson = {
      id: lessonId,
      title: lessonData.data.title || lessonId,
      estimatedTime: lessonData.data.estimatedTime,
      order: lessonData.data.order || 0,
      content: lessonData.content,
      frontmatter: lessonData.data // Populate frontmatter
    };

    lessonsCache.update(cache => cache.set(lessonKey, lesson));
    return lesson;
  } catch (error) {
    console.error(`Error loading lesson ${lessonId}:`, error);
    return null;
  }
}

/**
 * Load markdown content for an exercise
 */
export async function loadExercise(categoryOrPath: string, exerciseId?: string): Promise<ContentItem | null> {
  if (!browser) return null;

  const exerciseKey = exerciseId ? `${categoryOrPath}/${exerciseId}` : categoryOrPath;
  const cachedExercises = get(exercisesCache);
  if (cachedExercises.has(exerciseKey)) {
    return cachedExercises.get(exerciseKey) || null;
  }

  try {
    let exercisePath: string;
    
    if (exerciseId) {
      // If both category and exerciseId are provided
      exercisePath = `${EXERCISES_PATH}/${categoryOrPath}/${exerciseId}.md`;
    } else {
      // If only the full path identifier is provided
      exercisePath = `${EXERCISES_PATH}/${categoryOrPath}.md`;
      
      // Extract exerciseId from the path
      const parts = categoryOrPath.split('/');
      exerciseId = parts[parts.length - 1];
    }
    
    const exerciseData = await loadMarkdownWithFrontmatter(exercisePath);
    
    if (!exerciseData) {
      console.error(`Exercise not found: ${exercisePath}`);
      return null;
    }
    
    // Combine frontmatter data with content
    const exercise: ContentItem = {
      id: exerciseId!,
      title: exerciseData.data.title || exerciseId!,
      type: 'exercise',
      slug: exerciseData.data.slug || exerciseId!,
      description: exerciseData.data.description,
      tags: exerciseData.data.tags,
      difficulty: exerciseData.data.difficulty,
      estimatedTime: exerciseData.data.estimatedTime,
      ...exerciseData.data,
      content: exerciseData.content
    };

    exercisesCache.update(cache => cache.set(exerciseKey, exercise));
    return exercise;
  } catch (error) {
    console.error(`Error loading exercise ${categoryOrPath}/${exerciseId}:`, error);
    return null;
  }
}

/**
 * List all available courses by scanning the content directory
 */
export async function listCourses(): Promise<ContentMetadata[]> {
  if (!browser) return [];

  const cachedCourseList = get(courseListCache);
  if (cachedCourseList) {
    return cachedCourseList;
  }

  try {
    const courses: ContentMetadata[] = [];
    // Fetch the list of items in the courses directory
    const directoryResponse = await fetch(`${COURSES_PATH}/`); // e.g., /content/courses/
    if (!directoryResponse.ok) {
      console.error(`Failed to list courses directory: ${directoryResponse.statusText}`);
      courseListCache.set([]); // Cache empty list on error
      return [];
    }

    // Assuming the response is a JSON array of objects like { name: string, type: 'directory' | 'file' }
    const directoryItems: Array<{ name: string; type: string }> = await directoryResponse.json();

    const courseIds: string[] = directoryItems
      .filter(item => item.type === 'directory' && item.name.endsWith('/'))
      .map(item => item.name.slice(0, -1)); // Remove trailing slash to get the ID

    for (const courseId of courseIds) {
      const courseMetaPath = `${COURSES_PATH}/${courseId}/meta.json`;
      let metaResponse: Response | undefined = undefined; // Define here for access in catch

      try {
        metaResponse = await fetch(courseMetaPath);
        if (metaResponse.ok) {
          const meta = await metaResponse.json();
          // Ensure meta has the expected structure before pushing
          if (meta && meta.id && meta.title) {
            courses.push({
              id: meta.id,
              title: meta.title,
              type: 'course',
              slug: meta.slug || meta.id, // Prefer meta.slug if it exists
              description: meta.description,
              icon: meta.icon || 'fa-book',
              gradient: meta.gradient || { from: 'blue-500', to: 'blue-400' },
              tags: meta.tags,
              difficulty: meta.difficulty,
              estimatedTime: meta.estimatedTime,
              version: meta.version,
              author: meta.author
            });
          } else {
            console.warn(`Metadata for course ${courseId} is malformed or missing required fields.`);
          }
        } else {
          // Log only if not a 404, as 404s might be expected (course dir without meta.json)
          // These courses will be skipped, which is the correct behavior.
          if (metaResponse.status !== 404) {
            console.warn(`Failed to load metadata for course ${courseId}: ${metaResponse.statusText} (status: ${metaResponse.status})`);
          }
        }
      } catch (e) {
        // This catch handles errors from fetch() itself (e.g. network error) or from .json()
        let logMessage = `Error processing metadata for course ${courseId}: ${e instanceof Error ? e.message : String(e)}`;
        
        // Avoid logging if it was a 404 on metaResponse, as that's handled by not pushing the course.
        // This block is for unexpected errors (network, JSON parsing on OK response, etc.)
        if (!(metaResponse && metaResponse.status === 404)) {
            if (metaResponse && !metaResponse.ok) { 
                 // This case (fetch succeeded, not ok, but still threw to catch) is less common with current logic
                 // but adding status if available can help debug.
                 logMessage += ` (fetch status: ${metaResponse.status})`;
            }
            console.warn(logMessage);
        }
      }
    }

    courseListCache.set(courses);
    return courses;
  } catch (error) { // This outer catch is for errors with fetching/parsing the main directory listing
    console.error('Error listing courses (outer try-catch):', error);
    courseListCache.set([]); // Cache empty list on major error
    return [];
  }
}

/**
 * List all available exercises, optionally filtered by category
 */
export async function listExercises(category?: string): Promise<ContentMetadata[]> {
  if (!browser) return [];
  
  const cachedExerciseList = get(exerciseListCache);
  if (category && cachedExerciseList.has(category)) {
    return cachedExerciseList.get(category) || [];
  }

  try {
    // In a real implementation, we would scan the directory dynamically
    // For now, we'll manually check for exercises in our known categories
    const categories = category ? [category] : ['javascript', 'algorithms', 'web-development'];
    const exercises: ContentMetadata[] = [];
    
    for (const cat of categories) {
      // Hardcoded exercise IDs for each category - in a real implementation this would be dynamic
      const exerciseIds: Record<string, string[]> = {
        'javascript': ['array-manipulation'],
        'algorithms': [],
        'web-development': []
      };
      
      for (const exerciseId of exerciseIds[cat] || []) {
        // Try to load exercise metadata
        const exercisePath = `${EXERCISES_PATH}/${cat}/${exerciseId}.md`;
        try {
          const exerciseData = await loadMarkdownWithFrontmatter(exercisePath);
          if (exerciseData) {
            exercises.push({
              id: exerciseId,
              title: exerciseData.data.title || exerciseId,
              type: 'exercise',
              slug: exerciseData.data.slug || exerciseId,
              description: exerciseData.data.description,
              tags: exerciseData.data.tags,
              difficulty: exerciseData.data.difficulty,
              estimatedTime: exerciseData.data.estimatedTime
            });
          }
        } catch (e) {
          console.warn(`Exercise ${cat}/${exerciseId} could not be loaded`);
        }
      }
    }
    
    if (category) {
      exerciseListCache.update(cache => cache.set(category, exercises));
    }
    return exercises;
  } catch (error) {
    console.error('Error listing exercises:', error);
    return [];
  }
}

/**
 * Get all available exercise categories
 */
export async function getExerciseCategories(): Promise<string[]> {
  if (!browser) return [];
  
  try {
    // In a real implementation, this would scan the directory structure
    // For now, we return the actual categories we've created in the static directory
    return ['javascript', 'algorithms', 'web-development'];
  } catch (error) {
    console.error('Error getting exercise categories:', error);
    return [];
  }
}

/**
 * Search for content in courses and exercises
 * This is a naive implementation and would be replaced with a proper search engine in production
 */
export async function searchContent(query: string, types?: ('course' | 'exercise')[]): Promise<ContentMetadata[]> {
  if (!browser || !query) return [];
  
  const searchTypes = types || ['course', 'exercise'];
  const results: ContentMetadata[] = [];
  
  try {
    // Search in courses
    if (searchTypes.includes('course')) {
      const courses = await listCourses();
      
      // First pass: match course metadata
      const courseResults = courses.filter(course => 
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(query.toLowerCase())) ||
        (course.tags && course.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
      );
      
      results.push(...courseResults);
      
      // Second pass: search in course content (This is expensive and would be optimized in production)
      for (const course of courses) {
        if (courseResults.find(c => c.id === course.id)) continue; // Skip if already matched
        
        const courseStructure = await loadCourseStructure(course.id);
        if (!courseStructure) continue;
        
        let foundInCourse = false;
        
        // Check modules and lessons
        for (const module of courseStructure.modules) {
          if (
            module.title.toLowerCase().includes(query.toLowerCase()) || 
            (module.description && module.description.toLowerCase().includes(query.toLowerCase()))
          ) {
            foundInCourse = true;
            break;
          }
          
          // Look at lesson titles
          for (const lesson of module.lessons) {
            if (lesson.title.toLowerCase().includes(query.toLowerCase())) {
              foundInCourse = true;
              break;
            }
            
            // Deep search in lesson content (costly operation)
            const lessonData = await loadLesson(course.id, module.id, lesson.id);
            if (lessonData && lessonData.content.toLowerCase().includes(query.toLowerCase())) {
              foundInCourse = true;
              break;
            }
          }
          
          if (foundInCourse) break;
        }
        
        if (foundInCourse) {
          results.push(course);
        }
      }
    }
    
    // Search in exercises
    if (searchTypes.includes('exercise')) {
      const exercises = await listExercises();
      
      // First pass: match exercise metadata
      const exerciseResults = exercises.filter(exercise => 
        exercise.title.toLowerCase().includes(query.toLowerCase()) ||
        (exercise.description && exercise.description.toLowerCase().includes(query.toLowerCase())) ||
        (exercise.tags && exercise.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
      );
      
      results.push(...exerciseResults);
      
      // Second pass: search in exercise content (This is expensive and would be optimized in production)
      for (const exercise of exercises) {
        if (exerciseResults.find(e => e.id === exercise.id)) continue; // Skip if already matched
        
        const categories = await getExerciseCategories();
        for (const category of categories) {
          try {
            const exerciseContent = await loadExercise(category, exercise.id);
            if (exerciseContent && exerciseContent.content.toLowerCase().includes(query.toLowerCase())) {
              results.push(exercise);
              break;
            }
          } catch (e) {
            // Skip if exercise not found in this category
          }
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error searching content:', error);
    return [];
  }
}

/**
 * Clear all caches
 */
export function clearCaches() {
  coursesCache.set(new Map<string, CourseStructure>());
  courseContentCache.set(new Map<string, string>());
  if (browser) {
    console.log('Caches cleared');
  }
}

// Initialize caches or perform other setup if needed
if (browser) {
  console.log('Enhanced Content Service Initialized');
}
