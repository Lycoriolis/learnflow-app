// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getAllTopics, getAllCategories } from '$lib/services/forumService';

export const load = async () => {
  const topics = await getAllTopics();
  const categories = await getAllCategories();
  return { topics, categories };
};;null as any as PageServerLoad;