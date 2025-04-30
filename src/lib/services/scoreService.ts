// src/lib/services/scoreService.ts
import { pool } from './userService.server';
import { getCourse } from './courseService';

/**
 * Calculates a user score on a 0–5 scale.
 * Combines weighted sub-scores for courses, exercises, and flashcards.
 */
export async function calculateUserScore(userId: string): Promise<number> {
  try {
    // Run all database queries concurrently to reduce total wait time
    const [lessonResults, exerciseResults, flashcardResults, courseStructures] = await Promise.all([
      // 1. Course progress query
      pool.query(
        `SELECT COUNT(DISTINCT reference_id) AS viewed FROM activities WHERE user_id=$1 AND event_type='view_lesson'`,
        [userId]
      ),
      
      // 2. Exercise completion query
      pool.query(
        `SELECT
          SUM(CASE WHEN event_type='complete_exercise' THEN 1 ELSE 0 END) AS completed,
          SUM(CASE WHEN event_type='start_exercise' THEN 1 ELSE 0 END) AS started
         FROM activities
         WHERE user_id=$1`,
        [userId]
      ),
      
      // 3. Flashcard success query
      pool.query(
        `SELECT
          SUM(CASE WHEN event_type='flashcard_review' AND (metadata->>'success')::boolean THEN 1 ELSE 0 END) AS success,
          SUM(CASE WHEN event_type='flashcard_review' THEN 1 ELSE 0 END) AS total
         FROM activities
         WHERE user_id=$1`,
        [userId]
      ),
      
      // 4. Load course structures
      getAllCourseStructures()
    ]);

    // Extract and calculate course ratio
    const viewedLessons = Number(lessonResults.rows[0]?.viewed || 0);
    const courses = Object.values(courseStructures);
    const totalLessons = courses.reduce(
      (sum, course) => sum + course.modules.reduce((mSum, m) => mSum + m.lessons.length, 0), 
      0
    );
    const courseRatio = totalLessons ? viewedLessons / totalLessons : 0;

    // Extract and calculate exercise ratio
    const completed = Number(exerciseResults.rows[0]?.completed || 0);
    const started = Number(exerciseResults.rows[0]?.started || 0);
    const exerciseRatio = started ? completed / started : 0;

    // Extract and calculate flashcard ratio
    const success = Number(flashcardResults.rows[0]?.success || 0);
    const total = Number(flashcardResults.rows[0]?.total || 0);
    const flashcardRatio = total ? success / total : 0;

    // Calculate weighted score
    const weights = { course: 0.6, exercise: 0.2, flashcard: 0.2 };
    const rawScore = (
      courseRatio * weights.course + 
      exerciseRatio * weights.exercise + 
      flashcardRatio * weights.flashcard
    );

    // Scale to 0–5 and round to 2 decimal places
    return Math.round(Math.min(5, Math.max(0, rawScore * 5)) * 100) / 100;
  } catch (error) {
    console.error('Error calculating user score:', error);
    return 0; // Default score on error
  }
}

/**
 * Helper: load all course structures
 */
async function getAllCourseStructures() {
  // Use memoization to cache course structures
  if (!getAllCourseStructures.cache) {
    const courseIds = ['web-development-101', 'mpsi-mathematiques', 'intro-python'];
    const structures = await Promise.all(courseIds.map(id => getCourse(id)));
    
    getAllCourseStructures.cache = structures
      .filter(Boolean)
      .reduce((acc, course) => {
        if (course?.id) {
          acc[course.id] = course;
        }
        return acc;
      }, {} as Record<string, any>);
  }
  
  return getAllCourseStructures.cache;
}

// Add type for the cache property
declare namespace getAllCourseStructures {
  var cache: Record<string, any> | undefined;
}