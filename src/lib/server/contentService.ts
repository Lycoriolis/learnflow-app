import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// --- Type Definitions ---
export interface FrontmatterChildNode {
    id: string;
    title?: string;
    description?: string;
    order?: number;
    [key: string]: any;
}

export interface ServerContentNode {
    id: string;
    title?: string;
    description?: string;
    order?: number;
    contentType?: string; // e.g., 'course_overview', 'lesson_module_overview', 'lesson_content'
    childContentType?: string;
    children?: FrontmatterChildNode[];
    tags?: string[];
    difficulty?: string;
    estimatedTime?: string;
    category?: string;
    categoryPath?: string; // Added to ensure it's part of the type
    featured?: boolean;
    rawMdxContent: string;
    filePath: string;
    contentPath: string; // URL-friendly path, e.g., /courses/math/algebra
    itemType: 'exercise' | 'course' | 'lesson' | 'module' | 'theme'; // Broader category
    [key: string]: any;
}

// --- Cache ---
interface Cache<T> {
    data: T | null;
    timestamp: number;
    expiry: number;
}

let exercisesCache: Cache<ServerContentNode[]> = { data: null, timestamp: 0, expiry: 300000 };
let exerciseCategoriesCache: Cache<any[]> = { data: null, timestamp: 0, expiry: 300000 };
let coursesCache: Cache<ServerContentNode[]> = { data: null, timestamp: 0, expiry: 300000 };
let courseCategoriesCache: Cache<any[]> = { data: null, timestamp: 0, expiry: 300000 };

const CONTENT_BASE_PATH = path.join(process.cwd(), 'static', 'content');
const EXERCISES_BASE_PATH = path.join(CONTENT_BASE_PATH, 'exercises');
export const COURSES_BASE_PATH = path.join(CONTENT_BASE_PATH, 'courses');

console.log(`[contentService] Initialized CONTENT_BASE_PATH: ${CONTENT_BASE_PATH}`);
console.log(`[contentService] Initialized EXERCISES_BASE_PATH: ${EXERCISES_BASE_PATH}`);
console.log(`[contentService] Initialized COURSES_BASE_PATH: ${COURSES_BASE_PATH}`);

// Generic helper to parse MDX file frontmatter
function parseMdxFile(filePath: string, typeHint: 'exercise' | 'course' | 'lesson' | 'module' | 'theme'): ServerContentNode | null {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content: rawMdxContent } = matter(fileContent);

        let itemId = data.id;
        const baseName = path.basename(filePath, '.mdx');
        if (!itemId) {
            if (baseName === '_index') {
                const parentDirName = path.basename(path.dirname(filePath));
                itemId = `${parentDirName}_index`;
            } else {
                itemId = baseName;
            }
        }

        let contentPathValue = '';
        const relativePathFromContentBase = path.relative(CONTENT_BASE_PATH, filePath);
        const fileNameWithoutExt = path.basename(filePath, '.mdx');

        if (fileNameWithoutExt === '_index') {
            contentPathValue = '/' + path.dirname(relativePathFromContentBase);
        } else {
            contentPathValue = '/' + relativePathFromContentBase.substring(0, relativePathFromContentBase.length - path.extname(relativePathFromContentBase).length);
        }
        contentPathValue = contentPathValue.replace(/\\/g, '/').replace(/\/\//g, '/');
        if (contentPathValue === '/.') contentPathValue = '/';

        let finalItemType: ServerContentNode['itemType'] = typeHint;

        if (data.contentType) {
            if (data.contentType === 'course_overview') finalItemType = 'course';
            else if (data.contentType === 'theme_overview') finalItemType = 'theme';
            else if (data.contentType === 'lesson_module_overview') finalItemType = 'module';
            else if (data.contentType.startsWith('lesson_')) finalItemType = 'lesson';
        }

        if (filePath.startsWith(EXERCISES_BASE_PATH)) {
            finalItemType = 'exercise';
        }

        // Calculate categoryPath
        let categoryPathValue = '';
        let pathSegmentForCategoryDerivation = '';

        if (contentPathValue.startsWith('/exercises/')) {
            pathSegmentForCategoryDerivation = contentPathValue.substring('/exercises/'.length);
        } else if (contentPathValue.startsWith('/courses/')) {
            pathSegmentForCategoryDerivation = contentPathValue.substring('/courses/'.length);
        }
        // For an item like 'maths/calculus/limits', its category is 'maths/calculus'.
        // For a category _index like 'maths/calculus' (contentPath), its category is 'maths'.
        categoryPathValue = path.dirname(pathSegmentForCategoryDerivation);
        if (categoryPathValue === '.' || categoryPathValue === '/') {
            categoryPathValue = '';
        }
        categoryPathValue = categoryPathValue.replace(/^\.\//, '').replace(/^\.$/, '');

        return {
            ...data,
            id: itemId,
            contentPath: contentPathValue,
            categoryPath: categoryPathValue, // Added categoryPath
            filePath: filePath,
            rawMdxContent: rawMdxContent,
            itemType: finalItemType,
        } as ServerContentNode;
    } catch (error) {
        console.error(`[contentService] Error parsing MDX file ${filePath}:`, error);
        return null;
    }
}

// Recursive function to find all .mdx files in a directory
function findMdxFiles(dir: string): string[] {
    console.log(`[contentService] findMdxFiles: Scanning directory: ${dir}`);
    let mdxFiles: string[] = [];
    try {
        if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
            console.warn(`[contentService] findMdxFiles: Directory not found or not a directory: ${dir}`);
            return mdxFiles;
        }

        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                mdxFiles = mdxFiles.concat(findMdxFiles(filePath));
            } else if (path.extname(file) === '.mdx') {
                mdxFiles.push(filePath);
            }
        }
    } catch (error) {
        console.error(`[contentService] findMdxFiles: Error processing directory ${dir}:`, error);
        return mdxFiles;
    }
    return mdxFiles;
}

// Helper function to find all _index.mdx files recursively
function findAllIndexFilesRecursive(dir: string): string[] {
    let indexFiles: string[] = [];
    try {
        if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
            return indexFiles;
        }

        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                indexFiles = indexFiles.concat(findAllIndexFilesRecursive(fullPath));
            } else if (entry.isFile() && entry.name === '_index.mdx') {
                indexFiles.push(fullPath);
            }
        }
    } catch (error) {
        console.error(`[contentService] findAllIndexFilesRecursive: Error processing directory ${dir}:`, error);
    }
    return indexFiles;
}

// --- Exercises ---
export type Exercise = ServerContentNode; // Exporting ServerContentNode as Exercise
export async function getAllExercises(): Promise<ServerContentNode[]> {
    const now = Date.now();
    if (exercisesCache.data && (now - exercisesCache.timestamp < exercisesCache.expiry)) {
        console.log('[contentService] getAllExercises: Returning from cache.');
        return exercisesCache.data;
    }
    console.log('[contentService] getAllExercises: Fetching fresh data.');

    let allExerciseFiles = findMdxFiles(EXERCISES_BASE_PATH);
    console.log(`[contentService] getAllExercises: Found ${allExerciseFiles?.length ?? 0} raw exercise files from ${EXERCISES_BASE_PATH}.`);

    if (!Array.isArray(allExerciseFiles)) {
        console.error(`[contentService] getAllExercises: findMdxFiles did not return an array for path: ${EXERCISES_BASE_PATH}. Received:`, allExerciseFiles, ". Defaulting to empty array.");
        allExerciseFiles = [];
    }

    const exercises: ServerContentNode[] = allExerciseFiles
        .map(filePath => parseMdxFile(filePath, 'exercise'))
        .filter((ex): ex is ServerContentNode => ex !== null);
    console.log(`[contentService] getAllExercises: Parsed ${exercises?.length ?? 0} exercises.`);

    exercisesCache = { data: exercises, timestamp: now, expiry: exercisesCache.expiry };
    return exercises;
}

export async function getExerciseById(id: string): Promise<ServerContentNode | null> {
    const exercises = await getAllExercises();
    return exercises.find(ex => ex.id === id) || null;
}

/**
 * Fetches a single exercise by its full content path.
 * @param targetContentPath The exact content path (e.g., '/exercises/maths/mpsi-maths/calculus-basics').
 * @returns A ServerContentNode or null if not found.
 */
export async function getExerciseByContentPath(targetContentPath: string): Promise<ServerContentNode | null> {
    console.log(`[contentService] getExerciseByContentPath: Seeking exercise with contentPath: '${targetContentPath}'`);
    const exercises = await getAllExercises();
    if (!Array.isArray(exercises) || exercises.length === 0) {
        console.warn(`[contentService] getExerciseByContentPath: No exercises available.`);
        return null;
    }

    const foundExercise = exercises.find(ex => ex.contentPath === targetContentPath && !ex.id.endsWith('_index'));

    if (foundExercise) {
        console.log(`[contentService] getExerciseByContentPath: Found exercise '${foundExercise.title || foundExercise.id}' for contentPath '${targetContentPath}'`);
        return foundExercise;
    } else {
        console.warn(`[contentService] getExerciseByContentPath: Exercise NOT FOUND with contentPath: '${targetContentPath}'`);
        return null;
    }
}

// Remove or refactor getExerciseBySlug if it's fully replaced by getExerciseByContentPath
// For now, let's keep it but log a deprecation warning if used, or adapt it to use contentPath logic.
export async function getExerciseBySlug(slug: string): Promise<ServerContentNode | null> {
    console.warn(`[contentService] getExerciseBySlug: This function is being deprecated. Use getExerciseByContentPath or getNodeByContentPath instead. Attempting to map slug '${slug}' to a contentPath.`);
    
    // Attempt to treat the slug as a relative content path (without /exercises/ prefix)
    const potentialContentPath = slug.startsWith('/') ? `/exercises${slug}` : `/exercises/${slug}`;
    
    let exercise = await getExerciseByContentPath(potentialContentPath);
    if (exercise) return exercise;

    // If not found, try finding it as a category node (if slug might represent an _index file)
    const categoryNode = await getNodeByContentPath('exercises', potentialContentPath);
    if (categoryNode) return categoryNode; 

    console.error(`[contentService] getExerciseBySlug: Could not resolve slug '${slug}' to a valid exercise or category node via contentPath '${potentialContentPath}'.`);
    return null;
}

export async function getExerciseCategories(): Promise<any[]> {
    const now = Date.now();
    if (exerciseCategoriesCache.data && (now - exerciseCategoriesCache.timestamp < exerciseCategoriesCache.expiry)) {
        return exerciseCategoriesCache.data;
    }
    console.log('[contentService] getExerciseCategories: Fetching fresh data.');

    const exercises = await getAllExercises();
    const categoryMap = new Map();

    if (Array.isArray(exercises)) {
        exercises.forEach(ex => {
            if (ex && ex.category) {
                const categorySlug = String(ex.category).toLowerCase().replace(/\s+/g, '-');
                if (!categoryMap.has(categorySlug)) {
                    categoryMap.set(categorySlug, {
                        id: categorySlug,
                        title: String(ex.category).charAt(0).toUpperCase() + String(ex.category).slice(1),
                        exerciseCount: 0,
                        path: `/exercises/${categorySlug}`
                    });
                }
                categoryMap.get(categorySlug).exerciseCount++;
            }
        });
    } else {
        console.error("getExerciseCategories: exercises is not an array", exercises);
    }

    const categories = Array.from(categoryMap.values());
    exerciseCategoriesCache = { data: categories, timestamp: now, expiry: exerciseCategoriesCache.expiry };
    return categories;
}

export async function getExercisesByCategory(categorySlug: string): Promise<ServerContentNode[]> {
    const allExercises = await getAllExercises();
    if (!categorySlug) {
        return allExercises; // Should ideally not happen if a category slug is expected
    }
    // This function assumes categorySlug matches the 'category' frontmatter field, 
    // or a segment of the categoryPath.
    // For path-based category listing, use getChildNodesList.
    return allExercises.filter(ex => {
        // Match against the 'category' frontmatter field (if it exists)
        if (ex.category && String(ex.category).toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase()) {
            return true;
        }
        // Match if the categorySlug is part of the exercise's categoryPath
        // e.g. categorySlug "maths", ex.categoryPath "maths/calculus"
        if (ex.categoryPath && ex.categoryPath.toLowerCase().startsWith(categorySlug.toLowerCase())) {
            // Ensure it's not an _index file of the categorySlug itself, but an item within or a sub-category.
            // This logic might be too broad here. getChildNodesList is more precise for directory children.
            return true; 
        }
        return false;
    });
}

// --- Courses ---
export async function getAllCourses(): Promise<ServerContentNode[]> {
    const now = Date.now();
    if (coursesCache.data && (now - coursesCache.timestamp < coursesCache.expiry)) {
        console.log('[contentService] getAllCourses: Returning from cache.');
        return coursesCache.data;
    }
    console.log('[contentService] getAllCourses: Fetching fresh data. Scanning COURSES_BASE_PATH:', COURSES_BASE_PATH);

    const courseIndexFiles = findAllIndexFilesRecursive(COURSES_BASE_PATH);
    console.log(`[contentService] getAllCourses: Found ${courseIndexFiles.length} _index.mdx files in course directories.`);

    const courses: ServerContentNode[] = courseIndexFiles
        .map(filePath => parseMdxFile(filePath, 'course'))
        .filter((course): course is ServerContentNode => course !== null);

    console.log(`[contentService] getAllCourses: Parsed ${courses.length} items from _index.mdx files.`);

    coursesCache = { data: courses, timestamp: now, expiry: coursesCache.expiry };
    if (courses.length > 0) {
        console.log(`[contentService] getAllCourses: Cached items IDs:`, courses.map(c => c.id));
    }
    return courses;
}

export async function getCourseById(id: string): Promise<ServerContentNode | null> {
    console.log(`[contentService] getCourseById: Attempting to find course with id: '${id}'`);
    const courses = await getAllCourses();
    if (!Array.isArray(courses) || courses.length === 0) {
        console.warn(`[contentService] getCourseById: No courses available from getAllCourses (cache might be empty or stale).`);
        return null;
    }
    const foundCourse = courses.find(course => course && course.id === id) || null;
    if (foundCourse) {
        console.log(`[contentService] getCourseById: Found course: '${foundCourse.title}' for id: '${id}'`);
    } else {
        console.warn(`[contentService] getCourseById: Course with id: '${id}' NOT FOUND in cached courses. Cached IDs:`, courses.map(c => c.id));
    }
    return foundCourse;
}

export async function getCourseCategories(): Promise<any[]> {
    const now = Date.now();
    if (courseCategoriesCache.data && (now - courseCategoriesCache.timestamp < courseCategoriesCache.expiry)) {
        return courseCategoriesCache.data;
    }
    console.log('[contentService] getCourseCategories: Fetching fresh data.');

    const courses = await getAllCourses();
    const categoryMap = new Map();

    if (Array.isArray(courses)) {
        courses.forEach(course => {
            const courseCategory = course?.category || (Array.isArray(course?.tags) && course.tags.length > 0 ? course.tags[0] : null);
            if (course && courseCategory) {
                const categorySlug = String(courseCategory).toLowerCase().replace(/\s+/g, '-');
                if (!categoryMap.has(categorySlug)) {
                    categoryMap.set(categorySlug, {
                        id: categorySlug,
                        title: String(courseCategory).charAt(0).toUpperCase() + String(courseCategory).slice(1),
                        courseCount: 0,
                        path: `/courses/${categorySlug}`
                    });
                }
                categoryMap.get(categorySlug).courseCount++;
            }
        });
    } else {
        console.error("getCourseCategories: courses is not an array", courses);
    }

    const categories = Array.from(categoryMap.values());
    courseCategoriesCache = { data: categories, timestamp: now, expiry: courseCategoriesCache.expiry };
    return categories;
}

export async function getLessonsForCourse(courseContentPath: string, parentNodeData: ServerContentNode): Promise<ServerContentNode[]> {
    console.log(`[contentService] getLessonsForCourse: Looking for children for node: ${parentNodeData.id} (path: ${courseContentPath}, filePath: ${parentNodeData.filePath})`);
    let lessons: ServerContentNode[] = [];

    if (parentNodeData && parentNodeData.children && Array.isArray(parentNodeData.children)) {
        console.log(`[contentService] Found explicit 'children' array in parent node ${parentNodeData.id}. Processing ${parentNodeData.children.length} children.`);
        
        const parentDirPath = path.dirname(parentNodeData.filePath);

        for (const childInfo of parentNodeData.children) {
            if (!childInfo.id) {
                console.warn(`[contentService] Child info in ${parentNodeData.id} is missing an ID:`, childInfo);
                continue;
            }
            
            let lessonFilePath;
            const isIndexChild = childInfo.id.endsWith('_index');
            const baseChildName = isIndexChild ? childInfo.id.replace('_index', '') : childInfo.id;

            lessonFilePath = path.join(parentDirPath, baseChildName, '_index.mdx');
            
            if (fs.existsSync(lessonFilePath)) {
                const lessonData = parseMdxFile(lessonFilePath, 'lesson'); 
                if (lessonData) {
                    lessons.push({
                        ...lessonData,
                        title: childInfo.title || lessonData.title, 
                        description: childInfo.description || lessonData.description,
                        order: childInfo.order !== undefined ? childInfo.order : lessonData.order,
                    } as ServerContentNode);
                } else {
                    console.warn(`[contentService] Failed to parse lesson/module file: ${lessonFilePath} for child ID ${childInfo.id} of parent ${parentNodeData.id}`);
                }
            } else {
                console.warn(`[contentService] Lesson/module file not found: ${lessonFilePath}. Child ID: ${childInfo.id} of parent ${parentNodeData.id}. Parent dir: ${parentDirPath}`);
            }
        }
    } else {
        console.log(`[contentService] No 'children' array in parent node ${parentNodeData.id} or it's empty. Assuming it's a leaf or children are not defined this way.`);
    }

    lessons.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
        }
        const titleA = a.title || a.id || '';
        const titleB = b.title || b.id || '';
        return titleA.localeCompare(titleB);
    });

    console.log(`[contentService] getLessonsForCourse: Parsed and sorted ${lessons.length} lessons/modules for parent ${parentNodeData.id}.`);
    return lessons;
}

// --- Dashboard and Suggested Content ---
export async function getFeaturedExercises(): Promise<ServerContentNode[]> {
    const exercises = await getAllExercises();
    return exercises.filter(ex => ex.featured === true);
}

// --- Generic Content Fetching ---
// Unified function to get either featured content (if no user) or suggested content (if user)
export async function getFeaturedOrSuggestedContent(userId?: string): Promise<{ featuredExercises: ServerContentNode[], featuredCourses: ServerContentNode[] }> {
    console.log(`[contentService] getFeaturedOrSuggestedContent: Called with userId: ${userId}`);
    const allExercises = await getAllExercises();
    const allCourses = await getAllCourses();

    let featuredExercises: ServerContentNode[] = [];
    let featuredCourses: ServerContentNode[] = [];

    if (userId) {
        // Placeholder for suggestion logic - for now, return a mix of featured and recent
        // This would be where you'd integrate with a recommendation engine or user history
        console.log(`[contentService] getFeaturedOrSuggestedContent: User ID provided (${userId}), fetching suggested content (currently placeholder).`);
        featuredExercises = allExercises.filter(ex => ex.featured).slice(0, 5); // Example: 5 featured exercises
        featuredCourses = allCourses.filter(course => course.featured).slice(0, 3); // Example: 3 featured courses

        // Add some non-featured ones to simulate variety for a "suggestion"
        const recentExercises = allExercises.filter(ex => !ex.featured).sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0)).slice(0, 3);
        featuredExercises.push(...recentExercises);
        const recentCourses = allCourses.filter(course => !course.featured).sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0)).slice(0, 2);
        featuredCourses.push(...recentCourses);

    } else {
        console.log('[contentService] getFeaturedOrSuggestedContent: No user ID, fetching general featured content.');
        featuredExercises = allExercises.filter(ex => ex.featured);
        featuredCourses = allCourses.filter(course => course.featured);
    }

    console.log(`[contentService] getFeaturedOrSuggestedContent: Returning ${featuredExercises.length} exercises and ${featuredCourses.length} courses.`);
    return { featuredExercises, featuredCourses };
}

export async function getSuggestedContentItems(userId?: string): Promise<ServerContentNode[]> {
    // This function is now effectively replaced by getFeaturedOrSuggestedContent for the dashboard.
    // It can be kept if used elsewhere or refactored/removed.
    // For now, let's make it return a mix of featured exercises and courses as a generic fallback.
    console.warn("[contentService] getSuggestedContentItems: This function is being phased out for dashboard use in favor of getFeaturedOrSuggestedContent. Consider updating calls.");
    const { featuredExercises, featuredCourses } = await getFeaturedOrSuggestedContent(userId);
    
    // Combine and limit for a generic "suggested" list
    const combinedContent = [...featuredExercises, ...featuredCourses];
    return combinedContent.sort(() => 0.5 - Math.random()).slice(0, 10); // Shuffle and take 10
}

export async function getContentByResolvedPath(resolvedSlug: string): Promise<ServerContentNode | null> {
    const filePath = path.join(CONTENT_BASE_PATH, `${resolvedSlug}.mdx`);
    let potentialFilePath = filePath;
    if (!fs.existsSync(potentialFilePath) && !potentialFilePath.endsWith('.mdx')) {
        potentialFilePath = `${potentialFilePath}.mdx`;
    }
    if (!fs.existsSync(potentialFilePath) && resolvedSlug.endsWith('/')) {
        potentialFilePath = path.join(CONTENT_BASE_PATH, resolvedSlug, `_index.mdx`);
    }
    if (!fs.existsSync(potentialFilePath)) {
        const dirPath = path.join(CONTENT_BASE_PATH, resolvedSlug);
        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
            potentialFilePath = path.join(dirPath, `_index.mdx`);
        }
    }

    console.log(`[contentService] getContentByResolvedPath: Attempting to load: ${potentialFilePath} for slug: ${resolvedSlug}`);

    if (fs.existsSync(potentialFilePath)) {
        let type: 'exercise' | 'course' | 'lesson' = 'lesson';
        if (potentialFilePath.includes('/courses/')) {
            type = path.basename(potentialFilePath) === '_index.mdx' ? 'course' : 'lesson';
        } else if (potentialFilePath.includes('/exercises/')) {
            type = path.basename(potentialFilePath) === '_index.mdx' ? 'course' : 'exercise';
        }
        return parseMdxFile(potentialFilePath, type);
    }
    console.warn(`[contentService] getContentByResolvedPath: File not found after checks: ${potentialFilePath} (original slug: ${resolvedSlug})`);
    return null;
}

// --- Content Manifest Utilities ---

function collectItemsByTypeRecursive(items: ServerContentNode[], targetType: string): ServerContentNode[] {
    let collected: ServerContentNode[] = [];
    if (!items) return collected;
    for (const item of items) {
        if (item.contentType === targetType || item.itemType === targetType) {
            collected.push(item);
        }
    }
    return collected;
}

function findNodeByIdentifierRecursive(items: ServerContentNode[], identifier: string): ServerContentNode | null {
    if (!items) return null;
    for (const item of items) {
        if (item.id === identifier || item.slug === identifier || item.contentPath === identifier) {
            return item;
        }
        if (item.contentPath && item.contentPath.endsWith('/' + identifier)) {
            return item;
        }
    }
    return null;
}

async function loadManifest(contentType: 'courses' | 'exercises'): Promise<ServerContentNode[]> {
    if (contentType === 'courses') {
        return await getAllCourses();
    } else if (contentType === 'exercises') {
        return await getAllExercises();
    } else {
        throw new Error(`Unknown contentType for manifest: ${contentType}`);
    }
}

export async function getAllContentItemsByType(contentType: 'courses' | 'exercises', _itemType: string): Promise<ServerContentNode[]> { // itemType seems unused, marked with _
    let allItems: ServerContentNode[] = [];
    if (contentType === 'courses') {
        const courses = await getAllCourses();
        allItems = [...courses];
        for (const course of courses) {
            if (course.contentPath) {
                let coursePathRel = course.contentPath.startsWith('/courses/') ? course.contentPath.substring('/courses/'.length) : course.contentPath;
                coursePathRel = coursePathRel.replace(/^\//, '');

                const lessons = await getLessonsForCourse(coursePathRel, course);
                allItems = allItems.concat(lessons);
                for (const lesson of lessons) {
                    if (lesson.contentType && (lesson.contentType.endsWith('_overview') || lesson.contentType.endsWith('_index')) && lesson.contentPath) {
                        let lessonPathRel = lesson.contentPath.startsWith('/courses/') ? lesson.contentPath.substring('/courses/'.length) : lesson.contentPath;
                        lessonPathRel = lessonPathRel.replace(/^\//, '');
                        const subLessons = await getLessonsForCourse(lessonPathRel, lesson);
                        allItems = allItems.concat(subLessons);
                    }
                }
            }
        }
    } else if (contentType === 'exercises') {
        allItems = await getAllExercises();
    }

    return collectItemsByTypeRecursive(allItems, _itemType);
}

export async function getContentNodeByPath(contentType: 'courses' | 'exercises', identifier: string): Promise<ServerContentNode | null> {
    const manifest = await loadManifest(contentType);

    if (!identifier || identifier === '' || identifier === '/' || identifier === `/${contentType}`) {
        const rootChildren = manifest
            .filter(m => {
                if (!m.contentPath) return false;
                const relativePath = m.contentPath.startsWith(`/${contentType}/`)
                    ? m.contentPath.substring(`/${contentType}/`.length + 1)
                    : m.contentPath;
                return relativePath.split('/').length === 1 && relativePath !== "";
            })
            .map(m => ({ id: m.id, title: m.title, description: m.description, order: m.order } as FrontmatterChildNode));

        return {
            id: `${contentType}_root`,
            title: contentType.charAt(0).toUpperCase() + contentType.slice(1),
            itemType: contentType === 'courses' ? 'theme' : 'exercise',
            contentType: 'root_overview',
            contentPath: `/${contentType}`,
            filePath: '',
            rawMdxContent: '',
            children: rootChildren,
            description: `Top level overview for ${contentType}.`
        } as ServerContentNode;
    }

    let normalizedIdentifier = identifier.replace(/^\/+/, '').replace(/\/+$/, '');
    if (contentType === 'courses' && !normalizedIdentifier.startsWith('courses/')) {
    }

    const searchNormalized = '/' + normalizedIdentifier;

    let foundNode = findNodeByIdentifierRecursive(manifest, searchNormalized);
    if (foundNode) return foundNode;

    if (contentType === 'courses') {
        if (!identifier.includes('/')) {
            const nodeById = manifest.find(item => item.id === identifier);
            if (nodeById) return nodeById;
        }

        const pathWithinCourses = `/courses/${normalizedIdentifier.startsWith('courses/') ? normalizedIdentifier.substring('courses/'.length) : normalizedIdentifier}`;
        foundNode = findNodeByIdentifierRecursive(manifest, pathWithinCourses.replace(/\/\//g, '/'));
        if (foundNode) return foundNode;
    }

    if (contentType === 'courses') {
        for (const course of manifest) {
            if (course.children && course.children.length > 0) {
                let coursePathRel = course.contentPath;
                const lessons = await getLessonsForCourse(coursePathRel, course);
                foundNode = findNodeByIdentifierRecursive(lessons, searchNormalized);
                if (foundNode) return foundNode;
                if (!identifier.includes('/')) {
                    foundNode = lessons.find(l => l.id === identifier) || null;
                    if (foundNode) return foundNode;
                }

                for (const lesson of lessons) {
                    if (lesson.children && lesson.children.length > 0) {
                        let lessonPathRel = lesson.contentPath;
                        const subLessons = await getLessonsForCourse(lessonPathRel, lesson);
                        foundNode = findNodeByIdentifierRecursive(subLessons, searchNormalized);
                        if (foundNode) return foundNode;
                        if (!identifier.includes('/')) {
                            foundNode = subLessons.find(sl => sl.id === identifier) || null;
                            if (foundNode) return foundNode;
                        }
                    }
                }
            }
        }
    }
    if (!foundNode) {
        console.warn(`[contentService] getContentNodeByPath: Node not found for contentType '${contentType}' and identifier '${identifier}' (searched as '${searchNormalized}' and path within courses).`);
    }
    return foundNode || null;
}

export async function getContentListByCategory(contentType: 'courses' | 'exercises', categoryIdentifier: string): Promise<ServerContentNode[]> {
    let normalizedCategoryIdentifier = categoryIdentifier;
    if (contentType === 'courses' && !categoryIdentifier.startsWith('/courses/') && categoryIdentifier !== '/courses') {
        if (categoryIdentifier === '/') {
            normalizedCategoryIdentifier = '/courses';
        } else {
             normalizedCategoryIdentifier = categoryIdentifier.startsWith('/') ? `/courses${categoryIdentifier}` : `/courses/${categoryIdentifier}`;
             normalizedCategoryIdentifier = normalizedCategoryIdentifier.replace(/\/\//g, '/');
        }
    } else if (contentType === 'exercises' && !categoryIdentifier.startsWith('/exercises/') && categoryIdentifier !== '/exercises') {
         if (categoryIdentifier === '/') {
            normalizedCategoryIdentifier = '/exercises';
        } else {
            normalizedCategoryIdentifier = categoryIdentifier.startsWith('/') ? `/exercises${categoryIdentifier}` : `/exercises/${categoryIdentifier}`;
            normalizedCategoryIdentifier = normalizedCategoryIdentifier.replace(/\/\//g, '/');
        }
    }

    const node = await getContentNodeByPath(contentType, normalizedCategoryIdentifier);

    if (!node) {
        console.warn(`[contentService] getContentListByCategory: Category node not found for type "${contentType}" and identifier "${categoryIdentifier}" (normalized to "${normalizedCategoryIdentifier}")`);
        return [];
    }

    if (node.children && Array.isArray(node.children) && node.children.length > 0) {
        const childNodes: ServerContentNode[] = [];
        for (const fmChild of node.children) {
            let childIdentifier = '';
            const childInfoId = fmChild.id;

            const baseChildName = childInfoId.endsWith('_index') ? childInfoId.replace('_index', '') : childInfoId;
            childIdentifier = `${node.contentPath}/${baseChildName}`.replace(/\/\//g, '/');

            const childNode = await getContentNodeByPath(contentType, childIdentifier);
            if (childNode) {
                childNodes.push(childNode);
            } else {
                if (node.contentPath && node.itemType === 'course') {
                    let parentPathRel = node.contentPath.startsWith(`/${contentType}/`) ? node.contentPath.substring(`/${contentType}/`.length + 1) : node.contentPath;
                    parentPathRel = parentPathRel.replace(/^\//, '');
                    const lessons = await getLessonsForCourse(parentPathRel, node);
                    const foundLesson = lessons.find(l => l.id === fmChild.id || l.contentPath && l.contentPath.endsWith(fmChild.id));
                    if (foundLesson) childNodes.push(foundLesson);
                    else console.warn(`[contentService] Child node ${fmChild.id} (resolved as ${childIdentifier}) not found for parent ${categoryIdentifier}`);
                } else {
                    console.warn(`[contentService] Child node ${fmChild.id} (resolved as ${childIdentifier}) not found for parent ${categoryIdentifier}`);
                }
            }
        }
        return childNodes;
    } else if (node.itemType === 'course' || (node.contentType && (node.contentType.endsWith("_overview") || node.contentType.endsWith("_index")))) {
        if (node.contentPath) {
            let pathRel = node.contentPath.startsWith(`/${contentType}/`) ? node.contentPath.substring(`/${contentType}/`.length + 1) : node.contentPath;
            pathRel = pathRel.replace(/^\//, '');
            return await getLessonsForCourse(pathRel, node);
        }
    }

    return [];
}

// --- New functions for path-based content retrieval ---

/**
 * Fetches a single content node (typically an _index.mdx file) by its exact contentPath.
 * @param contentType The type of content ('exercises' or 'courses').
 * @param targetContentPath The exact content path (e.g., '/exercises/maths/mpsi-maths').
 * @returns A ServerContentNode or null if not found.
 */
export async function getNodeByContentPath(
    contentType: 'exercises' | 'courses',
    targetContentPath: string
): Promise<ServerContentNode | null> {
    console.log(`[contentService] getNodeByContentPath: Seeking ${contentType} node with contentPath: '${targetContentPath}'`);
    const allNodes = contentType === 'exercises' ? await getAllExercises() : await getAllCourses();
    
    const foundNode = allNodes.find(node => node.contentPath === targetContentPath && node.id.endsWith('_index'));
    
    if (foundNode) {
        console.log(`[contentService] getNodeByContentPath: Found node '${foundNode.id}' for contentPath '${targetContentPath}'`);
    } else {
        // If not found as an _index, try to find any node that matches the contentPath exactly
        // This might be relevant if a path points to a direct file that isn't an _index.
        const directMatch = allNodes.find(node => node.contentPath === targetContentPath);
        if (directMatch) {
            console.log(`[contentService] getNodeByContentPath: Found direct match node '${directMatch.id}' for contentPath '${targetContentPath}' (not an _index)`);
            return directMatch;
        }
        console.warn(`[contentService] getNodeByContentPath: Node NOT FOUND for ${contentType} with contentPath: '${targetContentPath}'`);
    }
    return foundNode || null;
}

/**
 * Fetches all direct child nodes (items or subcategory _index.mdx files) under a given parent content path.
 * @param contentType The type of content ('exercises' or 'courses').
 * @param parentNodeContentPath The content path of the parent directory (e.g., '/exercises/maths/mpsi-maths').
 * @returns An array of ServerContentNode.
 */
export async function getChildNodesList(
    contentType: 'exercises' | 'courses',
    parentNodeContentPath: string
): Promise<ServerContentNode[]> {
    console.log(`[contentService] getChildNodesList: Seeking children for ${contentType} under parent path: '${parentNodeContentPath}'`);
    const allNodes = contentType === 'exercises' ? await getAllExercises() : await getAllCourses();

    const normalizedParentPath = parentNodeContentPath.endsWith('/') ? parentNodeContentPath : parentNodeContentPath + '/';
    
    const children = allNodes.filter(node => {
        if (!node.contentPath || !node.contentPath.startsWith(normalizedParentPath)) {
            return false; // Not under the parent path
        }
        // Ensure it's a direct child: the path segment after parentNodeContentPath should not contain further slashes.
        // e.g. parent /exercises/maths, child /exercises/maths/calculus -> segment "calculus" (OK)
        // e.g. parent /exercises/maths, child /exercises/maths/calculus/limits -> segment "calculus/limits" (NOT a direct child for listing)
        const subPath = node.contentPath.substring(normalizedParentPath.length);
        return subPath.length > 0 && !subPath.includes('/');
    });

    console.log(`[contentService] getChildNodesList: Found ${children.length} children for parent path '${parentNodeContentPath}'`);
    return children.sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || (a.title ?? '').localeCompare(b.title ?? ''));
}
// --- End of new functions ---