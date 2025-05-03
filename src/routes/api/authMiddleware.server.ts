// Firebase authentication middleware for API routes
import type { Handle, RequestEvent } from '@sveltejs/kit';
// Import adminAuth from the correct server-side file
import { adminAuth } from '$lib/server/firebaseAdmin';
import type { DecodedIdToken } from 'firebase-admin/auth';

// Define the proper Locals interface
interface Locals {
  user?: DecodedIdToken;
  csrfToken?: string;
  isAuthenticated?: boolean;
}

// Type for request event with decoded user
interface RequestEventWithAuth extends RequestEvent {
  locals: Locals;
}

// Middleware that adds decoded Firebase token to `locals.user` if available
export const authMiddleware: Handle = async ({ event, resolve }) => {
  const authHeader = event.request.headers.get('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      // Verify and decode the Firebase token
      const decodedToken = await adminAuth.verifyIdToken(token);
      // Add the decoded token to locals
      event.locals.user = decodedToken;
      console.log(`User authenticated: ${decodedToken.uid}`);
    } catch (error) {
      console.error('Token verification failed:', error);
      // Don't set event.locals.user if token is invalid
    }
  }
  
  // Continue to the next middleware or route handler
  return resolve(event);
};

// Middleware that requires authentication (for protected routes)
export const requireAuth: Handle = async ({ event, resolve }) => {
  // First apply the standard auth middleware to verify and decode the token
  await authMiddleware({ event, resolve: e => Promise.resolve(new Response()) });
  
  // Now check if user is authenticated
  if (!event.locals.user) {
    // No valid user found, return 401 Unauthorized
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  // User is authenticated, continue to the next middleware or route handler
  return resolve(event);
};