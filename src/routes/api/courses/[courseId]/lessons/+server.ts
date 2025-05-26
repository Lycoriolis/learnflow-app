import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getCourseById, getLessonsForCourse } from '$lib/server/contentService';

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

		const lessons = await getLessonsForCourse(course.contentPath, course);
		
		return json(lessons);
	} catch (error) {
		console.error('Error fetching lessons for course:', error);
		return json({ error: 'Failed to fetch lessons' }, { status: 500 });
	}
};
