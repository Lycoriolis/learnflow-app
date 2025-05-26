import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
// Remove client-side Firestore imports
// import { getFirestore, collection, query, where, orderBy, limit as limitQuery, getDocs } from 'firebase/firestore';
import { getAllContentItemsByType, getContentNodeByPath, type ServerContentNode } from '$lib/server/contentService'; // Server import OK here, changed ContentNode to ServerContentNode
import { adminDb } from '$lib/server/firebaseAdmin';
import type { Query } from 'firebase-admin/firestore';

export interface Recommendation {
  type: string;
  referenceId: string;
  title: string;
  description: string;
  metadata?: Record<string, any>;
}

/**
 * Helper to find the next lesson within a course structure node.
 */
async function findNextLesson(course: ServerContentNode, currentLessonId: string): Promise<ServerContentNode | null> {
    if (!course.children) return null;
    for (let i = 0; i < course.children.length; i++) {
        const module = course.children[i] as ServerContentNode; // Added type assertion
        if (module.itemType === 'module' && module.children) {
            const lessonIndex = (module.children as ServerContentNode[]).findIndex((lesson: ServerContentNode) => lesson.itemType === 'lesson' && lesson.id === currentLessonId);
            if (lessonIndex !== -1 && lessonIndex + 1 < (module.children as ServerContentNode[]).length) {
                return (module.children as ServerContentNode[])[lessonIndex + 1];
            }
        }
    }
    return null;
}

export const GET: RequestHandler = async ({ locals, url }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  const userId = locals.user.uid;
  const limit = parseInt(url.searchParams.get('limit') || '5', 10);

  try {
    const db = adminDb;
    const activitiesRef = db.collection('activities');

    let adminQuery: Query = activitiesRef
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit * 2);
    
    const snapshot = await adminQuery.get();

    const acts = snapshot.docs.map(doc => ({
      type: doc.data().eventType as string,
      referenceId: doc.data().referenceId as string,
      timestampStart: doc.data().timestamp, 
      metadata: doc.data().metadata || {}
    }));

    const recs: Recommendation[] = [];

    const lastViewLesson = acts.find(a => a.type === 'view_lesson' && a.metadata?.courseId && a.referenceId);
    if (lastViewLesson && lastViewLesson.metadata?.courseId) {
        const courseId = lastViewLesson.metadata.courseId;
        const lessonId = lastViewLesson.referenceId;
        try {
            // Corrected: getContentNodeByPath expects base type and item path
            const structureNode = await getContentNodeByPath('courses', courseId);
            if (structureNode) {
                const nextLesson = await findNextLesson(structureNode, lessonId);
                if (nextLesson && !recs.some(r => r.type === 'next_lesson')) {
                    recs.push({
                        type: 'next_lesson',
                        referenceId: nextLesson.id,
                        title: `Next: ${nextLesson.title}`,
                        description: `Continue in ${structureNode.title || courseId}`,
                        metadata: { 
                            courseId: typeof structureNode === 'object' && 'id' in structureNode ? structureNode.id : courseId, 
                            path: nextLesson.contentPath // Use contentPath from ServerContentNode
                        }
                    });
                }
            }
        } catch (e) {
            console.warn(`Error fetching course structure for ${courseId}:`, e);
        }
    }

    const hasFlashcards = true; 
    if (hasFlashcards && !recs.some(r => r.type === 'review_flashcards')) {
        recs.push({
            type: 'review_flashcards',
            referenceId: '/tools/flashcards',
            title: 'Review your flashcards',
            description: 'Keep your knowledge fresh with spaced repetition.',
            metadata: { tool: 'flashcards' }
        });
    }

    const lastStartedExercise = acts.find(a => (a.type === 'start_exercise' || a.type === 'complete_exercise') && a.referenceId);
    if (lastStartedExercise && recs.length < limit) {
        try {
            const allExercises = await getAllContentItemsByType('exercises', 'exercise');
            const current = allExercises.find(e => e.id === lastStartedExercise.referenceId);
            if (current?.tags) {
                const userCompletedExercises = new Set(acts.filter(a => a.type === 'complete_exercise').map(a => a.referenceId));
                const similar = allExercises.filter(e =>
                    e.id !== current.id &&
                    !userCompletedExercises.has(e.id) &&
                    e.tags?.some(tag => current.tags?.includes(tag))
                );
                for (const ex of similar) {
                    if (recs.length >= limit) break;
                    if (!recs.some(r => r.referenceId === ex.id && r.type === 'exercise')) {
                        recs.push({
                            type: 'exercise',
                            referenceId: ex.id,
                            title: ex.title || ex.id,
                            description: `Practice ${ex.tags?.join(', ') || 'related skills'}`,
                            metadata: { path: ex.contentPath } // Use contentPath from ServerContentNode
                        });
                    }
                }
            }
        } catch (e) {
            console.warn(`Error fetching exercises for recommendations:`, e);
        }
    }

    if (recs.length < limit) {
        try {
            const allCourses = await getAllContentItemsByType('courses', 'course');
            const userCourseProgress = new Map<string, number>();
             acts.filter(a => a.type === 'start_course' || a.type === 'complete_course' || a.type === 'view_lesson')
                 .forEach(a => {
                     const courseId = a.metadata?.courseId || (a.type === 'start_course' ? a.referenceId : null);
                     if (courseId) {
                         const progress = a.type === 'complete_course' ? 100 : (userCourseProgress.get(courseId) || 1);
                         userCourseProgress.set(courseId, progress);
                     }
                 });

            const unstartedCourses = allCourses.filter(c => (userCourseProgress.get(c.id) || 0) < 100);

            for (const course of unstartedCourses) {
                if (recs.length >= limit) break;
                 if (!recs.some(r => r.referenceId === course.id && r.type === 'course')) {
                    recs.push({
                        type: 'course',
                        referenceId: course.id,
                        title: course.title || course.id,
                        description: course.description || `Explore ${course.title || course.id}`,
                        metadata: { path: course.contentPath } // Use contentPath from ServerContentNode
                    });
                }
            }
        } catch (e) {
            console.warn(`Error fetching courses for recommendations:`, e);
        }
    }

    return json(recs.slice(0, limit));

  } catch (err: any) {
    console.error("Error fetching recommendations:", err);
    throw error(err.status || 500, err.body?.message || err.message || 'Failed to fetch recommendations');
  }
};