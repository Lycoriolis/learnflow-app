import type { ForumCategory, ForumTopic, ForumPost } from '$lib/types/forumTypes'; // Removed unused ForumLike
import { error } from '@sveltejs/kit';
import { db } from '$lib/firebase';
import { 
  collection, query, where, orderBy, getDocs, 
  doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc,
  increment, serverTimestamp
} from 'firebase/firestore';

// Category operations
export const getCategories = async (): Promise<ForumCategory[]> => {
  try {
    const categoriesRef = collection(db, 'forumCategories');
    const q = query(categoriesRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ForumCategory));
  } catch (err) {
    console.error('Error getting forum categories:', err);
    throw error(500, 'Failed to fetch forum categories');
  }
};

export const getCategoryById = async (id: string): Promise<ForumCategory> => {
  try {
    const docRef = doc(db, 'forumCategories', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw error(404, 'Forum category not found');
    }
    
    return { id: docSnap.id, ...docSnap.data() } as ForumCategory;
  } catch (err) {
    console.error(`Error getting forum category ${id}:`, err);
    throw error(500, 'Failed to fetch forum category');
  }
};

export const createCategory = async (category: Omit<ForumCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const categoriesRef = collection(db, 'forumCategories');
    
    const newCategory = {
      ...category,
      topicCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(categoriesRef, newCategory);
    return docRef.id;
  } catch (err) {
    console.error('Error creating forum category:', err);
    throw error(500, 'Failed to create forum category');
  }
};

export const updateCategory = async (id: string, category: Partial<Omit<ForumCategory, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    const docRef = doc(db, 'forumCategories', id);
    
    await updateDoc(docRef, {
      ...category,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error(`Error updating forum category ${id}:`, err);
    throw error(500, 'Failed to update forum category');
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'forumCategories', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`Error deleting forum category ${id}:`, err);
    throw error(500, 'Failed to delete forum category');
  }
};

// Topic operations
export const getTopics = async (categoryId?: string): Promise<ForumTopic[]> => {
  try {
    const topicsRef = collection(db, 'forumTopics');
    
    let q;
    if (categoryId) {
      q = query(
        topicsRef, 
        where('categoryId', '==', categoryId),
        orderBy('lastPostAt', 'desc')
      );
    } else {
      q = query(topicsRef, orderBy('lastPostAt', 'desc'));
    }
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data() as Omit<ForumTopic, 'id'>;
      return { id: doc.id, ...data }; // returns ForumTopic
    });
  } catch (err) {
    console.error('Error getting forum topics:', err);
    throw error(500, 'Failed to fetch forum topics');
  }
};

export const getTopicById = async (id: string): Promise<ForumTopic> => {
  try {
    const docRef = doc(db, 'forumTopics', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw error(404, 'Forum topic not found');
    }
    
    return { id: docSnap.id, ...docSnap.data() } as ForumTopic;
  } catch (err) {
    console.error(`Error getting forum topic ${id}:`, err);
    throw error(500, 'Failed to fetch forum topic');
  }
};

export const createTopic = async (topic: Omit<ForumTopic, 'id' | 'postCount' | 'viewCount' | 'lastPostAt' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const topicsRef = collection(db, 'forumTopics');
    
    const newTopic = {
      ...topic,
      postCount: 0,
      viewCount: 0,
      lastPostAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(topicsRef, newTopic);
    return docRef.id;
  } catch (err) {
    console.error('Error creating forum topic:', err);
    throw error(500, 'Failed to create forum topic');
  }
};

export const updateTopic = async (id: string, topic: Partial<Omit<ForumTopic, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    const docRef = doc(db, 'forumTopics', id);
    
    await updateDoc(docRef, {
      ...topic,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error(`Error updating forum topic ${id}:`, err);
    throw error(500, 'Failed to update forum topic');
  }
};

export const deleteTopic = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'forumTopics', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`Error deleting forum topic ${id}:`, err);
    throw error(500, 'Failed to delete forum topic');
  }
};

// Post operations
export const getPostsByTopicId = async (topicId: string): Promise<ForumPost[]> => {
  try {
    const postsRef = collection(db, 'forumPosts');
    const q = query(
      postsRef, 
      where('topic_id', '==', topicId),
      orderBy('created_at', 'asc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ForumPost));
  } catch (err) {
    console.error(`Error getting posts for topic ${topicId}:`, err);
    throw error(500, 'Failed to fetch forum posts');
  }
};

export const createPost = async (post: Omit<ForumPost, 'id' | 'likes' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    const postsRef = collection(db, 'forumPosts');
    
    const newPost = {
      ...post,
      likes: 0,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };
    
    const docRef = await addDoc(postsRef, newPost);
    
    // Update the lastPostAt field in the parent topic
    const topicRef = doc(db, 'forumTopics', post.topic_id);
    await updateDoc(topicRef, {
      lastPostAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (err) {
    console.error('Error creating forum post:', err);
    throw error(500, 'Failed to create forum post');
  }
};

export const updatePost = async (id: string, post: Partial<Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    const docRef = doc(db, 'forumPosts', id);
    
    await updateDoc(docRef, {
      ...post,
      updatedAt: serverTimestamp(),
      editedAt: serverTimestamp()
    });
  } catch (err) {
    console.error(`Error updating forum post ${id}:`, err);
    throw error(500, 'Failed to update forum post');
  }
};

export const deletePost = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'forumPosts', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error(`Error deleting forum post ${id}:`, err);
    throw error(500, 'Failed to delete forum post');
  }
};

// Like operations
export const toggleLike = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const likeId = `${postId}_${userId}`;
    const likeRef = doc(db, 'forumLikes', likeId);
    const likeDoc = await getDoc(likeRef);
    
    if (likeDoc.exists()) {
      // Unlike
      await deleteDoc(likeRef);
      const postRef = doc(db, 'forumPosts', postId);
      await updateDoc(postRef, {
        likeCount: increment(-1)
      });
      return false;
    } else {
      // Like
      await setDoc(likeRef, {
        postId,
        userId,
        createdAt: serverTimestamp()
      });
      const postRef = doc(db, 'forumPosts', postId);
      await updateDoc(postRef, {
        likeCount: increment(1)
      });
      return true;
    }
  } catch (err) {
    console.error(`Error toggling like for post ${postId} by user ${userId}:`, err);
    throw error(500, 'Failed to toggle like');
  }
};

export const checkIfUserLikedPost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const likeId = `${postId}_${userId}`;
    const likeRef = doc(db, 'forumLikes', likeId);
    const likeDoc = await getDoc(likeRef);
    return likeDoc.exists();
  } catch (err) {
    console.error(`Error checking if user ${userId} liked post ${postId}:`, err);
    throw error(500, 'Failed to check like status');
  }
};
