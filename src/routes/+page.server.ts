import type { PageServerLoad } from './$types';
import { getFeaturedOrSuggestedContent } from '$lib/server/contentService';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const userId = locals.user?.uid;
        // Use the new unified function
        const content = await getFeaturedOrSuggestedContent(userId);

        return {
            // Adapt the return structure to what the page expects
            // Assuming the page expects suggestedContent.featuredExercises and suggestedContent.featuredCourses
            suggestedContent: content, 
        };
    } catch (error) {
        console.error('Error loading dashboard data in /+page.server.ts:', error);
        return {
            suggestedContent: {
                featuredExercises: [],
                featuredCourses: [], // Ensure this is also initialized if expected
            },
            error: 'Failed to load dashboard content. Please try again later.'
        };
    }
};
