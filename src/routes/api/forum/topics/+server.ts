import type { RequestHandler } from '@sveltejs/kit';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const GET: RequestHandler = async ({ url }) => {
  const categoryId = url.searchParams.get('category_id');
  let query = `
    SELECT t.*, u.name as author_name, u.avatar as author_avatar, c.name as category_name,
           (SELECT COUNT(*) FROM forum_posts WHERE topic_id = t.id) as posts_count
    FROM forum_topics t
    JOIN users u ON t.author_id = u.id
    JOIN forum_categories c ON t.category_id = c.id
  `;

  const params: any[] = [];
  if (categoryId) {
    query += ` WHERE t.category_id = $1`;
    params.push(categoryId);
  }

  query += ` ORDER BY t.is_pinned DESC, t.updated_at DESC`;
  
  const res = await pool.query(query, params);
  return new Response(JSON.stringify(res.rows), { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
  const { title, category_id, author_id, content } = await request.json();

  if (!title || !category_id || !author_id || !content) {
    return new Response('Missing required fields', { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create the topic
    const topicRes = await client.query(`
      INSERT INTO forum_topics (title, category_id, author_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [title, category_id, author_id]);

    // Create the first post
    await client.query(`
      INSERT INTO forum_posts (topic_id, author_id, content)
      VALUES ($1, $2, $3)
    `, [topicRes.rows[0].id, author_id, content]);

    await client.query('COMMIT');
    return new Response(JSON.stringify(topicRes.rows[0]), { status: 201 });
  } catch (error) {
    await client.query('ROLLBACK');
    return new Response('Error creating topic', { status: 500 });
  } finally {
    client.release();
  }
};

export const PUT: RequestHandler = async ({ request }) => {
  const { id, title, is_pinned, is_locked } = await request.json();

  if (!id || !title) {
    return new Response('Missing required fields', { status: 400 });
  }

  const res = await pool.query(`
    UPDATE forum_topics
    SET title = $1,
        is_pinned = COALESCE($2, is_pinned),
        is_locked = COALESCE($3, is_locked),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *
  `, [title, is_pinned, is_locked, id]);

  if (res.rowCount === 0) {
    return new Response('Topic not found', { status: 404 });
  }

  return new Response(JSON.stringify(res.rows[0]), { status: 200 });
};

export const DELETE: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response('Topic ID is required', { status: 400 });
  }

  const res = await pool.query(`
    DELETE FROM forum_topics
    WHERE id = $1
    RETURNING *
  `, [id]);

  if (res.rowCount === 0) {
    return new Response('Topic not found', { status: 404 });
  }

  return new Response(JSON.stringify(res.rows[0]), { status: 200 });
};