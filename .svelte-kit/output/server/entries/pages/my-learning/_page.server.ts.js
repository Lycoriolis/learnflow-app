import { a as getAllContentItemsByType } from "../../../chunks/contentService.js";
import { e as error } from "../../../chunks/index.js";
const load = async ({ parent }) => {
  const parentData = await parent();
  const userProfile = parentData.userProfile;
  if (!userProfile) {
    return { enrolledCourses: [] };
  }
  const enrolledIds = userProfile.preferences?.enrollments?.map((e) => e.id) || [];
  if (enrolledIds.length === 0) {
    return { enrolledCourses: [] };
  }
  try {
    const allCourses = await getAllContentItemsByType("courses", "course");
    const enrolledCourses = allCourses.filter((course) => enrolledIds.includes(course.id)).map((course) => {
      const enrollment = userProfile.preferences?.enrollments?.find((e) => e.id === course.id);
      return {
        meta: course,
        // Contains id, title, description, path etc.
        enrollment: enrollment || { progress: 0, lastAccessed: 0 }
        // Add default if somehow missing
      };
    });
    return { enrolledCourses };
  } catch (err) {
    console.error("Error loading enrolled courses in /my-learning:", err);
    throw error(500, "Failed to load enrolled courses.");
  }
};
export {
  load
};
//# sourceMappingURL=_page.server.ts.js.map
