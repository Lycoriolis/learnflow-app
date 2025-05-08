import type { PageServerLoad } from './$types';
import { getAllTopics, getAllCategories } from '$lib/services/forumService';

export const load: PageServerLoad = async () => {
  const topics = await getAllTopics();
  const categories = await getAllCategories();
  return { topics, categories };
};