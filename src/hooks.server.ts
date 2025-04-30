// hooks.server.ts - Server-side only hooks
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { csrfProtect } from './routes/api/csrfMiddleware.server.js';
import { authMiddleware, requireAuth } from './routes/api/authMiddleware.server.js';

// Define API routes that require authentication
const authRequiredPaths = [
  '/api/score',
  '/api/recommendations',
  '/api/activities'
];

// Chain middleware functions based on route
export const handle: Handle = async ({ event, resolve }) => {
  // For API routes 
  if (event.url.pathname.startsWith('/api')) {
    // Get base route without query parameters
    const path = event.url.pathname;
    
    // For most API routes, apply authentication check after CSRF
    if (authRequiredPaths.some(route => path.startsWith(route))) {
      // Apply sequence of middlewares: first CSRF, then require authentication
      return sequence(csrfProtect, requireAuth)({ event, resolve });
    }
    
    // For other API routes like CSRF token refresh, just apply CSRF protection
    return sequence(csrfProtect, authMiddleware)({ event, resolve });
  }
  
  // For non-API routes, just pass through
  return resolve(event);
};