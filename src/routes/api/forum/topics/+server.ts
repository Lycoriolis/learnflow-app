import type { RequestHandler } from '@sveltejs/kit';
import { getTopics, createForumTopic, updateTopic, deleteTopic } from '$lib/services/forums/forumService';

export const GET: RequestHandler = async ({ url }) => {
  const categoryId = url.searchParams.get('categoryId');
  let topics;

  try {
    topics = await getTopics();
    if (categoryId) {
      topics = topics.filter(t => t.category_id === categoryId);
    }
    return new Response(JSON.stringify(topics), { status: 200 });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return new Response('Failed to fetch topics', { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  const { title, categoryId, authorId, content } = await request.json();

  if (!title || !categoryId || !authorId || !content) {
    const missing = [];
    if (!title) missing.push('title');
    if (!categoryId) missing.push('category_id');
    if (!authorId) missing.push('author_id');
    if (!content) missing.push('content');
    return new Response(`Missing required fields: ${missing.join(', ')}`, { status: 400 });
  }

  try {
    const newTopic = await createForumTopic({ 
      title,
      category_id: categoryId,
      author_id: authorId, // Still need this for the type, but service will override with auth info
      views: 0,
      post_count: 0
    });
    return new Response(JSON.stringify(newTopic), { status: 201 });
  } catch (error) {
    console.error('Error creating topic:', error);
    return new Response('Failed to create topic', { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request }) => {
  const { id, ...data } = await request.json();

  if (!id) {
    return new Response('Topic ID is required', { status: 400 });
  }

  try {
    const topic = await updateTopic(id, data);
    // Explicitly check for null since updateTopic returns null when topic isn't found
    if (topic === null) {
      return new Response('Topic not found', { status: 404 });
    }
    return new Response(JSON.stringify(topic), { status: 200 });
  } catch (error) {
    console.error('Error updating topic:', error);
    return new Response('Failed to update topic', { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response('Topic ID is required', { status: 400 });
  }

  try {
    await deleteTopic(id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error deleting topic:', error);
    return new Response('Failed to delete topic', { status: 500 });
  }
};