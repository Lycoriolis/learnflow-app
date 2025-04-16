import type { RequestHandler } from '@sveltejs/kit';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const GET: RequestHandler = async () => {
  const res = await pool.query(`
    SELECT c.*,
           (SELECT COUNT(*) FROM forum_topics WHERE category_id = c.id) as topics_count,
           (SELECT COUNT(*) FROM forum_topics t
            JOIN forum_posts p ON p.topic_id = t.id
            WHERE t.category_id = c.id) as posts_count
    FROM forum_categories c
    ORDER BY c.name ASC
  `);

  return new Response(JSON.stringify(res.rows), { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
  const { name, description, icon, color } = await request.json();

  if (!name) {
    return new Response('Category name is required', { status: 400 });
  }

  const res = await pool.query(`
    INSERT INTO forum_categories (name, description, icon, color)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [name, description, icon, color]);

  return new Response(JSON.stringify(res.rows[0]), { status: 201 });
};

export const PUT: RequestHandler = async ({ request }) => {
  const { id, name, description, icon, color } = await request.json();

  if (!id || !name) {
    return new Response('Missing required fields', { status: 400 });
  }

  const res = await pool.query(`
    UPDATE forum_categories
    SET name = $1,
        description = $2,
        icon = $3,
        color = $4
    WHERE id = $5
    RETURNING *
  `, [name, description, icon, color, id]);

  if (res.rowCount === 0) {
    return new Response('Category not found', { status: 404 });
  }

  return new Response(JSON.stringify(res.rows[0]), { status: 200 });
};

export const DELETE: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response('Category ID is required', { status: 400 });
  }

  const res = await pool.query(`
    DELETE FROM forum_categories
    WHERE id = $1
    RETURNING *
  `, [id]);

  if (res.rowCount === 0) {
    return new Response('Category not found', { status: 404 });
  }

  return new Response(JSON.stringify(res.rows[0]), { status: 200 });
};