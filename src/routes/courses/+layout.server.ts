import type { LayoutServerLoad } from './$types';
import { getContentNodeByPath, getLessonsForCourse, ServerContentNode } from '$lib/server/contentService';
import path from 'path';

export const load: LayoutServerLoad = async ({ params, url }) => {
    // params.slug is the captured part from `[...slug]`.
    // e.g., if URL is /courses/maths/algebra/intro, params.slug is "maths/algebra/intro"
    const slug = params.slug;

    let currentCourseOverview: ServerContentNode | null = null;
    let siblingLessons: ServerContentNode[] = [];
    let currentLessonId: string | null = null;
    let parentTheme: ServerContentNode | null = null;
    let breadcrumbPathNodes: ServerContentNode[] = []; // For storing nodes used in breadcrumbs

    if (!slug) {
        // This case should ideally not be hit if all dynamic course routes are under [...slug]
        // and this layout is specific to those.
        // If on /courses root, this layout server load might not even run or slug would be undefined.
        return {
            currentCourseOverview: null,
            siblingLessons: [],
            currentLessonId: null,
            currentPathSlug: slug,
            parentTheme: null,
            breadcrumbPathNodes: []
        };
    }

    const slugParts = slug.split('/');
    const fullContentPath = `/courses/${slug}`;

    // Try to load the current node itself to determine its type
    const currentNode = await getContentNodeByPath('courses', fullContentPath);

    if (currentNode) {
        breadcrumbPathNodes.push(currentNode); // Add current node to breadcrumbs path

        if (currentNode.contentType && currentNode.contentType.startsWith('lesson_')) {
            // Current page is a lesson. Need to find its parent course.
            if (slugParts.length >= 2) {
                const coursePath = `/courses/${slugParts.slice(0, -1).join('/')}`;
                currentCourseOverview = await getContentNodeByPath('courses', coursePath);
                currentLessonId = currentNode.id; // or slugParts[slugParts.length - 1];
            }
        } else if (currentNode.contentType === 'course_overview') {
            // Current page is a course overview.
            currentCourseOverview = currentNode;
        }
        // If it's a theme_overview, currentCourseOverview remains null, sidebar won't show lessons.
    }
    
    if (currentCourseOverview && currentCourseOverview.contentType === 'course_overview') {
        // Fetch lessons for the current course
        // getLessonsForCourse expects parentNodeData to have .filePath and .children
        // currentCourseOverview from getContentNodeByPath should have these.
        siblingLessons = await getLessonsForCourse(currentCourseOverview.contentPath, currentCourseOverview);

        // Try to get the parent theme for breadcrumbs
        if (slugParts.length > 1) {
            const themePath = `/courses/${slugParts[0]}`;
            parentTheme = await getContentNodeByPath('courses', themePath);
            if (parentTheme) breadcrumbPathNodes.unshift(parentTheme);
        }
    } else if (currentNode?.contentType === 'theme_overview') {
        parentTheme = currentNode; // The theme itself is the main "parent" here for breadcrumb start
    }


    // console.log(`[courses/+layout.server.ts] Slug: ${slug}, Current Course: ${currentCourseOverview?.title}, Lessons: ${siblingLessons.length}, Current Lesson: ${currentLessonId}, Theme: ${parentTheme?.title}`);

    return {
        currentCourseOverview, // Course whose lessons are in sidebar (null if on theme page)
        siblingLessons,        // Lessons for the sidebar
        currentLessonId,       // ID of the active lesson (null if on course/theme overview)
        currentPathSlug: slug, // The dynamic part of the path (e.g., "maths/algebra/intro")
        parentTheme,           // Parent theme of the current course/lesson
        breadcrumbPathNodes,   // Nodes for breadcrumbs, might be incomplete, needs JS processing too
        currentContentNode: currentNode // Pass the current node for breadcrumb construction
    };
};
