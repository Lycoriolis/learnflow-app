import { p as pool } from "./userService.server.js";
async function getTopic(id) {
  try {
    const result = await pool.query("SELECT * FROM forum_topics WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching topic:", error);
    throw new Error("Failed to fetch topic");
  }
}
async function handleTopicVote(topicId, userId, voteType) {
  try {
    await pool.query("BEGIN");
    const existingVote = await pool.query(
      "SELECT * FROM topic_votes WHERE topic_id = $1 AND user_id = $2",
      [topicId, userId]
    );
    let result;
    if (existingVote.rows.length > 0) {
      if (existingVote.rows[0].vote_type === voteType) {
        await pool.query(
          "DELETE FROM topic_votes WHERE topic_id = $1 AND user_id = $2",
          [topicId, userId]
        );
      } else {
        await pool.query(
          "UPDATE topic_votes SET vote_type = $3 WHERE topic_id = $1 AND user_id = $2",
          [topicId, userId, voteType]
        );
      }
    } else {
      await pool.query(
        "INSERT INTO topic_votes (topic_id, user_id, vote_type) VALUES ($1, $2, $3)",
        [topicId, userId, voteType]
      );
    }
    const votesResult = await pool.query(
      "SELECT COALESCE(SUM(vote_type), 0) as total_votes FROM topic_votes WHERE topic_id = $1",
      [topicId]
    );
    await pool.query(
      "UPDATE forum_topics SET votes = $2 WHERE id = $1",
      [topicId, votesResult.rows[0].total_votes]
    );
    await pool.query("COMMIT");
    return {
      success: true,
      currentVotes: parseInt(votesResult.rows[0].total_votes)
    };
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error handling topic vote:", error);
    throw new Error("Failed to process vote");
  }
}
const createPost = async (topicId, postData) => {
  return { ...postData, createdAt: /* @__PURE__ */ new Date() };
};
export {
  createPost as c,
  getTopic as g,
  handleTopicVote as h
};
//# sourceMappingURL=topicService.js.map
