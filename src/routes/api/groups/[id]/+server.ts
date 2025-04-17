import type { RequestHandler } from '@sveltejs/kit';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost/learnflow_db'
});

export const GET: RequestHandler = async ({ params }) => {
  const groupId = params.id;
  if (!groupId) return new Response(JSON.stringify({ error: 'Missing group id' }), { status: 400 });
  try {
    const groupRes = await pool.query('SELECT * FROM groups WHERE id = $1', [groupId]);
    if (groupRes.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Group not found' }), { status: 404 });
    }
    const group = groupRes.rows[0];
    const membersRes = await pool.query('SELECT user_id FROM group_members WHERE group_id = $1', [groupId]);
    const members = membersRes.rows;
    return new Response(JSON.stringify({ group, members }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Failed to fetch group' }), { status: 500 });
  }
};
