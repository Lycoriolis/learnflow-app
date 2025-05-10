// src/lib/services/relatedContentService.ts
import { derived, get } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { listExercises, type ContentMetadata } from './enhancedContentService';
import { allExercises } from './exerciseFilterService';

// Define types
export interface RelatedContentItem {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'exercise' | 'lesson';
  tags: string[];
  similarity: number;
  prerequisiteFor?: string[];
  isPrerequisite?: boolean;
}

export interface ContentRelationship {
  sourceId: string;
  targetId: string;
  relationshipType: 'similar' | 'prerequisite' | 'next' | 'previous';
  strength: number; // 0-1 score for similarity strength
}

// Constants
const SIMILARITY_THRESHOLD = 0.4; // Minimum similarity score to consider content related
const MAX_RELATED_ITEMS = 6; // Maximum number of related items to return

/**
 * Calculate similarity score between two content items based on tags and metadata
 */
export function calculateSimilarity(source: ContentMetadata, target: ContentMetadata): number {
  if (source.id === target.id) return 0; // Same item, no similarity needed
  
  let score = 0;
  const sourceTags = source.tags || [];
  const targetTags = target.tags || [];
  
  // Tag matching (most important factor)
  if (sourceTags.length > 0 && targetTags.length > 0) {
    const matchingTags = sourceTags.filter(tag => targetTags.includes(tag));
    score += (matchingTags.length / Math.max(sourceTags.length, targetTags.length)) * 0.7;
  }
  
  // Difficulty matching (somewhat important)
  if (source.difficulty && target.difficulty) {
    if (source.difficulty === target.difficulty) {
      score += 0.15;
    } else {
      // Nearby difficulties still get some points
      const levels = ['beginner', 'intermediate', 'advanced'];
      const sourceIndex = levels.indexOf(source.difficulty);
      const targetIndex = levels.indexOf(target.difficulty);
      
      if (Math.abs(sourceIndex - targetIndex) === 1) {
        score += 0.05;
      }
    }
  }
  
  // Title/description keyword matching (less important)
  if (source.title && target.title) {
    const sourceWords = source.title.toLowerCase().split(/\s+/);
    const targetWords = target.title.toLowerCase().split(/\s+/);
    
    const matchingWords = sourceWords.filter(word => 
      word.length > 3 && targetWords.includes(word)
    );
    
    if (matchingWords.length > 0) {
      score += 0.1 * (matchingWords.length / Math.max(sourceWords.length, targetWords.length));
    }
  }
  
  // Content type matching (slight bonus)
  if (source.contentType === target.contentType) {
    score += 0.05;
  }
  
  return Math.min(score, 1); // Cap at 1.0
}

/**
 * Find related content for a given content item
 */
export async function findRelatedContent(
  contentId: string,
  options = { limit: MAX_RELATED_ITEMS, threshold: SIMILARITY_THRESHOLD }
): Promise<RelatedContentItem[]> {
  // Get all content items for comparison
  const allContent = get(allExercises).length > 0 
    ? get(allExercises) 
    : await listExercises();
  
  // Find the source content
  const sourceContent = allContent.find(item => item.id === contentId);
  if (!sourceContent) return [];
  
  // Calculate similarity scores for all other content
  const similarityScores = allContent
    .filter(item => item.id !== contentId) // Exclude the source item
    .map(item => ({
      content: item,
      similarity: calculateSimilarity(sourceContent, item)
    }))
    .filter(result => result.similarity >= options.threshold) // Only include items above threshold
    .sort((a, b) => b.similarity - a.similarity) // Sort by similarity (highest first)
    .slice(0, options.limit); // Take only the requested number
  
  // Convert to RelatedContentItem format
  return similarityScores.map(result => ({
    id: result.content.id || '',
    title: result.content.title || '',
    description: result.content.description || '',
    type: result.content.contentType === 'exercise' ? 'exercise' : 
          result.content.contentType === 'lesson' ? 'lesson' : 'course',
    tags: result.content.tags || [],
    similarity: result.similarity,
    isPrerequisite: false // Default value, would be determined by course structure
  }));
}

/**
 * Get prerequisites for a given content item
 */
export async function getPrerequisites(contentId: string): Promise<RelatedContentItem[]> {
  // In a real implementation, this would query the course structure data
  // For now, we'll use a simpler approach with mock data
  
  // Get all content items
  const allContent = get(allExercises).length > 0 
    ? get(allExercises) 
    : await listExercises();
  
  // Find the source content
  const sourceContent = allContent.find(item => item.id === contentId);
  if (!sourceContent) return [];
  
  // Check for prerequisites metadata
  const prereqIds = sourceContent.prerequisites || [];
  if (!prereqIds.length) return [];
  
  // Find the prerequisite content items
  return prereqIds
    .map(prereqId => {
      const prereq = allContent.find(item => item.id === prereqId);
      if (!prereq) return null;
      
      return {
        id: prereq.id || '',
        title: prereq.title || '',
        description: prereq.description || '',
        type: prereq.contentType === 'exercise' ? 'exercise' : 
              prereq.contentType === 'lesson' ? 'lesson' : 'course',
        tags: prereq.tags || [],
        similarity: 1, // Prerequisites are strongly related
        isPrerequisite: true
      };
    })
    .filter((item): item is RelatedContentItem => item !== null);
}

/**
 * Create a derived store that provides related content for the active content item
 */
export function createRelatedContentStore(activeContentId: Readable<string | null>): Readable<RelatedContentItem[]> {
  return derived(activeContentId, ($contentId, set) => {
    if (!$contentId) {
      set([]);
      return;
    }
    
    // Load related content
    const loadRelated = async () => {
      try {
        // Get both related content and prerequisites
        const [related, prerequisites] = await Promise.all([
          findRelatedContent($contentId),
          getPrerequisites($contentId)
        ]);
        
        // Combine and deduplicate
        const combinedResults = [
          ...prerequisites,
          ...related.filter(item => !prerequisites.some(p => p.id === item.id))
        ].slice(0, MAX_RELATED_ITEMS);
        
        set(combinedResults);
      } catch (error) {
        console.error('Error loading related content:', error);
        set([]);
      }
    };
    
    loadRelated();
  });
}

/**
 * Generate a learning path based on content relationships
 */
export async function generateLearningPath(
  startContentId: string,
  goalContentId?: string,
  options = { maxLength: 8 }
): Promise<RelatedContentItem[]> {
  // This would be a more complex algorithm in production
  // For simplicity, we'll implement a basic approach:
  
  // 1. Start with the source content
  // 2. Find prerequisites (if any)
  // 3. Find next steps based on similarity
  // 4. If goalContentId is provided, try to find a path to it
  
  // Get all content items
  const allContent = get(allExercises).length > 0 
    ? get(allExercises) 
    : await listExercises();
  
  // Find the start content
  const startContent = allContent.find(item => item.id === startContentId);
  if (!startContent) return [];
  
  // Initialize the path with the start content
  const path: RelatedContentItem[] = [{
    id: startContent.id || '',
    title: startContent.title || '',
    description: startContent.description || '',
    type: startContent.contentType === 'exercise' ? 'exercise' : 
          startContent.contentType === 'lesson' ? 'lesson' : 'course',
    tags: startContent.tags || [],
    similarity: 1
  }];
  
  // If we have a goal, try to find a path to it
  if (goalContentId) {
    // This would use a path-finding algorithm in production
    // For now, we'll just find content that bridges between start and goal
    
    const goalContent = allContent.find(item => item.id === goalContentId);
    if (!goalContent) return path;
    
    // Find content related to both start and goal
    const bridgeContent = allContent
      .filter(item => item.id !== startContentId && item.id !== goalContentId)
      .map(item => ({
        content: item,
        startSimilarity: calculateSimilarity(startContent, item),
        goalSimilarity: calculateSimilarity(goalContent, item)
      }))
      .filter(result => result.startSimilarity > 0.3 && result.goalSimilarity > 0.3)
      .sort((a, b) => (b.startSimilarity + b.goalSimilarity) - (a.startSimilarity + a.goalSimilarity))
      .slice(0, options.maxLength - 2); // Leave room for start and goal
    
    // Add bridge content to path
    path.push(...bridgeContent.map(result => ({
      id: result.content.id || '',
      title: result.content.title || '',
      description: result.content.description || '',
      type: result.content.contentType === 'exercise' ? 'exercise' : 
            result.content.contentType === 'lesson' ? 'lesson' : 'course',
      tags: result.content.tags || [],
      similarity: result.startSimilarity
    })));
    
    // Add goal content at the end
    path.push({
      id: goalContent.id || '',
      title: goalContent.title || '',
      description: goalContent.description || '',
      type: goalContent.contentType === 'exercise' ? 'exercise' : 
            goalContent.contentType === 'lesson' ? 'lesson' : 'course',
      tags: goalContent.tags || [],
      similarity: 1
    });
  } else {
    // No goal - just find related content to create a logical path
    const relatedContent = await findRelatedContent(startContentId, { 
      limit: options.maxLength - 1,
      threshold: 0.3
    });
    
    path.push(...relatedContent);
  }
  
  return path.slice(0, options.maxLength);
}

/**
 * Generate tag-based relationships between content items
 * This function analyzes all content and generates relationships based on tag similarity
 */
export async function generateTagRelationships(): Promise<ContentRelationship[]> {
  // Get all content items
  const allContent = get(allExercises).length > 0 
    ? get(allExercises) 
    : await listExercises();
  
  const relationships: ContentRelationship[] = [];
  
  // Compare each content item with every other
  for (let i = 0; i < allContent.length; i++) {
    const source = allContent[i];
    if (!source.id || !source.tags || source.tags.length === 0) continue;
    
    for (let j = i + 1; j < allContent.length; j++) {
      const target = allContent[j];
      if (!target.id || !target.tags || target.tags.length === 0) continue;
      
      // Calculate tag similarity
      const sourceTags = source.tags;
      const targetTags = target.tags;
      
      const commonTags = sourceTags.filter(tag => targetTags.includes(tag));
      if (commonTags.length === 0) continue; // No common tags
      
      const similarityScore = commonTags.length / 
        Math.sqrt(sourceTags.length * targetTags.length);
      
      // Only add relationships with meaningful similarity
      if (similarityScore >= 0.3) {
        relationships.push({
          sourceId: source.id,
          targetId: target.id,
          relationshipType: 'similar',
          strength: similarityScore
        });
      }
    }
  }
  
  return relationships;
}

/**
 * Extract all unique tags from content
 */
export async function extractAllContentTags(): Promise<string[]> {
  // Get all content items
  const allContent = get(allExercises).length > 0 
    ? get(allExercises) 
    : await listExercises();
  
  // Extract all tags
  const allTags = allContent
    .flatMap(item => item.tags || [])
    .filter(Boolean);
  
  // Get unique tags
  return [...new Set(allTags)].sort();
}

/**
 * Find content by tag
 */
export async function findContentByTags(
  tags: string[], 
  options = { contentType: 'all', limit: 20 }
): Promise<RelatedContentItem[]> {
  if (!tags.length) return [];
  
  // Get all content items
  const allContent = get(allExercises).length > 0 
    ? get(allExercises) 
    : await listExercises();
  
  // Filter by content type if specified
  let filteredContent = allContent;
  if (options.contentType !== 'all') {
    filteredContent = allContent.filter(item => {
      // Check the type of the item based on properties or explicit type
      const itemType = 'type' in item ? item.type : 
                      'contentType' in item ? item.contentType : 
                      item.id?.includes('exercise') ? 'exercise' : 'lesson';
      
      return itemType === options.contentType;
    });
  }
  
  // Score content by tag matches
  const scoredContent = filteredContent
    .map(item => {
      const itemTags = item.tags || [];
      const matchingTags = tags.filter(tag => itemTags.includes(tag));
      
      return {
        content: item,
        score: matchingTags.length / tags.length
      };
    })
    .filter(result => result.score > 0) // Only include items with at least one matching tag
    .sort((a, b) => b.score - a.score) // Sort by score (highest first)
    .slice(0, options.limit); // Take only the requested number
  
  // Convert to RelatedContentItem format
  return scoredContent.map(result => {
    // Determine the type based on available properties or naming conventions
    const itemType = 'type' in result.content ? result.content.type : 
                    'contentType' in result.content ? result.content.contentType : 
                    result.content.id?.includes('exercise') ? 'exercise' : 'lesson';
                    
    return {
      id: result.content.id || '',
      title: result.content.title || '',
      description: result.content.description || '',
      type: itemType === 'exercise' ? 'exercise' : 
            itemType === 'lesson' ? 'lesson' : 'course',
      tags: result.content.tags || [],
      similarity: result.score
    };
  });
}
