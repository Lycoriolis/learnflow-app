// src/lib/services/recommendationService.ts
import { getFirestore, collection, query, where, orderBy, limit as limitQuery, getDocs } from 'firebase/firestore';
import { getCourse } from './courseService.js';
import { listContent } from './contentService.js';
import { listCourses } from './courseService.js';
import type { Lesson } from './courseService.js';

export interface Recommendation {
  type: string;
  referenceId: string;
  title: string;
  description: string;
  metadata?: Record<string, any>;
}

/**
 * Fetch and compute personalized recommendations for a user
 */
export async function getRecommendations(userId: string, limit = 10): Promise<Recommendation[]> {
  const db = getFirestore();
  const activitiesRef = collection(db, 'activities');
  
  // Query recent activities
  const q = query(
    activitiesRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limitQuery(limit * 2)
  );

  const snapshot = await getDocs(q);
  const acts = snapshot.docs.map(doc => ({
    type: doc.data().eventType,
    referenceId: doc.data().referenceId,
    timestampStart: doc.data().timestamp,
    metadata: doc.data().metadata || {}
  }));

  const recs: Recommendation[] = [];

  // Next lesson based on metadata.courseId
  const lastViewLesson = acts.find(a => a.type === 'view_lesson' && a.metadata?.courseId);
  if (lastViewLesson) {
    const courseId = lastViewLesson.metadata.courseId;
    const structure = await getCourse(courseId);
    if (structure) {
      for (const module of structure.modules) {
        const idx = module.lessons.findIndex((l: Lesson) => l.id === lastViewLesson.referenceId);
        if (idx !== -1) {
          const nextIdx = idx + 1;
          if (nextIdx < module.lessons.length) {
            const nextLesson = module.lessons[nextIdx];
            recs.push({
              type: 'next_lesson',
              referenceId: nextLesson.id,
              title: `Next: ${nextLesson.title}`,
              description: `Continue in ${structure.title || courseId}`,
              metadata: { courseId, moduleId: module.id }
            });
          }
          break;
        }
      }
    }
  }

  // Review flashcards suggestion
  const lastFlashReview = acts.find(a => a.type === 'flashcard_review');
  if (lastFlashReview) {
    recs.push({
      type: 'review_flashcards',
      referenceId: '',
      title: 'Review your flashcards',
      description: 'You have cards due for review',
      metadata: {}
    });
  }

  // Fill with generic recs
  for (const a of acts) {
    if (recs.length >= limit) break;
    if (!['view_lesson','flashcard_review'].includes(a.type)) {
      recs.push({
        type: a.type,
        referenceId: a.referenceId,
        title: `Explore: ${a.type.replace(/_/g,' ')}`,
        description: 'Based on your recent activity',
        metadata: {}
      });
    }
  }

  // Exercise recommendations based on last started exercise
  const lastStartedExercise = acts.find(a => a.type === 'start_exercise' && a.referenceId);
  if (lastStartedExercise) {
    const allExercises = await listContent('exercise');
    const current = allExercises.find(e => e.id === lastStartedExercise.referenceId);
    if (current && current.tags) {
      const similar = allExercises.filter(e => e.id !== current.id && e.tags && e.tags.some(tag => current.tags?.includes(tag)));
      for (const ex of similar.slice(0, limit)) {
        recs.push({
          type: 'exercise',
          referenceId: ex.id,
          title: ex.title,
          description: ex.description || '',
          metadata: {}
        });
      }
    }
  }

  // Course recommendations based on last started course
  const lastStartedCourse = acts.find(a => a.type === 'start_course' && a.referenceId);
  if (lastStartedCourse) {
    const allCourses = await listCourses();
    const alternatives = allCourses.filter(c => c.id !== lastStartedCourse.referenceId);
    for (const course of alternatives.slice(0, limit)) {
      recs.push({ type: 'course', referenceId: course.id, title: course.title || course.id, description: course.description || '', metadata: {} });
    }
  }

  return recs.slice(0, limit);
}