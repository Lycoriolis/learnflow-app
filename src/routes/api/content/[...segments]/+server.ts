import { json, type RequestHandler } from '@sveltejs/kit';
import { 
    getNodeByContentPath, 
    getExerciseByContentPath 
} from '$lib/server/contentService'; // Adjust path if necessary, assuming $lib points to src/lib

// Assuming ContentNode type used by server functions is structurally compatible 
// with the client's ContentNode expectation. Ideally, import a shared ContentNode type.
// For example: import type { ContentNode } from '$lib/types/contentTypes';

export const GET: RequestHandler = async ({ params }) => {
    const segments = params.segments; // e.g., 'exercises/maths/mpsi-maths/calculs-algebriques'
    if (!segments) {
        return json({ error: 'Content path segments are required' }, { status: 400 });
    }
    
    // Construct the full path, ensuring it starts with a single slash
    const fullContentPath = `/${segments}`; 

    let contentType: 'courses' | 'exercises' | undefined;
    if (fullContentPath.startsWith('/exercises/')) {
        contentType = 'exercises';
    } else if (fullContentPath.startsWith('/courses/')) {
        contentType = 'courses';
    }

    if (!contentType) {
        return json({ error: 'Invalid content path. Path must start with /courses/ or /exercises/.' }, { status: 400 });
    }

    let node: any | null = null; // Replace 'any' with 'ContentNode' if a shared type is imported

    try {
        // Attempt to fetch as a specific content item (e.g., an exercise)
        // getExerciseByContentPath is specific to exercises based on its current implementation.
        if (contentType === 'exercises') {
            node = await getExerciseByContentPath(fullContentPath);
        }
        // Note: If specific course lessons (non-index files) need to be fetched, 
        // a corresponding server function (e.g., getCourseLessonByContentPath) and logic here would be needed.

        // If not found as a specific item, try fetching as a category/overview node (_index.mdx)
        if (!node) {
            // getNodeByContentPath expects the directory path, which fullContentPath should represent
            // for _index.mdx scenarios (e.g., /exercises/maths/mpsi-maths or /courses/main-course)
            node = await getNodeByContentPath(contentType, fullContentPath);
        }

        if (node) {
            return json(node);
        } else {
            return json({ error: `Content not found for path: ${fullContentPath}` }, { status: 404 });
        }
    } catch (error: any) {
        console.error(`[API /api/content] Error fetching content for path ${fullContentPath}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
        return json({ error: 'Server error while fetching content.', details: errorMessage }, { status: 500 });
    }
};
