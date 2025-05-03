import type { PageServerLoad } from './$types';
import { getCategory } from '$lib/services/forums/forumService';

export const load: PageServerLoad = async ({ params }) => {
  const category = await getCategory(params.id);
  return { category };
};