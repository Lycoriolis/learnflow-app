// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getTopics, getCategories } from '$lib/services/forums/forumService';
import { error } from '@sveltejs/kit';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
  const categories = await getCategories();
  const allTopics = await getTopics();
  const topics = allTopics.filter(t => t.category_id === params.id);
  
  if (!categories.find(c => c.id === params.id)) {
    throw error(404, 'Category not found');
  }
  return { topics, categories, selectedCategory: params.id };
};