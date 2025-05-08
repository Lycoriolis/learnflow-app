import type { RequestHandler } from '@sveltejs/kit';
import { getAllTopics, createTopic, updateTopic, deleteTopic, getTopic } from '$lib/services/forumService';

export const GET: RequestHandler = async ({ url }) => {
  const categoryId = url.searchParams.get('category_id');
  let topics;

  try {
    topics = await getAllTopics();
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
  const { title, category_id, author_id, content } = await request.json();

  if (!title || !category_id || !author_id || !content) {
    const missing = [];
    if (!title) missing.push('title');
    if (!category_id) missing.push('category_id');
    if (!author_id) missing.push('author_id');
    if (!content) missing.push('content');
    return new Response(`Missing required fields: ${missing.join(', ')}`, { status: 400 });
  }

  try {
    const newTopic = await createTopic({ title, category_id, author_id, content });
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
    if (!topic) {
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
    const result = await deleteTopic(id);
    if (!result) {
      return new Response('Topic not found', { status: 404 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error deleting topic:', error);
    return new Response('Failed to delete topic', { status: 500 });
  }
};