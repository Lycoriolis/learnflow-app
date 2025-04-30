// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getAllCategories, getTopic } from '$lib/services/forumService';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
  const categories = await getAllCategories();
  const topic = await getTopic(params.id);
  return { topic, categories };
};