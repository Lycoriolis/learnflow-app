import type { PageServerLoad } from './$types';
// Ensure this path is correct and the function is properly exported from contentService
import { getSuggestedContentItems } from '$lib/server/contentService';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        const userId = locals.user?.id; 
        // The error "TypeError: (0 , __vite_ssr_import_0__.getSuggestedContentItems) is not a function"
        // suggests an issue with how getSuggestedContentItems is being resolved.
        // Let's ensure the call is direct and the import is solid.
        const suggestedContent = await getSuggestedContentItems(userId);

        return {
            suggestedContent,
        };
    } catch (error) {
        console.error('Error loading dashboard data in /+page.server.ts:', error);
        return {
            suggestedContent: {
                featuredExercises: [],
            },
            error: 'Failed to load dashboard content. Please try again later.'
        };
    }
};
