import { vi, describe, it, expect, beforeEach, afterEach, SpyInstance } from 'vitest';
import { getContentNodeByIdentifier, clearContentCache } from '../contentService'; // Adjust path
import type { ContentNode } from '../../types/shared'; // Adjust path
import * as fsPromises from 'fs/promises';
import { marked } from 'marked'; // Import marked to potentially spy on or mock its direct usage
import { error as svelteKitError } from '@sveltejs/kit';


// Mock fs/promises
vi.mock('fs/promises', async (importOriginal) => {
  const original = await importOriginal<typeof import('fs/promises')>();
  return {
    ...original,
    readFile: vi.fn(),
    readdir: vi.fn(), // Mock other functions if they were used by other parts of contentService.server
  };
});

// Mock @sveltejs/kit error
vi.mock('@sveltejs/kit', () => ({
  error: vi.fn((status: number, message: string | Error) => {
    const err = message instanceof Error ? message : new Error(String(message));
    (err as any).status = status;
    return err;
  }),
}));


// Mock marked if direct control over its call is needed for some tests,
// though for testing sanitization, we want the actual marked instance from the module.
// For the error throwing test, we can spy and mock its implementation.
let markedSpy: SpyInstance;

// Helper to get typed mocks
const mockReadFile = fsPromises.readFile as SpyInstance;

const mockCourseManifest = [
  { id: 'course1', slug: 'course-one', title: 'Test Course 1', type: 'course', path: 'course1.md' },
  { id: 'lesson1', slug: 'lesson-one', title: 'Test Lesson 1', type: 'lesson', path: 'lesson1.md' },
];

const mockExerciseManifest = [
   { id: 'ex1', slug: 'exercise-one', title: 'Test Exercise 1', type: 'exercise', path: 'ex1.md' },
];


describe('contentService (Server-side)', () => {
  beforeEach(() => {
    clearContentCache();
    vi.clearAllMocks();

    // Default mock for readFile (manifest)
    mockReadFile.mockImplementation(async (path: string) => {
      if (path.endsWith('courses/manifest.json')) {
        return JSON.stringify(mockCourseManifest);
      }
      if (path.endsWith('exercises/manifest.json')) {
        return JSON.stringify(mockExerciseManifest);
      }
      // Default for content files - can be overridden in specific tests
      return '# Default Content'; 
    });

    // Restore marked to its original implementation before each test, then spy
    // This is tricky because marked.setOptions is global.
    // We assume the module's marked instance is already configured.
    markedSpy = vi.spyOn(marked, 'parse').mockName('marked.parse');


  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('marked.setOptions - Sanitization', () => {
    it('should sanitize unsafe HTML when sanitize:true is set', async () => {
      const unsafeMarkdown = 'Hello <script>alert("xss")</script> world';
      const expectedSafeHtml = "<p>Hello  world</p>\n"; // Based on marked's default sanitize behavior

      mockReadFile.mockImplementation(async (path: string) => {
        if (path.endsWith('courses/manifest.json')) return JSON.stringify([{ id: 'unsafe-course', type: 'course', path: 'unsafe.md' }]);
        if (path.endsWith('unsafe.md')) return unsafeMarkdown;
        return '';
      });
      
      // We are testing the instance of marked used by getContentNodeByIdentifier
      // which should have sanitize: true set globally in the module.
      const node = await getContentNodeByIdentifier('courses', 'unsafe-course');
      
      // marked.parse is the core function that does the conversion.
      // We expect the output `node.markdownContent` to be sanitized.
      expect(node.markdownContent).toBe(expectedSafeHtml);
    });

     it('should retain safe HTML like <h1>', async () => {
      const safeMarkdown = '# Safe Header';
      const expectedHtml = "<h1 id=\"safe-header\">Safe Header</h1>\n";

      mockReadFile.mockImplementation(async (path: string) => {
        if (path.endsWith('courses/manifest.json')) return JSON.stringify([{ id: 'safe-course', type: 'course', path: 'safe.md' }]);
        if (path.endsWith('safe.md')) return safeMarkdown;
        return '';
      });
      
      const node = await getContentNodeByIdentifier('courses', 'safe-course');
      expect(node.markdownContent).toBe(expectedHtml);
    });
  });

  describe('Error Handling in getContentNodeByIdentifier', () => {
    it('should throw SvelteKit error if readFile for markdown content fails', async () => {
      mockReadFile.mockImplementation(async (path: string) => {
        if (path.endsWith('courses/manifest.json')) {
          return JSON.stringify([{ id: 'course1', type: 'course', path: 'course1.md' }]);
        }
        if (path.endsWith('course1.md')) {
          throw new Error('FS Read Error');
        }
        return '';
      });

      await expect(getContentNodeByIdentifier('courses', 'course1')).rejects.toThrow('Failed to load content for course1: FS Read Error');
      expect(svelteKitError).toHaveBeenCalledWith(500, 'Failed to load content for course1: FS Read Error');
    });

    it('should throw SvelteKit error if manifest readFile fails', async () => {
        mockReadFile.mockImplementation(async (path: string) => {
            if (path.endsWith('courses/manifest.json')) {
                throw new Error('Manifest Read Error');
            }
            return ''; // Should not be reached if manifest fails
        });
        
        // The error in loadContentManifest is "Error loading manifest for courses:"
        // which then causes "Content node not found: course1" in getContentNodeByIdentifier
        // This is because loadContentManifest returns [] on error, leading to node not found.
        // To directly test the throw from loadContentManifest, we'd need to test it separately.
        // For getContentNodeByIdentifier, it will bubble up as a node not found error.
        await expect(getContentNodeByIdentifier('courses', 'course1')).rejects.toThrow('Content node not found: course1');
    });


    it('should throw SvelteKit error if marked parsing fails', async () => {
      const markdownContent = '# Some Markdown';
      mockReadFile.mockImplementation(async (path: string) => {
        if (path.endsWith('courses/manifest.json')) {
          return JSON.stringify([{ id: 'course-marked-fail', type: 'course', path: 'marked-fail.md' }]);
        }
        if (path.endsWith('marked-fail.md')) {
          return markdownContent;
        }
        return '';
      });

      // Make marked.parse throw an error when called with this specific content
      markedSpy.mockImplementation((val: string) => {
        if (val === markdownContent) {
          throw new Error('Marked Parsing Failed');
        }
        return 'parsed normally';
      });
      
      await expect(getContentNodeByIdentifier('courses', 'course-marked-fail')).rejects.toThrow('Failed to load content for course-marked-fail: Marked Parsing Failed');
      expect(svelteKitError).toHaveBeenCalledWith(500, 'Failed to load content for course-marked-fail: Marked Parsing Failed');
    });
  });
});
