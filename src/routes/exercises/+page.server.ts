import type { PageServerLoad } from './$types';
import { ExerciseContentService } from '$lib/services/exercises/exerciseContentService';

export const load: PageServerLoad = async ({ url }) => {
    const exerciseService = ExerciseContentService.getInstance();
    
    try {
        // Get query parameters for filtering
        const searchQuery = url.searchParams.get('search') || '';
        const difficulty = url.searchParams.get('difficulty') || 'all';
        const category = url.searchParams.get('category') || 'all';
        const sortBy = url.searchParams.get('sortBy') || 'title';
        const sortOrder = (url.searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';
        const tags = url.searchParams.get('tags')?.split(',').filter(Boolean) || [];

        // Get categories for the main page
        const categories = await exerciseService.getExerciseCategories();
        
        // Get exercise statistics
        const stats = await exerciseService.getExerciseStats();
        
        // Get available filter options
        const availableTags = await exerciseService.getAvailableTags();
        const availableCategories = await exerciseService.getAvailableCategories();

        // Process categories for display
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
            categories: processedCategories,
            stats,
            availableTags,
            availableCategories,
            filters: {
                searchQuery,
                difficulty,
                category,
                sortBy,
                sortOrder,
                tags
            }
        };
    } catch (error) {
        console.error('Error loading exercises overview page data:', error);
        return {
            categories: [],
            stats: {
                totalExercises: 0,
                totalCategories: 0,
                difficultyBreakdown: {},
                tagBreakdown: {},
                categoryBreakdown: {}
            },
            availableTags: [],
            availableCategories: [],
            filters: {
                searchQuery: '',
                difficulty: 'all',
                category: 'all',
                sortBy: 'title',
                sortOrder: 'asc' as const,
                tags: []
            },
            error: 'Failed to load exercise categories.'
        };
    }
};