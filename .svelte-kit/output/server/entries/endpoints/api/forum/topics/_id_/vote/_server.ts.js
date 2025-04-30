import { l as handleTopicVote } from "../../../../../../../chunks/forumService.js";
const POST = async ({ request, params }) => {
  const { user_id, vote_type } = await request.json();
  if (!user_id || ![1, -1].includes(vote_type)) {
    return new Response("Invalid vote payload", { status: 400 });
  }
  try {
    const result = await handleTopicVote(params.id, user_id, vote_type);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error("Error processing vote:", err);
    return new Response("Failed to record vote", { status: 500 });
  }
};
export {
  POST
};
