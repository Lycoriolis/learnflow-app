import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
// Use the unified content service
import { getContentListByCategory, getBreadcrumbs } from '$lib/server/contentService';

export const load: PageServerLoad = async ({ url }) => {
  // Use an empty string for the root category identifier
  const categoryIdentifier = url.searchParams.get('category') || '';

  try {
    // Fetch the list of items (top-level categories/exercises or children of a category)
    const items = await getContentListByCategory('exercises', categoryIdentifier);

    // Fetch breadcrumbs for the current category view
    const breadcrumbs = await getBreadcrumbs('exercises', categoryIdentifier);

    return {
      items, // Renamed from exercises to items for consistency
      breadcrumbs,
      currentCategory: categoryIdentifier
    };
  } catch (err: any) {
    // Re-throw SvelteKit errors (like 404/500 from the service)
    if (err.status) {
      throw err;
    }

    // Log unexpected errors and throw a generic 500
    console.error(`Error loading exercises page for category "${categoryIdentifier}":`, err);
    error(500, `Failed to load exercises data. An unexpected error occurred.`);
  }
};