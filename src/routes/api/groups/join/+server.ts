import type { RequestHandler } from '@sveltejs/kit';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost/learnflow_db'
});

function getUserId(event: any): string | null {
  return event.locals?.user?.uid || null;
}

export const POST: RequestHandler = async (event) => {
  const userId = getUserId(event);
  if (!userId) return new Response('Unauthorized', { status: 401 });
  const { group_id } = await event.request.json();
  if (!group_id) return new Response('Missing group_id', { status: 400 });
  try {
    // Insert membership if not already present
    await pool.query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [group_id, userId]
    );
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response('Failed to join group', { status: 500 });
  }
};
