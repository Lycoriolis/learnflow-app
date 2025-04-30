import type { RequestHandler } from '@sveltejs/kit';
import { pool } from '$lib/services/userService.server';

export const POST: RequestHandler = async ({ request, locals }) => {
  const { eventType, referenceId, metadata } = await request.json();
  const userId = locals.user?.uid;
  if (!userId) return new Response(null, { status: 401 });

  const prevRes = await pool.query(
    'SELECT id FROM activities WHERE user_id=$1 ORDER BY timestamp_start DESC LIMIT 1',
    [userId]
  );
  const previousEventId = prevRes.rows[0]?.id || null;
  const now = Date.now();

  await pool.query(
    `INSERT INTO activities
       (user_id, event_type, reference_id, timestamp_start, timestamp_end, metadata, previous_event_id)
     VALUES ($1,$2,$3,$4,$4,$5,$6)`,
    [userId, eventType, referenceId, now, metadata, previousEventId]
  );

  return new Response(null, { status: 201 });
};