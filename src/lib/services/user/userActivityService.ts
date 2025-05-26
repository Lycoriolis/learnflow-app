import { db } from '$lib/firebase';
import { doc, updateDoc, increment, arrayUnion, Timestamp, getDoc, serverTimestamp } from 'firebase/firestore';
import type { ServiceResponse } from "$lib/types/shared";
import type { UserProgressMetrics } from "$lib/types/user"; // Corrected import path

export class UserActivityService {
  private static instance: UserActivityService;
  private constructor() {}

  static getInstance(): UserActivityService {
    if (!UserActivityService.instance) {
      UserActivityService.instance = new UserActivityService();
    }
    return UserActivityService.instance;
  }

  async trackCourseProgress(
    userId: string,
    courseId: string,
    lessonId: string,
    progress: number
  ): Promise<ServiceResponse<void>> {
    try {
      const userProgressRef = doc(db, 'userProgress', userId);
      
      await updateDoc(userProgressRef, {
        [`courses.${courseId}.progress`]: progress,
        [`courses.${courseId}.completedLessons`]: arrayUnion(lessonId),
        [`courses.${courseId}.lastAccessed`]: Timestamp.now(),
        'metrics.totalLearningTime': increment(5), // Assuming 5 minutes per lesson
        'metrics.totalCoursesStarted': increment(progress === 0 ? 1 : 0),
        'metrics.totalCoursesCompleted': increment(progress === 100 ? 1 : 0)
      });

      return { data: undefined, error: null }; // Adjusted to ServiceResponse
    } catch (error) {
      console.error('Error tracking course progress:', error);
      return { data: null, error: error instanceof Error ? error : new Error('Failed to update course progress') }; // Adjusted
    }
  }

  async trackExerciseAttempt(
    userId: string,
    exerciseId: string,
    score: number,
    completed: boolean
  ): Promise<ServiceResponse<void>> {
    const userProgressRef = doc(db, 'userProgress', userId);
    try {
      const userProgress = await this.getUserProgress(userId);
      let newAverage = score;
      let totalCompleted = completed ? 1 : 0;

      if (userProgress.error === null && userProgress.data) { // Adjusted to check error property
        const metrics = userProgress.data.metrics as UserProgressMetrics;
        const totalExercisesCompleted = metrics.totalExercisesCompleted || 0;
        // Ensure division by zero is handled if totalExercisesCompleted + (completed ? 1:0) is 0
        const divisor = totalExercisesCompleted + (completed ? 1 : 0);
        newAverage = divisor === 0 ? 0 : (totalExercisesCompleted * (metrics.averageExerciseScore || 0) + score) / divisor;
        totalCompleted = totalExercisesCompleted + (completed ? 1 : 0);
      }

      await updateDoc(userProgressRef, {
        [`exercises.${exerciseId}.lastAttempted`]: serverTimestamp(),
        [`exercises.${exerciseId}.score`]: score,
        [`exercises.${exerciseId}.completed`]: completed,
        'metrics.totalExercisesAttempted': increment(1),
        'metrics.totalExercisesCompleted': totalCompleted,
        'metrics.averageExerciseScore': newAverage
      });

      return { data: undefined, error: null }; // Adjusted
    } catch (error) {
      console.error('Error tracking exercise attempt:', error);
      return { data: null, error: error instanceof Error ? error : new Error('Failed to update exercise progress') }; // Adjusted
    }
  }

  async getUserProgress(userId: string): Promise<ServiceResponse<any>> {
    const userProgressRef = doc(db, 'userProgress', userId);
    try {
      const snapshot = await getDoc(userProgressRef);
      if (!snapshot.exists()) {
        return { data: null, error: new Error('User progress not found') }; // Adjusted
      }

      return { data: snapshot.data(), error: null }; // Adjusted
    } catch (error) {
      console.error('Error getting user progress:', error);
      return { data: null, error: error instanceof Error ? error : new Error('Failed to get user progress') }; // Adjusted
    }
  }

  async updateTotalLearningTime(userId: string, timeToAdd: number): Promise<ServiceResponse<void>> {
    const userProgressRef = doc(db, 'userProgress', userId);
    try {
      await updateDoc(userProgressRef, {
        'metrics.totalLearningTime': increment(timeToAdd)
      });
      return { data: undefined, error: null }; // Adjusted
    } catch (error) {
      console.error('Error updating learning time:', error);
      return { data: null, error: error instanceof Error ? error : new Error('Failed to update learning time') }; // Adjusted
    }
  }
}