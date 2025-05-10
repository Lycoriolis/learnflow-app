// Filepath: /home/linux/learnflow-app/learnflow-app/src/routes/courses/[slug]/[moduleId]/[lessonId]/+page.server.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from './+page.server';
import * as enhancedContentService from '$lib/services/enhancedContentService';
import * as relatedContentService from '$lib/services/relatedContentService';
import { error } from '@sveltejs/kit';

// Mock SvelteKit's error function
vi.mock('@sveltejs/kit', () => {
  return {
    error: vi.fn((code, message) => ({ code, message }))
  };
});

// Mock the content service functions
vi.mock('$lib/services/enhancedContentService', () => ({
  loadCourseStructure: vi.fn(),
  loadLesson: vi.fn()
}));

// Mock the related content service functions
vi.mock('$lib/services/relatedContentService', () => ({
  findRelatedContent: vi.fn(),
  getPrerequisites: vi.fn()
}));

describe('Lesson Page Server Load', () => {
  const mockCourse = {
    id: 'course-1',
    title: 'Test Course',
    description: 'Test Description',
    modules: []
  };

  const mockLesson = {
    id: 'lesson-1',
    title: 'Test Lesson',
    content: 'Test Content'
  };

  const mockRelatedContent = [
    {
      id: 'ex1',
      title: 'Related Exercise 1',
      type: 'exercise',
      tags: ['javascript'],
      similarity: 0.8
    }
  ];

  const mockPrerequisites = [
    {
      id: 'lesson-2',
      title: 'Prerequisite Lesson',
      type: 'lesson',
      tags: ['html'],
      similarity: 1,
      isPrerequisite: true
    }
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(enhancedContentService.loadCourseStructure).mockResolvedValue(mockCourse);
    vi.mocked(enhancedContentService.loadLesson).mockResolvedValue(mockLesson);
    vi.mocked(relatedContentService.findRelatedContent).mockResolvedValue(mockRelatedContent);
    vi.mocked(relatedContentService.getPrerequisites).mockResolvedValue(mockPrerequisites);
  });

  it('should load course, lesson, related content, and prerequisites', async () => {
    const params = { slug: 'course-1', moduleId: 'module-1', lessonId: 'lesson-1' };
    const result = await load({ params } as any);

    expect(enhancedContentService.loadCourseStructure).toHaveBeenCalledWith('course-1');
    expect(enhancedContentService.loadLesson).toHaveBeenCalledWith('course-1', 'module-1', 'lesson-1');
    expect(relatedContentService.findRelatedContent).toHaveBeenCalledWith('lesson-1', { limit: 6, threshold: 0.3 });
    expect(relatedContentService.getPrerequisites).toHaveBeenCalledWith('lesson-1');

    expect(result).toEqual({
      course: mockCourse,
      lesson: mockLesson,
      relatedContent: mockRelatedContent,
      prerequisites: mockPrerequisites
    });
  });

  it('should throw 404 error if course is not found', async () => {
    vi.mocked(enhancedContentService.loadCourseStructure).mockResolvedValue(null);

    const params = { slug: 'nonexistent-course', moduleId: 'module-1', lessonId: 'lesson-1' };
    
    await expect(async () => {
      await load({ params } as any);
    }).rejects.toEqual(expect.objectContaining({ 
      code: 404, 
      message: 'Course not found' 
    }));
  });

  it('should throw 404 error if lesson is not found', async () => {
    vi.mocked(enhancedContentService.loadLesson).mockResolvedValue(null);

    const params = { slug: 'course-1', moduleId: 'module-1', lessonId: 'nonexistent-lesson' };

    await expect(async () => {
      await load({ params } as any);
    }).rejects.toEqual(expect.objectContaining({ 
      code: 404, 
      message: 'Lesson not found' 
    }));
  });

  it('should handle errors when loading content', async () => {
    vi.mocked(enhancedContentService.loadCourseStructure).mockRejectedValue(new Error('Test error'));

    const params = { slug: 'course-1', moduleId: 'module-1', lessonId: 'lesson-1' };

    await expect(async () => {
      await load({ params } as any);
    }).rejects.toEqual(expect.objectContaining({ 
      code: 500,
      message: 'Failed to load lesson content. Please try again later.'
    }));
  });
});
