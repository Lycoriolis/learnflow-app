import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getTopicById, getPostsByTopicId } from '$lib/services/forumService';

export const load: PageServerLoad = async ({ params }) => {
  const topic = await getTopicById(params.id);
  if (!topic) {
    throw error(404, 'Topic not found');
  }
  const posts = await getPostsByTopicId(params.id);
  return { topic, posts };
};