import type { PageLoad } from './$types';
import { loadContent } from '$lib/services/contentService.js';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
  const course = await loadContent('course', params.courseId);
  if (!course) throw error(404, 'Course not found');
  return { course };
};