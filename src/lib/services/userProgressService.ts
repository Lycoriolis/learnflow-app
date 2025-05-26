import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { UserProgress } from '../types/content';
import type { ServiceResponse } from '../types/shared';
import { db } from '../../lib/firebase';
import { BaseService } from './baseService';

export class UserProgressService extends BaseService {
  private db = db;

  async fetchUserProgress(userId: string): Promise<ServiceResponse<UserProgress[]>> {
    return this.handleRequest(async () => {
      const progressRef = collection(this.db, 'userProgress');
      const q = query(progressRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as UserProgress));
    });
  }

  async fetchProgressById(progressId: string): Promise<ServiceResponse<UserProgress>> {
    return this.handleRequest(async () => {
      const progressRef = doc(this.db, 'userProgress', progressId);
      const docSnap = await getDoc(progressRef);
      if (!docSnap.exists()) throw new Error('Progress not found');
      return { ...docSnap.data(), id: docSnap.id } as unknown as UserProgress;
    });
  }

  async updateProgress(progressId: string, data: Partial<UserProgress>): Promise<ServiceResponse<void>> {
    return this.handleRequest(async () => {
      const progressRef = doc(this.db, 'userProgress', progressId);
      await updateDoc(progressRef, data);
    });
  }

  async createProgress(progress: Omit<UserProgress, 'id'>): Promise<ServiceResponse<string>> {
    return this.handleRequest(async () => {
      const progressRef = collection(this.db, 'userProgress');
      const docRef = await addDoc(progressRef, progress);
      return docRef.id;
    });
  }

  async deleteProgress(progressId: string): Promise<ServiceResponse<void>> {
    return this.handleRequest(async () => {
      const progressRef = doc(this.db, 'userProgress', progressId);
      await deleteDoc(progressRef);
    });
  }
}

// Standalone functions for direct use
export const fetchUserProgress = async (userId: string) => {
  const service = new UserProgressService();
  return service.fetchUserProgress(userId);
};

export const fetchProgressById = async (progressId: string) => {
  const service = new UserProgressService();
  return service.fetchProgressById(progressId);
};

export const updateProgress = async (progressId: string, data: Partial<UserProgress>) => {
  const service = new UserProgressService();
  return service.updateProgress(progressId, data);
};

export const createProgress = async (progress: Omit<UserProgress, 'id'>) => {
  const service = new UserProgressService();
  return service.createProgress(progress);
};

export const deleteProgress = async (progressId: string) => {
  const service = new UserProgressService();
  return service.deleteProgress(progressId);
}; 