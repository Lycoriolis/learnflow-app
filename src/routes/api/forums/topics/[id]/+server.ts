import { json } from '@sveltejs/kit';
import { getTopic, updateTopic, deleteTopic } from '$lib/services/forums/forumService';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const topicId = params.id;
  if (!topicId) {
    return json({ error: 'Topic ID is required' }, { status: 400 });
  }
  
  const topic = await getTopic(topicId);
  if (!topic) {
    return json({ error: 'Topic not found' }, { status: 404 });
  }
  
  return json(topic);
};

export const PUT: RequestHandler = async ({ params, request }) => {
  const topicId = params.id;
  if (!topicId) {
    return json({ error: 'Topic ID is required' }, { status: 400 });
  }
  
  const data = await request.json();
  try {
    await updateTopic(topicId, data);
    return json({ success: true });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  const topicId = params.id;
  if (!topicId) {
    return json({ error: 'Topic ID is required' }, { status: 400 });
  }
  
  try {
    await deleteTopic(topicId);
    return json({ success: true });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};
