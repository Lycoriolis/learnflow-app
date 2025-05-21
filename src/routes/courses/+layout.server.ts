import type { LayoutServerLoad } from './$types';
import { getCourseById, getLessonsForCourse } from '$lib/server/contentService';
import path from 'path';

export const load: LayoutServerLoad = async ({ params, route }) => {
    // params.slug will be either:
    // - "courseOrThemeSlug" (from /courses/[slug])
    // - "courseDir/subDir/lessonSlug" (from /courses/[...slug])
    
    let currentCourseId: string | null = null;
    let currentCourseOverview: any | null = null;
    let siblingLessons: any[] = [];
    let currentLessonId: string | null = null;

    const slugParts = params.slug?.split('/') || [];

    if (route.id === '/courses/[slug]') {
        // This is an overview page (theme or course)
        currentCourseId = params.slug || null; // The slug itself is the ID of the overview
        currentCourseOverview = await getCourseById(currentCourseId);
        if (currentCourseOverview?.contentType === 'course_overview') {
            // If it's a course overview, its lessons are its siblings for this context
            const courseDirName = currentCourseOverview.filePath ? path.basename(path.dirname(currentCourseOverview.filePath)) : currentCourseId.replace(/_index$/, '');
            siblingLessons = await getLessonsForCourse(courseDirName, currentCourseOverview);
        }
    } else if (route.id === '/courses/[...slug]') {
        // This is a lesson page or a deeply nested overview page
        if (slugParts.length > 0) {
            // Assume the first part is the theme, second is the course directory
            // e.g., maths/mpsi-maths/lesson-name
            // We need to determine the ID of the parent course overview
            let courseDirName = '';
            if (slugParts.length >= 2) { // e.g. maths/mpsi-maths
                courseDirName = slugParts[1]; // mpsi-maths
                const courseOverviewId = `${courseDirName}_index`; // Standard ID for _index.mdx
                currentCourseOverview = await getCourseById(courseOverviewId);
                if (currentCourseOverview) {
                    currentCourseId = currentCourseOverview.id;
                    siblingLessons = await getLessonsForCourse(courseDirName, currentCourseOverview);
                } else {
                     // Fallback if _index.mdx doesn't follow pattern, try custom ID if courseDirName is the ID
                     currentCourseOverview = await getCourseById(courseDirName);
                     if (currentCourseOverview && currentCourseOverview.contentType === 'course_overview') {
                        currentCourseId = currentCourseOverview.id;
                        // If it's a single file course overview, its "directory" might be its own ID
                        const dirContext = currentCourseOverview.filePath ? path.basename(path.dirname(currentCourseOverview.filePath)) : courseDirName;
                        siblingLessons = await getLessonsForCourse(dirContext, currentCourseOverview);
                     }
                }
            }
            if (slugParts.length > 2) { // It's likely a lesson
                currentLessonId = slugParts[slugParts.length -1];
            }
        }
    }
    
    // console.log('[courses/+layout.server.ts] Data:', { currentCourseId, currentCourseOverviewTitle: currentCourseOverview?.title, numSiblingLessons: siblingLessons.length, currentLessonId });

    return {
        currentCourseId,
        currentCourseOverview, // Contains title, etc. of the course
        siblingLessons,        // List of all lessons in the current course
        currentLessonId,       // ID of the currently viewed lesson, if applicable
        currentPathSlug: params.slug // The full slug from the URL
    };
};
