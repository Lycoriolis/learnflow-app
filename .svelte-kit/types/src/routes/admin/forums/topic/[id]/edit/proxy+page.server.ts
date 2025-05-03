// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getCategories, getTopic } from '$lib/services/forums/forumService';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
  const categories = await getCategories();
  const topic = await getTopic(params.id);
  return { topic, categories };
};