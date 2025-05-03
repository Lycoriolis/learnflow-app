// @ts-nocheck
import { error } from '@sveltejs/kit';
// Updated import to use the new server-side service
import { getContentNodeByPath, getBreadcrumbs } from '$lib/server/contentService';
import type { PageServerLoad } from './$types';

export const load = async ({ url }: Parameters<PageServerLoad>[0]) => {
  const path = url.searchParams.get('path') || ''; // Default to root path if not specified

  try {
    // Use the new service function for courses
    const node = await getContentNodeByPath('courses', path);

    if (!node) {
      // Keep SvelteKit's error helper for 404
      error(404, `Course content not found for path: ${path || '/'}`);
    }

    // Use the new service function for breadcrumbs
    const breadcrumbs = await getBreadcrumbs('courses', path);

    // Return data structure remains similar, but sourced from the new service
    return {
      node, // This can be the root node structure or a specific item node
      breadcrumbs,
      currentPath: path
    };
  } catch (err: any) {
     // Catch potential errors from getContentNodeByPath or getBreadcrumbs
     // Including SvelteKit errors thrown by the service itself
     if (err.status) {
       throw err; // Re-throw SvelteKit errors (like 404 or 500 from the service)
     }

     // Log unexpected errors
     console.error(`Unexpected error loading courses page for path "${path}":`, err);
     // Throw a generic 500 for other server-side issues
     error(500, `Failed to load course data. An unexpected error occurred.`);
  }
};