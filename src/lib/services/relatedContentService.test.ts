// src/lib/services/relatedContentService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  findRelatedContent, 
  getPrerequisites, 
  calculateSimilarity,
  generateTagRelationships,
  extractAllContentTags,
  generateLearningPath
} from './relatedContentService';
import { allExercises } from './exerciseFilterService';
import * as enhancedContentService from './enhancedContentService';

// Mock data for tests
const mockExercises = [
  {
    id: 'ex1',
    title: 'JavaScript Basics',
    description: 'Learn the basics of JavaScript',
    type: 'exercise',
    tags: ['javascript', 'basics', 'programming'],
    difficulty: 'beginner',
    estimatedTime: '30 min'
  },
  {
    id: 'ex2',
    title: 'Advanced JavaScript',
    description: 'Advanced JavaScript concepts',
    type: 'exercise',
    tags: ['javascript', 'advanced', 'programming'],
    difficulty: 'advanced',
    estimatedTime: '45 min'
  },
  {
    id: 'ex3',
    title: 'CSS Layouts',
    description: 'Learn CSS layouts',
    type: 'exercise',
    tags: ['css', 'layouts', 'frontend'],
    difficulty: 'intermediate',
    estimatedTime: '20 min'
  },
  {
    id: 'ex4',
    title: 'JavaScript DOM Manipulation',
    description: 'Learn to manipulate the DOM with JavaScript',
    type: 'exercise',
    tags: ['javascript', 'dom', 'frontend'],
    difficulty: 'intermediate',
    estimatedTime: '40 min',
    prerequisites: ['ex1']
  },
  {
    id: 'ex5',
    title: 'React Components',
    description: 'Build React components',
    type: 'exercise',
    tags: ['react', 'javascript', 'frontend'],
    difficulty: 'intermediate',
    estimatedTime: '45 min',
    prerequisites: ['ex1', 'ex4']
  }
];

// Mock the necessary store and services
vi.mock('./exerciseFilterService', () => ({
  allExercises: {
    subscribe: vi.fn(),
    set: vi.fn(),
    update: vi.fn()
  },
  
}));

vi.mock('svelte/store', async () => {
  const actual = await vi.importActual('svelte/store');
  return {
    ...actual,
    get: vi.fn((store) => {
      if (store === allExercises) {
        return mockExercises;
      }
      return [];
    })
  };
});

vi.mock('./enhancedContentService', () => ({
  listExercises: vi.fn(() => Promise.resolve(mockExercises))
}));

describe('relatedContentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findRelatedContent', () => {
    it('should find related content based on tags', async () => {
      const result = await findRelatedContent('ex1');
      
      expect(result.length).toBeGreaterThan(0);
      // Should find at least ex2 and ex4 as related to ex1 (both have javascript tag)
      expect(result.some(item => item.id === 'ex2')).toBeTruthy();
      expect(result.some(item => item.id === 'ex4')).toBeTruthy();
    });

    it('should respect the limit parameter', async () => {
      const result = await findRelatedContent('ex1', { limit: 1 });
      
      expect(result.length).toBe(1);
    });

    it('should respect the threshold parameter', async () => {
      // Set high threshold to get fewer results
      const result = await findRelatedContent('ex1', { threshold: 0.8 });
      
      expect(result.length).toBeLessThan(mockExercises.length - 1);
    });
  });

  describe('getPrerequisites', () => {
    it('should return prerequisites for a content item', async () => {
      const result = await getPrerequisites('ex5');
      
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('ex1');
      expect(result[1].id).toBe('ex4');
      expect(result[0].isPrerequisite).toBe(true);
    });

    it('should return empty array if no prerequisites exist', async () => {
      const result = await getPrerequisites('ex1');
      
      expect(result.length).toBe(0);
    });
  });

  describe('calculateSimilarity', () => {
    it('should calculate higher similarity for items with more common tags', () => {
      const ex1 = mockExercises[0];
      const ex2 = mockExercises[1];
      const ex3 = mockExercises[2];
      
      const sim12 = calculateSimilarity(ex1, ex2);
      const sim13 = calculateSimilarity(ex1, ex3);
      
      // ex1 and ex2 share 'javascript' and 'programming' tags
      // ex1 and ex3 share no tags
      expect(sim12).toBeGreaterThan(sim13);
    });

    it('should return 0 for the same item', () => {
      const ex1 = mockExercises[0];
      
      const result = calculateSimilarity(ex1, ex1);
      
      expect(result).toBe(0);
    });
  });

  describe('generateTagRelationships', () => {
    it('should generate relationships based on tag similarity', async () => {
      const relationships = await generateTagRelationships();
      
      expect(relationships.length).toBeGreaterThan(0);
      
      // ex1 and ex2 should have a relationship due to shared tags
      const relation = relationships.find(r => 
        (r.sourceId === 'ex1' && r.targetId === 'ex2') || 
        (r.sourceId === 'ex2' && r.targetId === 'ex1')
      );
      
      expect(relation).toBeDefined();
      expect(relation?.relationshipType).toBe('similar');
      expect(relation?.strength).toBeGreaterThan(0);
    });
  });

  describe('extractAllContentTags', () => {
    it('should extract all unique tags from content', async () => {
      const tags = await extractAllContentTags();
      
      expect(tags).toContain('javascript');
      expect(tags).toContain('css');
      expect(tags).toContain('react');
      expect(tags).toContain('frontend');
      
      // Each tag should appear only once
      const uniqueTags = [...new Set(tags)];
      expect(tags.length).toBe(uniqueTags.length);
    });
  });

  describe('generateLearningPath', () => {
    it('should generate a learning path starting from a content item', async () => {
      const path = await generateLearningPath('ex1');
      
      expect(path.length).toBeGreaterThan(0);
      expect(path[0].id).toBe('ex1');
    });

    it('should generate a path to a goal content item if specified', async () => {
      const path = await generateLearningPath('ex1', 'ex5');
      
      expect(path.length).toBeGreaterThan(1);
      expect(path[0].id).toBe('ex1');
      expect(path[path.length - 1].id).toBe('ex5');
    });

    it('should respect the maxLength parameter', async () => {
      const maxLength = 3;
      const path = await generateLearningPath('ex1', undefined, { maxLength });
      
      expect(path.length).toBeLessThanOrEqual(maxLength);
    });
  });
});
