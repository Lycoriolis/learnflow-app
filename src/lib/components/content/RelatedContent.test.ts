// src/lib/components/content/RelatedContent.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import RelatedContent from './RelatedContent.svelte';
import PrerequisiteIndicator from './PrerequisiteIndicator.svelte';
import LearningPath from './LearningPath.svelte';
import * as relatedContentService from '$lib/services/relatedContentService';

// Mock related content data
const mockRelatedItems = [
  {
    id: 'ex1',
    title: 'JavaScript Basics',
    description: 'Learn the basics of JavaScript',
    type: 'exercise',
    tags: ['javascript', 'basics', 'programming'],
    similarity: 0.8
  },
  {
    id: 'ex2',
    title: 'Advanced JavaScript',
    description: 'Advanced JavaScript concepts',
    type: 'exercise',
    tags: ['javascript', 'advanced', 'programming'],
    similarity: 0.7
  }
];

// Mock prerequisites data
const mockPrerequisites = [
  {
    id: 'ex3',
    title: 'CSS Fundamentals',
    description: 'CSS basics and selectors',
    type: 'exercise',
    tags: ['css', 'basics'],
    similarity: 1,
    isPrerequisite: true
  }
];

// Mock learning path data
const mockLearningPath = [
  {
    id: 'ex4',
    title: 'Starting Point',
    description: 'Starting point of the learning path',
    type: 'exercise',
    tags: ['javascript', 'basics'],
    similarity: 1
  },
  {
    id: 'ex5',
    title: 'Next Step',
    description: 'Next step in the learning path',
    type: 'exercise',
    tags: ['javascript', 'intermediate'],
    similarity: 0.8
  }
];

// Mock the related content service
vi.mock('$lib/services/relatedContentService', () => ({
  findRelatedContent: vi.fn(() => Promise.resolve(mockRelatedItems)),
  getPrerequisites: vi.fn(() => Promise.resolve(mockPrerequisites)),
  generateLearningPath: vi.fn(() => Promise.resolve(mockLearningPath))
}));

// Mock the $app/stores for page
vi.mock('$app/stores', () => ({
  page: {
    subscribe: vi.fn(callback => {
      callback({ params: { slug: 'test-slug' } });
      return () => {};
    })
  }
}));

describe('Related Content Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('RelatedContent', () => {
    it('should render related content items', async () => {
      const { container } = render(RelatedContent, {
        contentId: 'ex1',
        contentType: 'exercise'
      });

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(relatedContentService.findRelatedContent).toHaveBeenCalledWith('ex1', { limit: 4 });
      expect(container.textContent).toContain('Related Content');
      
      // Wait for content to render after promises
      await screen.findByText('JavaScript Basics');
      expect(container.textContent).toContain('JavaScript Basics');
      expect(container.textContent).toContain('Advanced JavaScript');
    });

    it('should show loading state initially', () => {
      const { container } = render(RelatedContent, {
        contentId: 'ex1',
        contentType: 'exercise'
      });
      
      // Should have loading animation initially
      expect(container.querySelector('.animate-pulse')).not.toBeNull();
    });

    it('should respect maxItems parameter', async () => {
      const { container } = render(RelatedContent, {
        contentId: 'ex1',
        contentType: 'exercise',
        maxItems: 1
      });

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(relatedContentService.findRelatedContent).toHaveBeenCalledWith('ex1', { limit: 1 });
    });
  });

  describe('PrerequisiteIndicator', () => {
    it('should render prerequisites', async () => {
      const { container } = render(PrerequisiteIndicator, {
        contentId: 'ex5',
        contentType: 'exercise'
      });

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(relatedContentService.getPrerequisites).toHaveBeenCalledWith('ex5');
      
      // Wait for content to render after promises
      await screen.findByText('Prerequisites');
      expect(container.textContent).toContain('Prerequisites');
      expect(container.textContent).toContain('CSS Fundamentals');
    });

    it('should not show anything if no prerequisites exist', async () => {
      vi.mocked(relatedContentService.getPrerequisites).mockResolvedValueOnce([]);
      
      const { container } = render(PrerequisiteIndicator, {
        contentId: 'ex1',
        contentType: 'exercise'
      });

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Nothing should be rendered if there are no prerequisites
      expect(container.textContent).toBe('');
    });
  });

  describe('LearningPath', () => {
    it('should render a learning path', async () => {
      const { container } = render(LearningPath, {
        startContentId: 'ex4'
      });

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(relatedContentService.generateLearningPath).toHaveBeenCalledWith('ex4', undefined, { maxLength: 5 });
      
      // Wait for content to render after promises
      await screen.findByText('Suggested Learning Path');
      expect(container.textContent).toContain('Suggested Learning Path');
      expect(container.textContent).toContain('Starting Point');
      expect(container.textContent).toContain('Next Step');
    });

    it('should show loading state initially', () => {
      const { container } = render(LearningPath, {
        startContentId: 'ex4'
      });
      
      // Should have loading spinner initially
      expect(container.querySelector('[data-testid="loading-spinner"]')).not.toBeNull();
    });

    it('should respect custom title', async () => {
      const customTitle = 'Custom Learning Path Title';
      const { container } = render(LearningPath, {
        startContentId: 'ex4',
        title: customTitle
      });

      // Wait for promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Wait for content to render after promises
      await screen.findByText(customTitle);
      expect(container.textContent).toContain(customTitle);
    });
  });
});
