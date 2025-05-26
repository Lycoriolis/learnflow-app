import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { UserActivityService } from '$lib/services/user/userActivityService';

export const GET: RequestHandler = async ({ params, locals }) => {
	const { userId, courseId } = params;
	
	if (!userId || !courseId) {
		return json({ error: 'User ID and Course ID are required' }, { status: 400 });
	}

	// Ensure the requesting user can only access their own progress
	if (locals.user?.uid !== userId) {
		return json({ error: 'Unauthorized' }, { status: 403 });
	}

	try {
		const userActivityService = UserActivityService.getInstance();
		const progressResult = await userActivityService.getUserProgress(userId);
		
		if (progressResult.error) {
			if (progressResult.error.message === 'User progress not found') {
				return json({ error: 'User progress not found' }, { status: 404 });
			}
			throw progressResult.error;
		}

		const userProgress = progressResult.data;
		
		// Extract progress for the specific course
		const courseProgress = userProgress?.courses?.[courseId] || {
			progress: 0,
			completedLessons: [],
			lastAccessed: null
		};

		return json({
			userId,
			courseId,
			progress: courseProgress.progress || 0,
			completedLessons: courseProgress.completedLessons || [],
			lastAccessed: courseProgress.lastAccessed,
			metrics: userProgress?.metrics || {}
		});
	} catch (error) {
		console.error('Error fetching user progress:', error);
		return json({ error: 'Failed to fetch user progress' }, { status: 500 });
	}
};
