import pkg from 'pg';
const { Pool } = pkg;
import { env } from '$env/dynamic/private';

// Configure the connection pool
// Ensure environment variables like DATABASE_URL or POSTGRES_URL are set
const pool = new Pool({
  connectionString: env.DATABASE_URL || env.POSTGRES_URL, // Fallback to POSTGRES_URL if DATABASE_URL is not available
});

/**
 * Fetches a topic by its ID from the database.
 * @param {string} topicId The ID of the topic to fetch.
 * @returns {Promise<object|null>} The topic data or null if not found.
 */
export async function getTopicById(topicId) {
  console.log(`Fetching topic with ID from DB: ${topicId}`);
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT id, title, author, created_at as date, content FROM forum_topics WHERE id = $1', [topicId]);
    if (res.rows.length > 0) {
      const topic = res.rows[0];
      // TODO: Fetch replies separately if they are in a different table
      topic.replies = []; // Placeholder for replies
      return topic;
    } else {
      return null; // Topic not found
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
 * Fetches a list of all topics from the database.
 * @returns {Promise<object[]>} A list of topics.
 */
export async function getAllTopics() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM forum_topics ORDER BY created_at DESC');
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

// Add other forum-related functions here (e.g., createTopic, addReply)