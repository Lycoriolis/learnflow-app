// src/routes/exercises/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { loadExercise, getExerciseById } from '$lib/services/enhancedContentService';
import { getUserProgress } from '$lib/services/progressService';
import { findRelatedContent, getPrerequisites } from '$lib/services/relatedContentService';

// Handles both slug-based and id-based access to exercises
export const load: PageServerLoad = async ({ params, locals }: { params: { slug: string }, locals: { user?: { uid: string } } }) => {
  const { slug } = params;
  
  try {
    // Try to load exercise by slug first
    let exercise = await loadExercise(slug);
    
    // If not found by slug, try by ID as a fallback
    if (!exercise) {
      exercise = await getExerciseById(slug);
    }
    
    // If still not found, throw a 404 error
    if (!exercise) {
      throw error(404, 'Exercise not found');
    }
    
    // Get user progress if user is authenticated
    let progress = null;
    if (locals.user) {
      const userProgress = await getUserProgress(locals.user.uid);
      progress = userProgress.exercises[exercise.id] || null;
    }
    
    // Load related content and prerequisites
    const [relatedContent, prerequisites] = await Promise.all([
      findRelatedContent(exercise.id, { limit: 6, threshold: 0.3 }),
      getPrerequisites(exercise.id)
    ]);
    
    return {
      exercise,
      progress,
      relatedContent,
      prerequisites
    };
  } catch (err) {
    console.error('Error loading exercise:', err);
    throw error(500, 'Failed to load exercise content. Please try again later.');
  }
};
