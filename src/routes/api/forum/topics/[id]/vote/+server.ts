import type { RequestHandler } from '@sveltejs/kit';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const POST: RequestHandler = async ({ params, request }) => {
  const topic_id = params.id;
  const { user_id, vote_type } = await request.json(); // vote_type: 1 (upvote), -1 (downvote)

  if (!user_id || !topic_id || ![1, -1].includes(vote_type)) {
    return new Response('Missing or invalid fields', { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Check for existing vote
    const res = await client.query(
      'SELECT * FROM forum_votes WHERE topic_id = $1 AND user_id = $2',
      [topic_id, user_id]
    );
    if (res.rows.length > 0) {
      if (res.rows[0].vote_type === vote_type) {
        // Toggle: remove vote
        await client.query('DELETE FROM forum_votes WHERE id = $1', [res.rows[0].id]);
      } else {
        // Update vote
        await client.query('UPDATE forum_votes SET vote_type = $1 WHERE id = $2', [vote_type, res.rows[0].id]);
      }
    } else {
      // Insert new vote
      await client.query(
        'INSERT INTO forum_votes (topic_id, user_id, vote_type) VALUES ($1, $2, $3)',
        [topic_id, user_id, vote_type]
      );
    }
    // Get updated vote counts
    const upvotesRes = await client.query(
      'SELECT COUNT(*) FROM forum_votes WHERE topic_id = $1 AND vote_type = 1',
      [topic_id]
    );
    const downvotesRes = await client.query(
      'SELECT COUNT(*) FROM forum_votes WHERE topic_id = $1 AND vote_type = -1',
      [topic_id]
    );
    await client.query('COMMIT');
    return new Response(
      JSON.stringify({
        upvotes: parseInt(upvotesRes.rows[0].count, 10),
        downvotes: parseInt(downvotesRes.rows[0].count, 10)
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    await client.query('ROLLBACK');
    return new Response('Error processing vote', { status: 500 });
  } finally {
    client.release();
  }
};