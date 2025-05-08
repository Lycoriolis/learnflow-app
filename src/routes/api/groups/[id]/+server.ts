import type { RequestHandler } from '@sveltejs/kit';
import { getGroupById } from '$lib/services/groupService';

export const GET: RequestHandler = async ({ params }) => {
  const groupId = params.id;
  if (!groupId) {
    return new Response(JSON.stringify({ error: 'Missing group id' }), { status: 400 });
  }

  try {
    const result = await getGroupById(groupId);
    if (!result) {
      return new Response(JSON.stringify({ error: 'Group not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Failed to fetch group' }), { status: 500 });
  }
};
