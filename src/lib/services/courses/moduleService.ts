import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import type { Module } from '../../types/content';
import type { ServiceResponse } from '../../types/shared';
import { db } from '../../../lib/firebase';
import { BaseService } from '../baseService';

export class ModuleService extends BaseService {
  private db = db;

  async fetchModulesByCourse(courseId: string): Promise<ServiceResponse<Module[]>> {
    return this.handleRequest(async () => {
      const modulesRef = collection(this.db, 'modules');
      const q = query(modulesRef, where('courseId', '==', courseId), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Module));
    });
  }

  async fetchModuleById(moduleId: string): Promise<ServiceResponse<Module>> {
    return this.handleRequest(async () => {
      const moduleRef = doc(this.db, 'modules', moduleId);
      const docSnap = await getDoc(moduleRef);
      if (!docSnap.exists()) throw new Error('Module not found');
      return { ...docSnap.data(), id: docSnap.id } as Module;
    });
  }

  async createModule(module: Omit<Module, 'id'>): Promise<ServiceResponse<string>> {
    return this.handleRequest(async () => {
      const modulesRef = collection(this.db, 'modules');
      const docRef = await addDoc(modulesRef, module);
      return docRef.id;
    });
  }

  async updateModule(moduleId: string, data: Partial<Module>): Promise<ServiceResponse<void>> {
    return this.handleRequest(async () => {
      const moduleRef = doc(this.db, 'modules', moduleId);
      await updateDoc(moduleRef, data);
    });
  }

  async deleteModule(moduleId: string): Promise<ServiceResponse<void>> {
    return this.handleRequest(async () => {
      const moduleRef = doc(this.db, 'modules', moduleId);
      await deleteDoc(moduleRef);
    });
  }
}

// Standalone functions for direct use
export const fetchModulesByCourse = async (courseId: string) => {
  const service = new ModuleService();
  return service.fetchModulesByCourse(courseId);
};

export const fetchModuleById = async (moduleId: string) => {
  const service = new ModuleService();
  return service.fetchModuleById(moduleId);
};

export const createModule = async (module: Omit<Module, 'id'>) => {
  const service = new ModuleService();
  return service.createModule(module);
};

export const updateModule = async (moduleId: string, data: Partial<Module>) => {
  const service = new ModuleService();
  return service.updateModule(moduleId, data);
};

export const deleteModule = async (moduleId: string) => {
  const service = new ModuleService();
  return service.deleteModule(moduleId);
}; 