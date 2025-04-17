import { error } from '@sveltejs/kit';
import { getTopicById } from '$lib/services/forumService';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const topicId = params.id;
  
  // Fetch the topic using the service
  const topic = await getTopicById(topicId);

  if (!topic) {
    // If the service returns null (topic not found), throw a 404 error
    throw error(404, 'Topic not found');
  }

  // Return the fetched topic data
  return {
    topic
  };
}