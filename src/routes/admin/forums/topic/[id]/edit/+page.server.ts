import type { PageServerLoad } from './$types';
import { getAllCategories, getTopic } from '$lib/services/forumService';

export const load: PageServerLoad = async ({ params }) => {
  const categories = await getAllCategories();
  const topic = await getTopic(params.id);
  return { topic, categories };
};