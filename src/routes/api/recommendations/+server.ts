import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getFirestore, collection, query, where, orderBy, limit as limitQuery, getDocs } from 'firebase/firestore';
import { getAllContentItemsByType, getContentNodeByPath, type ContentNode } from '$lib/server/contentService'; // Server import OK here
import { adminDb } from '$lib/server/firebaseAdmin';

interface SimpleLesson {
  id: string;
  title: string;
  type: 'lesson';
  path?: string; // Added path
}

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
function findNextLesson(node: ContentNode | null, currentLessonId: string): SimpleLesson | null {
  if (!node || !node.children) return null;

  for (const module of node.children) {
    if (module.type === 'module' && module.children) {
      const lessonIndex = module.children.findIndex((lesson) => lesson.type === 'lesson' && lesson.id === currentLessonId);
      if (lessonIndex !== -1 && lessonIndex + 1 < module.children.length) {
        const nextLesson = module.children[lessonIndex + 1];
        if (nextLesson.type === 'lesson') {
          // Ensure path is included if available
          return {
              id: nextLesson.id,
              title: nextLesson.title || nextLesson.id,
              type: 'lesson',
              path: nextLesson.path
          };
        }
      }
    }
  }
  // Check next module if current lesson was the last in its module
  for (let i = 0; i < node.children.length; i++) {
      const module = node.children[i];
      if (module.type === 'module' && module.children) {
          const lessonIndex = module.children.findIndex((lesson) => lesson.type === 'lesson' && lesson.id === currentLessonId);
          if (lessonIndex !== -1 && i + 1 < node.children.length) {
              // Find the first lesson in the next module
              const nextModule = node.children[i + 1];
              if (nextModule.type === 'module' && nextModule.children) {
                  const firstLessonOfNextModule = nextModule.children.find(lesson => lesson.type === 'lesson');
                  if (firstLessonOfNextModule) {
                      return {
                          id: firstLessonOfNextModule.id,
                          title: firstLessonOfNextModule.title || firstLessonOfNextModule.id,
                          type: 'lesson',
                          path: firstLessonOfNextModule.path
                      };
                  }
              }
          }
      }
  }

  return null;
}


export const GET: RequestHandler = async ({ locals, url }) => {
  // Basic Auth Check (Adapt as needed based on your auth setup)
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  const userId = locals.user.uid;
  const limit = parseInt(url.searchParams.get('limit') || '5', 10);

  try {
    // Use the initialized Firestore Admin instance
    const db = adminDb;

    const activitiesRef = collection(db, 'activities');

    const q = query(
      activitiesRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limitQuery(limit * 2) // Fetch more activities to have options
    );

    const snapshot = await getDocs(q);
    const acts = snapshot.docs.map(doc => ({
      type: doc.data().eventType as string,
      referenceId: doc.data().referenceId as string,
      timestampStart: doc.data().timestamp, // Assuming timestamp is stored
      metadata: doc.data().metadata || {}
    }));

    const recs: Recommendation[] = [];

    // --- Recommendation Logic (Moved from service) ---

    // 1. Next lesson based on last viewed lesson
    const lastViewLesson = acts.find(a => a.type === 'view_lesson' && a.metadata?.courseId && a.referenceId);
    if (lastViewLesson && lastViewLesson.metadata?.courseId) {
        const courseId = lastViewLesson.metadata.courseId;
        const lessonId = lastViewLesson.referenceId;
        try {
            const structureNode = await getContentNodeByPath('courses', courseId); // Use server function
            if (structureNode) {
                const nextLesson = findNextLesson(structureNode, lessonId);
                if (nextLesson && !recs.some(r => r.type === 'next_lesson')) { // Avoid duplicates
                    recs.push({
                        type: 'next_lesson',
                        referenceId: nextLesson.id,
                        title: `Next: ${nextLesson.title}`,
                        description: `Continue in ${structureNode.title || courseId}`,
                        metadata: { 
                            courseId: typeof structureNode === 'object' && 'id' in structureNode ? structureNode.id : courseId, 
                            path: nextLesson.path 
                        } // Include path with safe access to id
                    });
                }
            }
        } catch (e) {
            console.warn(`Error fetching course structure for ${courseId}:`, e);
        }
    }


    // 2. Review flashcards suggestion (Simplified - needs actual logic based on your flashcard system)
    const hasFlashcards = true; // Replace with actual check if user has flashcards
    if (hasFlashcards && !recs.some(r => r.type === 'review_flashcards')) {
        recs.push({
            type: 'review_flashcards',
            referenceId: '/tools/flashcards', // Link to the tool
            title: 'Review your flashcards',
            description: 'Keep your knowledge fresh with spaced repetition.',
            metadata: { tool: 'flashcards' }
        });
    }

    // 3. Suggest related exercises
    const lastStartedExercise = acts.find(a => (a.type === 'start_exercise' || a.type === 'complete_exercise') && a.referenceId);
    if (lastStartedExercise && recs.length < limit) {
        try {
            const allExercises = await getAllContentItemsByType('exercises', 'exercise'); // Use server function
            const current = allExercises.find(e => e.id === lastStartedExercise.referenceId);
            if (current?.tags) {
                const userCompletedExercises = new Set(acts.filter(a => a.type === 'complete_exercise').map(a => a.referenceId));
                const similar = allExercises.filter(e =>
                    e.id !== current.id &&
                    !userCompletedExercises.has(e.id) && // Don't suggest completed ones
                    e.tags?.some(tag => current.tags?.includes(tag))
                );
                for (const ex of similar) {
                    if (recs.length >= limit) break;
                    if (!recs.some(r => r.referenceId === ex.id && r.type === 'exercise')) {
                        recs.push({
                            type: 'exercise',
                            referenceId: ex.id,
                            title: ex.title || ex.id,
                            description: `Practice ${ex.tags?.join(', ') || 'related skills'}`, // Improved description
                            metadata: { path: ex.path } // Include path
                        });
                    }
                }
            }
        } catch (e) {
            console.warn(`Error fetching exercises for recommendations:`, e);
        }
    }


    // 4. Suggest new courses (not already started/completed)
    if (recs.length < limit) {
        try {
            const allCourses = await getAllContentItemsByType('courses', 'course'); // Use server function
            const userCourseProgress = new Map<string, number>();
             acts.filter(a => a.type === 'start_course' || a.type === 'complete_course' || a.type === 'view_lesson')
                 .forEach(a => {
                     const courseId = a.metadata?.courseId || (a.type === 'start_course' ? a.referenceId : null);
                     if (courseId) {
                         const progress = a.type === 'complete_course' ? 100 : (userCourseProgress.get(courseId) || 1);
                         userCourseProgress.set(courseId, progress);
                     }
                 });

            const unstartedCourses = allCourses.filter(c => (userCourseProgress.get(c.id) || 0) < 100); // Suggest courses not completed

            for (const course of unstartedCourses) {
                if (recs.length >= limit) break;
                 if (!recs.some(r => r.referenceId === course.id && r.type === 'course')) {
                    recs.push({
                        type: 'course',
                        referenceId: course.id,
                        title: course.title || course.id,
                        description: course.description || `Explore ${course.title || course.id}`, // Fallback description
                        metadata: { path: course.path } // Include path
                    });
                }
            }
        } catch (e) {
            console.warn(`Error fetching courses for recommendations:`, e);
        }
    }

    // --- End Recommendation Logic ---

    return json(recs.slice(0, limit));

  } catch (err: any) {
    console.error("Error fetching recommendations:", err);
    // Ensure a proper error response is sent
    throw error(err.status || 500, err.body?.message || err.message || 'Failed to fetch recommendations');
  }
};