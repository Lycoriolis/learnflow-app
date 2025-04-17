/**
 * Content Service
 * 
 * Handles loading and managing markdown content for courses and exercises
 */

import { browser } from '$app/environment';

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
}

export interface ContentItem extends ContentMetadata {
  content: string;
}

// Content directory paths
const BASE_CONTENT_PATH = '/content';
const COURSES_PATH = `${BASE_CONTENT_PATH}/courses`;
const EXERCISES_PATH = `${BASE_CONTENT_PATH}/exercises`;

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
 * Load markdown content from a file
 */
export async function loadContent(type: 'course' | 'exercise', id: string): Promise<ContentItem | null> {
  if (!browser) return null;
  
  try {
    const basePath = type === 'course' ? COURSES_PATH : EXERCISES_PATH;
    const response = await fetch(`${basePath}/${id}.md`);
    
    if (!response.ok) {
      console.error(`Failed to load ${type} content:`, response.statusText);
      return null;
    }
    
    const content = await response.text();
    const metadata = extractMetadata(content, id, type);
    
    return {
      ...metadata,
      content
    };
  } catch (error) {
    console.error(`Error loading ${type} content:`, error);
    return null;
  }
}

/**
 * List available content items (with basic metadata)
 */
export async function listContent(type: 'course' | 'exercise'): Promise<ContentMetadata[]> {
  // In a real application, you would have an API endpoint that returns the list of content items
  // For this example, we'll use a hardcoded list of available content
  
  if (type === 'course') {
    return [
      {
        id: 'sample-course',
        title: 'Introduction to Web Development',
        type: 'course',
        slug: 'intro-web-dev',
        description: 'Learn the basics of web development with HTML, CSS, and JavaScript',
        difficulty: 'beginner',
        estimatedTime: '3 hours',
        tags: ['html', 'css', 'javascript', 'web']
      },
      {
        id: 'bezout-theorem',
        title: "Bezout's Theorem and Identity",
        type: 'course',
        slug: 'bezout-theorem',
        description: "Understanding Bézout's identity, the extended GCD algorithm, and applications.",
        difficulty: 'intermediate',
        estimatedTime: '90 minutes',
        tags: ['math', 'number theory', 'gcd', 'bezout']
      }
    ];
  } else {
    return [
      {
        id: 'html-basics-exercise',
        title: 'HTML Basics Exercise',
        type: 'exercise',
        slug: 'html-basics',
        description: 'Practice creating a simple HTML webpage with various elements',
        difficulty: 'beginner',
        estimatedTime: '45 minutes',
        tags: ['html', 'practice']
      },
      {
        id: 'bezout-identity-exercise',
        title: "Bézout's Identity Exercises",
        type: 'exercise',
        slug: 'bezout-identity',
        description: "Exercises on computing GCD, extended Euclidean algorithm, and Bézout coefficients.",
        difficulty: 'intermediate',
        estimatedTime: '30 minutes',
        tags: ['math', 'number theory', 'gcd', 'bezout']
      }
    ];
  }
}