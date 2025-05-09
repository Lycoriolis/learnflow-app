import pkg from 'pg';
const { Pool } = pkg;
import { env } from '$env/dynamic/private';

// Configure the connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL
});

/**
 * Fetches a topic by its ID from the database.
 * @param {string} topicId The ID of the topic to fetch.
 * @returns {Promise<object|null>} The topic data or null if not found.
 */
export async function getTopicById(topicId: string) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT 
        t.id, t.title, t.content, t.category_id as category,
        json_build_object('id', u.id, 'name', u.name, 'avatar', u.avatar) as author,
        t.created_at as createdAt,
        t.updated_at as updatedAt,
        (SELECT COUNT(*) FROM forum_posts p WHERE p.topic_id = t.id) as repliesCount,
        COALESCE(t.views_count, 0) as viewsCount
      FROM forum_topics t
      JOIN users u ON t.author_id = u.id
      WHERE t.id = $1`,
      [topicId]
    );
    if (res.rows.length > 0) {
      return res.rows[0];
    } else {
      return null;
    }
  } catch (err) {
    console.error('Error fetching topic by ID:', err);
    // Optionally, re-throw the error or handle it as needed
    throw new Error('Failed to fetch topic from database');
  } finally {
    client.release(); // Release the client back to the pool
  }
}

/**
 * Get a specific topic by ID - alias for getTopicById for consistent API
 */
export function getTopic(id: string) {
  return getTopicById(id);
}

/**
 * Updates a forum topic
 */
export async function updateTopic(id: string, data: {
  title?: string;
  content?: string;
  category_id?: string;
  is_pinned?: boolean;
  is_locked?: boolean;
}) {
  const client = await pool.connect();
  try {
    const updates = [];
    const values = [];
    
    if (data.title !== undefined) {
      updates.push(`title = $${updates.length + 1}`);
      values.push(data.title);
    }
    
    if (data.content !== undefined) {
      updates.push(`content = $${updates.length + 1}`);
      values.push(data.content);
    }
    
    if (data.category_id !== undefined) {
      updates.push(`category_id = $${updates.length + 1}`);
      values.push(data.category_id);
    }
    
    if (data.is_pinned !== undefined) {
      updates.push(`is_pinned = $${updates.length + 1}`);
      values.push(data.is_pinned);
    }
    
    if (data.is_locked !== undefined) {
      updates.push(`is_locked = $${updates.length + 1}`);
      values.push(data.is_locked);
    }
    
    // Add updated_at timestamp
    updates.push(`updated_at = NOW()`);
    
    if (updates.length === 0) {
      return null; // Nothing to update
    }
    
    values.push(id);
    
    const query = `
      UPDATE forum_topics
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING *
    `;
    
    const res = await client.query(query, values);
    
    if (res.rows.length === 0) {
      return null;
    }
    
    return res.rows[0];
  } catch (err) {
    console.error('Error updating topic:', err);
    throw new Error('Failed to update topic');
  } finally {
    client.release();
  }
}

/**
 * Deletes a forum topic and all its posts
 */
export async function deleteTopic(id: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Delete all posts first (foreign key constraint)
    await client.query('DELETE FROM forum_posts WHERE topic_id = $1', [id]);
    
    // Delete the topic
    const res = await client.query('DELETE FROM forum_topics WHERE id = $1 RETURNING *', [id]);
    
    await client.query('COMMIT');
    
    if (res.rows.length === 0) {
      return false;
    }
    
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting topic:', err);
    throw new Error('Failed to delete topic');
  } finally {
    client.release();
  }
}

/**
 * Fetches a list of all topics from the database.
 * @returns {Promise<object[]>} A list of topics.
 */
export async function getAllTopics() {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT 
        t.id, t.title, t.category_id as category,
        json_build_object('id', u.id, 'name', u.name, 'avatar', u.avatar) as author,
        t.created_at as createdAt,
        t.updated_at as updatedAt,
        t.is_pinned, t.is_locked,
        (SELECT COUNT(*) FROM forum_posts p WHERE p.topic_id = t.id) as repliesCount,
        COALESCE(t.views_count, 0) as viewsCount
      FROM forum_topics t
      JOIN users u ON t.author_id = u.id
      ORDER BY t.is_pinned DESC, t.updated_at DESC`);
    return res.rows;
  } catch (err) {
    console.error('Error fetching topics (forum_topics):', err);
    throw new Error('Failed to fetch topics from database');
  } finally {
    client.release();
  }
}

/**
 * Fetches a list of all forum categories from the database.
 * @returns {Promise<object[]>} A list of categories.
 */
export async function getAllCategories() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM forum_categories ORDER BY name ASC');
    console.log('Fetched categories from DB:', res.rows);
    return res.rows;
  } catch (err) {
    console.error('Error fetching categories:', err);
    throw new Error('Failed to fetch categories from database');
  } finally {
    client.release();
  }
}

/**
 * Fetches all posts for a given forum topic from the database.
 * @param {string} topicId The ID of the topic to fetch posts for.
 * @returns {Promise<object[]>} A list of posts.
 */
export async function getPostsByTopicId(topicId: string) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT p.*, u.name as author_name, u.avatar as author_avatar
       FROM forum_posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.topic_id = $1
       ORDER BY p.created_at ASC`,
      [topicId]
    );
    return res.rows;
  } catch (err) {
    console.error('Error fetching posts for topic:', err);
    throw new Error('Failed to fetch posts from database');
  } finally {
    client.release();
  }
}

/**
 * Updates a forum category
 */
export async function updateCategory(id: string, data: {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}) {
  const client = await pool.connect();
  try {
    const updates = [];
    const values = [];
    
    if (data.name !== undefined) {
      updates.push(`name = $${updates.length + 1}`);
      values.push(data.name);
    }
    
    if (data.description !== undefined) {
      updates.push(`description = $${updates.length + 1}`);
      values.push(data.description);
    }
    
    if (data.icon !== undefined) {
      updates.push(`icon = $${updates.length + 1}`);
      values.push(data.icon);
    }
    
    if (data.color !== undefined) {
      updates.push(`color = $${updates.length + 1}`);
      values.push(data.color);
    }
    
    if (updates.length === 0) {
      return null; // Nothing to update
    }
    
    values.push(id);
    
    const query = `
      UPDATE forum_categories
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING *
    `;
    
    const res = await client.query(query, values);
    
    if (res.rows.length === 0) {
      return null;
    }
    
    return res.rows[0];
  } catch (err) {
    console.error('Error updating category:', err);
    throw new Error('Failed to update category');
  } finally {
    client.release();
  }
}

/**
 * Creates a new forum category
 */
export async function createCategory(data: {
  name: string;
  description: string;
  icon: string;
  color: string;
}) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO forum_categories (name, description, icon, color)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const res = await client.query(query, [
      data.name,
      data.description,
      data.icon,
      data.color
    ]);
    
    return res.rows[0];
  } catch (err) {
    console.error('Error creating category:', err);
    throw new Error('Failed to create category');
  } finally {
    client.release();
  }
}

/**
 * Deletes a forum category
 * Note: This will fail if there are topics in this category
 */
export async function deleteCategory(id: string) {
  const client = await pool.connect();
  try {
    // First check if there are topics in this category
    const checkRes = await client.query(
      'SELECT COUNT(*) as topic_count FROM forum_topics WHERE category_id = $1',
      [id]
    );
    
    if (parseInt(checkRes.rows[0].topic_count) > 0) {
      throw new Error('Cannot delete category with topics');
    }
    
    const res = await client.query(
      'DELETE FROM forum_categories WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (res.rows.length === 0) {
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error deleting category:', err);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Get a specific category by ID
 */
export async function getCategory(id: string) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      'SELECT * FROM forum_categories WHERE id = $1',
      [id]
    );
    
    if (res.rows.length === 0) {
      return null;
    }
    
    return res.rows[0];
  } catch (err) {
    console.error('Error fetching category:', err);
    throw new Error('Failed to fetch category');
  } finally {
    client.release();
  }
}

/**
 * Creates a new forum post
 */
export async function createPost(data: {
  topic_id: string;
  author_id: string;
  content: string;
}) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Create the post
    const postRes = await client.query(`
      INSERT INTO forum_posts (topic_id, author_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [data.topic_id, data.author_id, data.content]);

    // Update topic's updated_at timestamp
    await client.query(`
      UPDATE forum_topics
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [data.topic_id]);

    await client.query('COMMIT');
    return postRes.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating post:', err);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Updates a forum post
 */
export async function updatePost(id: string, content: string) {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      UPDATE forum_posts
      SET content = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [content, id]);
    
    if (res.rows.length === 0) {
      return null;
    }
    
    return res.rows[0];
  } catch (err) {
    console.error('Error updating post:', err);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Deletes a forum post
 */
export async function deletePost(id: string) {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      DELETE FROM forum_posts
      WHERE id = $1
      RETURNING *
    `, [id]);
    
    if (res.rows.length === 0) {
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error deleting post:', err);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Creates a new forum topic with an initial post
 */
export async function createTopic(data: {
  title: string;
  content: string;
  category_id: string;
  author_id: string;
}) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Create the topic
    const topicRes = await client.query(`
      INSERT INTO forum_topics (title, category_id, author_id, created_at, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `, [data.title, data.category_id, data.author_id]);

    // Create the first post
    await client.query(`
      INSERT INTO forum_posts (topic_id, author_id, content, created_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    `, [topicRes.rows[0].id, data.author_id, data.content]);

    await client.query('COMMIT');
    return topicRes.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating topic:', err);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Handles voting on a forum topic
 */
export async function handleTopicVote(topicId: string, userId: string, voteType: 1 | -1) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check for existing vote
    const existing = await client.query(
      'SELECT * FROM forum_topic_votes WHERE topic_id = $1 AND user_id = $2',
      [topicId, userId]
    );

    let userVote: (1 | -1) | null = voteType;
    if (existing.rows.length) {
      if (existing.rows[0].vote_type === voteType) {
        // Toggle off (remove vote)
        await client.query('DELETE FROM forum_topic_votes WHERE id = $1', [existing.rows[0].id]);
        userVote = null;
      } else {
        // Update vote
        await client.query(
          'UPDATE forum_topic_votes SET vote_type = $1 WHERE id = $2',
          [voteType, existing.rows[0].id]
        );
      }
    } else {
      // New vote
      await client.query(
        'INSERT INTO forum_topic_votes (topic_id, user_id, vote_type, created_at) VALUES ($1, $2, $3, NOW())',
        [topicId, userId, voteType]
      );
    }

    // Recalculate counts
    const up = await client.query(
      'SELECT COUNT(*) FROM forum_topic_votes WHERE topic_id = $1 AND vote_type = 1',
      [topicId]
    );
    const down = await client.query(
      'SELECT COUNT(*) FROM forum_topic_votes WHERE topic_id = $1 AND vote_type = -1',
      [topicId]
    );

    // Update topic vote counts
    await client.query(
      'UPDATE forum_topics SET upvotes = $1, downvotes = $2 WHERE id = $3',
      [up.rows[0].count, down.rows[0].count, topicId]
    );

    await client.query('COMMIT');

    return {
      upvotes: Number(up.rows[0].count),
      downvotes: Number(down.rows[0].count),
      userVote
    };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error processing vote:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Add other forum-related functions here (e.g., addReply)