import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { getAllCourses, getLessonsForCourse, getExercisesByCategory, getAllExercises } from '$lib/server/contentService';

export const GET: RequestHandler = async ({ params }) => {
	const { lessonId } = params;
	
	if (!lessonId) {
		return json({ error: 'Lesson ID is required' }, { status: 400 });
	}

	try {
		// First, find the lesson to understand its structure
		const courses = await getAllCourses();
		let lesson = null;
		
		for (const course of courses) {
			const lessons = await getLessonsForCourse(course.contentPath, course);
			lesson = lessons.find(l => l.id === lessonId);
			
			if (lesson) break;
			
			// Check nested lessons (modules with sub-lessons)
			for (const potentialModule of lessons) {
				if (potentialModule.itemType === 'module') {
					const subLessons = await getLessonsForCourse(potentialModule.contentPath, potentialModule);
					lesson = subLessons.find(l => l.id === lessonId);
					if (lesson) break;
				}
			}
			if (lesson) break;
		}
		
		if (!lesson) {
			return json({ error: 'Lesson not found' }, { status: 404 });
		}

		// Now find exercises related to this lesson
		// This could be based on category, tags, or other criteria
		let exercises = [];
		
		// Try to find exercises by category if the lesson has one
		if (lesson.category) {
			exercises = await getExercisesByCategory(lesson.category);
		} else if (lesson.categoryPath) {
			// Extract category from categoryPath
			const categorySlug = lesson.categoryPath.split('/')[0];
			exercises = await getExercisesByCategory(categorySlug);
		} else {
			// Fallback: get all exercises and filter by tags or other criteria
			const allExercises = await getAllExercises();
			exercises = allExercises.filter(ex => {
				// Match exercises that have similar tags or content path
				if (lesson.tags && ex.tags) {
					return lesson.tags.some(tag => ex.tags?.includes(tag));
				}
				// Or match by similar category path
				if (lesson.categoryPath && ex.categoryPath) {
					return ex.categoryPath.startsWith(lesson.categoryPath.split('/')[0]);
				}
				return false;
			});
		}
		
		return json(exercises);
	} catch (error) {
		console.error('Error fetching exercises for lesson:', error);
		return json({ error: 'Failed to fetch exercises' }, { status: 500 });
	}
};
