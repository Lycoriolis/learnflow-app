import type { PageServerLoad } from './$types';
import { 
    getCourseCategories, 
    getCourseById,
    getLessonsForCourse,
    COURSES_BASE_PATH
} from '$lib/server/contentService';
import { error } from '@sveltejs/kit';
import path from 'path';

async function getCoursesByCategorySlug(categorySlug: string): Promise<any[]> {
    console.warn(`[courses/[slug]/+page.server.ts] getCoursesByCategorySlug for '${categorySlug}' not fully implemented. Returning empty array.`);
    return []; 
}

export const load: PageServerLoad = async ({ params }) => {
    const slug = params.slug;
    console.log(`[courses/[slug]/+page.server.ts] Loading for slug: ${slug}`);

    const currentItem = await getCourseById(slug); 

    if (!currentItem) {
        console.error(`[courses/[slug]/+page.server.ts] No item found for slug: ${slug} by getCourseById.`);
        throw error(404, `Content not found for overview or category '${slug}'`);
    }
    console.log(`[courses/[slug]/+page.server.ts] Found item for slug '${slug}':`, currentItem.title, `contentType: ${currentItem.contentType}`);

    // Case 1: The item is a theme overview (e.g., maths_index)
    if (currentItem.contentType === 'theme_overview') {
        console.log(`[courses/[slug]/+page.server.ts] Item '${slug}' is a theme_overview. Processing children.`);
        let childCourses: any[] = [];
        if (currentItem.children && Array.isArray(currentItem.children) && currentItem.childContentType === 'course_overview') {
            console.log(`[courses/[slug]/+page.server.ts] Found ${currentItem.children.length} children defined in frontmatter for theme '${slug}'.`);
            for (const childInfo of currentItem.children) {
                if (childInfo.id) {
                    console.log(`[courses/[slug]/+page.server.ts] Fetching child course overview with id: ${childInfo.id}`);
                    const courseData = await getCourseById(childInfo.id); 
                    if (courseData) {
                        console.log(`[courses/[slug]/+page.server.ts] Successfully fetched child: ${courseData.title} (id: ${childInfo.id})`);
                        childCourses.push({
                            ...courseData, 
                            title: childInfo.title || courseData.title, 
                            description: childInfo.description || courseData.description,
                        });
                    } else {
                        console.warn(`[courses/[slug]/+page.server.ts] Child course overview with id: ${childInfo.id} NOT FOUND by getCourseById.`);
                    }
                } else {
                    console.warn(`[courses/[slug]/+page.server.ts] Child info in theme '${slug}' is missing an ID:`, childInfo);
                }
            }
        } else {
            console.log(`[courses/[slug]/+page.server.ts] No 'children' array or incorrect childContentType for theme '${slug}'. childContentType: ${currentItem.childContentType}`);
        }
        
        childCourses.sort((a, b) => (a.order || 0) - (b.order || 0) || (a.title || '').localeCompare(b.title || ''));
        console.log(`[courses/[slug]/+page.server.ts] Prepared ${childCourses.length} child courses for theme '${slug}'.`);

        return {
            type: 'theme_overview', 
            overviewData: currentItem, 
            courses: childCourses, 
        };
    } 
    // Case 2: The item is a course overview (e.g., mpsi-maths_index)
    else if (currentItem.contentType === 'course_overview') {
        console.log(`[courses/[slug]/+page.server.ts] Item '${slug}' is a course_overview. Processing lessons.`);
        let lessons: any[] = [];
        let coursePathRelativeToCoursesBase = ''; // This will be like "maths/mpsi-maths"

        if (currentItem.filePath) {
            // filePath is absolute: /home/linux/learnflow-app/learnflow-app/static/content/courses/maths/mpsi-maths/_index.mdx
            // COURSES_BASE_PATH is /home/linux/learnflow-app/learnflow-app/static/content/courses
            const fullDirPath = path.dirname(currentItem.filePath);
            if (fullDirPath.startsWith(COURSES_BASE_PATH)) {
                coursePathRelativeToCoursesBase = fullDirPath.substring(COURSES_BASE_PATH.length + 1); // +1 for the path separator
                // Normalize path separators for consistency if needed, though path.join later should handle it
                coursePathRelativeToCoursesBase = coursePathRelativeToCoursesBase.replace(/\\/g, '/');
            } else {
                 console.error(`[courses/[slug]/+page.server.ts] Course overview filePath ${currentItem.filePath} is not under COURSES_BASE_PATH ${COURSES_BASE_PATH}`);
            }
        } else {
            // Fallback if filePath is not available, this is less reliable
            // We might need to infer from slug or ID structure if possible
            console.warn(`[courses/[slug]/+page.server.ts] Course overview '${slug}' is missing filePath. Cannot reliably determine lesson directory.`);
            // Attempt to use slug if it represents the directory structure, e.g. "maths/mpsi-maths"
            // This part is tricky and depends on how `slug` is formed for such items.
            // For an ID like "mpsi-maths_index", we need to know its theme parent.
            // This information might need to be part of currentItem or passed differently.
            // For now, we rely on filePath.
        }
        
        if (coursePathRelativeToCoursesBase) {
            console.log(`[courses/[slug]/+page.server.ts] Determined course path for lessons: '${coursePathRelativeToCoursesBase}'`);
            lessons = await getLessonsForCourse(coursePathRelativeToCoursesBase, currentItem); // Pass full relative path
        } else if (currentItem.children && currentItem.children.length > 0 && currentItem.contentType === 'course_overview') {
            // If filePath method failed but we have explicit children, try with slug as context
            // This assumes children IDs are relative to a dir named like the slug, which might be wrong for nested.
            console.warn(`[courses/[slug]/+page.server.ts] Using slug '${slug}' as directory context for lessons due to missing filePath info. This might be incorrect for nested courses.`);
            lessons = await getLessonsForCourse(slug, currentItem);
        }

        return {
            type: 'course_overview', 
            courseData: currentItem,
            lessons: lessons 
        };
    } 
    // Case 3: It might be a simple category listing
    else {
        const categories = await getCourseCategories();
        const currentCategoryInfo = categories.find(cat => cat.id.toLowerCase() === slug.toLowerCase());

        if (currentCategoryInfo) {
            const coursesInCategory = await getCoursesByCategorySlug(currentCategoryInfo.id); 
            return {
                type: 'category',
                categoryDetails: currentCategoryInfo,
                courses: coursesInCategory, 
                allCategories: categories
            };
        } else {
            throw error(404, `Content not found for course or category '${slug}'`);
        }
    }
};
