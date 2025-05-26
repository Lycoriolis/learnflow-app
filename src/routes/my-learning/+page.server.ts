import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  // Get parent data 
  const parentData = await parent();
  // Parent data only has csrfToken, not userProfile
  // TODO: Add proper user authentication and profile loading
  
  // For now, return empty enrollment list
  return { 
    enrolledCourses: [],
    csrfToken: parentData.csrfToken
  };

  /* TODO: Implement when user profile loading is added
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
  */
};
