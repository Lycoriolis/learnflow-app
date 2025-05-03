// @ts-nocheck
import { getTopics, getCategories } from '$lib/services/forums/forumService';
import type { PageServerLoad } from './$types';

export const load = async () => {
  try {
    const [topics, categories] = await Promise.all([
      getTopics(),
      getCategories()
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
};;null as any as PageServerLoad;