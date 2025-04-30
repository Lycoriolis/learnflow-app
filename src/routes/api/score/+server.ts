import type { RequestHandler } from '@sveltejs/kit';
import { calculateUserScore } from '$lib/services/scoreService';

export const GET: RequestHandler = async ({ locals }) => {
  // Get user ID from the decoded token
  const userId = locals.user?.uid;
  
  if (!userId) {
    console.error('Unauthorized attempt to access score API');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
  
  try {
    console.log(`Calculating score for user: ${userId}`);
    const score = await calculateUserScore(userId);
    return new Response(JSON.stringify({ score }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Score error:', err);
    return new Response(JSON.stringify({ error: 'Failed to compute score' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};