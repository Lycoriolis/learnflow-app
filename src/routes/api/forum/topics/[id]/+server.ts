import type { RequestHandler } from '@sveltejs/kit';
import { updateTopic, deleteTopic } from '$lib/services/forumService';

export const PUT: RequestHandler = async ({ request, params }) => {
  const topicId = params.id;
  const data = await request.json();

  if (!topicId) {
    return new Response(JSON.stringify({ message: 'Topic ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const updatedTopic = await updateTopic(topicId, {
      title: data.title,
      content: data.content,
      category_id: data.category_id,
      is_pinned: data.is_pinned,
      is_locked: data.is_locked
    });
    
    if (!updatedTopic) {
      return new Response(JSON.stringify({ message: 'Topic not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(updatedTopic), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating topic:', error);
    return new Response(JSON.stringify({ message: 'Failed to update topic' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  const topicId = params.id;

  if (!topicId) {
    return new Response(JSON.stringify({ message: 'Topic ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const success = await deleteTopic(topicId);
    
    if (!success) {
      return new Response(JSON.stringify({ message: 'Topic not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ message: 'Topic deleted successfully' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting topic:', error);
    return new Response(JSON.stringify({ message: 'Failed to delete topic' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};