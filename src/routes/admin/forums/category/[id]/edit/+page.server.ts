import type { PageServerLoad } from './$types';
import { getCategory } from '$lib/services/forumService';

export const load: PageServerLoad = async ({ params }) => {
  const category = await getCategory(params.id);
  return { category };
};