import type { PageServerLoad } from './$types';
import { 
    getNodeByContentPath, 
    getChildNodesList, 
    getExerciseByContentPath 
} from '$lib/server/contentService';

export const load: PageServerLoad = async ({ params }) => {
    const contentPath = params.contentPath; // e.g., "maths/mpsi-maths" or "maths/mpsi-maths/calculs-algebriques"
    
    if (!contentPath) {
        throw new Error('Content path is required');
    }

    // Construct the full content path
    const fullContentPath = `/exercises/${contentPath}`;

    try {
        // First, try to fetch as an individual exercise
        let exercise = null;
        try {
            exercise = await getExerciseByContentPath(fullContentPath);
        } catch (error) {
            // Not an individual exercise, continue
        }

        if (exercise) {
            // This is an individual exercise page
            // Map rawMdxContent to content for Svelte component
            const exerciseWithContent = {
                ...exercise,
                content: exercise.rawMdxContent
            };
            
            return {
                type: 'exercise',
                exercise: exerciseWithContent,
                breadcrumbs: generateBreadcrumbs(contentPath)
            };
        }

        // Try to fetch as a category/overview node (_index.mdx)
        const categoryNode = await getNodeByContentPath('exercises', fullContentPath);
        if (!categoryNode) {
            throw new Error(`Content not found for path: ${fullContentPath}`);
        }

        // Map rawMdxContent to content for Svelte component
        const categoryNodeWithContent = {
            ...categoryNode,
            content: categoryNode.rawMdxContent
        };

        // Fetch child items for this category
        const items = await getChildNodesList('exercises', fullContentPath);

        return {
            type: 'category',
            categoryNode: categoryNodeWithContent,
            items,
            breadcrumbs: generateBreadcrumbs(contentPath)
        };

    } catch (error) {
        console.error(`Error loading content for path ${fullContentPath}:`, error);
        throw error;
    }
};

function generateBreadcrumbs(contentPath: string) {
    const segments = contentPath.split('/').filter(Boolean);
    const breadcrumbs = [
        { title: 'Exercises', href: '/exercises' }
    ];
    
    let currentPath = '';
    for (const segment of segments) {
        currentPath += `/${segment}`;
        breadcrumbs.push({
            title: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
            href: `/exercises${currentPath}`
        });
    }
    
    return breadcrumbs;
}
