import type { RequestHandler } from '@sveltejs/kit';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const GET: RequestHandler = async ({ url }) => {
  const topicId = url.searchParams.get('topic_id');
  
  if (!topicId) {
    return new Response('Topic ID is required', { status: 400 });
  }

  const res = await pool.query(`
    SELECT p.*, u.name as author_name, u.avatar as author_avatar
    FROM forum_posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.topic_id = $1
    ORDER BY p.created_at ASC
  `, [topicId]);

  return new Response(JSON.stringify(res.rows), { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
  const { topic_id, author_id, content } = await request.json();

  if (!topic_id || !author_id || !content) {
    return new Response('Missing required fields', { status: 400 });
  }

  const res = await pool.query(`
    INSERT INTO forum_posts (topic_id, author_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [topic_id, author_id, content]);

  // Update topic's updated_at timestamp
  await pool.query(`
    UPDATE forum_topics
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
  `, [topic_id]);

  return new Response(JSON.stringify(res.rows[0]), { status: 201 });
};

export const PUT: RequestHandler = async ({ request }) => {
  const { id, content } = await request.json();

  if (!id || !content) {
    return new Response('Missing required fields', { status: 400 });
  }

  const res = await pool.query(`
    UPDATE forum_posts
    SET content = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `, [content, id]);

  if (res.rowCount === 0) {
    return new Response('Post not found', { status: 404 });
  }

  return new Response(JSON.stringify(res.rows[0]), { status: 200 });
};

export const DELETE: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response('Post ID is required', { status: 400 });
  }

  const res = await pool.query(`
    DELETE FROM forum_posts
    WHERE id = $1
    RETURNING *
  `, [id]);

  if (res.rowCount === 0) {
    return new Response('Post not found', { status: 404 });
  }

  return new Response(JSON.stringify(res.rows[0]), { status: 200 });
};