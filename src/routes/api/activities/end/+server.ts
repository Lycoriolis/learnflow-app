import type { RequestHandler } from '@sveltejs/kit';
import { pool } from '$lib/services/userService.server';

export const POST: RequestHandler = async ({ request, locals }) => {
  const { eventId } = await request.json();
  const userId = locals.user?.uid;
  if (!userId) return new Response(null, { status: 401 });

  const now = Date.now();
  await pool.query(
    'UPDATE activities SET timestamp_end=$1 WHERE id=$2 AND user_id=$3',
    [now, eventId, userId]
  );

  return new Response(null, { status: 204 });
};