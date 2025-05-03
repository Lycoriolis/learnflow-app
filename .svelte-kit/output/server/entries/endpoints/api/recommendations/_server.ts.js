import { e as error, j as json } from "../../../../chunks/index.js";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { g as getContentNodeByPath, a as getAllContentItemsByType } from "../../../../chunks/contentService.js";
import { a as adminDb } from "../../../../chunks/firebaseAdmin.js";
function findNextLesson(node, currentLessonId) {
  if (!node || !node.children) return null;
  for (const module of node.children) {
    if (module.type === "module" && module.children) {
      const lessonIndex = module.children.findIndex((lesson) => lesson.type === "lesson" && lesson.id === currentLessonId);
      if (lessonIndex !== -1 && lessonIndex + 1 < module.children.length) {
        const nextLesson = module.children[lessonIndex + 1];
        if (nextLesson.type === "lesson") {
          return {
            id: nextLesson.id,
            title: nextLesson.title || nextLesson.id,
            type: "lesson",
            path: nextLesson.path
          };
        }
      }
    }
  }
  for (let i = 0; i < node.children.length; i++) {
    const module = node.children[i];
    if (module.type === "module" && module.children) {
      const lessonIndex = module.children.findIndex((lesson) => lesson.type === "lesson" && lesson.id === currentLessonId);
      if (lessonIndex !== -1 && i + 1 < node.children.length) {
        const nextModule = node.children[i + 1];
        if (nextModule.type === "module" && nextModule.children) {
          const firstLessonOfNextModule = nextModule.children.find((lesson) => lesson.type === "lesson");
          if (firstLessonOfNextModule) {
            return {
              id: firstLessonOfNextModule.id,
              title: firstLessonOfNextModule.title || firstLessonOfNextModule.id,
              type: "lesson",
              path: firstLessonOfNextModule.path
            };
          }
        }
      }
    }
  }
  return null;
}
const GET = async ({ locals, url }) => {
  if (!locals.user) {
    throw error(401, "Unauthorized");
  }
  const userId = locals.user.uid;
  const limit$1 = parseInt(url.searchParams.get("limit") || "5", 10);
  try {
    const db = adminDb;
    const activitiesRef = collection(db, "activities");
    const q = query(
      activitiesRef,
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(limit$1 * 2)
      // Fetch more activities to have options
    );
    const snapshot = await getDocs(q);
    const acts = snapshot.docs.map((doc) => ({
      type: doc.data().eventType,
      referenceId: doc.data().referenceId,
      timestampStart: doc.data().timestamp,
      // Assuming timestamp is stored
      metadata: doc.data().metadata || {}
    }));
    const recs = [];
    const lastViewLesson = acts.find((a) => a.type === "view_lesson" && a.metadata?.courseId && a.referenceId);
    if (lastViewLesson && lastViewLesson.metadata?.courseId) {
      const courseId = lastViewLesson.metadata.courseId;
      const lessonId = lastViewLesson.referenceId;
      try {
        const structureNode = await getContentNodeByPath("courses", courseId);
        if (structureNode) {
          const nextLesson = findNextLesson(structureNode, lessonId);
          if (nextLesson && !recs.some((r) => r.type === "next_lesson")) {
            recs.push({
              type: "next_lesson",
              referenceId: nextLesson.id,
              title: `Next: ${nextLesson.title}`,
              description: `Continue in ${structureNode.title || courseId}`,
              metadata: {
                courseId: typeof structureNode === "object" && "id" in structureNode ? structureNode.id : courseId,
                path: nextLesson.path
              }
              // Include path with safe access to id
            });
          }
        }
      } catch (e) {
        console.warn(`Error fetching course structure for ${courseId}:`, e);
      }
    }
    const hasFlashcards = true;
    if (hasFlashcards && !recs.some((r) => r.type === "review_flashcards")) {
      recs.push({
        type: "review_flashcards",
        referenceId: "/tools/flashcards",
        // Link to the tool
        title: "Review your flashcards",
        description: "Keep your knowledge fresh with spaced repetition.",
        metadata: { tool: "flashcards" }
      });
    }
    const lastStartedExercise = acts.find((a) => (a.type === "start_exercise" || a.type === "complete_exercise") && a.referenceId);
    if (lastStartedExercise && recs.length < limit$1) {
      try {
        const allExercises = await getAllContentItemsByType("exercises", "exercise");
        const current = allExercises.find((e) => e.id === lastStartedExercise.referenceId);
        if (current?.tags) {
          const userCompletedExercises = new Set(acts.filter((a) => a.type === "complete_exercise").map((a) => a.referenceId));
          const similar = allExercises.filter(
            (e) => e.id !== current.id && !userCompletedExercises.has(e.id) && // Don't suggest completed ones
            e.tags?.some((tag) => current.tags?.includes(tag))
          );
          for (const ex of similar) {
            if (recs.length >= limit$1) break;
            if (!recs.some((r) => r.referenceId === ex.id && r.type === "exercise")) {
              recs.push({
                type: "exercise",
                referenceId: ex.id,
                title: ex.title || ex.id,
                description: `Practice ${ex.tags?.join(", ") || "related skills"}`,
                // Improved description
                metadata: { path: ex.path }
                // Include path
              });
            }
          }
        }
      } catch (e) {
        console.warn(`Error fetching exercises for recommendations:`, e);
      }
    }
    if (recs.length < limit$1) {
      try {
        const allCourses = await getAllContentItemsByType("courses", "course");
        const userCourseProgress = /* @__PURE__ */ new Map();
        acts.filter((a) => a.type === "start_course" || a.type === "complete_course" || a.type === "view_lesson").forEach((a) => {
          const courseId = a.metadata?.courseId || (a.type === "start_course" ? a.referenceId : null);
          if (courseId) {
            const progress = a.type === "complete_course" ? 100 : userCourseProgress.get(courseId) || 1;
            userCourseProgress.set(courseId, progress);
          }
        });
        const unstartedCourses = allCourses.filter((c) => (userCourseProgress.get(c.id) || 0) < 100);
        for (const course of unstartedCourses) {
          if (recs.length >= limit$1) break;
          if (!recs.some((r) => r.referenceId === course.id && r.type === "course")) {
            recs.push({
              type: "course",
              referenceId: course.id,
              title: course.title || course.id,
              description: course.description || `Explore ${course.title || course.id}`,
              // Fallback description
              metadata: { path: course.path }
              // Include path
            });
          }
        }
      } catch (e) {
        console.warn(`Error fetching courses for recommendations:`, e);
      }
    }
    return json(recs.slice(0, limit$1));
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    throw error(err.status || 500, err.body?.message || err.message || "Failed to fetch recommendations");
  }
};
export {
  GET
};
//# sourceMappingURL=_server.ts.js.map
