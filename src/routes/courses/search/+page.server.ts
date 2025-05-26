import type { PageServerLoad } from './$types';
import { getAllCourses, getCourseCategories } from '$lib/server/contentService';

export const load: PageServerLoad = async ({ url }) => {
    try {
        const [categories, allCourses] = await Promise.all([
            getCourseCategories(),
            getAllCourses()
        ]);

        // Get search query from URL if present
        const searchQuery = url.searchParams.get('q') || '';

        return {
            categories,
            allCourses,
            searchQuery
        };
    } catch (error) {
        console.error('Error loading search page data:', error);
        return {
            categories: [],
            allCourses: [],
            searchQuery: '',
            error: 'Failed to load search data.'
        };
    }
};
