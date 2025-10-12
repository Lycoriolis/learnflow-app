import type { PageServerLoad } from './$types';
import { getAllCourses, getCourseCategories } from '$lib/server/contentService';

export const load: PageServerLoad = async () => {
    try {
        const categories = await getCourseCategories();
        const allCourses = await getAllCourses();
        const courses = allCourses.filter((course) => course.itemType === 'course');

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