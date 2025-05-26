import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { UserActivityService } from '$lib/services/user/userActivityService';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { courseId, lessonId } = await request.json();
    
    if (!courseId || !lessonId) {
      return json({ error: 'Course ID and Lesson ID are required' }, { status: 400 });
    }

    // Get current user from auth middleware
    const userId = locals.user?.uid;
    if (!userId) {
      return json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userActivityService = UserActivityService.getInstance();
    
    // Track lesson view - for now we'll assume viewing = starting progress
    const result = await userActivityService.trackCourseProgress(
      userId, 
      courseId, 
      lessonId, 
      10 // 10% progress for viewing a lesson
    );

    if (result.error) {
      console.error('Failed to track lesson view:', result.error);
      return json({ error: 'Failed to track lesson view' }, { status: 500 });
    }

    return json({ success: true });
  } catch (error) {
    console.error('Error in track-view endpoint:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
