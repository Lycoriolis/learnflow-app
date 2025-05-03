// src/lib/services/courses/courseService.ts
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import type { CourseStructure, Lesson, Module, ServiceResponse } from '../../types/shared';
import { BaseService } from '../baseService';
import { db, auth } from '../../../lib/firebase'; // Import the initialized Firebase instances

// Define the ContentNode type which represents courses and exercises
export interface ContentNode {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  content?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
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
const courseCache: Record<string, CourseStructure> = {};
const categoryCache: Record<string, any[]> = {};

export class CourseService extends BaseService {
  private db = db; // Use the already initialized Firestore instance
  private auth = auth; // Use the already initialized Auth instance

  async fetchCourses(): Promise<ServiceResponse<CourseStructure[]>> {
    return this.handleRequest(async () => {
      const coursesRef = collection(this.db, 'courses');
      const snapshot = await getDocs(coursesRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        thumbnail: doc.data().thumbnail,
        difficulty: doc.data().difficulty,
        totalDuration: doc.data().totalDuration || 0,
        enrolledCount: doc.data().enrolledCount || 0,
        category: doc.data().category,
        tags: doc.data().tags || [],
        modules: doc.data().modules || [],
        metadata: {
          createdAt: doc.data().metadata?.createdAt?.toDate() || new Date(),
          updatedAt: doc.data().metadata?.updatedAt?.toDate() || new Date(),
          author: doc.data().metadata?.author || 'System'
        }
      }));
    });
  }

  async fetchCourseCategories(): Promise<ServiceResponse<any[]>> {
    return this.handleRequest(async () => {
      if (categoryCache['all']) {
        return categoryCache['all'];
      }

      const categoriesRef = collection(this.db, 'courseCategories');
      const snapshot = await getDocs(categoriesRef);
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      categoryCache['all'] = categories;
      return categories;
    });
  }

  async fetchCourseById(id: string): Promise<ServiceResponse<CourseStructure>> {
    return this.handleRequest(async () => {
      const courseRef = doc(this.db, 'courses', id);
      const docSnap = await getDoc(courseRef);
      
      if (!docSnap.exists()) {
        throw new Error('Course not found');
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        difficulty: data.difficulty,
        totalDuration: data.totalDuration || 0,
        enrolledCount: data.enrolledCount || 0,
        category: data.category,
        tags: data.tags || [],
        modules: data.modules || [],
        metadata: {
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date(),
          author: data.metadata?.author || 'System'
        }
      };
    });
  }

  async fetchCourseBySlug(slug: string): Promise<ServiceResponse<CourseStructure>> {
    return this.handleRequest(async () => {
      const coursesRef = collection(this.db, 'courses');
      const q = query(coursesRef, where('slug', '==', slug));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        throw new Error('Course not found');
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        difficulty: data.difficulty,
        totalDuration: data.totalDuration || 0,
        enrolledCount: data.enrolledCount || 0,
        category: data.category,
        tags: data.tags || [],
        modules: data.modules || [],
        metadata: {
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date(),
          author: data.metadata?.author || 'System'
        }
      };
    });
  }

  clearCourseCache(): void {
    Object.keys(courseCache).forEach(key => delete courseCache[key]);
    Object.keys(categoryCache).forEach(key => delete categoryCache[key]);
  }

  async listCourses(): Promise<ServiceResponse<CourseStructure[]>> {
    return this.handleRequest(async () => {
      const { data: courses, error } = await this.fetchCourses();
      if (error) {
        throw error;
      }

      if (!courses) {
        return [];
      }

      return courses.map(course => ({
        ...course,
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        difficulty: course.difficulty,
        totalDuration: course.totalDuration,
        enrolledCount: course.enrolledCount || 0,
        category: course.category,
        tags: course.tags || [],
        modules: course.modules.map(module => ({
          id: module.id,
          title: module.title,
          description: module.description,
          lessons: module.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            content: lesson.content,
            duration: lesson.duration,
            order: lesson.order,
            exercises: lesson.exercises,
            prerequisites: lesson.prerequisites,
            metadata: lesson.metadata
          })),
          order: module.order,
          duration: module.duration,
          prerequisites: module.prerequisites,
          metadata: module.metadata
        })),
        metadata: course.metadata
      }));
    });
  }

  extractModulesFromContent(content: string): Module[] {
    const modules: Module[] = [];
    const moduleRegex = /^#\s+(.+)$/gm;
    const lessonRegex = /^##\s+(.+)$/gm;
    let currentModule: Module | null = null;
    let currentLesson: Lesson | null = null;
    let moduleContent = '';
    let lessonContent = '';

    const lines = content.split('\n');
    for (const line of lines) {
      const moduleMatch = line.match(moduleRegex);
      const lessonMatch = line.match(lessonRegex);

      if (moduleMatch) {
        if (currentModule) {
          if (currentLesson) {
            currentModule.lessons.push(currentLesson);
          }
          modules.push(currentModule);
        }

        currentModule = {
          id: moduleMatch[1].toLowerCase().replace(/\s+/g, '-'),
          title: moduleMatch[1],
          description: '',
          lessons: [],
          order: modules.length + 1,
          duration: 0,
          prerequisites: [],
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            author: 'System'
          }
        };
        currentLesson = null;
        moduleContent = '';
      } else if (lessonMatch && currentModule) {
        if (currentLesson) {
          currentModule.lessons.push(currentLesson);
        }

        currentLesson = {
          id: lessonMatch[1].toLowerCase().replace(/\s+/g, '-'),
          title: lessonMatch[1],
          content: '',
          duration: 0,
          order: currentModule.lessons.length + 1,
          exercises: [],
          prerequisites: [],
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            author: 'System'
          }
        };
        lessonContent = '';
      } else if (currentLesson) {
        lessonContent += line + '\n';
        currentLesson.content = lessonContent.trim();
      } else if (currentModule) {
        moduleContent += line + '\n';
        currentModule.description = moduleContent.trim();
      }
    }

    if (currentModule) {
      if (currentLesson) {
        currentModule.lessons.push(currentLesson);
      }
      modules.push(currentModule);
    }

    return modules;
  }

  getCourseGradient(title: string, id: string, tags: string[] = []): string {
    const lowerTitle = title.toLowerCase();
    const lowerId = id.toLowerCase();
    const lowerTags = tags.map(tag => tag.toLowerCase());

    if (
      lowerTitle.includes('programming') ||
      lowerTitle.includes('code') ||
      lowerTitle.includes('developer') ||
      lowerTags.includes('programming') ||
      lowerTags.includes('code') ||
      lowerTags.includes('developer')
    ) {
      return 'from-blue-500 to-purple-600';
    }

    if (
      lowerTitle.includes('physics') ||
      lowerTitle.includes('science') ||
      lowerTags.includes('physics') ||
      lowerTags.includes('science')
    ) {
      return 'from-green-500 to-teal-600';
    }

    if (
      lowerTitle.includes('language') ||
      lowerTitle.includes('linguistics') ||
      lowerTags.includes('language') ||
      lowerTags.includes('linguistics')
    ) {
      return 'from-yellow-500 to-orange-600';
    }

    return 'from-gray-500 to-gray-700';
  }
}

// Export the fetchCourses function for direct use
export const fetchCourses = async (): Promise<ServiceResponse<CourseStructure[]>> => {
  const service = new CourseService();
  return service.fetchCourses();
};

// Export the fetchCourseCategories function for direct use
export const fetchCourseCategories = async (): Promise<ServiceResponse<any[]>> => {
  const service = new CourseService();
  return service.fetchCourseCategories();
};

// Export the fetchCourseBySlug function for direct use
export const fetchCourseBySlug = async (slug: string): Promise<ServiceResponse<CourseStructure>> => {
  const service = new CourseService();
  return service.fetchCourseBySlug(slug);
};