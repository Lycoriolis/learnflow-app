import type { PageServerLoad } from './$types';
import { getChildNodesList } from '$lib/server/contentService';

export const load: PageServerLoad = async () => {
    try {
        // Get top-level exercise categories from the root exercises directory
        const categories = await getChildNodesList('exercises', '/exercises');
        
        // For the main exercises page, we'll show the top-level categories
        // Each category should be an _index.mdx file representing a subject area
        const processedCategories = categories.map(category => {
            // Extract the relative path for routing
            let relativePath = '';
            if (category.contentPath) {
                relativePath = category.contentPath.replace(/^\/exercises\/?/, '');
            }
            
            return {
                ...category,
                href: relativePath ? `/exercises/${relativePath}` : '/exercises',
                relativePath
            };
        });

        return {
            categories: processedCategories
        };
    } catch (error) {
        console.error('Error loading exercises overview page data:', error);
        return {
            categories: [],
            error: 'Failed to load exercise categories.'
        };
    }
};