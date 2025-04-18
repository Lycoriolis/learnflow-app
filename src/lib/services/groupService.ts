import pkg from 'pg';
const { Pool } = pkg;
import { env } from '$env/dynamic/private';

// Configure the connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL
});

/**
 * Get all groups with member status for a given user
 */
export async function getAllGroups(userId: string | null = null) {
  const client = await pool.connect();
  try {
    const groupsRes = await client.query('SELECT * FROM groups ORDER BY created_at DESC');
    const groups = groupsRes.rows;
    let memberGroupIds: number[] = [];
    
    if (userId) {
      const memberRes = await client.query(
        'SELECT group_id FROM group_members WHERE user_id = $1',
        [userId]
      );
      memberGroupIds = memberRes.rows.map((r: any) => r.group_id);
    }
    
    // Attach isMember flag
    return groups.map((g: any) => ({
      ...g,
      isMember: memberGroupIds.includes(g.id)
    }));
  } catch (err) {
    console.error('Error fetching groups:', err);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Get a specific group by ID with its members
 */
export async function getGroupById(groupId: string) {
  const client = await pool.connect();
  try {
    const groupRes = await client.query(
      'SELECT * FROM groups WHERE id = $1',
      [groupId]
    );
    
    if (groupRes.rowCount === 0) {
      return null;
    }
    
    const group = groupRes.rows[0];
    const membersRes = await client.query(
      'SELECT user_id FROM group_members WHERE group_id = $1',
      [groupId]
    );
    
    return {
      group,
      members: membersRes.rows
    };
  } catch (err) {
    console.error('Error fetching group:', err);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Create a new group
 */
export async function createGroup(data: {
  name: string;
  description: string;
  topic: string;
  image?: string;
  is_public?: boolean;
  created_by: string;
}) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Create group
    const groupRes = await client.query(
      `INSERT INTO groups (name, description, topic, image, is_public, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.name, data.description, data.topic, data.image, data.is_public ?? true, data.created_by]
    );
    
    // Add creator as first member
    await client.query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)',
      [groupRes.rows[0].id, data.created_by]
    );
    
    await client.query('COMMIT');
    return groupRes.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating group:', err);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Join a group
 */
export async function joinGroup(groupId: string, userId: string) {
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [groupId, userId]
    );
    return true;
  } catch (err) {
    console.error('Error joining group:', err);
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Leave a group
 */
export async function leaveGroup(groupId: string, userId: string) {
  const client = await pool.connect();
  try {
    await client.query(
      'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2',
      [groupId, userId]
    );
    return true;
  } catch (err) {
    console.error('Error leaving group:', err);
    throw err;
  } finally {
    client.release();
  }
}