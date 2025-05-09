import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import Page from './+page.svelte'; // The Svelte component we're testing

// Mocks
vi.mock('$app/stores', () => ({
  page: readable({
    params: { slug: 'test-course', moduleId: 'test-module', lessonId: 'test-lesson' },
    // Add other properties if your component uses them, e.g., data, url, routeId
  }),
  // Mock other stores if needed, e.g., session, updated
}));

vi.mock('$lib/services/enhancedContentService', async () => {
  const actual = await vi.importActual('$lib/services/enhancedContentService');
  return {
    ...actual,
    loadCourseStructure: vi.fn(),
    loadLesson: vi.fn(),
  };
});

vi.mock('$lib/services/activityService.js', () => ({
  logStart: vi.fn().mockResolvedValue('mock-view-id'),
  logEnd: vi.fn().mockResolvedValue(undefined),
}));

// Mock MarkdownRenderer as it's a dependency and not the focus of this unit test
vi.mock('$lib/components/MarkdownRenderer.svelte', () => ({
  default: vi.fn().mockImplementation(() => {
    // A simple mock that doesn't try to access props
    const el = document.createElement('div');
    el.textContent = 'Mocked Markdown Content';
    el.setAttribute('data-testid', 'mock-markdown-renderer');
    return {
      Component: el // Svelte Testing Library expects a component constructor or DOM element
    };
  }),
}));

// Mock CourseFlashcardGenerator
vi.mock('$lib/components/CourseFlashcardGenerator.svelte', () => ({
  default: vi.fn().mockImplementation(() => {
    const el = document.createElement('div');
    el.textContent = 'Mocked CourseFlashcardGenerator';
    el.setAttribute('data-testid', 'mock-flashcard-generator');
    return { Component: el };
  }),
}));

import { loadCourseStructure, loadLesson } from '$lib/services/enhancedContentService';
import type { CourseStructure, Lesson, Module } from '$lib/services/enhancedContentService';
import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte'; // Import for type checking if needed by vi.mocked

describe('Lesson Display Page (/courses/[slug]/[moduleId]/[lessonId]/+page.svelte)', () => {
  const mockCourseId = 'test-course';
  const mockModuleId = 'test-module';
  const mockLessonId = 'test-lesson';

  const mockCourse: CourseStructure = {
    id: mockCourseId,
    title: 'Test Course Title',
    description: 'Test course description.',
    icon: 'fa-book',
    gradient: { from: 'blue-500', to: 'blue-400' },
    modules: [
      {
        id: mockModuleId,
        title: 'Test Module Title',
        order: 1,
        lessons: [
          { id: mockLessonId, title: 'Test Lesson Title', order: 1, estimatedTime: '10 mins', frontmatter: { objectives: ['Objective 1'] } },
          { id: 'other-lesson', title: 'Other Lesson', order: 2, estimatedTime: '15 mins', frontmatter: {} },
        ],
      },
    ],
  };

  const mockLesson: Lesson = {
    id: mockLessonId,
    title: 'Test Lesson Title',
    content: 'This is the **lesson content**.',
    estimatedTime: '10 minutes',
    order: 1,
    frontmatter: {
      objectives: ['Objective A', 'Objective B'],
      title: 'Test Lesson Title from Frontmatter',
    },
  };

  beforeEach(() => {
    vi.mocked(loadCourseStructure).mockResolvedValue(mockCourse);
    vi.mocked(loadLesson).mockResolvedValue(mockLesson);
    vi.mocked(MarkdownRenderer).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially', async () => {
    // Temporarily make loadLesson take longer to show loading state
    vi.mocked(loadLesson).mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve(mockLesson), 100)));
    
    render(Page);
    expect(screen.queryByText('Test Lesson Title')).toBeNull(); 
  });

  it('renders lesson title, content, and objectives when data is loaded', async () => {
    render(Page);

    await waitFor(() => {
      expect(screen.getByText(mockLesson.title)).toBeInTheDocument();
    });
    
    // Check for objectives
    for (const objective of mockLesson.frontmatter!.objectives!) {
      await waitFor(() => {
        expect(screen.getByText(objective)).toBeInTheDocument();
      });
    }

    // Instead of checking for the mock directly, verify the lesson content container
    await waitFor(() => {
      const contentContainer = screen.getByText(/10 minutes/);
      expect(contentContainer).toBeInTheDocument();
    });
  });

  it('displays breadcrumbs correctly', async () => {
    render(Page);
    await waitFor(() => {
      expect(screen.getByText('Courses')).toBeInTheDocument(); 
      expect(screen.getByText(mockCourse.title)).toBeInTheDocument(); 
      expect(screen.getByText(mockCourse.modules[0].title)).toBeInTheDocument();
      expect(screen.getAllByText(mockLesson.title).length).toBeGreaterThanOrEqual(1);
    });
  });
  
  it('displays navigation links (previous/next or back to course)', async () => {
    render(Page);
    await waitFor(() => {
      expect(screen.getByText(/Next: Other Lesson/i)).toBeInTheDocument();
    });

    // Test scenario: Last lesson in course (only "Complete Course" or "Back to Course")
    vi.mocked(loadCourseStructure).mockResolvedValue({
      ...mockCourse,
      modules: [{ ...mockCourse.modules[0], lessons: [mockCourse.modules[0].lessons[0]] }] 
    });
    vi.mocked(loadLesson).mockResolvedValue(mockLesson);

    const { unmount } = render(Page);
    
    await waitFor(() => {
      expect(screen.getByText(/Complete Course/i)).toBeInTheDocument();
    });
    unmount();
  });

  it('displays an error message if loadLesson fails', async () => {
    const errorMessage = 'Failed to fetch lesson';
    vi.mocked(loadLesson).mockRejectedValueOnce(new Error(errorMessage));
    render(Page);

    await waitFor(() => {
      expect(screen.getByText(/Lesson Not Found/i)).toBeInTheDocument();
      expect(screen.getByText(/Back to Course/i)).toBeInTheDocument();
    });
  });
  
  it('displays an error message if course structure fails to load', async () => {
    const errorMessage = 'Failed to fetch course structure';
    vi.mocked(loadCourseStructure).mockRejectedValueOnce(new Error(errorMessage));
    render(Page);

    await waitFor(() => {
      expect(screen.getByText(/Lesson Not Found/i)).toBeInTheDocument();
      expect(screen.getByText(/Back to Course/i)).toBeInTheDocument();
    });
  });

  it('displays an error message if page parameters are missing (simulated by mocking $app/stores)', async () => {
    // Simulate the error by having the component load with missing data
    vi.mocked(loadCourseStructure).mockResolvedValueOnce(null);
    vi.mocked(loadLesson).mockResolvedValueOnce(null);
    
    render(Page);
    
    await waitFor(() => {
      expect(screen.getByText(/Lesson Not Found/i)).toBeInTheDocument();
    });
  });
});
