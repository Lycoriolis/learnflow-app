// Filepath: /home/linux/learnflow-app/learnflow-app/src/lib/services/enhancedContentService.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { writable } from 'svelte/store';
import {
  loadCourseStructure,
  listCourses,
  coursesCache,
  courseContentCache,
  courseListCache,
  loadLesson, // Added loadLesson import
} from './enhancedContentService';
import type { ContentMetadata, CourseStructure, ModuleMetadata, Lesson } from './enhancedContentService'; // Added Lesson import

// Mock $app/environment
vi.mock('$app/environment', () => ({
  browser: true,
}));

// Mock Svelte stores
vi.mock('svelte/store', async () => {
  const actualStoreFunctions = await vi.importActual('svelte/store');

  return {
    ...actualStoreFunctions,
    writable: vi.fn((initialValue: any) => {
      let currentValue = initialValue;
      const storeInstance = {
        subscribe: vi.fn((run: (value: any) => void, invalidate?: (value?: any) => void) => {
          run(currentValue);
          return () => {};
        }),
        set: vi.fn((newValue: any) => {
          currentValue = newValue;
        }),
        update: vi.fn((updater: (value: any) => any) => {
          currentValue = updater(currentValue);
        }),
        _getCurrentValue: () => currentValue, // Helper to get value in tests
      };
      return storeInstance;
    }),
    get: vi.fn((store: any) => { 
      if (store && typeof store._getCurrentValue === 'function') {
        return store._getCurrentValue();
      }
      if (store && typeof store.subscribe === 'function') {
        let value;
        const unsubscribe = store.subscribe((v: any) => value = v);
        unsubscribe();
        return value;
      }
      return undefined;
    }),
  };
});


describe('enhancedContentService - loadCourseStructure', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
    coursesCache.set(new Map());
    courseContentCache.set(new Map());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    mockFetch.mockReset(); 
  });

  const MOCK_COURSES_PATH = '/content/courses';

  it('should load course structure with version and author if present in meta.json', async () => {
    const courseId = 'course-with-all-meta';
    const mockCourseMeta: ContentMetadata = {
      id: courseId,
      title: 'Course with All Meta',
      type: 'course',
      slug: courseId,
      description: 'A test course.',
      icon: 'fa-test',
      gradient: { from: 'red-500', to: 'red-400' },
      version: '1.1.0',
      author: 'Test Author',
      modules: ['mod1'],
    };
    const mockModuleMeta: ModuleMetadata = {
      id: 'mod1',
      title: 'Module 1',
      order: 1,
      lessons: ['lesson1.md'],
    };
    const mockLessonData = { 
      title: 'Lesson 1',
      order: 1,
      objectives: ['Objective 1', 'Objective 2'], // Added objectives for testing frontmatter
    };

    mockFetch
      .mockResolvedValueOnce({ // Course meta.json
        ok: true,
        json: async () => mockCourseMeta,
      })
      .mockResolvedValueOnce({ // Course README.md (optional, assume 404 for this test)
        ok: false,
      })
      .mockResolvedValueOnce({ // Module meta.json for mod1
        ok: true,
        json: async () => mockModuleMeta,
      })
      .mockResolvedValueOnce({ // Lesson markdown file lesson1.md
        ok: true,
        text: async () => `---
title: ${mockLessonData.title}
order: ${mockLessonData.order}
objectives:
  - ${mockLessonData.objectives[0]}
  - ${mockLessonData.objectives[1]}
---
Lesson content`,
      });

    const result = await loadCourseStructure(courseId);

    expect(mockFetch).toHaveBeenCalledWith(`${MOCK_COURSES_PATH}/${courseId}/meta.json`);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(courseId);
    expect(result?.title).toBe('Course with All Meta');
    expect(result?.version).toBe('1.1.0');
    expect(result?.author).toBe('Test Author');
    expect(result?.modules.length).toBe(1);
    expect(result?.modules[0].id).toBe('mod1');
    expect(result?.modules[0].lessons.length).toBe(1);
    expect(result?.modules[0].lessons[0].title).toBe('Lesson 1');
    expect(result?.modules[0].lessons[0].frontmatter).toBeDefined();
    expect(result?.modules[0].lessons[0].frontmatter?.title).toBe('Lesson 1');
    expect(result?.modules[0].lessons[0].frontmatter?.objectives).toEqual(['Objective 1', 'Objective 2']);
  });

  it('should load course structure without version and author if not in meta.json', async () => {
    const courseId = 'course-partial-meta';
    const mockCourseMeta: Omit<ContentMetadata, 'version' | 'author' | 'modules'> & { modules?: string[] } = {
      id: courseId,
      title: 'Course with Partial Meta',
      type: 'course',
      slug: courseId,
      description: 'Another test course.',
      icon: 'fa-test',
      gradient: { from: 'blue-500', to: 'blue-400' },
      modules: [], 
    };

    mockFetch
      .mockResolvedValueOnce({ 
        ok: true,
        json: async () => mockCourseMeta as ContentMetadata, 
      })
      .mockResolvedValueOnce({ 
        ok: false,
      });

    const result = await loadCourseStructure(courseId);

    expect(mockFetch).toHaveBeenCalledWith(`${MOCK_COURSES_PATH}/${courseId}/meta.json`);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(courseId);
    expect(result?.title).toBe('Course with Partial Meta');
    expect(result?.version).toBeUndefined();
    expect(result?.author).toBeUndefined();
    expect(result?.modules.length).toBe(0);
  });

  it('should return null if course meta.json is not found', async () => {
    const courseId = 'course-missing-meta';
    mockFetch.mockResolvedValueOnce({ 
      ok: false,
      status: 404,
    });

    const result = await loadCourseStructure(courseId);

    expect(mockFetch).toHaveBeenCalledWith(`${MOCK_COURSES_PATH}/${courseId}/meta.json`);
    expect(result).toBeNull();
  });

  it('should use description from README.md if courseMeta.description is empty', async () => {
    const courseId = 'course-readme-desc';
    const mockCourseMeta: Omit<ContentMetadata, 'description' | 'modules'> & { modules?: string[] } = {
      id: courseId,
      title: 'Course with README Description',
      type: 'course',
      slug: courseId,
      icon: 'fa-book',
      gradient: { from: 'green-500', to: 'green-400' },
      modules: [],
    };
    const readmeContent = `# ${mockCourseMeta.title}\nThis is the description from README.`;

    mockFetch
      .mockResolvedValueOnce({ 
        ok: true,
        json: async () => mockCourseMeta as ContentMetadata,
      })
      .mockResolvedValueOnce({ 
        ok: true,
        text: async () => readmeContent,
      });

    const result = await loadCourseStructure(courseId);
    expect(result?.description).toBe('This is the description from README.');
  });

  it('should prefer courseMeta.description over README.md description', async () => {
    const courseId = 'course-meta-desc-priority';
    const metaDescription = 'Description from meta.json';
    const mockCourseMeta: ContentMetadata = {
      id: courseId,
      title: 'Course with Meta Description Priority',
      type: 'course',
      slug: courseId,
      description: metaDescription,
      icon: 'fa-book',
      gradient: { from: 'purple-500', to: 'purple-400' },
      modules: [],
    };
    const readmeContent = `# ${mockCourseMeta.title}\nThis is a description from README that should be ignored.`;

    mockFetch
      .mockResolvedValueOnce({ 
        ok: true,
        json: async () => mockCourseMeta,
      })
      .mockResolvedValueOnce({ 
        ok: true,
        text: async () => readmeContent,
      });

    const result = await loadCourseStructure(courseId);
    expect(result?.description).toBe(metaDescription);
  });
});

describe('enhancedContentService - loadLesson', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  const MOCK_COURSES_PATH = '/content/courses';

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    mockFetch.mockReset();
  });

  it('should load a lesson with its frontmatter', async () => {
    const courseId = 'test-course';
    const moduleId = 'test-module';
    const lessonId = 'test-lesson';
    const mockLessonFrontmatter = {
      title: 'Test Lesson Title',
      estimatedTime: '30 minutes',
      order: 1,
      objectives: ['Learn testing', 'Understand mocks'],
    };
    const mockLessonContent = 'This is the lesson content.';

    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 
`---
${Object.entries(mockLessonFrontmatter).map(([key, value]) => {
  if (Array.isArray(value)) {
    return `${key}:\n${value.map(item => `  - ${item}`).join('\n')}`;
  }
  return `${key}: ${value}`;
}).join('\n')}
---
${mockLessonContent}`,
    });

    const result = await loadLesson(courseId, moduleId, lessonId);

    expect(mockFetch).toHaveBeenCalledWith(`${MOCK_COURSES_PATH}/${courseId}/modules/${moduleId}/lessons/${lessonId}.md`);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(lessonId);
    expect(result?.title).toBe(mockLessonFrontmatter.title);
    expect(result?.estimatedTime).toBe(mockLessonFrontmatter.estimatedTime);
    expect(result?.order).toBe(mockLessonFrontmatter.order);
    expect(result?.content).toBe(mockLessonContent);
    expect(result?.frontmatter).toBeDefined();
    expect(result?.frontmatter?.title).toBe(mockLessonFrontmatter.title);
    expect(result?.frontmatter?.objectives).toEqual(mockLessonFrontmatter.objectives);
  });

  it('should return null if lesson file is not found', async () => {
    const courseId = 'test-course';
    const moduleId = 'test-module';
    const lessonId = 'nonexistent-lesson';

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await loadLesson(courseId, moduleId, lessonId);

    expect(mockFetch).toHaveBeenCalledWith(`${MOCK_COURSES_PATH}/${courseId}/modules/${moduleId}/lessons/${lessonId}.md`);
    expect(result).toBeNull();
  });
});

describe('enhancedContentService - listCourses', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  const MOCK_COURSES_PATH = '/content/courses';

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
    coursesCache.set(new Map());
    courseContentCache.set(new Map());
    courseListCache.set(null); 
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks(); 
  });

  const getUrlString = (urlInput: string | Request | URL): string => {
    if (typeof urlInput === 'string') {
      return urlInput;
    }
    if (urlInput instanceof URL) {
      return urlInput.href; 
    }
    return (urlInput as Request).url;
  };

  it('should fetch and return a list of courses with version and author', async () => {
    const mockCourseDirs = [{ name: 'course1/', type: 'directory' }, { name: 'course2/', type: 'directory' }]; // Added trailing slash
    const mockCourse1Meta: ContentMetadata = {
      id: 'course1',
      title: 'Course One',
      type: 'course',
      slug: 'course1',
      description: 'First course',
      version: '1.0.0',
      author: 'Author One',
    };
    const mockCourse2Meta: ContentMetadata = {
      id: 'course2',
      title: 'Course Two',
      type: 'course',
      slug: 'course2',
      description: 'Second course',
      version: '2.1.0',
      author: 'Author Two',
    };

    mockFetch.mockImplementation(async (urlInput: string | Request | URL) => {
      const url = getUrlString(urlInput);
      if (url.endsWith(`${MOCK_COURSES_PATH}/`)) {
        return { ok: true, json: async () => mockCourseDirs };
      }
      if (url.endsWith(`${MOCK_COURSES_PATH}/course1/meta.json`)) {
        return { ok: true, json: async () => mockCourse1Meta };
      }
      if (url.endsWith(`${MOCK_COURSES_PATH}/course2/meta.json`)) {
        return { ok: true, json: async () => mockCourse2Meta };
      }
      console.warn(`Unhandled fetch mock URL in test: ${url}`);
      return { ok: false, status: 404, json: async () => ({ message: `Unhandled mock URL: ${url}` }) };
    });

    const result = await listCourses();

    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/content\/courses\/$/));
    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/content\/courses\/course1\/meta\.json$/));
    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/content\/courses\/course2\/meta\.json$/));
    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining(mockCourse1Meta),
        expect.objectContaining(mockCourse2Meta),
      ])
    );
  });

  it('should return courses without version and author if not in meta.json', async () => {
    const mockCourseDirs = [{ name: 'course-no-extras/', type: 'directory' }]; // Added trailing slash
    const mockCourseMetaNoExtras: Omit<ContentMetadata, 'version' | 'author'> = { 
      id: 'course-no-extras',
      title: 'Course Without Extras',
      type: 'course',
      slug: 'course-no-extras',
      description: 'A simple course.',
    };

    mockFetch.mockImplementation(async (urlInput: string | Request | URL) => {
      const url = getUrlString(urlInput);
      if (url.endsWith(`${MOCK_COURSES_PATH}/`)) {
        return { ok: true, json: async () => mockCourseDirs };
      }
      if (url.endsWith(`${MOCK_COURSES_PATH}/course-no-extras/meta.json`)) {
        return { ok: true, json: async () => mockCourseMetaNoExtras };
      }
      console.warn(`Unhandled fetch mock URL in test: ${url}`);
      return { ok: false, status: 404, json: async () => ({ message: `Unhandled mock URL: ${url}` }) };
    });

    const result = await listCourses();

    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/content\/courses\/$/));
    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/content\/courses\/course-no-extras\/meta\.json$/));
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('course-no-extras');
    expect(result[0].version).toBeUndefined();
    expect(result[0].author).toBeUndefined();
  });

  it('should return an empty list if the courses directory is empty or fetch fails', async () => {
    // Scenario 1: Empty directory
    mockFetch.mockImplementation(async (urlInput: string | Request | URL) => {
      const url = getUrlString(urlInput);
      if (url.endsWith(`${MOCK_COURSES_PATH}/`)) {
        return { ok: true, json: async () => [] }; 
      }
      console.warn(`Unhandled fetch mock URL in test (empty dir scenario): ${url}`);
      return { ok: false, status: 404, json: async () => ({ message: 'Not Found by default' }) };
    });
    let result1 = await listCourses();
    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/content\/courses\/$/));
    expect(result1).toEqual([]);

    // Reset mockFetch for scenario 2
    mockFetch.mockReset(); 
    vi.stubGlobal('fetch', mockFetch); 
    courseListCache.set(null); 

    mockFetch.mockImplementation(async (urlInput: string | Request | URL) => {
      const url = getUrlString(urlInput);
      if (url.endsWith(`${MOCK_COURSES_PATH}/`)) {
        return { ok: false, status: 500, json: async () => ({ message: 'Server Error' }) }; 
      }
      console.warn(`Unhandled fetch mock URL in test (fetch fail scenario): ${url}`);
      return { ok: false, status: 404, json: async () => ({ message: 'Not Found by default' }) };
    });
    let result2 = await listCourses();
    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/content\/courses\/$/));
    expect(result2).toEqual([]);
  });

  it('should skip courses where meta.json fetch fails', async () => {
    const mockCourseDirs = [{ name: 'course-valid/', type: 'directory' }, { name: 'course-invalid-meta/', type: 'directory' }]; // Added trailing slashes
    const mockValidCourseMeta: ContentMetadata = {
      id: 'course-valid',
      title: 'Valid Course',
      type: 'course',
      slug: 'course-valid',
      description: 'This one is fine.',
      version: '1.0',
      author: 'Valid Author',
    };

    mockFetch.mockImplementation(async (urlInput: string | Request | URL) => {
      const url = getUrlString(urlInput);
      if (url.endsWith(`${MOCK_COURSES_PATH}/`)) {
        return { ok: true, json: async () => mockCourseDirs };
      }
      if (url.endsWith(`${MOCK_COURSES_PATH}/course-valid/meta.json`)) {
        return { ok: true, json: async () => mockValidCourseMeta };
      }
      if (url.endsWith(`${MOCK_COURSES_PATH}/course-invalid-meta/meta.json`)) {
        return { ok: false, status: 404, json: async () => ({ message: 'Meta Not Found' }) }; 
      }
      console.warn(`Unhandled fetch mock URL in test: ${url}`);
      return { ok: false, status: 404, json: async () => ({ message: `Unhandled mock URL: ${url}` }) };
    });

    const result = await listCourses();

    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/content\/courses\/$/));
    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/content\/courses\/course-valid\/meta\.json$/));
    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/content\/courses\/course-invalid-meta\/meta\.json$/));
    expect(result).toHaveLength(1); 
    expect(result[0].id).toBe('course-valid');
    expect(result[0].version).toBe('1.0');
    expect(result[0].author).toBe('Valid Author');
  });

  it('should only list items that are directories', async () => {
    const mockDirectoryListing = [
      { name: 'course1/', type: 'directory' }, // Added trailing slash
      { name: 'some-file.txt', type: 'file' }, 
      { name: 'course2/', type: 'directory' }, // Added trailing slash
    ];
    const mockCourse1Meta: ContentMetadata = { id: 'course1', title: 'Course One', type: 'course', slug: 'course1' };
    const mockCourse2Meta: ContentMetadata = { id: 'course2', title: 'Course Two', type: 'course', slug: 'course2' };

    mockFetch.mockImplementation(async (urlInput: string | Request | URL) => {
      const url = getUrlString(urlInput);
      if (url.endsWith(`${MOCK_COURSES_PATH}/`)) {
        return { ok: true, json: async () => mockDirectoryListing };
      }
      if (url.endsWith(`${MOCK_COURSES_PATH}/course1/meta.json`)) {
        return { ok: true, json: async () => mockCourse1Meta };
      }
      if (url.endsWith(`${MOCK_COURSES_PATH}/course2/meta.json`)) {
        return { ok: true, json: async () => mockCourse2Meta };
      }
      console.warn(`Unhandled fetch mock URL in test: ${url}`);
      return { ok: false, status: 404, json: async () => ({ message: `Unhandled mock URL: ${url}` }) };
    });

    const result = await listCourses();
    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/content\/courses\/$/));
    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/content\/courses\/course1\/meta\.json$/));
    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/content\/courses\/course2\/meta\.json$/));
    expect(result).toHaveLength(2); 
    expect(result.find(c => c.id === 'course1')).toBeDefined();
    expect(result.find(c => c.id === 'course2')).toBeDefined();
    expect(result.find(c => c.id === 'some-file.txt')).toBeUndefined();
  });
});
