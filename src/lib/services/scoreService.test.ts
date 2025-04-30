import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateUserScore } from './scoreService';
import * as userService from './userService.server';
import * as courseService from './courseService';

// Mock pool.query
vi.mock('./userService.server', () => ({
  pool: { query: vi.fn() }
}));
// Mock getCourseStructure to return consistent 2-lesson modules
vi.mock('./courseService', () => ({
  getCourseStructure: vi.fn(async (id: string) => ({
    modules: [ { lessons: [ { id: 'a' }, { id: 'b' } ] } ]
  }))
}));

const { pool } = userService as any;

describe('calculateUserScore', () => {
  beforeEach(() => {
    vi.resetAllMocks();
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