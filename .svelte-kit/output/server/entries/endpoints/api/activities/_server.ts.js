import { p as pool } from "../../../../chunks/userService.server.js";
const GET = async ({ url, locals }) => {
  const userId = locals.user?.uid;
  if (!userId) {
    return new Response(null, { status: 401 });
  }
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);
  const res = await pool.query(
    `SELECT id, event_type AS "eventType", reference_id AS "referenceId", timestamp_start AS "timestampStart", timestamp_end AS "timestampEnd", metadata
       FROM activities
       WHERE user_id = $1
       ORDER BY timestamp_start DESC
       LIMIT $2`,
    [userId, limit]
  );
  const activities = res.rows;
  return new Response(JSON.stringify({ activities }), { headers: { "Content-Type": "application/json" } });
};
export {
  GET
};
