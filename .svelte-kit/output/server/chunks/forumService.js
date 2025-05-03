import { getFirestore, collection, getDocs, Timestamp, addDoc, doc, deleteDoc, getDoc, updateDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
class ServiceError extends Error {
  constructor(message, code, status = 500) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = "ServiceError";
  }
}
class BaseService {
  async handleRequest(fn) {
    try {
      const data = await fn();
      return { data, error: null };
    } catch (error) {
      return this.handleError(error);
    }
  }
  handleError(error) {
    if (error instanceof ServiceError) {
      return { data: null, error };
    }
    if (error instanceof Error) {
      return {
        data: null,
        error: new ServiceError(error.message, "INTERNAL_ERROR")
      };
    }
    return {
      data: null,
      error: new ServiceError("An unknown error occurred", "UNKNOWN_ERROR")
    };
  }
  validateId(id) {
    if (!id) {
      throw new ServiceError("Invalid ID provided", "INVALID_ID", 400);
    }
  }
  validateInput(input, fieldName) {
    if (!input) {
      throw new ServiceError(`Invalid ${fieldName} provided`, "INVALID_INPUT", 400);
    }
  }
}
class ForumService extends BaseService {
  db = getFirestore();
  auth = getAuth();
  async getForumCategories() {
    return this.handleRequest(async () => {
      const categoriesRef = collection(this.db, "forumCategories");
      const snapshot = await getDocs(categoriesRef);
      return snapshot.docs.map((doc2) => ({
        id: doc2.id,
        ...doc2.data()
      }));
    });
  }
  async createForumTopic(topic) {
    return this.handleRequest(async () => {
      const user = this.auth.currentUser;
      if (!user) {
        throw new ServiceError("Unauthorized", "UNAUTHORIZED", 401);
      }
      const topicsRef = collection(this.db, "forumTopics");
      const newTopic = {
        ...topic,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
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
      };
    });
  }
  async createForumPost(post) {
    return this.handleRequest(async () => {
      const user = this.auth.currentUser;
      if (!user) {
        throw new ServiceError("Unauthorized", "UNAUTHORIZED", 401);
      }
      const postsRef = collection(this.db, "forumPosts");
      const newPost = {
        ...post,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
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
      };
    });
  }
  async createCategory(category) {
    return this.handleRequest(async () => {
      const categoriesRef = collection(this.db, "forumCategories");
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
      };
    });
  }
  async deleteCategory(categoryId) {
    return this.handleRequest(async () => {
      const categoryRef = doc(this.db, "forumCategories", categoryId);
      await deleteDoc(categoryRef);
    });
  }
  async getCategory(categoryId) {
    return this.handleRequest(async () => {
      const categoryRef = doc(this.db, "forumCategories", categoryId);
      const docSnap = await getDoc(categoryRef);
      if (!docSnap.exists()) {
        throw new ServiceError("Category not found", "NOT_FOUND", 404);
      }
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    });
  }
  async updateCategory(categoryId, updates) {
    return this.handleRequest(async () => {
      const categoryRef = doc(this.db, "forumCategories", categoryId);
      const updatesWithTimestamp = {
        ...updates,
        updatedAt: Timestamp.now()
      };
      await updateDoc(categoryRef, updatesWithTimestamp);
      const updatedDoc = await getDoc(categoryRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    });
  }
  async getForumTopic(topicId) {
    return this.handleRequest(async () => {
      const topicRef = doc(this.db, "forumTopics", topicId);
      const docSnap = await getDoc(topicRef);
      if (!docSnap.exists()) {
        throw new ServiceError("Topic not found", "NOT_FOUND", 404);
      }
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    });
  }
  async updateTopic(topicId, updates) {
    return this.handleRequest(async () => {
      const topicRef = doc(this.db, "forumTopics", topicId);
      const updatesWithTimestamp = {
        ...updates,
        updatedAt: Timestamp.now()
      };
      await updateDoc(topicRef, updatesWithTimestamp);
      const updatedDoc = await getDoc(topicRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    });
  }
  async deleteTopic(topicId) {
    return this.handleRequest(async () => {
      const topicRef = doc(this.db, "forumTopics", topicId);
      await deleteDoc(topicRef);
    });
  }
  async getCategories() {
    return this.getForumCategories();
  }
  async getTopics(categoryId) {
    return this.handleRequest(async () => {
      const topicsRef = collection(this.db, "forumTopics");
      let q = query(topicsRef);
      if (categoryId) {
        q = query(q, where("categoryId", "==", categoryId));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc2) => ({
        id: doc2.id,
        ...doc2.data()
      }));
    });
  }
  async getTopic(topicId) {
    return this.getForumTopic(topicId);
  }
  async getPostsByTopicId(topicId) {
    return this.handleRequest(async () => {
      const postsRef = collection(this.db, "forumPosts");
      const q = query(postsRef, where("topicId", "==", topicId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc2) => ({
        id: doc2.id,
        ...doc2.data()
      }));
    });
  }
  async updatePost(postId, updates) {
    return this.handleRequest(async () => {
      const postRef = doc(this.db, "forumPosts", postId);
      const updatesWithTimestamp = { ...updates, updatedAt: Timestamp.now() };
      await updateDoc(postRef, updatesWithTimestamp);
      const updatedSnap = await getDoc(postRef);
      return { id: updatedSnap.id, ...updatedSnap.data() };
    });
  }
  async deletePost(postId) {
    return this.handleRequest(async () => {
      const postRef = doc(this.db, "forumPosts", postId);
      await deleteDoc(postRef);
    });
  }
}
const createForumTopic = async (topic) => {
  const service = new ForumService();
  const response = await service.createForumTopic(topic);
  if (response.error) throw response.error;
  return response.data;
};
const createCategory = async (category) => {
  const service = new ForumService();
  const response = await service.createCategory(category);
  if (response.error) throw response.error;
  return response.data;
};
const deleteCategory = async (categoryId) => {
  const service = new ForumService();
  const response = await service.deleteCategory(categoryId);
  if (response.error) throw response.error;
};
const getCategory = async (categoryId) => {
  const service = new ForumService();
  const response = await service.getCategory(categoryId);
  if (response.error) throw response.error;
  return response.data;
};
const updateCategory = async (categoryId, updates) => {
  const service = new ForumService();
  const response = await service.updateCategory(categoryId, updates);
  if (response.error) throw response.error;
  return response.data;
};
const updateTopic = async (topicId, updates) => {
  const service = new ForumService();
  const response = await service.updateTopic(topicId, updates);
  if (response.error) throw response.error;
  return response.data;
};
const deleteTopic = async (topicId) => {
  const service = new ForumService();
  const response = await service.deleteTopic(topicId);
  if (response.error) throw response.error;
};
const getCategories = async () => {
  const service = new ForumService();
  const response = await service.getCategories();
  if (response.error) throw response.error;
  return response.data || [];
};
const getTopics = async (categoryId) => {
  const service = new ForumService();
  const response = await service.getTopics(categoryId);
  if (response.error) throw response.error;
  return response.data || [];
};
const getTopic = async (topicId) => {
  const service = new ForumService();
  const response = await service.getTopic(topicId);
  if (response.error) throw response.error;
  return response.data;
};
const getPostsByTopicId = async (topicId) => {
  const service = new ForumService();
  const response = await service.getPostsByTopicId(topicId);
  if (response.error) throw response.error;
  return response.data || [];
};
const createPost = async (post) => {
  const service = new ForumService();
  const response = await service.createForumPost(post);
  if (response.error) throw response.error;
  return response.data;
};
const updatePost = async (postId, updates) => {
  const service = new ForumService();
  const response = await service.updatePost(postId, updates);
  if (response.error) throw response.error;
  return response.data;
};
const deletePost = async (postId) => {
  const service = new ForumService();
  const response = await service.deletePost(postId);
  if (response.error) throw response.error;
};
export {
  getCategories as a,
  updateCategory as b,
  createCategory as c,
  deleteTopic as d,
  deleteCategory as e,
  getPostsByTopicId as f,
  getTopic as g,
  createPost as h,
  updatePost as i,
  deletePost as j,
  getTopics as k,
  createForumTopic as l,
  getCategory as m,
  updateTopic as u
};
//# sourceMappingURL=forumService.js.map
