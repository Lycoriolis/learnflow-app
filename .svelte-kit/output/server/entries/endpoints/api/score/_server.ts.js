import { p as pool } from "../../../../chunks/userService.server.js";
import { a as getAllContentItemsByType } from "../../../../chunks/contentService.js";
async function calculateUserScore(userId) {
  try {
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
    const viewedLessons = Number(lessonResults.rows[0]?.viewed || 0);
    const courses = Object.values(courseStructures);
    const totalLessons = courses.reduce((courseSum, course) => {
      const modules = course.children?.filter((child) => child.type === "module") || [];
      const lessonsInCourse = modules.reduce((moduleSum, module) => {
        const lessons = module.children?.filter((child) => child.type === "lesson") || [];
        return moduleSum + lessons.length;
      }, 0);
      return courseSum + lessonsInCourse;
    }, 0);
    const courseRatio = totalLessons ? viewedLessons / totalLessons : 0;
    const completed = Number(exerciseResults.rows[0]?.completed || 0);
    const started = Number(exerciseResults.rows[0]?.started || 0);
    const exerciseRatio = started ? completed / started : 0;
    const success = Number(flashcardResults.rows[0]?.success || 0);
    const total = Number(flashcardResults.rows[0]?.total || 0);
    const flashcardRatio = total ? success / total : 0;
    const weights = { course: 0.6, exercise: 0.2, flashcard: 0.2 };
    const rawScore = courseRatio * weights.course + exerciseRatio * weights.exercise + flashcardRatio * weights.flashcard;
    return Math.round(Math.min(5, Math.max(0, rawScore * 5)) * 100) / 100;
  } catch (error) {
    console.error("Error calculating user score:", error);
    return 0;
  }
}
const getAllCourseStructuresLike = async function() {
  if (!getAllCourseStructuresLike.cache) {
    try {
      const courses = await getAllContentItemsByType("courses", "course");
      getAllCourseStructuresLike.cache = courses.reduce((acc, course) => {
        acc[course.id] = {
          ...course,
          modules: course.children?.filter((child) => child.type === "module") || []
        };
        return acc;
      }, {});
    } catch (error) {
      console.error("Failed to load course structures using contentService:", error);
      getAllCourseStructuresLike.cache = {};
    }
  }
  return getAllCourseStructuresLike.cache;
};
const GET = async ({ locals }) => {
  const userId = locals.user?.uid;
  if (!userId) {
    console.error("Unauthorized attempt to access score API");
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  try {
    console.log(`Calculating score for user: ${userId}`);
    const score = await calculateUserScore(userId);
    return new Response(JSON.stringify({ score }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Score error:", err);
    return new Response(JSON.stringify({ error: "Failed to compute score" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
export {
  GET
};
//# sourceMappingURL=_server.ts.js.map
