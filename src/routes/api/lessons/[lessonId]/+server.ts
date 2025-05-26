import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getAllCourses, getLessonsForCourse } from '$lib/server/contentService';

export const GET: RequestHandler = async ({ params }) => {
	const { lessonId } = params;
	
	if (!lessonId) {
		return json({ error: 'Lesson ID is required' }, { status: 400 });
	}

	try {
		// Since there's no direct getLessonById, we need to search through all courses
		const courses = await getAllCourses();
		
		for (const course of courses) {
			const lessons = await getLessonsForCourse(course.contentPath, course);
			const lesson = lessons.find(l => l.id === lessonId);
			
			if (lesson) {
				return json(lesson);
			}
			
			// Check nested lessons (modules with sub-lessons)
			for (const potentialModule of lessons) {
				if (potentialModule.itemType === 'module') {
					const subLessons = await getLessonsForCourse(potentialModule.contentPath, potentialModule);
					const subLesson = subLessons.find(l => l.id === lessonId);
					if (subLesson) {
						return json(subLesson);
					}
				}
			}
		}
		
		return json({ error: 'Lesson not found' }, { status: 404 });
	} catch (error) {
		console.error('Error fetching lesson:', error);
		return json({ error: 'Failed to fetch lesson' }, { status: 500 });
	}
};
