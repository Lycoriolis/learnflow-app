// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getCategory } from '$lib/services/forums/forumService';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
  const category = await getCategory(params.id);
  return { category };
};