// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getContentListByCategory } from '$lib/server/contentService';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
  const { slug } = params;
  const items = await getContentListByCategory('courses', slug);
  return { items, slug };
};