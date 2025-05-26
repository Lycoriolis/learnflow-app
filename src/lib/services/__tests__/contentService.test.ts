import { describe, it, expect } from 'vitest';
import { getCourseGradient, findNextLesson } from '../contentService';
import type { CourseStructure } from '$lib/types/contentTypes';

describe('getCourseGradient', () => {
  it('returns correct gradient for beginner difficulty', () => {
    expect(getCourseGradient('beginner')).toBe('from-green-400 to-green-600');
  });

  it('returns correct gradient for intermediate difficulty', () => {
    expect(getCourseGradient('intermediate')).toBe('from-blue-400 to-blue-600');
  });

  it('returns correct gradient for advanced difficulty', () => {
    expect(getCourseGradient('advanced')).toBe('from-purple-400 to-purple-600');
  });

  it('returns correct gradient for expert difficulty', () => {
    expect(getCourseGradient('expert')).toBe('from-red-400 to-red-600');
  });

  it('returns default gradient for undefined difficulty', () => {
    expect(getCourseGradient(undefined)).toBe('from-gray-400 to-gray-600');
  });

  it('returns default gradient for unknown difficulty', () => {
    expect(getCourseGradient('unknown')).toBe('from-gray-400 to-gray-600');
  });
});

describe('findNextLesson', () => {
  const mockCourse: CourseStructure = {
    metadata: {
      title: 'Test Course',
      slug: 'test-course',
      type: 'course'
    },
    sections: [
      {
        title: 'Section 1',
        lessons: [
          { id: '1', title: 'Lesson 1', slug: 'lesson-1', type: 'lesson' },
          { id: '2', title: 'Lesson 2', slug: 'lesson-2', type: 'lesson' }
        ]
      },
      {
        title: 'Section 2',
        lessons: [
          { id: '3', title: 'Lesson 3', slug: 'lesson-3', type: 'lesson' },
          { id: '4', title: 'Lesson 4', slug: 'lesson-4', type: 'lesson' }
        ]
      }
    ]
  };

  it('finds the next lesson correctly', () => {
    const result = findNextLesson(mockCourse, 'lesson-2');
    expect(result?.slug).toBe('lesson-3');
  });

  it('finds the next lesson across sections', () => {
    const result = findNextLesson(mockCourse, 'lesson-1');
    expect(result?.slug).toBe('lesson-2');
  });

  it('returns null when current lesson is the last one', () => {
    const result = findNextLesson(mockCourse, 'lesson-4');
    expect(result).toBeNull();
  });

  it('returns null when current lesson not found', () => {
    const result = findNextLesson(mockCourse, 'non-existent');
    expect(result).toBeNull();
  });

  it('returns null for invalid course structure', () => {
    const result = findNextLesson({ metadata: { title: '', slug: '', type: '' }, sections: [] }, 'lesson-1');
    expect(result).toBeNull();
  });

  it('handles null course gracefully', () => {
    const result = findNextLesson(null as any, 'lesson-1');
    expect(result).toBeNull();
  });
});
