// src/lib/services/forums/topicService.ts
import type { ForumTopic } from '../../types/forumTypes'; // Removed unused TopicVote
import { pool } from '../userService.server';

/**
 * Get a specific topic by ID
 */
export async function getTopic(id: string): Promise<ForumTopic | null> {
  try {
    const result = await pool.query('SELECT * FROM forum_topics WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching topic:', error);
    throw new Error('Failed to fetch topic');
  }
}

/**
 * Get all topics
 */
export async function getAllTopics(): Promise<ForumTopic[]> {
  try {
    const result = await pool.query(`
      SELECT t.*, 
             c.name as category_name, 
             COUNT(p.id) as post_count, 
             u.username as author_name
      FROM forum_topics t
      LEFT JOIN forum_categories c ON t.category_id = c.id
      LEFT JOIN forum_posts p ON p.topic_id = t.id
      LEFT JOIN users u ON t.author_id = u.id
      GROUP BY t.id, c.name, u.username
      ORDER BY t.is_pinned DESC, t.created_at DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw new Error('Failed to fetch topics');
  }
}

/**
 * Create a new topic
 */
export async function createTopic(data: {
  title: string;
  category_id: string;
  author_id: string;
  content: string;
}): Promise<ForumTopic> {
  try {
    // Start a transaction
    await pool.query('BEGIN');
    
    // Insert the topic
    const topicResult = await pool.query(
      'INSERT INTO forum_topics (title, category_id, author_id) VALUES ($1, $2, $3) RETURNING *',
      [data.title, data.category_id, data.author_id]
    );
    
    // Insert the first post for this topic
    await pool.query(
      'INSERT INTO forum_posts (topic_id, author_id, content) VALUES ($1, $2, $3)',
      [topicResult.rows[0].id, data.author_id, data.content]
    );
    
    // Commit the transaction
    await pool.query('COMMIT');
    
    return topicResult.rows[0];
  } catch (error) {
    // Rollback in case of error
    await pool.query('ROLLBACK');
    console.error('Error creating topic:', error);
    throw new Error('Failed to create topic');
  }
}

/**
 * Update a topic
 */
export async function updateTopic(
  id: string, 
  data: Partial<ForumTopic>
): Promise<ForumTopic | null> {
  try {
    // Create SET clause dynamically based on provided fields
    const fields = Object.keys(data)
      .filter(key => key !== 'id') // Don't update id
      .map((key, index) => `${key} = $${index + 2}`);
    
    if (fields.length === 0) {
      return null; // Nothing to update
    }
    
    const values = Object.values(data);
    
    const query = `
      UPDATE forum_topics 
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, ...values]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating topic:', error);
    throw new Error('Failed to update topic');
  }
}

/**
 * Delete a topic and all its posts
 */
export async function deleteTopic(id: string): Promise<boolean> {
  try {
    // Start a transaction
    await pool.query('BEGIN');
    
    // Delete all posts for this topic
    await pool.query('DELETE FROM forum_posts WHERE topic_id = $1', [id]);
    
    // Delete the topic
    const result = await pool.query('DELETE FROM forum_topics WHERE id = $1 RETURNING id', [id]);
    
    // Commit the transaction
    await pool.query('COMMIT');
    
    return result.rows.length > 0;
  } catch (error) {
    // Rollback in case of error
    await pool.query('ROLLBACK');
    console.error('Error deleting topic:', error);
    throw new Error('Failed to delete topic');
  }
}

/**
 * Handle topic voting (upvote/downvote)
 */
export async function handleTopicVote(
  topicId: string, 
  userId: string, 
  voteType: 1 | -1
): Promise<{ success: boolean; currentVotes: number }> {
  try {
    // Start a transaction
    await pool.query('BEGIN');
    
    // Check if user already voted on this topic
    const existingVote = await pool.query(
      'SELECT * FROM topic_votes WHERE topic_id = $1 AND user_id = $2',
      [topicId, userId]
    );
    
    if (existingVote.rows.length > 0) {
      // User already voted, update their vote
      if (existingVote.rows[0].vote_type === voteType) {
        // Remove vote if clicking the same button
        await pool.query(
          'DELETE FROM topic_votes WHERE topic_id = $1 AND user_id = $2',
          [topicId, userId]
        );
      } else {
        // Change vote type
        await pool.query(
          'UPDATE topic_votes SET vote_type = $3 WHERE topic_id = $1 AND user_id = $2',
          [topicId, userId, voteType]
        );
      }
    } else {
      // New vote
      await pool.query(
        'INSERT INTO topic_votes (topic_id, user_id, vote_type) VALUES ($1, $2, $3)',
        [topicId, userId, voteType]
      );
    }
    
    // Get the current total votes
    const votesResult = await pool.query(
      'SELECT COALESCE(SUM(vote_type), 0) as total_votes FROM topic_votes WHERE topic_id = $1',
      [topicId]
    );
    
    // Update the votes count in the topics table
    await pool.query(
      'UPDATE forum_topics SET votes = $2 WHERE id = $1',
      [topicId, votesResult.rows[0].total_votes]
    );
    
    // Commit the transaction
    await pool.query('COMMIT');
    
    return { 
      success: true, 
      currentVotes: parseInt(votesResult.rows[0].total_votes) 
    };
  } catch (error) {
    // Rollback in case of error
    await pool.query('ROLLBACK');
    console.error('Error handling topic vote:', error);
    throw new Error('Failed to process vote');
  }
}

export const createPost = async (_topicId: string, postData: any) => {
  // Add post logic
  // _topicId is marked as unused
  return { ...postData, createdAt: new Date() };
};