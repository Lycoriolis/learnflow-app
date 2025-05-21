import type { PageServerLoad } from './$types';
import { getAllExercises, getExerciseCategories } from '$lib/server/contentService';

export const load: PageServerLoad = async () => {
    try {
        const categories = await getExerciseCategories();
        // Fetch a sample of exercises or featured ones for the overview page
        const exercises = (await getAllExercises()).slice(0, 10); // Example: show first 10

        return {
            categories,
            exercises 
        };
    } catch (error) {
        console.error('Error loading exercises overview page data:', error);
        return {
            categories: [],
            exercises: [],
            error: 'Failed to load exercise categories or exercises.'
        };
    }
};