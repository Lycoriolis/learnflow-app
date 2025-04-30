import type { RequestHandler } from '@sveltejs/kit';
import { getRecommendations } from '$lib/services/recommendationService';

export const GET: RequestHandler = async ({ url, locals }) => {
  // Get user ID from the decoded token
  const userId = locals.user?.uid;
  
  if (!userId) {
    console.error('Unauthorized attempt to access recommendations API');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  try {
    console.log(`Getting recommendations for user: ${userId}, limit: ${limit}`);
    const recommendations = await getRecommendations(userId, limit);
    return new Response(JSON.stringify({ recommendations }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Recommendation error:', err);
    return new Response(JSON.stringify({ error: 'Failed to compute recommendations' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};