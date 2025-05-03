// Firebase database utility functions for common operations
import { db } from '$lib/firebase/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

/**
 * Create a new document in a collection
 * @param collectionName The name of the collection
 * @param data The data to store in the document
 * @param id Optional ID for the document (will be auto-generated if not provided)
 * @returns The ID of the created document
 */
export async function createDocument(collectionName: string, data: any, id?: string) {
  try {
    const timestamp = serverTimestamp();
    const dataWithTimestamp = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    if (id) {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, dataWithTimestamp);
      return id;
    } else {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, dataWithTimestamp);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
}

/**
 * Get a document by ID
 * @param collectionName The name of the collection
 * @param id The ID of the document
 * @returns The document data or null if not found
 */
export async function getDocument(collectionName: string, id: string) {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
}

/**
 * Update a document by ID
 * @param collectionName The name of the collection
 * @param id The ID of the document
 * @param data The data to update in the document
 */
export async function updateDocument(collectionName: string, id: string, data: any) {
  try {
    const docRef = doc(db, collectionName, id);
    const dataWithTimestamp = {
      ...data,
      updatedAt: serverTimestamp()
    };
    await updateDoc(docRef, dataWithTimestamp);
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
}

/**
 * Delete a document by ID
 * @param collectionName The name of the collection
 * @param id The ID of the document
 */
export async function deleteDocument(collectionName: string, id: string) {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

/**
 * Query documents in a collection
 * @param collectionName The name of the collection
 * @param conditions Array of condition objects with field, operator, and value
 * @param orderByField Optional field to order results by
 * @param orderDirection Optional direction to order results ('asc' or 'desc')
 * @param limitCount Optional number of results to limit to
 * @returns Array of documents matching the query
 */
export async function queryDocuments(
  collectionName: string, 
  conditions: Array<{field: string, operator: string, value: any}> = [],
  orderByField?: string,
  orderDirection: 'asc' | 'desc' = 'asc',
  limitCount?: number
) {
  try {
    const collectionRef = collection(db, collectionName);
    
    // Build query constraints
    const queryConstraints = [];
    
    // Add where clauses
    for (const condition of conditions) {
      queryConstraints.push(where(condition.field, condition.operator as any, condition.value));
    }
    
    // Add order by
    if (orderByField) {
      queryConstraints.push(orderBy(orderByField, orderDirection));
    }
    
    // Add limit
    if (limitCount) {
      queryConstraints.push(limit(limitCount));
    }
    
    // Execute query
    const q = query(collectionRef, ...queryConstraints);
    const querySnapshot = await getDocs(q);
    
    // Return documents
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
}