import { db } from '$lib/firebase';
import { doc, updateDoc, increment, arrayUnion, Timestamp, getDoc } from 'firebase/firestore';
import type { ServiceResponse } from '$lib/types/service';

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

      return { success: true };
    } catch (error) {
      console.error('Error tracking course progress:', error);
      return { success: false, error: error instanceof Error ? error : new Error('Failed to update course progress') };
    }
  }

  async trackExerciseAttempt(
    userId: string,
    exerciseId: string,
    score: number,
    timeSpent: number
  ): Promise<ServiceResponse<void>> {
    try {
      const userProgressRef = doc(db, 'userProgress', userId);
      const completed = score >= 80; // Assuming 80% is passing

      await updateDoc(userProgressRef, {
        [`exercises.${exerciseId}.attempts`]: increment(1),
        [`exercises.${exerciseId}.completed`]: completed,
        [`exercises.${exerciseId}.lastAttempt`]: Timestamp.now(),
        [`exercises.${exerciseId}.bestScore`]: score,
        [`exercises.${exerciseId}.timeSpent`]: increment(timeSpent),
        'metrics.totalExercisesAttempted': increment(1),
        'metrics.totalExercisesCompleted': increment(completed ? 1 : 0),
        'metrics.totalLearningTime': increment(timeSpent)
      });

      // Update average score
      const userProgress = await this.getUserProgress(userId);
      if (userProgress.data) {
        const { totalExercisesAttempted, totalExercisesCompleted } = userProgress.data.metrics;
        const newAverage = (totalExercisesCompleted * 80 + score) / (totalExercisesCompleted + 1);
        
        await updateDoc(userProgressRef, {
          'metrics.averageExerciseScore': newAverage
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error tracking exercise attempt:', error);
      return { success: false, error: error instanceof Error ? error : new Error('Failed to update exercise progress') };
    }
  }

  async getUserProgress(userId: string): Promise<ServiceResponse<any>> {
    try {
      const userProgressRef = doc(db, 'userProgress', userId);
      const snapshot = await getDoc(userProgressRef);
      
      if (!snapshot.exists()) {
        return { success: false, error: new Error('User progress not found') };
      }

      return { success: true, data: snapshot.data() };
    } catch (error) {
      console.error('Error getting user progress:', error);
      return { success: false, error: error instanceof Error ? error : new Error('Failed to get user progress') };
    }
  }

  async updateLearningTime(userId: string, minutes: number): Promise<ServiceResponse<void>> {
    try {
      const userProgressRef = doc(db, 'userProgress', userId);
      await updateDoc(userProgressRef, {
        'metrics.totalLearningTime': increment(minutes)
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating learning time:', error);
      return { success: false, error: error instanceof Error ? error : new Error('Failed to update learning time') };
    }
  }
} 