// @ts-nocheck
import type { PageServerLoad } from './$types.js';
import { error } from '@sveltejs/kit';
// Use the unified content service function
import { getContentNodeByIdentifier, getBreadcrumbs } from '$lib/server/contentService.js';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
  // The identifier comes from the route parameter
  const identifier = params.id;

  try {
    // Use the unified function to get the node. Content is loaded by the service.
    const node = await getContentNodeByIdentifier('exercises', identifier);

    // Service throws 404 if not found.

    // Determine if it's a category/container or a specific exercise
    const containerTypes = ['category', 'root', 'exercise-category', 'topic']; // Add relevant container types for exercises
    const isCategory = containerTypes.includes(node.type);

    // Fetch breadcrumbs for the current node
    const breadcrumbs = await getBreadcrumbs('exercises', identifier);

    if (isCategory) {
      // For categories/containers, return the node and its children
      return {
        node: node,
        isCategory: true,
        items: node.children || [], // Pass children if available
        breadcrumbs
      };
    } else if (node.type === 'exercise') {
      // For exercises, the service should have loaded markdownContent
      const content = (node as any).markdownContent || '';
      const contentLoadingError = (node as any).contentLoadingError;

      if (contentLoadingError) {
        console.warn(`Content loading error for exercise ${identifier}: ${contentLoadingError}`);
        // Content will contain the error message loaded by the service
      }

      return {
        node: node, // Renamed from exercise to node for consistency
        content: content,
        isCategory: false,
        breadcrumbs
      };
    } else {
      // Handle unexpected node types
      console.warn(`Unexpected content node type \"${node.type}\" for identifier: ${identifier}`);
      throw error(404, 'Content type not viewable');
    }

  } catch (err: any) {
    // Re-throw SvelteKit errors (like 404/500 from the service)
    if (err.status) {
      throw err;
    }

    // Log unexpected errors and throw a generic 500
    console.error(`Error loading exercise content for identifier ${identifier}:`, err);
    throw error(500, `Error loading exercise content: ${err.message || 'Internal Server Error'}`);
  }
};