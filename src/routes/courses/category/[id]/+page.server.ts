import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getCourseCategories, getAllCourses } from '$lib/server/contentService';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const { id } = params;
        
        if (!id) {
            throw error(400, 'Category ID is required');
        }
        
        const [categories, allCourses] = await Promise.all([
            getCourseCategories(),
            getAllCourses()
        ]);

        // Find the specific category
        const category = categories.find(cat => cat.id === id);
        if (!category) {
            throw error(404, `Category "${id}" not found`);
        }

        // Get courses for this category
        const coursesInCategory = allCourses.filter(course => 
            course.category === id || 
            course.tags?.includes(id) ||
            course.filePath?.includes(id)
        );

        // Calculate category stats
        const totalLessons = coursesInCategory.reduce((sum, course) => 
            sum + (course.lessonCount || 0), 0
        );

        const difficulties = coursesInCategory
            .map(course => course.difficulty)
            .filter(Boolean);
        
        const averageDifficulty = difficulties.length > 0 
            ? difficulties.sort((a, b) => 
                ['beginner', 'intermediate', 'advanced'].indexOf(a || '') - 
                ['beginner', 'intermediate', 'advanced'].indexOf(b || '')
            )[Math.floor(difficulties.length / 2)]
            : null;

        // Get related categories (categories with similar tags or themes)
        const relatedCategories = categories
            .filter(cat => cat.id !== id)
            .map(cat => ({
                ...cat,
                courseCount: allCourses.filter(course => 
                    course.category === cat.id || 
                    course.tags?.includes(cat.id)
                ).length
            }))
            .filter(cat => cat.courseCount > 0)
            .slice(0, 8); // Limit to 8 related categories

        return {
            category: {
                ...category,
                courseCount: coursesInCategory.length
            },
            courses: coursesInCategory.sort((a, b) => {
                // Sort by order if available, then by title
                const orderA = a.order || 999;
                const orderB = b.order || 999;
                if (orderA !== orderB) return orderA - orderB;
                return (a.title || '').localeCompare(b.title || '');
            }),
            totalLessons,
            averageDifficulty,
            relatedCategories
        };
    } catch (err) {
        console.error('Error loading category page:', err);
        
        if (err instanceof Error && 'status' in err) {
            throw err; // Re-throw SvelteKit errors
        }
        
        throw error(500, 'Failed to load category data');
    }
};
