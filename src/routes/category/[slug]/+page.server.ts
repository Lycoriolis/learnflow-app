import type { PageServerLoad } from './$types';
import { getContentListByCategory } from '$lib/server/contentService';

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;
  const items = await getContentListByCategory('courses', slug);
  return { items, slug };
};