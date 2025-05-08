import { getAllTopics, getAllCategories } from '$lib/services/forumService';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const [topics, categories] = await Promise.all([
      getAllTopics(),
      getAllCategories()
    ]);
    return {
      topics,
      categories
    };
  } catch (error) {
    console.error('Error loading forum data:', error);
    return {
      topics: [],
      categories: [],
      error: 'Failed to load forum data'
    };
  }
};