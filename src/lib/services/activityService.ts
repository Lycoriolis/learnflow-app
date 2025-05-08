// src/lib/services/activityService.ts
import { collection, addDoc, query, where, orderBy, limit as firestoreLimit, getDocs, doc, updateDoc, type DocumentData } from 'firebase/firestore';
import { db } from '../firebase.js';
import { get } from 'svelte/store';
import { user } from '../stores/authStore.js';

export interface Activity {
  id: string;
  userId: string;
  eventType: string;
  referenceId?: string;
  metadata?: Record<string, any>;
  timestampStart: number;
  timestampEnd?: number;
}

/**
 * Start logging an activity
 */
export async function logStart(eventType: string, referenceId?: string, metadata?: Record<string, any>): Promise<string> {
  const activityData: any = {
    eventType,
    timestampStart: Date.now(),
  };
  
  // Get user ID from auth store instead of localStorage
  const currentUser = get(user);
  if (currentUser) {
    activityData.userId = currentUser.uid;
  } else {
    // Fallback to localStorage only if needed
    const localStorageUserId = globalThis?.localStorage?.getItem('userId');
    if (localStorageUserId) {
      activityData.userId = localStorageUserId;
    }
  }
  
  // Only add these fields if they're not undefined
  if (referenceId !== undefined) {
    activityData.referenceId = referenceId;
  }
  
  if (metadata !== undefined) {
    activityData.metadata = metadata;
  }
  
  try {
    const docRef = await addDoc(collection(db, 'activities'), activityData);
    return docRef.id;
  } catch (error) {
    console.error('Error logging activity start:', error);
    return '';
  }
}

/**
 * Log completion of an activity
 */
export async function logEnd(activityId: string): Promise<void> {
  const activityDoc = doc(db, 'activities', activityId);
  await updateDoc(activityDoc, {
    timestampEnd: Date.now()
  });
}

/**
 * Log a one-time event
 */
export async function logEvent(eventType: string, referenceId?: string, metadata?: Record<string, any>): Promise<void> {
  const now = Date.now();
  const eventData: any = {
    eventType,
    timestampStart: now,
    timestampEnd: now
  };
  
  // Get user ID from auth store instead of localStorage
  const currentUser = get(user);
  if (currentUser) {
    eventData.userId = currentUser.uid;
  } else {
    // Fallback to localStorage only if needed
    const localStorageUserId = globalThis?.localStorage?.getItem('userId');
    if (localStorageUserId) {
      eventData.userId = localStorageUserId;
    }
  }
  
  // Only add these fields if they're not undefined
  if (referenceId !== undefined) {
    eventData.referenceId = referenceId;
  }
  
  if (metadata !== undefined) {
    eventData.metadata = metadata;
  }
  
  try {
    await addDoc(collection(db, 'activities'), eventData);
  } catch (error) {
    console.error('Error logging event:', error);
  }
}

/**
 * Fetch recent activities for a user
 */
export async function getRecentActivities(userId: string, limitCount: number = 10): Promise<Activity[]> {
  const q = query(
    collection(db, 'activities'),
    where('userId', '==', userId),
    orderBy('timestampStart', 'desc'),
    firestoreLimit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Activity[];
}

/**
 * Fetch recent activities for the current user
 */
export async function fetchRecentActivities(limitCount: number = 10): Promise<Activity[]> {
  const userId = globalThis?.localStorage?.getItem('userId');
  if (!userId) return [];
  return getRecentActivities(userId, limitCount);
}