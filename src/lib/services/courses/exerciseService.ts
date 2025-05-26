// src/lib/services/courses/exerciseService.ts
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { BaseService } from '../baseService';
import type { Exercise, ExerciseFilterOptions, ServiceResponse } from '../../types/shared'; // Removed unused ScoredExercise
import { db } from '../../../lib/firebase'; // Removed unused auth import, Import the initialized Firebase instances
import type { Exercise as ContentExercise } from '../../types/content';

export type { Exercise }; // Export the Exercise type

let exerciseCache: Record<string, Exercise[]> = {};

export class ExerciseService extends BaseService {
  private db = db; // Use the already initialized Firestore instance

  async fetchExercises(options: ExerciseFilterOptions = {}): Promise<ServiceResponse<Exercise[]>> {
    return this.handleRequest(async () => {
      const cacheKey = JSON.stringify(options);
      if (exerciseCache[cacheKey]) {
        return exerciseCache[cacheKey];
      }

      const exercisesRef = collection(this.db, 'exercises');
      let q = query(exercisesRef);

      if (options.difficulty) {
        q = query(q, where('difficulty', '==', options.difficulty));
      }

      if (options.category) {
        q = query(q, where('category', '==', options.category));
      }

      if (options.tags && options.tags.length > 0) {
        q = query(q, where('tags', 'array-contains-any', options.tags));
      }

      const snapshot = await getDocs(q);
      const exercises = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        difficulty: doc.data().difficulty,
        estimatedTime: doc.data().estimatedTime || 0,
        completedCount: doc.data().completedCount || 0,
        category: doc.data().category,
        tags: doc.data().tags || [],
        metadata: {
          createdAt: doc.data().metadata?.createdAt?.toDate() || new Date(),
          updatedAt: doc.data().metadata?.updatedAt?.toDate() || new Date(),
          author: doc.data().metadata?.author || 'System'
        }
      })) as Exercise[];

      exerciseCache[cacheKey] = exercises;
      return exercises;
    });
  }

  async getAllExercises(): Promise<ServiceResponse<Exercise[]>> {
    return this.fetchExercises();
  }

  async getExercisesByCategory(category: string): Promise<ServiceResponse<Exercise[]>> {
    return this.handleRequest(async () => {
      if (exerciseCache[`category-${category}`]) {
        return exerciseCache[`category-${category}`];
      }

      const { data: exercises, error } = await this.getAllExercises();
      if (error) {
        throw error;
      }

      if (!exercises) {
        return [];
      }

      const filteredExercises = exercises.filter(exercise => exercise.category === category);
      exerciseCache[`category-${category}`] = filteredExercises;
      return filteredExercises;
    });
  }

  async getExerciseById(id: string): Promise<ServiceResponse<Exercise | null>> {
    return this.handleRequest(async () => {
      const exerciseRef = doc(this.db, 'exercises', id);
      const docSnap = await getDoc(exerciseRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        estimatedTime: data.estimatedTime || 0,
        completedCount: data.completedCount || 0,
        category: data.category,
        tags: data.tags || [],
        metadata: {
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date(),
          author: data.metadata?.author || 'System'
        }
      };
    });
  }

  async getExerciseBySlug(slug: string): Promise<ServiceResponse<Exercise | null>> {
    return this.handleRequest(async () => {
      this.validateInput(slug, 'slug');

      const { data: exercises, error } = await this.getAllExercises();
      if (error) {
        throw error;
      }

      if (!exercises) {
        return null;
      }

      const exercise = exercises.find(exercise => exercise.id === slug);
      if (exercise) {
        return exercise;
      }

      const response = await fetch(`/content/exercises/by-slug/${slug}.json`);
      if (!response.ok) {
        return null;
      }

      return await response.json();
    });
  }

  async fetchExercisesByLesson(lessonId: string): Promise<ServiceResponse<ContentExercise[]>> {
    return this.handleRequest(async () => {
      const exercisesRef = collection(this.db, 'exercises');
      const q = query(exercisesRef, where('lessonId', '==', lessonId), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ContentExercise));
    });
  }

  async fetchExerciseById(exerciseId: string): Promise<ServiceResponse<ContentExercise>> {
    return this.handleRequest(async () => {
      const exerciseRef = doc(this.db, 'exercises', exerciseId);
      const docSnap = await getDoc(exerciseRef);
      if (!docSnap.exists()) throw new Error('Exercise not found');
      return { ...docSnap.data(), id: docSnap.id } as ContentExercise;
    });
  }

  async createExercise(exercise: Omit<ContentExercise, 'id'>): Promise<ServiceResponse<string>> {
    return this.handleRequest(async () => {
      const exercisesRef = collection(this.db, 'exercises');
      const docRef = await addDoc(exercisesRef, exercise);
      return docRef.id;
    });
  }

  async updateExercise(exerciseId: string, data: Partial<ContentExercise>): Promise<ServiceResponse<void>> {
    return this.handleRequest(async () => {
      const exerciseRef = doc(this.db, 'exercises', exerciseId);
      await updateDoc(exerciseRef, data);
    });
  }

  async deleteExercise(exerciseId: string): Promise<ServiceResponse<void>> {
    return this.handleRequest(async () => {
      const exerciseRef = doc(this.db, 'exercises', exerciseId);
      await deleteDoc(exerciseRef);
    });
  }

  clearExerciseCache(): void {
    exerciseCache = {};
  }
}

export const exerciseService = new ExerciseService();

// Export the fetchExercises function for direct use
export const fetchExercises = async (options: ExerciseFilterOptions = {}): Promise<Exercise[]> => {
  const service = new ExerciseService();
  const response = await service.fetchExercises(options);
  if (response.error) {
    throw response.error;
  }
  return response.data || [];
};

// Export the getAllExercises function for direct use
export const getAllExercises = async (): Promise<ServiceResponse<Exercise[]>> => {
  const service = new ExerciseService();
  return service.getAllExercises();
};

// Standalone functions for direct use
export const fetchExercisesByLesson = async (lessonId: string) => {
  const service = new ExerciseService();
  return service.fetchExercisesByLesson(lessonId);
};

export const fetchExerciseById = async (exerciseId: string) => {
  const service = new ExerciseService();
  return service.fetchExerciseById(exerciseId);
};

export const createExercise = async (exercise: Omit<ContentExercise, 'id'>) => {
  const service = new ExerciseService();
  return service.createExercise(exercise);
};

export const updateExercise = async (exerciseId: string, data: Partial<ContentExercise>) => {
  const service = new ExerciseService();
  return service.updateExercise(exerciseId, data);
};

export const deleteExercise = async (exerciseId: string) => {
  const service = new ExerciseService();
  return service.deleteExercise(exerciseId);
};