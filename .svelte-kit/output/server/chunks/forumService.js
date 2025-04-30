import pkg from "pg";
import { d as private_env } from "./shared-server.js";
const { Pool } = pkg;
const pool = new Pool({
  connectionString: private_env.DATABASE_URL
});
async function getTopicById(topicId) {
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
    console.error("Error fetching topic by ID:", err);
    throw new Error("Failed to fetch topic from database");
  } finally {
    client.release();
  }
}
function getTopic(id) {
  return getTopicById(id);
}
async function updateTopic(id, data) {
  const client = await pool.connect();
  try {
    const updates = [];
    const values = [];
    if (data.title !== void 0) {
      updates.push(`title = $${updates.length + 1}`);
      values.push(data.title);
    }
    if (data.content !== void 0) {
      updates.push(`content = $${updates.length + 1}`);
      values.push(data.content);
    }
    if (data.category_id !== void 0) {
      updates.push(`category_id = $${updates.length + 1}`);
      values.push(data.category_id);
    }
    if (data.is_pinned !== void 0) {
      updates.push(`is_pinned = $${updates.length + 1}`);
      values.push(data.is_pinned);
    }
    if (data.is_locked !== void 0) {
      updates.push(`is_locked = $${updates.length + 1}`);
      values.push(data.is_locked);
    }
    updates.push(`updated_at = NOW()`);
    if (updates.length === 0) {
      return null;
    }
    values.push(id);
    const query = `
      UPDATE forum_topics
      SET ${updates.join(", ")}
      WHERE id = $${values.length}
      RETURNING *
    `;
    const res = await client.query(query, values);
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0];
  } catch (err) {
    console.error("Error updating topic:", err);
    throw new Error("Failed to update topic");
  } finally {
    client.release();
  }
}
async function deleteTopic(id) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM forum_posts WHERE topic_id = $1", [id]);
    const res = await client.query("DELETE FROM forum_topics WHERE id = $1 RETURNING *", [id]);
    await client.query("COMMIT");
    if (res.rows.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error deleting topic:", err);
    throw new Error("Failed to delete topic");
  } finally {
    client.release();
  }
}
async function getAllTopics() {
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
      ORDER BY t.is_pinned DESC, t.updated_at DESC`
    );
    return res.rows;
  } catch (err) {
    console.error("Error fetching topics (forum_topics):", err);
    throw new Error("Failed to fetch topics from database");
  } finally {
    client.release();
  }
}
async function getAllCategories() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM forum_categories ORDER BY name ASC");
    console.log("Fetched categories from DB:", res.rows);
    return res.rows;
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw new Error("Failed to fetch categories from database");
  } finally {
    client.release();
  }
}
async function getPostsByTopicId(topicId) {
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
    console.error("Error fetching posts for topic:", err);
    throw new Error("Failed to fetch posts from database");
  } finally {
    client.release();
  }
}
async function updateCategory(id, data) {
  const client = await pool.connect();
  try {
    const updates = [];
    const values = [];
    if (data.name !== void 0) {
      updates.push(`name = $${updates.length + 1}`);
      values.push(data.name);
    }
    if (data.description !== void 0) {
      updates.push(`description = $${updates.length + 1}`);
      values.push(data.description);
    }
    if (data.icon !== void 0) {
      updates.push(`icon = $${updates.length + 1}`);
      values.push(data.icon);
    }
    if (data.color !== void 0) {
      updates.push(`color = $${updates.length + 1}`);
      values.push(data.color);
    }
    if (updates.length === 0) {
      return null;
    }
    values.push(id);
    const query = `
      UPDATE forum_categories
      SET ${updates.join(", ")}
      WHERE id = $${values.length}
      RETURNING *
    `;
    const res = await client.query(query, values);
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0];
  } catch (err) {
    console.error("Error updating category:", err);
    throw new Error("Failed to update category");
  } finally {
    client.release();
  }
}
async function createCategory(data) {
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
    console.error("Error creating category:", err);
    throw new Error("Failed to create category");
  } finally {
    client.release();
  }
}
async function deleteCategory(id) {
  const client = await pool.connect();
  try {
    const checkRes = await client.query(
      "SELECT COUNT(*) as topic_count FROM forum_topics WHERE category_id = $1",
      [id]
    );
    if (parseInt(checkRes.rows[0].topic_count) > 0) {
      throw new Error("Cannot delete category with topics");
    }
    const res = await client.query(
      "DELETE FROM forum_categories WHERE id = $1 RETURNING *",
      [id]
    );
    if (res.rows.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error deleting category:", err);
    throw err;
  } finally {
    client.release();
  }
}
async function getCategory(id) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT * FROM forum_categories WHERE id = $1",
      [id]
    );
    if (res.rows.length === 0) {
      return null;
    }
    return res.rows[0];
  } catch (err) {
    console.error("Error fetching category:", err);
    throw new Error("Failed to fetch category");
  } finally {
    client.release();
  }
}
async function createPost(data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const postRes = await client.query(`
      INSERT INTO forum_posts (topic_id, author_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [data.topic_id, data.author_id, data.content]);
    await client.query(`
      UPDATE forum_topics
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [data.topic_id]);
    await client.query("COMMIT");
    return postRes.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating post:", err);
    throw err;
  } finally {
    client.release();
  }
}
async function updatePost(id, content) {
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
    console.error("Error updating post:", err);
    throw err;
  } finally {
    client.release();
  }
}
async function deletePost(id) {
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
    console.error("Error deleting post:", err);
    throw err;
  } finally {
    client.release();
  }
}
async function createTopic(data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const topicRes = await client.query(`
      INSERT INTO forum_topics (title, category_id, author_id, created_at, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `, [data.title, data.category_id, data.author_id]);
    await client.query(`
      INSERT INTO forum_posts (topic_id, author_id, content, created_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
    `, [topicRes.rows[0].id, data.author_id, data.content]);
    await client.query("COMMIT");
    return topicRes.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating topic:", err);
    throw err;
  } finally {
    client.release();
  }
}
async function handleTopicVote(topicId, userId, voteType) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const existing = await client.query(
      "SELECT * FROM forum_topic_votes WHERE topic_id = $1 AND user_id = $2",
      [topicId, userId]
    );
    let userVote = voteType;
    if (existing.rows.length) {
      if (existing.rows[0].vote_type === voteType) {
        await client.query("DELETE FROM forum_topic_votes WHERE id = $1", [existing.rows[0].id]);
        userVote = null;
      } else {
        await client.query(
          "UPDATE forum_topic_votes SET vote_type = $1 WHERE id = $2",
          [voteType, existing.rows[0].id]
        );
      }
    } else {
      await client.query(
        "INSERT INTO forum_topic_votes (topic_id, user_id, vote_type, created_at) VALUES ($1, $2, $3, NOW())",
        [topicId, userId, voteType]
      );
    }
    const up = await client.query(
      "SELECT COUNT(*) FROM forum_topic_votes WHERE topic_id = $1 AND vote_type = 1",
      [topicId]
    );
    const down = await client.query(
      "SELECT COUNT(*) FROM forum_topic_votes WHERE topic_id = $1 AND vote_type = -1",
      [topicId]
    );
    await client.query(
      "UPDATE forum_topics SET upvotes = $1, downvotes = $2 WHERE id = $3",
      [up.rows[0].count, down.rows[0].count, topicId]
    );
    await client.query("COMMIT");
    return {
      upvotes: Number(up.rows[0].count),
      downvotes: Number(down.rows[0].count),
      userVote
    };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error processing vote:", err);
    throw err;
  } finally {
    client.release();
  }
}
export {
  getPostsByTopicId as a,
  createPost as b,
  createCategory as c,
  deleteCategory as d,
  updatePost as e,
  deletePost as f,
  getAllCategories as g,
  getAllTopics as h,
  createTopic as i,
  updateTopic as j,
  deleteTopic as k,
  handleTopicVote as l,
  getCategory as m,
  getTopic as n,
  getTopicById as o,
  updateCategory as u
};
