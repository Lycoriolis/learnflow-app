import type { RequestHandler } from '@sveltejs/kit';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost/learnflow_db'
});

// Helper: get user id from session/cookie (replace with your auth logic)
function getUserId(event: any): string | null {
  // Example: from cookie or session
  return event.locals?.user?.uid || null;
}

export const GET: RequestHandler = async (event) => {
  const userId = getUserId(event);
  try {
    // Get all groups
    const groupsRes = await pool.query('SELECT * FROM groups ORDER BY created_at DESC');
    const groups = groupsRes.rows;
    let memberGroupIds: number[] = [];
    if (userId) {
      const memberRes = await pool.query('SELECT group_id FROM group_members WHERE user_id = $1', [userId]);
      memberGroupIds = memberRes.rows.map((r: any) => r.group_id);
    }
    // Attach isMember flag
    const result = groups.map((g: any) => ({
      ...g,
      isMember: memberGroupIds.includes(g.id)
    }));
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response('Failed to fetch groups', { status: 500 });
  }
};
