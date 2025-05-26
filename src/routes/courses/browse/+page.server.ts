import type { PageServerLoad } from './$types';
import { getAllCourses, getCourseCategories } from '$lib/server/contentService';

export const load: PageServerLoad = async () => {
    try {
        const [categories, allCourses] = await Promise.all([
            getCourseCategories(),
            getAllCourses()
        ]);

        // Build a hierarchical tree structure for browsing
        const contentTree = categories.map(category => {
            const categoryChildren = allCourses.filter(course => 
                course.category === category.id || 
                course.tags?.includes(category.id) ||
                course.filePath?.includes(category.id)
            );

            return {
                id: category.id,
                title: category.title,
                description: category.description,
                contentType: 'category',
                children: categoryChildren.sort((a, b) => {
                    // Sort by order if available, then by title
                    const orderA = a.order || 999;
                    const orderB = b.order || 999;
                    if (orderA !== orderB) return orderA - orderB;
                    return (a.title || '').localeCompare(b.title || '');
                })
            };
        });

        // Add uncategorized courses
        const categorizedCourseIds = new Set(
            contentTree.flatMap(category => 
                (category.children || []).map(course => course.id)
            )
        );
        
        const uncategorizedCourses = allCourses.filter(course => 
            !categorizedCourseIds.has(course.id)
        );

        if (uncategorizedCourses.length > 0) {
            contentTree.push({
                id: 'uncategorized',
                title: 'Other Courses',
                description: 'Courses not assigned to a specific category',
                contentType: 'category',
                children: uncategorizedCourses
            });
        }

        return {
            contentTree,
            totalCourses: allCourses.length,
            totalCategories: categories.length
        };
    } catch (error) {
        console.error('Error loading course browser data:', error);
        return {
            contentTree: [],
            totalCourses: 0,
            totalCategories: 0,
            error: 'Failed to load course browser data.'
        };
    }
};
