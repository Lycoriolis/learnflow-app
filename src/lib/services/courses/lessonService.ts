import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import type { Lesson } from '../../types/content';
import type { ServiceResponse } from '../../types/shared';
import { db } from '../../../lib/firebase';
import { BaseService } from '../baseService';

export class LessonService extends BaseService {
  private db = db;

  async fetchLessonsByModule(moduleId: string): Promise<ServiceResponse<Lesson[]>> {
    return this.handleRequest(async () => {
      const lessonsRef = collection(this.db, 'lessons');
      const q = query(lessonsRef, where('moduleId', '==', moduleId), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Lesson));
    });
  }

  async fetchLessonById(lessonId: string): Promise<ServiceResponse<Lesson>> {
    return this.handleRequest(async () => {
      const lessonRef = doc(this.db, 'lessons', lessonId);
      const docSnap = await getDoc(lessonRef);
      if (!docSnap.exists()) throw new Error('Lesson not found');
      return { ...docSnap.data(), id: docSnap.id } as Lesson;
    });
  }

  async createLesson(lesson: Omit<Lesson, 'id'>): Promise<ServiceResponse<string>> {
    return this.handleRequest(async () => {
      const lessonsRef = collection(this.db, 'lessons');
      const docRef = await addDoc(lessonsRef, lesson);
      return docRef.id;
    });
  }

  async updateLesson(lessonId: string, data: Partial<Lesson>): Promise<ServiceResponse<void>> {
    return this.handleRequest(async () => {
      const lessonRef = doc(this.db, 'lessons', lessonId);
      await updateDoc(lessonRef, data);
    });
  }

  async deleteLesson(lessonId: string): Promise<ServiceResponse<void>> {
    return this.handleRequest(async () => {
      const lessonRef = doc(this.db, 'lessons', lessonId);
      await deleteDoc(lessonRef);
    });
  }
}

// Standalone functions for direct use
export const fetchLessonsByModule = async (moduleId: string) => {
  const service = new LessonService();
  return service.fetchLessonsByModule(moduleId);
};

export const fetchLessonById = async (lessonId: string) => {
  const service = new LessonService();
  return service.fetchLessonById(lessonId);
};

export const createLesson = async (lesson: Omit<Lesson, 'id'>) => {
  const service = new LessonService();
  return service.createLesson(lesson);
};

export const updateLesson = async (lessonId: string, data: Partial<Lesson>) => {
  const service = new LessonService();
  return service.updateLesson(lessonId, data);
};

export const deleteLesson = async (lessonId: string) => {
  const service = new LessonService();
  return service.deleteLesson(lessonId);
}; 