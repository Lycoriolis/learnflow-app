import { getFirestore, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { g as getCourse } from "../../../../chunks/courseService.js";
async function getRecommendations(userId, limit$1 = 10) {
  const db = getFirestore();
  const activitiesRef = collection(db, "activities");
  const q = query(
    activitiesRef,
    where("userId", "==", userId),
    orderBy("timestamp", "desc"),
    limit(limit$1 * 2)
  );
  const snapshot = await getDocs(q);
  const acts = snapshot.docs.map((doc) => ({
    type: doc.data().eventType,
    referenceId: doc.data().referenceId,
    timestampStart: doc.data().timestamp,
    metadata: doc.data().metadata || {}
  }));
  const recs = [];
  const lastViewLesson = acts.find((a) => a.type === "view_lesson" && a.metadata?.courseId);
  if (lastViewLesson) {
    const courseId = lastViewLesson.metadata.courseId;
    const structure = await getCourse(courseId);
    if (structure) {
      for (const module of structure.modules) {
        const idx = module.lessons.findIndex((l) => l.id === lastViewLesson.referenceId);
        if (idx !== -1) {
          const nextIdx = idx + 1;
          if (nextIdx < module.lessons.length) {
            const nextLesson = module.lessons[nextIdx];
            recs.push({
              type: "next_lesson",
              referenceId: nextLesson.id,
              title: `Next: ${nextLesson.title}`,
              description: `Continue in ${structure.title || courseId}`,
              metadata: { courseId, moduleId: module.id }
            });
          }
          break;
        }
      }
    }
  }
  const lastFlashReview = acts.find((a) => a.type === "flashcard_review");
  if (lastFlashReview) {
    recs.push({
      type: "review_flashcards",
      referenceId: "",
      title: "Review your flashcards",
      description: "You have cards due for review",
      metadata: {}
    });
  }
  for (const a of acts) {
    if (recs.length >= limit$1) break;
    if (!["view_lesson", "flashcard_review"].includes(a.type)) {
      recs.push({
        type: a.type,
        referenceId: a.referenceId,
        title: `Explore: ${a.type.replace(/_/g, " ")}`,
        description: "Based on your recent activity",
        metadata: {}
      });
    }
  }
  return recs.slice(0, limit$1);
}
const GET = async ({ url, locals }) => {
  const userId = locals.user?.uid;
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const limit2 = parseInt(url.searchParams.get("limit") || "10", 10);
  try {
    const recommendations = await getRecommendations(userId, limit2);
    return new Response(JSON.stringify({ recommendations }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Recommendation error:", err);
    return new Response(JSON.stringify({ error: "Failed to compute recommendations" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
export {
  GET
};
