// @ts-nocheck
import { getSuggestedContentItems } from '$lib/server/contentService';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit'; // Import error helper

export const load = async (event: Parameters<PageServerLoad>[0]) => {
    const { parent } = event;
    // Get parent data with a proper fallback in case userProfile is missing
    const parentData = await parent();
    const userProfile = parentData.userProfile || null;

    // Ensure data can be accessed safely even if userProfile is undefined
    const enrolledCourseIds = userProfile?.preferences?.enrollments?.map((e: any) => e.id) || [];
    // Assuming similar structure for exercise progress/enrollment if applicable
    // If not, adjust accordingly or pass an empty array
    const completedExerciseIds = userProfile?.progress?.exercises?.map((ex: any) => ex.id) || []; // Example structure

    try {
        // Fetch suggested courses and exercises using the new service function
        const [suggestedCourses, suggestedExercises] = await Promise.all([
            getSuggestedContentItems('courses', 'course', enrolledCourseIds),
            getSuggestedContentItems('exercises', 'exercise', completedExerciseIds) // Use relevant IDs for exercises
        ]);

        return {
            suggestedCourses,
            suggestedExercises,
            userProfile // Pass userProfile through for the client component
        };
    } catch (err: any) {
        console.error("Error loading dashboard data:", err);

        // Re-throw SvelteKit errors or throw a generic 500
        if (err.status) {
            throw err; // Re-throw the error caught from contentService
        }
        // Throw a generic 500 error for other unexpected issues
        error(500, 'Failed to load dashboard data. Please try again later.');

        // SvelteKit's error function halts execution, but for type safety:
        // return { suggestedCourses: [], suggestedExercises: [] };
    }
};
