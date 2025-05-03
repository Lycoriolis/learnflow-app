import pkg from "pg";
import { d as private_env } from "./shared-server.js";
const { Pool } = pkg;
const pool = new Pool({
  connectionString: private_env.DATABASE_URL
});
async function getAllGroups(userId = null) {
  const client = await pool.connect();
  try {
    const groupsRes = await client.query("SELECT * FROM groups ORDER BY created_at DESC");
    const groups = groupsRes.rows;
    let memberGroupIds = [];
    if (userId) {
      const memberRes = await client.query(
        "SELECT group_id FROM group_members WHERE user_id = $1",
        [userId]
      );
      memberGroupIds = memberRes.rows.map((r) => r.group_id);
    }
    return groups.map((g) => ({
      ...g,
      isMember: memberGroupIds.includes(g.id)
    }));
  } catch (err) {
    console.error("Error fetching groups:", err);
    throw err;
  } finally {
    client.release();
  }
}
async function getGroupById(groupId) {
  const client = await pool.connect();
  try {
    const groupRes = await client.query(
      "SELECT * FROM groups WHERE id = $1",
      [groupId]
    );
    if (groupRes.rowCount === 0) {
      return null;
    }
    const group = groupRes.rows[0];
    const membersRes = await client.query(
      "SELECT user_id FROM group_members WHERE group_id = $1",
      [groupId]
    );
    return {
      group,
      members: membersRes.rows
    };
  } catch (err) {
    console.error("Error fetching group:", err);
    throw err;
  } finally {
    client.release();
  }
}
async function createGroup(data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const groupRes = await client.query(
      `INSERT INTO groups (name, description, topic, image, is_public, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.name, data.description, data.topic, data.image, data.is_public ?? true, data.created_by]
    );
    await client.query(
      "INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)",
      [groupRes.rows[0].id, data.created_by]
    );
    await client.query("COMMIT");
    return groupRes.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating group:", err);
    throw err;
  } finally {
    client.release();
  }
}
async function joinGroup(groupId, userId) {
  const client = await pool.connect();
  try {
    await client.query(
      "INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [groupId, userId]
    );
    return true;
  } catch (err) {
    console.error("Error joining group:", err);
    throw err;
  } finally {
    client.release();
  }
}
async function leaveGroup(groupId, userId) {
  const client = await pool.connect();
  try {
    await client.query(
      "DELETE FROM group_members WHERE group_id = $1 AND user_id = $2",
      [groupId, userId]
    );
    return true;
  } catch (err) {
    console.error("Error leaving group:", err);
    throw err;
  } finally {
    client.release();
  }
}
export {
  getGroupById as a,
  createGroup as c,
  getAllGroups as g,
  joinGroup as j,
  leaveGroup as l
};
//# sourceMappingURL=groupService.js.map
