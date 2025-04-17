import type { RequestHandler } from '@sveltejs/kit';
import pkg from 'pg';
const { Pool } = pkg;

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

export const POST: RequestHandler = async (event) => {
  const userId = getUserId(event);
  if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  try {
    const { name, description, topic, image, is_public } = await event.request.json();
    if (!name || !description || !topic) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    // Insert group
    const groupRes = await pool.query(
      `INSERT INTO groups (name, description, topic, image, is_public, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, topic, image, is_public ?? true, userId]
    );
    const group = groupRes.rows[0];
    // Add creator as first member
    await pool.query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [group.id, userId]
    );
    return new Response(JSON.stringify(group), { status: 201 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Failed to create group' }), { status: 500 });
  }
};
