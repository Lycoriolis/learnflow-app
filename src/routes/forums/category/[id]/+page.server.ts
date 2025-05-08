import type { PageServerLoad } from './$types';
import { getAllTopics, getAllCategories } from '$lib/services/forumService';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const categories = await getAllCategories();
  const allTopics = await getAllTopics();
  const topics = allTopics.filter(t => t.category === params.id || t.category_id === params.id);
  if (!categories.find(c => c.id === params.id)) {
    throw error(404, 'Category not found');
  }
  return { topics, categories, selectedCategory: params.id };
};