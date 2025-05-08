import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getAllTopics, getAllCategories } from '$lib/services/forumService';

export const load: PageServerLoad = async ({ params }) => {
  const categories = await getAllCategories();
  const allTopics = await getAllTopics();
  const topics = allTopics.filter(t => t.tags?.includes(params.tag));
  if (!topics) {
    throw error(404, 'Tag not found or no topics');
  }
  return { topics, categories, selectedTag: params.tag };
};