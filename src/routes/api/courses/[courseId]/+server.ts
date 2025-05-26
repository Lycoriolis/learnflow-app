import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getCourseById } from '$lib/server/contentService';

export const GET: RequestHandler = async ({ params }) => {
	const { courseId } = params;
	
	if (!courseId) {
		return json({ error: 'Course ID is required' }, { status: 400 });
	}

	try {
		const course = await getCourseById(courseId);
		
		if (!course) {
			return json({ error: 'Course not found' }, { status: 404 });
		}

		return json(course);
	} catch (error) {
		console.error('Error fetching course:', error);
		return json({ error: 'Failed to fetch course' }, { status: 500 });
	}
};
