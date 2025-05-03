import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateUserScore } from './scoreService.js'; // Added .js extension
import * as userService from '$lib/services/userService.server.js'; // Added .js extension
import * as contentService from '$lib/server/contentService.js'; // Added .js extension and corrected path

// Mock pool.query
vi.mock('$lib/services/userService.server.js', () => ({ // Added .js extension
  pool: { query: vi.fn() }
}));

// Mock getAllContentItemsByType
vi.mock('$lib/server/contentService.js', () => ({ // Added .js extension and corrected mock path
  getAllContentItemsByType: vi.fn(async (contentType: string, itemType: string) => {
    if (contentType === 'courses' && itemType === 'course') {
      // Simulate 2 courses, each with 1 module containing 2 lessons = 4 total lessons
      return [
        {
          id: 'course1',
          type: 'course',
          title: 'Course 1',
          path: 'course1',
          children: [
            {
              id: 'm1',
              type: 'module',
              title: 'Module 1',
              path: 'course1/m1',
              children: [
                { id: 'l1a', type: 'lesson', title: 'Lesson 1a', path: 'course1/m1/l1a' },
                { id: 'l1b', type: 'lesson', title: 'Lesson 1b', path: 'course1/m1/l1b' }
              ]
            }
          ]
        },
        {
          id: 'course2',
          type: 'course',
          title: 'Course 2',
          path: 'course2',
          children: [
            {
              id: 'm2',
              type: 'module',
              title: 'Module 2',
              path: 'course2/m2',
              children: [
                { id: 'l2a', type: 'lesson', title: 'Lesson 2a', path: 'course2/m2/l2a' },
                { id: 'l2b', type: 'lesson', title: 'Lesson 2b', path: 'course2/m2/l2b' }
              ]
            }
          ]
        }
      ];
    }
    return []; // Default empty array for other types
  })
}));

const { pool } = userService as any;

describe('calculateUserScore', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (contentService.getAllContentItemsByType as any).mockClear();
    (contentService.getAllContentItemsByType as any).mockImplementation(async (contentType: string, itemType: string) => {
      if (contentType === 'courses' && itemType === 'course') {
        return [
          {
            id: 'course1',
            type: 'course',
            title: 'Course 1',
            path: 'course1',
            children: [
              {
                id: 'm1',
                type: 'module',
                title: 'Module 1',
                path: 'course1/m1',
                children: [
                  { id: 'l1a', type: 'lesson', title: 'Lesson 1a', path: 'course1/m1/l1a' },
                  { id: 'l1b', type: 'lesson', title: 'Lesson 1b', path: 'course1/m1/l1b' }
                ]
              }
            ]
          },
          {
            id: 'course2',
            type: 'course',
            title: 'Course 2',
            path: 'course2',
            children: [
              {
                id: 'm2',
                type: 'module',
                title: 'Module 2',
                path: 'course2/m2',
                children: [
                  { id: 'l2a', type: 'lesson', title: 'Lesson 2a', path: 'course2/m2/l2a' },
                  { id: 'l2b', type: 'lesson', title: 'Lesson 2b', path: 'course2/m2/l2b' }
                ]
              }
            ]
          }
        ];
      }
      return [];
    });
  });

  it('returns 0 when no activities recorded', async () => {
    // No lessons viewed
    pool.query.mockResolvedValueOnce({ rows: [{ viewed: 0 }] });
    // No exercises
    pool.query.mockResolvedValueOnce({ rows: [{ completed: '0', started: '0' }] });
    // No flashcards
    pool.query.mockResolvedValueOnce({ rows: [{ success: '0', total: '0' }] });

    const score = await calculateUserScore('user1');
    expect(score).toBe(0);
  });

  it('returns 5 when fully completed across all categories', async () => {
    // 2 lessons modules x 2 courses = 4 total
    // User viewed 4 lessons
    pool.query.mockResolvedValueOnce({ rows: [{ viewed: 4 }] });
    // Exercises: 3 started, 3 completed
    pool.query.mockResolvedValueOnce({ rows: [{ completed: '3', started: '3' }] });
    // Flashcards: 2 reviews, both success
    pool.query.mockResolvedValueOnce({ rows: [{ success: '2', total: '2' }] });

    const score = await calculateUserScore('user1');
    expect(score).toBe(5);
  });

  it('weights categories correctly', async () => {
    // viewed lessons: 2 of 4 => 0.5
    pool.query.mockResolvedValueOnce({ rows: [{ viewed: 2 }] });
    // exercises: 1 of 2 => 0.5
    pool.query.mockResolvedValueOnce({ rows: [{ completed: '1', started: '2' }] });
    // flashcards: 0 of 2 => 0
    pool.query.mockResolvedValueOnce({ rows: [{ success: '0', total: '2' }] });

    // Raw score = 0.5*0.6 + 0.5*0.2 + 0*0.2 = 0.4
    // Scaled *5 = 2.0
    const score = await calculateUserScore('user1');
    expect(score).toBe(2.0);
  });
});