import { p as pool } from "../../../../../chunks/userService.server.js";
const POST = async ({ request, locals }) => {
  const { eventType, referenceId, metadata } = await request.json();
  const userId = locals.user?.uid;
  if (!userId) {
    return new Response(null, { status: 401 });
  }
  const prevRes = await pool.query(
    "SELECT id FROM activities WHERE user_id=$1 ORDER BY timestamp_start DESC LIMIT 1",
    [userId]
  );
  const previousEventId = prevRes.rows[0]?.id || null;
  const now = Date.now();
  const insertRes = await pool.query(
    `INSERT INTO activities
       (user_id, event_type, reference_id, timestamp_start, metadata, previous_event_id)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id`,
    [userId, eventType, referenceId, now, metadata, previousEventId]
  );
  const eventId = insertRes.rows[0].id;
  return new Response(JSON.stringify({ eventId }), { headers: { "Content-Type": "application/json" } });
};
export {
  POST
};
//# sourceMappingURL=_server.ts.js.map
