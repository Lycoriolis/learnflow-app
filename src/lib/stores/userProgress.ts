import { writable, derived, get } from 'svelte/store';
import type { Readable } from 'svelte/store';

// Types for user progress
export interface LessonProgress {
	id: string;
	completed: boolean;
	completedAt?: Date;
	timeSpent?: number; // in minutes
	score?: number; // percentage 0-100
}

export interface CourseProgress {
	id: string;
	enrolledAt: Date;
	lastAccessedAt: Date;
	completedLessons: string[];
	totalLessons: number;
	progressPercentage: number;
	timeSpent: number; // total time in minutes
	achievements: string[];
}

export interface UserProgressData {
	userId: string;
	courses: Record<string, CourseProgress>;
	lessons: Record<string, LessonProgress>;
	totalTimeSpent: number;
	totalLessonsCompleted: number;
	totalCoursesCompleted: number;
	streakDays: number;
	lastActiveDate: Date;
}

// Create writable stores
const userProgressData = writable<UserProgressData | null>(null);
const isLoading = writable<boolean>(false);
const error = writable<string | null>(null);

// Derived stores
const courseProgress: Readable<Record<string, CourseProgress>> = derived(
	userProgressData,
	($data) => $data?.courses || {}
);

const lessonProgress: Readable<Record<string, LessonProgress>> = derived(
	userProgressData,
	($data) => $data?.lessons || {}
);

// Track when a lesson is viewed
function trackLessonView(courseId: string, lessonId: string): void {
	userProgressData.update((data) => {
		if (!data) return data;

		// Update the last accessed time for the course
		if (data.courses[courseId]) {
			data.courses[courseId].lastAccessedAt = new Date();
		} else {
			// Initialize course progress if it doesn't exist
			data.courses[courseId] = {
				id: courseId,
				enrolledAt: new Date(),
				lastAccessedAt: new Date(),
				completedLessons: [],
				totalLessons: 0, // This would be updated when course data is fully loaded
				progressPercentage: 0,
				timeSpent: 0,
				achievements: []
			};
		}

		// Initialize lesson progress if it doesn't exist
		const lessonKey = `${courseId}:${lessonId}`;
		if (!data.lessons[lessonKey]) {
			data.lessons[lessonKey] = {
				id: lessonId,
				completed: false,
				timeSpent: 0
			};
		}

		// Update last active date
		data.lastActiveDate = new Date();
		
		return data;
	});
}

// Track lesson completion
function completeLessonInCourse(courseId: string, lessonId: string): void {
	userProgressData.update((data) => {
		if (!data) return data;
		
		// Create course progress entry if it doesn't exist
		if (!data.courses[courseId]) {
			data.courses[courseId] = {
				id: courseId,
				enrolledAt: new Date(),
				lastAccessedAt: new Date(),
				completedLessons: [],
				totalLessons: 0,
				progressPercentage: 0,
				timeSpent: 0,
				achievements: []
			};
		}
		
		const course = data.courses[courseId];
		
		// Add lesson to completed lessons if not already completed
		if (!course.completedLessons.includes(lessonId)) {
			course.completedLessons.push(lessonId);
			data.totalLessonsCompleted = (data.totalLessonsCompleted || 0) + 1;
			
			// Update course progress percentage
			if (course.totalLessons > 0) {
				course.progressPercentage = (course.completedLessons.length / course.totalLessons) * 100;
				
				// If all lessons are completed, mark the course as completed
				if (course.progressPercentage >= 100) {
					data.totalCoursesCompleted = (data.totalCoursesCompleted || 0) + 1;
					// Could add achievement here
				}
			}
		}
		
		// Update lesson progress
		const lessonKey = `${courseId}:${lessonId}`;
		data.lessons[lessonKey] = {
			...data.lessons[lessonKey] || { id: lessonId },
			completed: true,
			completedAt: new Date()
		};
		
		// Update last active date
		data.lastActiveDate = new Date();
		
		return data;
	});
}

// Update lesson time spent
function updateLessonTimeSpent(courseId: string, lessonId: string, timeInMinutes: number): void {
	userProgressData.update((data) => {
		if (!data) return data;
		
		// Update course time tracking
		if (data.courses[courseId]) {
			data.courses[courseId].timeSpent = (data.courses[courseId].timeSpent || 0) + timeInMinutes;
		}
		
		// Update lesson time tracking
		const lessonKey = `${courseId}:${lessonId}`;
		if (!data.lessons[lessonKey]) {
			data.lessons[lessonKey] = {
				id: lessonId,
				completed: false,
				timeSpent: timeInMinutes
			};
		} else {
			data.lessons[lessonKey].timeSpent = (data.lessons[lessonKey].timeSpent || 0) + timeInMinutes;
		}
		
		// Update total time spent
		data.totalTimeSpent = (data.totalTimeSpent || 0) + timeInMinutes;
		
		return data;
	});
}

const totalProgress: Readable<{
	lessonsCompleted: number;
	coursesCompleted: number;
	timeSpent: number;
	streakDays: number;
}> = derived(
	userProgressData,
	($data) => ({
		lessonsCompleted: $data?.totalLessonsCompleted || 0,
		coursesCompleted: $data?.totalCoursesCompleted || 0,
		timeSpent: $data?.totalTimeSpent || 0,
		streakDays: $data?.streakDays || 0
	})
);

// Helper functions
function updateUserProgress(updater: (current: UserProgressData | null) => UserProgressData | null) {
	userProgressData.update(updater);
}

function setError(message: string) {
	error.set(message);
}

function clearError() {
	error.set(null);
}

function setLoading(loading: boolean) {
	isLoading.set(loading);
}

// Main store functions
async function initializeUserProgress(userId: string): Promise<void> {
	setLoading(true);
	clearError();
	
	try {
		// Initialize with empty progress data
		const initialData: UserProgressData = {
			userId,
			courses: {},
			lessons: {},
			totalTimeSpent: 0,
			totalLessonsCompleted: 0,
			totalCoursesCompleted: 0,
			streakDays: 0,
			lastActiveDate: new Date()
		};
		
		userProgressData.set(initialData);
		
		// TODO: Load actual progress from server/Firebase
		// const progressData = await fetchUserProgress(userId);
		// userProgressData.set(progressData);
		
	} catch (err) {
		setError(err instanceof Error ? err.message : 'Failed to load user progress');
		console.error('Error initializing user progress:', err);
	} finally {
		setLoading(false);
	}
}

async function markLessonComplete(courseId: string, lessonId: string): Promise<void> {
	const currentData = get(userProgressData);
	if (!currentData) return;

	try {
		// Update lesson progress
		const lessonProgress: LessonProgress = {
			id: lessonId,
			completed: true,
			completedAt: new Date(),
			score: 100 // Default score for completion
		};

		// Update course progress
		const courseProgress = currentData.courses[courseId] || {
			id: courseId,
			enrolledAt: new Date(),
			lastAccessedAt: new Date(),
			completedLessons: [],
			totalLessons: 1, // This would come from course data
			progressPercentage: 0,
			timeSpent: 0,
			achievements: []
		};

		if (!courseProgress.completedLessons.includes(lessonId)) {
			courseProgress.completedLessons.push(lessonId);
			courseProgress.progressPercentage = Math.round(
				(courseProgress.completedLessons.length / courseProgress.totalLessons) * 100
			);
		}

		courseProgress.lastAccessedAt = new Date();

		updateUserProgress((current) => {
			if (!current) return null;
			
			return {
				...current,
				lessons: {
					...current.lessons,
					[lessonId]: lessonProgress
				},
				courses: {
					...current.courses,
					[courseId]: courseProgress
				},
				totalLessonsCompleted: Object.values({
					...current.lessons,
					[lessonId]: lessonProgress
				}).filter(l => l.completed).length,
				lastActiveDate: new Date()
			};
		});

		// TODO: Persist to server/Firebase
		// await saveUserProgress(currentData.userId, get(userProgressData));

	} catch (err) {
		setError(err instanceof Error ? err.message : 'Failed to mark lesson complete');
		console.error('Error marking lesson complete:', err);
	}
}

async function enrollInCourse(courseId: string, totalLessons: number): Promise<void> {
	const currentData = get(userProgressData);
	if (!currentData) return;

	try {
		const courseProgress: CourseProgress = {
			id: courseId,
			enrolledAt: new Date(),
			lastAccessedAt: new Date(),
			completedLessons: [],
			totalLessons,
			progressPercentage: 0,
			timeSpent: 0,
			achievements: []
		};

		updateUserProgress((current) => {
			if (!current) return null;
			
			return {
				...current,
				courses: {
					...current.courses,
					[courseId]: courseProgress
				},
				lastActiveDate: new Date()
			};
		});

		// TODO: Persist to server/Firebase
		// await saveUserProgress(currentData.userId, get(userProgressData));

	} catch (err) {
		setError(err instanceof Error ? err.message : 'Failed to enroll in course');
		console.error('Error enrolling in course:', err);
	}
}

async function updateLessonTime(courseId: string, lessonId: string, timeSpent: number): Promise<void> {
	const currentData = get(userProgressData);
	if (!currentData) return;

	try {
		updateUserProgress((current) => {
			if (!current) return null;
			
			const lesson = current.lessons[lessonId] || {
				id: lessonId,
				completed: false
			};

			const course = current.courses[courseId] || {
				id: courseId,
				enrolledAt: new Date(),
				lastAccessedAt: new Date(),
				completedLessons: [],
				totalLessons: 1,
				progressPercentage: 0,
				timeSpent: 0,
				achievements: []
			};

			return {
				...current,
				lessons: {
					...current.lessons,
					[lessonId]: {
						...lesson,
						timeSpent: (lesson.timeSpent || 0) + timeSpent
					}
				},
				courses: {
					...current.courses,
					[courseId]: {
						...course,
						timeSpent: course.timeSpent + timeSpent,
						lastAccessedAt: new Date()
					}
				},
				totalTimeSpent: current.totalTimeSpent + timeSpent,
				lastActiveDate: new Date()
			};
		});

	} catch (err) {
		setError(err instanceof Error ? err.message : 'Failed to update lesson time');
		console.error('Error updating lesson time:', err);
	}
}

function getCourseProgress(courseId: string): CourseProgress | null {
	const data = get(userProgressData);
	return data?.courses[courseId] || null;
}

function getLessonProgress(lessonId: string): LessonProgress | null {
	const data = get(userProgressData);
	return data?.lessons[lessonId] || null;
}

function isLessonCompleted(lessonId: string): boolean {
	const lesson = getLessonProgress(lessonId);
	return lesson?.completed || false;
}

function isCourseCompleted(courseId: string): boolean {
	const course = getCourseProgress(courseId);
	if (!course) return false;
	return course.progressPercentage >= 100;
}

function resetProgress(): void {
	userProgressData.set(null);
	clearError();
}

// Export the store
export const userProgressStore = {
	// Readable stores
	subscribe: userProgressData.subscribe,
	courseProgress,
	lessonProgress,
	totalProgress,
	isLoading: { subscribe: isLoading.subscribe },
	error: { subscribe: error.subscribe },

	// Actions
	initializeUserProgress,
	markLessonComplete,
	enrollInCourse,
	updateLessonTime,
	getCourseProgress,
	getLessonProgress,
	isLessonCompleted,
	isCourseCompleted,
	resetProgress,
	setError,
	clearError,
	
	// New client-side tracking functions
	trackLessonView,
	completeLessonInCourse,
	updateLessonTimeSpent
};

export default userProgressStore;
