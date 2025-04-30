import { p as pool } from "../../../../chunks/userService.server.js";
import "gray-matter";
import { g as getCourse } from "../../../../chunks/courseService.js";
async function calculateUserScore(userId) {
  const lesRes = await pool.query(
    `SELECT COUNT(DISTINCT reference_id) AS viewed FROM activities WHERE user_id=$1 AND event_type='view_lesson'`,
    [userId]
  );
  const viewedLessons = Number(lesRes.rows[0].viewed || 0);
  const courses = Object.values(await getAllCourseStructures());
  const totalLessons = courses.reduce((sum, course) => sum + course.modules.reduce((mSum, m) => mSum + m.lessons.length, 0), 0);
  const courseRatio = totalLessons ? viewedLessons / totalLessons : 0;
  const exerRes = await pool.query(
    `SELECT
       SUM(CASE WHEN event_type='complete_exercise' THEN 1 ELSE 0 END) AS completed,
       SUM(CASE WHEN event_type='start_exercise' THEN 1 ELSE 0 END) AS started
     FROM activities
     WHERE user_id=$1`,
    [userId]
  );
  const completed = Number(exerRes.rows[0].completed || 0);
  const started = Number(exerRes.rows[0].started || 0);
  const exerciseRatio = started ? completed / started : 0;
  const flashRes = await pool.query(
    `SELECT
       SUM(CASE WHEN event_type='flashcard_review' AND (metadata->>'success')::boolean THEN 1 ELSE 0 END) AS success,
       SUM(CASE WHEN event_type='flashcard_review' THEN 1 ELSE 0 END) AS total
     FROM activities
     WHERE user_id=$1`,
    [userId]
  );
  const success = Number(flashRes.rows[0].success || 0);
  const total = Number(flashRes.rows[0].total || 0);
  const flashcardRatio = total ? success / total : 0;
  const weights = { course: 0.6, exercise: 0.2, flashcard: 0.2 };
  const rawScore = courseRatio * weights.course + exerciseRatio * weights.exercise + flashcardRatio * weights.flashcard;
  const score = Math.min(5, Math.max(0, rawScore * 5));
  return Math.round(score * 100) / 100;
}
async function getAllCourseStructures() {
  const courseIds = ["web-development-101", "mpsi-mathematiques", "intro-python"];
  const structures = await Promise.all(courseIds.map((id) => getCourse(id)));
  return structures.filter(Boolean).reduce((acc, course) => {
    if (course && course.id) {
      acc[course.id] = course;
    }
    return acc;
  }, {});
}
const GET = async ({ locals }) => {
  const userId = locals.user?.uid;
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  try {
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
