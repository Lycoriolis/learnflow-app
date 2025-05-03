import type { RequestHandler } from '@sveltejs/kit';
import { handleTopicVote } from '$lib/services/forums/topicService';

export const POST: RequestHandler = async ({ request, params }) => {
  const { user_id, vote_type } = await request.json();
  
  // Ensure we have all required parameters
  if (!params.id) {
    return new Response('Topic ID is required', { status: 400 });
  }
  
  if (!user_id || ![1, -1].includes(vote_type)) {
    return new Response('Invalid vote payload', { status: 400 });
  }

  try {
    const result = await handleTopicVote(params.id, user_id, vote_type as 1 | -1);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error('Error processing vote:', err);
    return new Response('Failed to record vote', { status: 500 });
  }
};