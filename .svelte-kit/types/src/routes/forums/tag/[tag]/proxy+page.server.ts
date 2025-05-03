// @ts-nocheck
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getTopics, getCategories } from '$lib/services/forums/forumService';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
  const categories = await getCategories();
  const allTopics = await getTopics();
  const topics = allTopics.filter((topic) => topic.tags?.includes(params.tag));
  
  if (!topics || topics.length === 0) {
    throw error(404, 'Tag not found or no topics');
  }
  
  return { topics, categories, selectedTag: params.tag };
};