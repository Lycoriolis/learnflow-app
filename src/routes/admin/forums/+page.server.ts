import type { PageServerLoad } from './$types';
import { getTopics, getCategories } from '$lib/services/forums/forumService';

export const load: PageServerLoad = async () => {
  const topics = await getTopics();
  const categories = await getCategories();
  return { topics, categories };
};