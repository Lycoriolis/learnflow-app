// src/lib/services/courses/courseService.ts
import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import type { Course, Module, Lesson, Exercise, Category } from '../../types/content';
import type { ServiceResponse } from '../../types/shared';
import { BaseService } from '../baseService';
import { db } from '../../../lib/firebase'; // Import the initialized Firebase instances

// Define the ContentNode type which represents courses and exercises
export interface ContentNode {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  content?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: string | number; // Allow number or string for duration
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isPublished?: boolean;
  order?: number;
  type?: 'course' | 'exercise' | 'module';
  prerequisites?: string[];
  children?: ContentNode[];
  parentId?: string;
  slug?: string;
}

// Cache for courses
const courseCache: Record<string, Course> = {};
const categoryCache: Record<string, Category[]> = {};

export class CourseService extends BaseService {
  private db = db; // Use the already initialized Firestore instance

  async fetchCourses(): Promise<ServiceResponse<Course[]>> {
    return this.handleRequest(async () => {
      const coursesRef = collection(this.db, 'courses');
      const q = query(coursesRef, orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Course));
    });
  }

  async fetchCourseById(id: string): Promise<ServiceResponse<Course>> {
    return this.handleRequest(async () => {
      const courseRef = doc(this.db, 'courses', id);
      const docSnap = await getDoc(courseRef);
      
      if (!docSnap.exists()) {
        throw new Error('Course not found');
      }

      return {
        ...docSnap.data(),
        id: docSnap.id
      } as Course;
    });
  }

  async fetchCourseBySlug(slug: string): Promise<ServiceResponse<Course>> {
    return this.handleRequest(async () => {
      const coursesRef = collection(this.db, 'courses');
      const q = query(coursesRef, where('slug', '==', slug));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        throw new Error('Course not found');
      }

      const doc = snapshot.docs[0];
      return {
        ...doc.data(),
        id: doc.id
      } as Course;
    });
  }

  async fetchCourseModules(courseId: string): Promise<ServiceResponse<Module[]>> {
    return this.handleRequest(async () => {
      const modulesRef = collection(this.db, 'modules');
      const q = query(
        modulesRef,
        where('courseId', '==', courseId),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Module));
    });
  }

  async fetchModuleLessons(moduleId: string): Promise<ServiceResponse<Lesson[]>> {
    return this.handleRequest(async () => {
      const lessonsRef = collection(this.db, 'lessons');
      const q = query(
        lessonsRef,
        where('moduleId', '==', moduleId),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Lesson));
    });
  }

  async fetchLessonExercises(lessonId: string): Promise<ServiceResponse<Exercise[]>> {
    return this.handleRequest(async () => {
      const exercisesRef = collection(this.db, 'exercises');
      const q = query(
        exercisesRef,
        where('lessonId', '==', lessonId),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Exercise));
    });
  }

  async fetchCourseCategories(): Promise<ServiceResponse<Category[]>> {
    return this.handleRequest(async () => {
      if (categoryCache['all']) {
        return categoryCache['all'];
      }

      const categoriesRef = collection(this.db, 'categories');
      const q = query(categoriesRef, orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      
      const categories = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Category));

      categoryCache['all'] = categories;
      return categories;
    });
  }

  async fetchCoursesByCategory(categoryId: string): Promise<ServiceResponse<Course[]>> {
    return this.handleRequest(async () => {
      const coursesRef = collection(this.db, 'courses');
      const q = query(
        coursesRef,
        where('category', '==', categoryId),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Course));
    });
  }

  clearCache(): void {
    Object.keys(courseCache).forEach(key => delete courseCache[key]);
    Object.keys(categoryCache).forEach(key => delete categoryCache[key]);
  }
}

// Export standalone functions for direct use
export const fetchCourses = async (): Promise<ServiceResponse<Course[]>> => {
  const service = new CourseService();
  return service.fetchCourses();
};

export const fetchCourseById = async (id: string): Promise<ServiceResponse<Course>> => {
  const service = new CourseService();
  return service.fetchCourseById(id);
};

export const fetchCourseBySlug = async (slug: string): Promise<ServiceResponse<Course>> => {
  const service = new CourseService();
  return service.fetchCourseBySlug(slug);
};

export const fetchCourseModules = async (courseId: string): Promise<ServiceResponse<Module[]>> => {
  const service = new CourseService();
  return service.fetchCourseModules(courseId);
};

export const fetchModuleLessons = async (moduleId: string): Promise<ServiceResponse<Lesson[]>> => {
  const service = new CourseService();
  return service.fetchModuleLessons(moduleId);
};

export const fetchLessonExercises = async (lessonId: string): Promise<ServiceResponse<Exercise[]>> => {
  const service = new CourseService();
  return service.fetchLessonExercises(lessonId);
};

export const fetchCourseCategories = async (): Promise<ServiceResponse<Category[]>> => {
  const service = new CourseService();
  return service.fetchCourseCategories();
};

export const fetchCoursesByCategory = async (categoryId: string): Promise<ServiceResponse<Course[]>> => {
  const service = new CourseService();
  return service.fetchCoursesByCategory(categoryId);
};