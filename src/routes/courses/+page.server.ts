import type { PageServerLoad } from './$types';
import { getAllCourses, getCourseCategories } from '$lib/server/contentService';

export const load: PageServerLoad = async () => {
    try {
        const categories = await getCourseCategories();
        // Fetch a sample of courses or featured ones for the overview page
        const courses = (await getAllCourses()).slice(0, 10); // Example: show first 10

        return {
            categories,
            courses
        };
    } catch (error) {
        console.error('Error loading courses overview page data:', error);
        return {
            categories: [],
            courses: [],
            error: 'Failed to load course categories or courses.'
        };
    }
};