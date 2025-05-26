import type { PageServerLoad } from './$types';
import { 
    getNodeByContentPath, 
    getChildNodesList, 
    getExerciseByContentPath 
} from '$lib/server/contentService';
import { ExerciseContentService } from '$lib/services/exercises/exerciseContentService';

export const load: PageServerLoad = async ({ params, url }) => {
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

            // Get related exercises
            const relatedExercises = await getRelatedExercises(exercise);
            
            return {
                type: 'exercise',
                exercise: exerciseWithContent,
                relatedExercises,
                breadcrumbs: generateBreadcrumbs(contentPath),
                analytics: {
                    viewTime: Date.now(),
                    contentPath: fullContentPath
                }
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

        // Get category statistics
        const statistics = await getCategoryStatistics(items);
        
        return {
            type: 'category',
            categoryNode: categoryNodeWithContent,
            items,
            statistics,
            breadcrumbs: generateBreadcrumbs(contentPath),
            analytics: {
                viewTime: Date.now(),
                contentPath: fullContentPath
            }
        };

    } catch (error) {
        console.error(`Error loading content for path ${fullContentPath}:`, error);
        throw error;
    }
};

async function getRelatedExercises(exercise: any): Promise<any[]> {
    try {
        const exerciseService = new ExerciseContentService();
        const allExercises = await exerciseService.getAllExercises('exercises');
        
        // Find related exercises based on tags, category, and difficulty
        const related = allExercises
            .filter(ex => 
                ex.href !== exercise.href && // Not the same exercise
                (
                    // Same category
                    ex.category === exercise.category ||
                    // Similar difficulty
                    ex.difficulty === exercise.difficulty ||
                    // Overlapping tags
                    (exercise.tags && ex.tags && 
                     exercise.tags.some((tag: string) => ex.tags?.includes(tag)))
                )
            )
            .slice(0, 4); // Limit to 4 related exercises
            
        return related;
    } catch (error) {
        console.error('Error getting related exercises:', error);
        return [];
    }
}

async function getCategoryStatistics(items: any[]): Promise<any> {
    if (!items || items.length === 0) {
        return {
            totalExercises: 0,
            difficultyDistribution: {},
            estimatedDuration: 0
        };
    }

    const exercises = items.filter(item => item.type === 'exercise');
    const totalExercises = exercises.length;
    
    // Calculate difficulty distribution
    const difficultyDistribution = exercises.reduce((acc: any, exercise: any) => {
        const difficulty = exercise.difficulty || 'Unknown';
        acc[difficulty] = (acc[difficulty] || 0) + 1;
        return acc;
    }, {});

    // Estimate total duration (simple heuristic)
    const estimatedDuration = exercises.reduce((total: number, exercise: any) => {
        if (exercise.duration) {
            const match = exercise.duration.match(/(\d+)/);
            if (match) {
                return total + parseInt(match[1], 10);
            }
        }
        return total + 15; // Default 15 minutes per exercise
    }, 0);

    return {
        totalExercises,
        difficultyDistribution,
        estimatedDuration
    };
}

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
