import type { PageServerLoad } from './$types.js';
import { error } from '@sveltejs/kit';
// Use the unified content service function
import { getContentNodeByIdentifier } from '$lib/server/contentService';

export const load: PageServerLoad = async (event) => {
  const { params } = event; // Removed fetch
  const identifier = params.slug; // Use identifier instead of slug

  try {
    // Directly use the service to get the node. It handles finding by path/id and loading content.
    const node = await getContentNodeByIdentifier('courses', identifier);

    // Service throws 404 if not found, so explicit check might be redundant.
    // if (!node) {
    //   throw error(404, 'Content not found');
    // }

    // Determine if it's a category/container or a content page
    const containerTypes = ['category', 'root', 'course-category', 'topic'];
    const isCategory = containerTypes.includes(node.type);

    if (isCategory) {
      // For categories/containers, return the node and its children
      return {
          node: node,
          isCategory: true,
          items: node.children || [] // Pass children if available
      };
    } else {
      // For content pages (course, lesson, module), return node and content
      const content = (node as any).markdownContent || '';
      const contentLoadingError = (node as any).contentLoadingError;

      if (contentLoadingError) {
          console.warn(`Content loading error for ${identifier}: ${contentLoadingError}`);
          // Content will contain the error message loaded by the service
      }

      return {
          node: node,
          content: content,
          isCategory: false
      };
    }

  } catch (err: any) {
    // Re-throw SvelteKit errors (like 404/500 from the service)
    if (err.status) {
      throw err;
    }
    // Log unexpected errors and throw a generic 500
    console.error(`Error loading content for identifier ${identifier}:`, err);
    throw error(500, `Error loading content: ${err.message || 'Internal Server Error'}`);
  }
};