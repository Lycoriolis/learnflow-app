// src/lib/services/scoreService.ts
import { pool } from './userService.server.js';
// Import the new server-side content service and necessary types
import { getAllContentItemsByType, type ServerContentNode, type FrontmatterChildNode } from '$lib/server/contentService';

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

      // 4. Load course structures using the new helper
      getAllCourseStructuresLike()
    ]);

    // Extract and calculate course ratio
    const viewedLessons = Number(lessonResults.rows[0]?.viewed || 0);
    const courses = Object.values(courseStructures) as ServerContentNode[];

    // Calculate total lessons based on the new structure (assuming lessons are children of modules)
    const totalLessons = courses.reduce((courseSum, course) => {
        // Find module children
        const modules = (course as ServerContentNode).children?.filter((child: FrontmatterChildNode) => child.type === 'module') || [];
        // Sum lessons within each module
        const lessonsInCourse = modules.reduce((moduleSum, moduleNode) => {
            const lessons = (moduleNode as FrontmatterChildNode).children?.filter((child: FrontmatterChildNode) => child.type === 'lesson') || [];
            return moduleSum + lessons.length;
        }, 0);
        return courseSum + lessonsInCourse;
    }, 0);

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

// Create namespace for the function to allow for caching
interface GetAllCourseStructuresLike {
  (this: void): Promise<Record<string, ServerContentNode>>;
  cache?: Record<string, ServerContentNode>;
}

/**
 * Helper: load all course structures using the new contentService.
 */
const getAllCourseStructuresLike: GetAllCourseStructuresLike = async function(): Promise<Record<string, ServerContentNode>> {
  // Use memoization to cache course structures
  if (!getAllCourseStructuresLike.cache) {
      try {
          // Fetch all items of type 'course' from the 'courses' manifest
          const courses = await getAllContentItemsByType('courses', 'course');

          // Transform ServerContentNode[] to the required Record<string, ServerContentNode>
          getAllCourseStructuresLike.cache = courses.reduce<Record<string, ServerContentNode>>((acc, course) => {
              acc[course.id] = {
                  ...course,
                  modules: (course as ServerContentNode).children?.filter((child: FrontmatterChildNode) => child.type === 'module') || []
              };
              return acc;
          }, {});
      } catch (error) {
          console.error("Failed to load course structures using contentService:", error);
          getAllCourseStructuresLike.cache = {}; // Return empty object on error
      }
  }

  return getAllCourseStructuresLike.cache;
}