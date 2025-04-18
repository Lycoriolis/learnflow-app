import type { RequestHandler } from '@sveltejs/kit';
import { getAllGroups, createGroup } from '$lib/services/groupService';

function getUserId(event: any): string | null {
  return event.locals?.user?.uid || null;
}

export const GET: RequestHandler = async (event) => {
  const userId = getUserId(event);
  try {
    const groups = await getAllGroups(userId);
    return new Response(JSON.stringify(groups), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response('Failed to fetch groups', { status: 500 });
  }
};

export const POST: RequestHandler = async (event) => {
  const userId = getUserId(event);
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { name, description, topic, image, is_public } = await event.request.json();
    if (!name || !description || !topic) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const group = await createGroup({
      name,
      description,
      topic,
      image,
      is_public,
      created_by: userId
    });

    return new Response(JSON.stringify(group), { status: 201 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Failed to create group' }), { status: 500 });
  }
};
