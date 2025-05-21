import type { PageServerLoad } from './$types';
import { 
    getExerciseCategories, 
    getExercisesByCategory, // Note: This function might need to accept the category slug
    getExerciseById 
} from '$lib/server/contentService';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const slug = params.slug;

    // 1. Check if the slug matches a known category ID (slug)
    const categories = await getExerciseCategories();
    // Ensure category.id is the slug used in URLs
    const currentCategoryInfo = categories.find(cat => cat.id.toLowerCase() === slug.toLowerCase());

    if (currentCategoryInfo) {
        // Slug is a category
        // getExercisesByCategory should accept the category ID/slug
        const exercisesInCategory = await getExercisesByCategory(currentCategoryInfo.id); 
        return {
            type: 'category',
            categoryDetails: currentCategoryInfo,
            exercises: exercisesInCategory,
            allCategories: categories // For navigation or breadcrumbs
        };
    } else {
        // 2. Slug is not a category, assume it's an exercise ID
        const exercise = await getExerciseById(slug);
        if (exercise) {
            return {
                type: 'exercise',
                exerciseData: exercise
            };
        } else {
            // 3. Slug is neither a known category nor a known exercise ID
            throw error(404, `Content not found for '${slug}'`);
        }
    }
};
