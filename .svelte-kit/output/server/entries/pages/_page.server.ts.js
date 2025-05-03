import { b as getSuggestedContentItems } from "../../chunks/contentService.js";
import { e as error } from "../../chunks/index.js";
const load = async (event) => {
  const { parent } = event;
  const parentData = await parent();
  const userProfile = parentData.userProfile || null;
  const enrolledCourseIds = userProfile?.preferences?.enrollments?.map((e) => e.id) || [];
  const completedExerciseIds = userProfile?.progress?.exercises?.map((ex) => ex.id) || [];
  try {
    const [suggestedCourses, suggestedExercises] = await Promise.all([
      getSuggestedContentItems("courses", "course", enrolledCourseIds),
      getSuggestedContentItems("exercises", "exercise", completedExerciseIds)
      // Use relevant IDs for exercises
    ]);
    return {
      suggestedCourses,
      suggestedExercises,
      userProfile
      // Pass userProfile through for the client component
    };
  } catch (err) {
    console.error("Error loading dashboard data:", err);
    if (err.status) {
      throw err;
    }
    error(500, "Failed to load dashboard data. Please try again later.");
  }
};
export {
  load
};
//# sourceMappingURL=_page.server.ts.js.map
