import type { PageLoad } from './$types';

// Mock course data - Replace with actual data fetching
const getCourseData = async (courseId: string) => {
    console.log(`Fetching data for course: ${courseId}`);
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

export const load: PageLoad = async ({ params }) => {
    const course = await getCourseData(params.courseId);

    if (!course) {
        // In a real app, you might redirect to a 404 page or show an error
        // For now, we'll return an error status and message
        return {
            status: 404,
            error: new Error('Course not found')
        };
    }

    return {
        course
    };
}; 