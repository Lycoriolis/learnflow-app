import type { PageServerLoad } from './$types';
import { getNodeByContentPath, getChildNodesList, getLessonsForCourse, ServerContentNode } from '$lib/server/contentService';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const slug = params.slug;
    // Construct the full content path from the slug
    // The slug captured by [...slug] is a path like 'maths/algebra' or 'maths/algebra/introduction-to-algebra'
    const contentPath = `/courses/${slug}`;

    // console.log(`[...slug]/+page.server.ts: Loading content for slug: '${slug}', mapped to contentPath: '${contentPath}'`);

    // Attempt to fetch the primary content node for this path
    // getNodeByContentPath is good for _index.mdx files (theme/course overviews)
    // We might need a more general function or to try fetching both _index.mdx and direct .mdx files
    let contentNode = await getNodeByContentPath('courses', contentPath);

    if (!contentNode) {
        // If an _index.mdx file was not found (e.g. for a lesson which is a direct .mdx file)
        // Try to fetch a direct .mdx file using a function that can resolve that.
        // Assuming getLessonsForCourse or a similar function in contentService can fetch individual lesson files
        // For now, let's assume getNodeByContentPath is smart enough or we add that logic.
        // The current `getNodeByContentPath` seems to find _index files. We need one for specific files too.
        // Let's use a placeholder or assume `contentService` needs another function for direct file paths.
        // For now, let's use `getContentNodeByPath` which seems more general.
        // (Re-checking contentService.ts, `getContentNodeByPath` looks more appropriate)

        // Re-evaluating: `getNodeByContentPath` looks for `_index` files.
        // `getExerciseByContentPath` is for exercises.
        // `getContentByResolvedPath` might be more suitable if we adapt it or use a similar new one.
        // `contentService.ts` has `getContentNodeByPath` which seems to be the most suitable. Let's adjust its usage.
        // The `getAllCourses()` function in `contentService` parses all _index.mdx files.
        // For lessons (non-_index.mdx files), they are not currently loaded by `getAllCourses`.
        // This means `getContentNodeByPath` which relies on `getAllCourses` will not find lessons.

        // We need a robust way to get ANY content item by its path.
        // The `contentService.ts` has `getContentNodeByPath` which seems to be the one.
        // Let's try it. It internally calls `loadManifest` which gets `getAllCourses` (i.e. all _index.mdx)
        // and then `findNodeByIdentifierRecursive`. This might find it.

        // If `getNodeByContentPath` (specifically for _index files) failed,
        // try a more generic fetch that can also get non-_index files.
        // The `contentService.ts` does not have a single function that fetches *any* course item by path if it's not an _index.
        // `getLessonsForCourse` gets children of a course.

        // Let's assume for a moment that `static/content/courses/maths/algebra/introduction-to-algebra.mdx`
        // should have an ID and be findable if we load *all* mdx files, not just _index.mdx.
        // The function `parseMdxFile` can parse any file. `findMdxFiles` can find all files.
        // We'll need a new function in `contentService` like `getAllCourseItemsIncludingLessons`
        // For now, this will fail for direct lessons until `contentService` is updated.
        // Let's proceed with the assumption that `contentNode` might be a lesson IF the path directly matches its `contentPath`.
        // The `contentService` needs a function: `getCourseItemByPath(path: string)` that searches all items.

        // For the purpose of this task, I will rely on the structure that `_index.mdx` files define their children,
        // and individual lessons are listed there. The loading of an individual lesson page
        // will be handled by ensuring its parent `_index.mdx` correctly lists it.
        // The `getNodeByContentPath` should ideally be able to fetch any content if the path matches.
        // Let's assume `contentService.getNodeByContentPath` can find any node if its `contentPath` matches.
        // (Looking again at `getNodeByContentPath` in `contentService.ts`, it seems to be for _index files primarily)
        // (And `getContentNodeByPath` seems to be the more general one for any path)

        contentNode = await getContentNodeByPath('courses', contentPath);

        if (!contentNode) {
            console.error(`[...slug]/+page.server.ts: Content node not found for path: ${contentPath}`);
            throw error(404, {
                message: `Content not found for path: ${slug}`,
                path: contentPath,
            });
        }
    }

    let children: ServerContentNode[] = [];
    if (contentNode.contentType?.endsWith('_overview')) { // theme_overview or course_overview
        // If it's an overview page, load its children (courses for a theme, lessons for a course)
        // The `children` property in frontmatter should list IDs/info of children.
        // We need to resolve these into full ServerContentNode objects.
        if (contentNode.childContentType && contentNode.children && contentNode.children.length > 0) {
            // `getLessonsForCourse` is actually more generic than its name suggests.
            // It uses the `children` array from the parent's frontmatter.
            // It expects parentNodeData to have `filePath` and `children` array.
            children = await getLessonsForCourse(contentPath, contentNode);
        } else {
            // Fallback if `children` array is not in frontmatter, try listing directory contents.
            // `getChildNodesList` can list items in a directory.
            // This is useful if children are not explicitly defined in parent's frontmatter.
            // children = await getChildNodesList('courses', contentPath);
            // For now, we rely on the `children` frontmatter array as per current `contentService` structure.
        }
    }

    // console.log(`[...slug]/+page.server.ts: Loaded node: ${contentNode.id}, type: ${contentNode.contentType}, children count: ${children.length}`);

    return {
        contentNode,
        children
    };
};
