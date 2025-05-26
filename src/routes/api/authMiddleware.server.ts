// Firebase authentication middleware for API routes
import type { Handle } from '@sveltejs/kit'; // Removed unused RequestEvent import
// Import adminAuth from the correct server-side file
import { adminAuth } from '$lib/server/firebaseAdmin';
import type { DecodedIdToken } from 'firebase-admin/auth';

import type { User } from 'firebase/auth';
// import type { Locals } from '$lib/types/auth'; // Removed unused import

// Convert DecodedIdToken to User
function decodedTokenToUser(decodedToken: DecodedIdToken): User {
  return {
    uid: decodedToken.uid,
    email: decodedToken.email || null,
    displayName: decodedToken.name || null,
    photoURL: decodedToken.picture || null,
    providerId: decodedToken.firebase.sign_in_provider, // Added this line
    emailVerified: decodedToken.email_verified || false,
    phoneNumber: decodedToken.phone_number || null,
    isAnonymous: false, // DecodedIdToken does not have isAnonymous, default to false
    tenantId: decodedToken.tenant || null,
    providerData: decodedToken.firebase.identities ? Object.entries(decodedToken.firebase.identities).map(([providerId, data]) => ({
      providerId,
      uid: (data as any).uid?.[0] || decodedToken.uid, // Attempt to get provider-specific UID
      displayName: decodedToken.name || null,
      email: decodedToken.email || null,
      photoURL: decodedToken.picture || null,
      phoneNumber: decodedToken.phone_number || null,
    })) : [],
    metadata: {
      creationTime: decodedToken.iat ? new Date(decodedToken.iat * 1000).toISOString() : undefined,
      lastSignInTime: decodedToken.auth_time ? new Date(decodedToken.auth_time * 1000).toISOString() : undefined,
      // lastRefreshTime is not available in DecodedIdToken
    },
    refreshToken: '', // Not available in DecodedIdToken
    delete: async () => { throw new Error('Delete operation is not available for a token-based user object.'); },
    getIdToken: async () => { throw new Error('GetIdToken operation is not available for a token-based user object, use the original token.'); },
    getIdTokenResult: async () => { throw new Error('GetIdTokenResult operation is not available for a token-based user object.'); },
    reload: async () => { throw new Error('Reload operation is not available for a token-based user object.'); },
    toJSON: () => {
      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
        photoURL: decodedToken.picture,
        emailVerified: decodedToken.email_verified,
        phoneNumber: decodedToken.phone_number,
        isAnonymous: false,
        tenantId: decodedToken.tenant,
        providerData: decodedToken.firebase.identities ? Object.entries(decodedToken.firebase.identities).map(([providerId, data]) => ({
          providerId,
          uid: (data as any).uid?.[0] || decodedToken.uid,
          displayName: decodedToken.name,
          email: decodedToken.email,
          photoURL: decodedToken.picture,
          phoneNumber: decodedToken.phone_number,
        })) : [],
        // metadata is not directly part of User.toJSON() standard output but can be added if needed
      };
    }
  } as User;
}

// Middleware that adds decoded Firebase token to `locals.user` if available
export const authMiddleware: Handle = async ({ event, resolve }) => {
  const authHeader = event.request.headers.get('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      // Verify and decode the Firebase token
      const decodedToken = await adminAuth.verifyIdToken(token);
      // Convert DecodedIdToken to User and add to locals
      event.locals.user = decodedTokenToUser(decodedToken);
      event.locals.isAuthenticated = true;
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
  await authMiddleware({ event, resolve: () => Promise.resolve(new Response()) }); // Removed unused variable e
  
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