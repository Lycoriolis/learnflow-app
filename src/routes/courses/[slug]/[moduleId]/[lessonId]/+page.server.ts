// src/routes/courses/[slug]/[moduleId]/[lessonId]/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { 
  loadCourseStructure, 
  loadLesson 
} from '$lib/services/enhancedContentService';
import { findRelatedContent, getPrerequisites } from '$lib/services/relatedContentService';

export const load: PageServerLoad = async ({ params }: { params: { slug: string, moduleId: string, lessonId: string } }) => {
  const { slug: courseId, moduleId, lessonId } = params;
  
  try {
    // Load the course structure first
    const course = await loadCourseStructure(courseId);
    
    if (!course) {
      throw error(404, 'Course not found');
    }
    
    // Load the specific lesson
    const lesson = await loadLesson(courseId, moduleId, lessonId);
    
    if (!lesson) {
      throw error(404, 'Lesson not found');
    }
    
    // Load related content and prerequisites
    const [relatedContent, prerequisites] = await Promise.all([
      findRelatedContent(lessonId, { limit: 6, threshold: 0.3 }),
      getPrerequisites(lessonId)
    ]);
    
    return {
      course,
      lesson,
      relatedContent,
      prerequisites
    };
  } catch (err) {
    console.error('Error loading lesson:', err);
    throw error(500, 'Failed to load lesson content. Please try again later.');
  }
};
