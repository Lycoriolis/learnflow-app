import type { PageLoad } from './$types.js';
import { loadContent } from '$lib/services/contentService.js';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
    try {
        // First try to load the markdown content
        const contentItem = await loadContent('course', params.courseId);
        
        if (contentItem) {
            // Return the content item with the markdown content
            return {
                course: {
                    ...contentItem,
                    // Add any additional properties needed for the UI
                    category: contentItem.tags?.[0] || 'General',
                    modules: [
                        { 
                            id: 'module-1', 
                            title: 'Main Content', 
                            lessons: [
                                { id: 'lesson-1', title: contentItem.title }
                            ] 
                        }
                    ]
                }
            };
        }
        
        // If no markdown content, fall back to the mock data
        const mockCourse = await getMockCourseData(params.courseId);
        
        if (mockCourse) {
            return { course: mockCourse };
        }
        
        // If neither markdown nor mock data exists, throw a 404 error
        throw error(404, 'Course not found');
    } catch (err) {
        console.error('Error loading course:', err);
        throw error(500, 'Failed to load course content');
    }
};

// Mock course data - Replace with actual data fetching
const getMockCourseData = async (courseId: string) => {
    console.log(`Fetching mock data for course: ${courseId}`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 50)); 

    // Example course structure
    if (courseId === 'math-algebra-basics') {
        return {
            id: 'math-algebra-basics',
            title: 'Algebra Basics',
            description: 'Master the fundamentals of algebra, including variables, equations, inequalities, and functions. This course provides a solid foundation for further mathematical studies.',
            category: 'Mathematics',
            imageUrl: '/images/algebra-banner.jpg', // Placeholder image path
            modules: [
                { id: 'mod-1', title: 'Introduction to Variables', lessons: [{ id: 'l1-1', title: 'What is a Variable?' }, { id: 'l1-2', title: 'Expressions with Variables' }] },
                { id: 'mod-2', title: 'Solving Linear Equations', lessons: [{ id: 'l2-1', title: 'One-Step Equations' }, { id: 'l2-2', title: 'Two-Step Equations' }, { id: 'l2-3', title: 'Equations with Variables on Both Sides' }] },
                { id: 'mod-3', title: 'Inequalities', lessons: [{ id: 'l3-1', title: 'Graphing Inequalities' }, { id: 'l3-2', title: 'Solving Linear Inequalities' }] },
                { id: 'mod-4', title: 'Introduction to Functions', lessons: [{ id: 'l4-1', title: 'What is a Function?' }, { id: 'l4-2', title: 'Function Notation' }] }
            ]
        };
    }
    // Add more mock courses or handle not found cases
    return null; // Course not found
}; 