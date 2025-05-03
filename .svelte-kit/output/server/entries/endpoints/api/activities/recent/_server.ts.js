import { j as json } from "../../../../../chunks/index.js";
import { query, collection, where, orderBy, limit, getDocs } from "firebase/firestore";
import "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "clsx";
import "../../../../../chunks/authStore.js";
let db;
{
  const mockDb = {};
  db = mockDb;
}
async function getRecentActivities(userId, limitCount = 10) {
  const q = query(
    collection(db, "activities"),
    where("userId", "==", userId),
    orderBy("timestampStart", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc2) => ({
    id: doc2.id,
    ...doc2.data()
  }));
}
function getUserId(event) {
  return event.locals?.user?.uid || null;
}
const GET = async (event) => {
  const userId = getUserId(event);
  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const limit2 = Number(event.url.searchParams.get("limit")) || 10;
    const activities = await getRecentActivities(userId, limit2);
    return json(activities);
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    return json({ error: "Failed to fetch activities" }, { status: 500 });
  }
};
export {
  GET
};
//# sourceMappingURL=_server.ts.js.map
