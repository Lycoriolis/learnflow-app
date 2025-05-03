import type { PageServerLoad } from './$types';
import { getCategories, getTopic } from '$lib/services/forums/forumService';

export const load: PageServerLoad = async ({ params }) => {
  const categories = await getCategories();
  const topic = await getTopic(params.id);
  return { topic, categories };
};