import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'; // Removed SpyInstance
import { 
  fetchContentById, 
  fetchContentBySlug, 
  fetchContent, 
  fetchCategories, 
  clearContentCache 
} from '../contentService'; // Adjust path as needed
import type { ContentNode } from '../contentService';

// Mock global fetch
global.fetch = vi.fn();

const mockCourse1: ContentNode = { id: 'course1', slug: 'course-one', title: 'Test Course 1', type: 'course' };
const mockCourse2: ContentNode = { id: 'course2', slug: 'course-two', title: 'Test Course 2', type: 'course' };
const mockExercise1: ContentNode = { id: 'ex1', slug: 'exercise-one', title: 'Test Exercise 1', type: 'exercise' };

describe('contentService (Client-side)', () => {
  beforeEach(() => {
    clearContentCache();
    (global.fetch as any).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchContentById', () => {
    it('should fetch content by ID and cache it for courses', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse1,
      });

      let content = await fetchContentById('courses', 'course1');
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('/content/courses/course1.json');
      expect(content).toEqual(mockCourse1);

      // Call again, should use cache
      content = await fetchContentById('courses', 'course1');
      expect(global.fetch).toHaveBeenCalledTimes(1); // Still 1
      expect(content).toEqual(mockCourse1);
    });

    it('should fetch content by ID and cache it for exercises', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockExercise1,
      });

      let content = await fetchContentById('exercises', 'ex1');
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('/content/exercises/ex1.json');
      expect(content).toEqual(mockExercise1);

      // Call again, should use cache
      content = await fetchContentById('exercises', 'ex1');
      expect(global.fetch).toHaveBeenCalledTimes(1); // Still 1
      expect(content).toEqual(mockExercise1);
    });

    it('should re-fetch content after cache is cleared', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse1,
      });

      await fetchContentById('courses', 'course1');
      expect(global.fetch).toHaveBeenCalledTimes(1);

      clearContentCache();
      (global.fetch as any).mockResolvedValueOnce({ // Mock again for the second call
        ok: true,
        json: async () => mockCourse1,
      });

      await fetchContentById('courses', 'course1');
      expect(global.fetch).toHaveBeenCalledTimes(2); // Called again
    });

    it('should throw an error if fetch fails for fetchContentById', async () => {
      (global.fetch as any).mockResolvedValueOnce({ ok: false, statusText: 'Not Found' });
      await expect(fetchContentById('courses', 'nonexistent')).rejects.toThrow('Failed to fetch content by ID: nonexistent, Status: Not Found');
    });
  });

  describe('fetchContentBySlug', () => {
    it('should fetch content by slug directly and cache it', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse1,
      });

      let content = await fetchContentBySlug('courses', 'course-one');
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('/content/courses/by-slug/course-one.json');
      expect(content).toEqual(mockCourse1);

      // Call again, should use cache
      content = await fetchContentBySlug('courses', 'course-one');
      expect(global.fetch).toHaveBeenCalledTimes(1); // Still 1
      expect(content).toEqual(mockCourse1);
    });

    it('should attempt direct slug fetch first, and not call fetchContent if successful', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse1,
      });

      await fetchContentBySlug('courses', 'course-one');
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('/content/courses/by-slug/course-one.json');
      // Ensure fetchContent (index fetch) was NOT called
      expect(((global.fetch as any).mock as any).calls.some((call: any[]) => call[0] === '/content/courses/index.json')).toBe(false);
    });
    
    it('should fallback to fetchContent and search if direct slug fetch fails (404)', async () => {
      // Mock direct slug fetch (404)
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404, 
        statusText: 'Not Found'
      });
      // Mock fetchContent (index fetch)
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [mockCourse1, mockCourse2],
      });

      const content = await fetchContentBySlug('courses', 'course-one');
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenNthCalledWith(1, '/content/courses/by-slug/course-one.json');
      expect(global.fetch).toHaveBeenNthCalledWith(2, '/content/courses/index.json'); // Called fetchContent
      expect(content).toEqual(mockCourse1);

      // Call again, should use cache (should be cached from the fallback)
      (global.fetch as any).mockClear(); // Clear history for the next check
      const cachedContent = await fetchContentBySlug('courses', 'course-one');
      expect(global.fetch).toHaveBeenCalledTimes(0); // Not called again
      expect(cachedContent).toEqual(mockCourse1);
    });

    it('should return null if direct slug fetch fails and item not in fallback', async () => {
      (global.fetch as any).mockResolvedValueOnce({ ok: false, status: 404 }); // Direct slug fails
      (global.fetch as any).mockResolvedValueOnce({ ok: true, json: async () => [mockCourse2] }); // Fallback data

      const content = await fetchContentBySlug('courses', 'nonexistent-slug');
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(content).toBeNull();
    });
    
    it('should re-fetch content by slug after cache is cleared', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCourse1,
      });
      await fetchContentBySlug('courses', 'course-one');
      expect(global.fetch).toHaveBeenCalledTimes(1);

      clearContentCache();
      (global.fetch as any).mockResolvedValueOnce({ // Mock again for the second call
        ok: true,
        json: async () => mockCourse1,
      });
      await fetchContentBySlug('courses', 'course-one');
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if fetch fails for fetchContentBySlug (and fallback also fails)', async () => {
      (global.fetch as any).mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Server Error (direct)' }); // Direct slug fetch fails
      (global.fetch as any).mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Server Error (index)' }); // Fallback fetchContent also fails
      
      await expect(fetchContentBySlug('courses', 'any-slug')).rejects.toThrow(); // Error comes from fetchContent
    });
  });

  describe('Error Handling for fetchContent and fetchCategories', () => {
    it('should throw an error if fetch fails for fetchContent', async () => {
      (global.fetch as any).mockResolvedValueOnce({ ok: false, statusText: 'Server Error' });
      await expect(fetchContent('courses')).rejects.toThrow('Failed to fetch content: Server Error');
    });

    it('should throw an error if fetch fails for fetchCategories', async () => {
      (global.fetch as any).mockResolvedValueOnce({ ok: false, statusText: 'Server Error' });
      await expect(fetchCategories('courses')).rejects.toThrow('Failed to fetch categories: Server Error');
    });
  });
});
