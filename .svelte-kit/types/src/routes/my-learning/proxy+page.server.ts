// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getAllContentItemsByType } from '$lib/server/contentService';
import { error } from '@sveltejs/kit';

export const load = async ({ parent }: Parameters<PageServerLoad>[0]) => {
  // Get parent data and handle case where userProfile might be undefined
  const parentData = await parent();
  const userProfile = parentData.userProfile;

  if (!userProfile) {
    // This case might be handled by the layout guard, but good to be safe
    return { enrolledCourses: [] }; 
  }

  // Safely access enrollment IDs with proper typings
  const enrolledIds = userProfile.preferences?.enrollments?.map((e: { id: string }) => e.id) || [];

  if (enrolledIds.length === 0) {
    return { enrolledCourses: [] };
  }

  try {
    // Fetch metadata for all courses
    const allCourses = await getAllContentItemsByType('courses', 'course');
    
    // Filter courses based on enrollment IDs and add enrollment details
    const enrolledCourses = allCourses
      .filter(course => enrolledIds.includes(course.id))
      .map(course => {
        // Safely access enrollment with null check
        const enrollment = userProfile.preferences?.enrollments?.find((e: { id: string }) => e.id === course.id);
        return {
          meta: course, // Contains id, title, description, path etc.
          enrollment: enrollment || { progress: 0, lastAccessed: 0 } // Add default if somehow missing
        };
      });

    return { enrolledCourses };

  } catch (err) {
    console.error("Error loading enrolled courses in /my-learning:", err);
    // Use SvelteKit's error helper for server-side errors
    throw error(500, 'Failed to load enrolled courses.'); 
  }
};
