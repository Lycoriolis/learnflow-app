// Admin service server-side functions
// This file contains admin-related functions that use server-only APIs
import { adminDb } from '$lib/server/firebaseAdmin';

/**
 * Server-side function to check admin status
 * @param userId The user ID to check
 * @returns Promise<boolean> True if the user is an admin
 */
export async function verifyAdminServer(userId: string): Promise<boolean> {
  try {
    const userRef = adminDb.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) return false;
    
    const userData = userDoc.data();
    return userData?.role === 'admin';
  } catch (error) {
    console.error('Error verifying admin on server:', error);
    return false;
  }
}

/**
 * Get all admin users - server-side implementation
 * @returns Promise with array of admin users
 */
export async function getAdminUsers() {
  try {
    const usersRef = adminDb.collection('users');
    const snapshot = await usersRef.where('role', '==', 'admin').get();
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }
}

/**
 * Get detailed statistics for the admin dashboard
 * @returns Promise with admin dashboard statistics
 */
export async function getAdminStats() {
  try {
    // Get user count
    const usersSnapshot = await adminDb.collection('users').get();
    const totalUsers = usersSnapshot.size;
    
    // Get courses count
    const coursesSnapshot = await adminDb.collection('courses').get();
    const totalCourses = coursesSnapshot.size;
    
    // You can add more statistics here as needed
    
    return {
      totalUsers,
      totalCourses,
      // Add more stats as needed
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
}