// src/lib/services/forums/forumService.ts
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, increment, arrayUnion, Timestamp } from 'firebase/firestore';
import { BaseService, ServiceError } from '../baseService';
import type { ServiceResponse, ForumCategory, ForumTopic, ForumPost } from '../../types/shared';
import { db, auth } from '../../../lib/firebase'; // Import the initialized Firebase instances

export class ForumService extends BaseService {
  private db = db; // Use the already initialized Firestore instance
  private auth = auth; // Use the already initialized Auth instance

  async getForumCategories(): Promise<ServiceResponse<ForumCategory[]>> {
    return this.handleRequest(async () => {
      const categoriesRef = collection(this.db, 'forumCategories');
      const snapshot = await getDocs(categoriesRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ForumCategory[];
    });
  }

  async createForumTopic(topic: Omit<ForumTopic, 'id'>): Promise<ServiceResponse<ForumTopic>> {
    return this.handleRequest(async () => {
      const user = this.auth.currentUser;
      if (!user) {
        throw new ServiceError('Unauthorized', 'UNAUTHORIZED', 401);
      }

      const topicsRef = collection(this.db, 'forumTopics');
      const newTopic = {
        ...topic,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        viewCount: 0,
        replyCount: 0,
        isPinned: false,
        isLocked: false
      };

      const docRef = await addDoc(topicsRef, newTopic);
      return {
        id: docRef.id,
        ...newTopic
      } as ForumTopic;
    });
  }

  async createForumPost(post: Omit<ForumPost, 'id'>): Promise<ServiceResponse<ForumPost>> {
    return this.handleRequest(async () => {
      const user = this.auth.currentUser;
      if (!user) {
        throw new ServiceError('Unauthorized', 'UNAUTHORIZED', 401);
      }

      const postsRef = collection(this.db, 'forumPosts');
      const newPost = {
        ...post,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        upvotes: 0,
        downvotes: 0,
        isAnswer: false
      };

      const docRef = await addDoc(postsRef, newPost);
      return {
        id: docRef.id,
        ...newPost
      } as ForumPost;
    });
  }

  async createCategory(category: Omit<ForumCategory, 'id'>): Promise<ServiceResponse<ForumCategory>> {
    return this.handleRequest(async () => {
      const categoriesRef = collection(this.db, 'forumCategories');
      const newCategory = {
        ...category,
        topicCount: 0,
        postCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(categoriesRef, newCategory);
      return {
        id: docRef.id,
        ...newCategory
      } as ForumCategory;
    });
  }

  async deleteCategory(categoryId: string): Promise<ServiceResponse<void>> {
    return this.handleRequest(async () => {
      const categoryRef = doc(this.db, 'forumCategories', categoryId);
      await deleteDoc(categoryRef);
    });
  }

  async getCategory(categoryId: string): Promise<ServiceResponse<ForumCategory>> {
    return this.handleRequest(async () => {
      const categoryRef = doc(this.db, 'forumCategories', categoryId);
      const docSnap = await getDoc(categoryRef);
      
      if (!docSnap.exists()) {
        throw new ServiceError('Category not found', 'NOT_FOUND', 404);
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as ForumCategory;
    });
  }

  async updateCategory(categoryId: string, updates: Partial<ForumCategory>): Promise<ServiceResponse<ForumCategory>> {
    return this.handleRequest(async () => {
      const categoryRef = doc(this.db, 'forumCategories', categoryId);
      const updatesWithTimestamp = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      await updateDoc(categoryRef, updatesWithTimestamp);
      const updatedDoc = await getDoc(categoryRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as ForumCategory;
    });
  }

  async getForumTopic(topicId: string): Promise<ServiceResponse<ForumTopic>> {
    return this.handleRequest(async () => {
      const topicRef = doc(this.db, 'forumTopics', topicId);
      const docSnap = await getDoc(topicRef);
      
      if (!docSnap.exists()) {
        throw new ServiceError('Topic not found', 'NOT_FOUND', 404);
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as ForumTopic;
    });
  }

  async updateTopic(topicId: string, updates: Partial<ForumTopic>): Promise<ServiceResponse<ForumTopic>> {
    return this.handleRequest(async () => {
      const topicRef = doc(this.db, 'forumTopics', topicId);
      const updatesWithTimestamp = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      await updateDoc(topicRef, updatesWithTimestamp);
      const updatedDoc = await getDoc(topicRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as ForumTopic;
    });
  }

  async deleteTopic(topicId: string): Promise<ServiceResponse<void>> {
    return this.handleRequest(async () => {
      const topicRef = doc(this.db, 'forumTopics', topicId);
      await deleteDoc(topicRef);
    });
  }

  async getCategories(): Promise<ServiceResponse<ForumCategory[]>> {
    return this.getForumCategories();
  }

  async getTopics(categoryId?: string): Promise<ServiceResponse<ForumTopic[]>> {
    return this.handleRequest(async () => {
      const topicsRef = collection(this.db, 'forumTopics');
      let q = query(topicsRef);

      if (categoryId) {
        q = query(q, where('categoryId', '==', categoryId));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ForumTopic[];
    });
  }

  async getTopic(topicId: string): Promise<ServiceResponse<ForumTopic>> {
    return this.getForumTopic(topicId);
  }

  async getPostsByTopicId(topicId: string): Promise<ServiceResponse<ForumPost[]>> {
    return this.handleRequest(async () => {
      const postsRef = collection(this.db, 'forumPosts');
      const q = query(postsRef, where('topicId', '==', topicId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ForumPost[];
    });
  }

  async updatePost(postId: string, updates: Partial<ForumPost>): Promise<ServiceResponse<ForumPost>> {
    return this.handleRequest(async () => {
      const postRef = doc(this.db, 'forumPosts', postId);
      const updatesWithTimestamp = { ...updates, updatedAt: Timestamp.now() };
      await updateDoc(postRef, updatesWithTimestamp);
      const updatedSnap = await getDoc(postRef);
      return { id: updatedSnap.id, ...updatedSnap.data() } as ForumPost;
    });
  }

  async deletePost(postId: string): Promise<ServiceResponse<void>> {
    return this.handleRequest(async () => {
      const postRef = doc(this.db, 'forumPosts', postId);
      await deleteDoc(postRef);
    });
  }
}

// Export individual functions for direct use
export const createForumTopic = async (topic: Omit<ForumTopic, 'id'>): Promise<ForumTopic> => {
  const service = new ForumService();
  const response = await service.createForumTopic(topic);
  if (response.error) throw response.error;
  return response.data!;
};

export const getForumCategories = async (): Promise<ForumCategory[]> => {
  const service = new ForumService();
  const response = await service.getForumCategories();
  if (response.error) throw response.error;
  return response.data || [];
};

export const createForumPost = async (post: Omit<ForumPost, 'id'>): Promise<ForumPost> => {
  const service = new ForumService();
  const response = await service.createForumPost(post);
  if (response.error) throw response.error;
  return response.data!;
};

export const createCategory = async (category: Omit<ForumCategory, 'id'>): Promise<ForumCategory> => {
  const service = new ForumService();
  const response = await service.createCategory(category);
  if (response.error) throw response.error;
  return response.data!;
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  const service = new ForumService();
  const response = await service.deleteCategory(categoryId);
  if (response.error) throw response.error;
};

export const getCategory = async (categoryId: string): Promise<ForumCategory> => {
  const service = new ForumService();
  const response = await service.getCategory(categoryId);
  if (response.error) throw response.error;
  return response.data!;
};

export const updateCategory = async (categoryId: string, updates: Partial<ForumCategory>): Promise<ForumCategory> => {
  const service = new ForumService();
  const response = await service.updateCategory(categoryId, updates);
  if (response.error) throw response.error;
  return response.data!;
};

export const getForumTopic = async (topicId: string): Promise<ForumTopic> => {
  const service = new ForumService();
  const response = await service.getForumTopic(topicId);
  if (response.error) throw response.error;
  return response.data!;
};

export const updateTopic = async (topicId: string, updates: Partial<ForumTopic>): Promise<ForumTopic> => {
  const service = new ForumService();
  const response = await service.updateTopic(topicId, updates);
  if (response.error) throw response.error;
  return response.data!;
};

export const deleteTopic = async (topicId: string): Promise<void> => {
  const service = new ForumService();
  const response = await service.deleteTopic(topicId);
  if (response.error) throw response.error;
};

export const getCategories = async (): Promise<ForumCategory[]> => {
  const service = new ForumService();
  const response = await service.getCategories();
  if (response.error) throw response.error;
  return response.data || [];
};

export const getTopics = async (categoryId?: string): Promise<ForumTopic[]> => {
  const service = new ForumService();
  const response = await service.getTopics(categoryId);
  if (response.error) throw response.error;
  return response.data || [];
};

export const getTopic = async (topicId: string): Promise<ForumTopic> => {
  const service = new ForumService();
  const response = await service.getTopic(topicId);
  if (response.error) throw response.error;
  return response.data!;
};

export const getPostsByTopicId = async (topicId: string): Promise<ForumPost[]> => {
  const service = new ForumService();
  const response = await service.getPostsByTopicId(topicId);
  if (response.error) throw response.error;
  return response.data || [];
};

export const createPost = async (post: Omit<ForumPost, 'id'>): Promise<ForumPost> => {
  const service = new ForumService();
  const response = await service.createForumPost(post);
  if (response.error) throw response.error;
  return response.data!;
};

export const updatePost = async (postId: string, updates: Partial<ForumPost>): Promise<ForumPost> => {
  const service = new ForumService();
  const response = await service.updatePost(postId, updates);
  if (response.error) throw response.error;
  return response.data!;
};

export const deletePost = async (postId: string): Promise<void> => {
  const service = new ForumService();
  const response = await service.deletePost(postId);
  if (response.error) throw response.error;
};