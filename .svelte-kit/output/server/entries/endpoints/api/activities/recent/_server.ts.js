import { j as json } from "../../../../../chunks/index2.js";
import { g as getRecentActivities } from "../../../../../chunks/activityService.js";
function getUserId(event) {
  return event.locals?.user?.uid || null;
}
const GET = async (event) => {
  const userId = getUserId(event);
  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const limit = Number(event.url.searchParams.get("limit")) || 10;
    const activities = await getRecentActivities(userId, limit);
    return json(activities);
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return json({ error: "Failed to fetch activities" }, { status: 500 });
  }
};
export {
  GET
};
