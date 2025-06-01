import type { PageServerLoad } from './$types';
import { getAllCourses } from '$lib/server/contentService'; // Removed getCourseCategories as themes are primary now

export const load: PageServerLoad = async () => {
    try {
        const allContentNodes = await getAllCourses(); // This fetches all _index.mdx files

        // Filter for top-level themes.
        // Themes are expected to be directly under 'courses', e.g., 'courses/maths/_index.mdx'
        // Their contentPath would be '/courses/maths'
        const themes = allContentNodes.filter(node => {
            return node.contentType === 'theme_overview' && node.contentPath?.startsWith('/courses/') && node.contentPath.split('/').length === 3;
        });

        // Sort themes by order, then by title
        themes.sort((a, b) => {
            const orderA = typeof a.order === 'number' ? a.order : Infinity;
            const orderB = typeof b.order === 'number' ? b.order : Infinity;
            if (orderA !== orderB) {
                return orderA - orderB;
            }
            return (a.title || '').localeCompare(b.title || '');
        });

        return {
            themes // Pass the filtered and sorted themes to the page
        };
    } catch (error) {
        console.error('Error loading themes for courses overview page:', error);
        return {
            themes: [],
            error: 'Failed to load themes.'
        };
    }
};