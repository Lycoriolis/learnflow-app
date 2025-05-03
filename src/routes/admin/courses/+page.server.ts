import type { PageServerLoad } from './$types';
// Update import path and function name
import { getAllContentItemsByType } from '$lib/server/contentService';

export const load: PageServerLoad = async () => {
  // Retrieve course metadata for admin using the new function
  const courses = await getAllContentItemsByType('courses', 'course');
  return { courses };
};