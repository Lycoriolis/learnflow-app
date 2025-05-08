import type { PageServerLoad } from './$types';
import { listContent } from '$lib/services/contentService';

export const load: PageServerLoad = async () => {
  // Retrieve course metadata for admin
  const courses = await listContent('course');
  return { courses };
};