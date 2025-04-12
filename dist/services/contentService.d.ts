/**
 * Content Service
 *
 * Handles loading and managing markdown content for courses and exercises
 */
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
/**
 * Load markdown content from a file
 */
export declare function loadContent(type: 'course' | 'exercise', id: string): Promise<ContentItem | null>;
/**
 * List available content items (with basic metadata)
 */
export declare function listContent(type: 'course' | 'exercise'): Promise<ContentMetadata[]>;
