import type { RequestHandler } from '@sveltejs/kit';
import { pool } from '$lib/services/userService.server';

export const GET: RequestHandler = async ({ url, locals }) => {
  // Get user ID from the decoded token
  const userId = locals.user?.uid;
  
  if (!userId) {
    console.error('Unauthorized attempt to access activities API');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  
  try {
    console.log(`Getting activities for user: ${userId}, limit: ${limit}`);
    const res = await pool.query(
      `SELECT id, event_type AS "eventType", reference_id AS "referenceId", timestamp_start AS "timestampStart", timestamp_end AS "timestampEnd", metadata
         FROM activities
         WHERE user_id = $1
         ORDER BY timestamp_start DESC
         LIMIT $2`,
      [userId, limit]
    );
    const activities = res.rows;
    return new Response(JSON.stringify({ activities }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Activities error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch activities' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};