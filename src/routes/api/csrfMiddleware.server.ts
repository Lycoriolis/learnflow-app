/**
 * CSRF middleware for protecting API endpoints
 */
import type { Handle } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { validateCsrfToken, setupCsrfToken } from '$lib/utils/csrf.server';
import { CSRF_HEADER } from '$lib/utils/csrf.types';

// Server-side only check
if (typeof window !== 'undefined') {
  throw new Error('csrfMiddleware.ts should only be imported on the server!');
}

export const csrfProtect: Handle = async ({ event, resolve }) => {
  // Skip CSRF check for GET requests (they should be idempotent)
  if (event.request.method === 'GET') {
    // Generate a new token for the next request
    const newToken = setupCsrfToken(event.cookies);
    const response = await resolve(event);
    
    // Add the token to response headers
    const headers = new Headers(response.headers);
    headers.set(CSRF_HEADER, newToken);
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
  
  // For non-GET requests, validate the token
  const headerToken = event.request.headers.get(CSRF_HEADER);
  
  if (!validateCsrfToken(event.cookies, headerToken)) {
    throw error(403, {
      message: 'CSRF token validation failed'
    });
  }
  
  // Generate a new token for the next request
  const newToken = setupCsrfToken(event.cookies);
  const response = await resolve(event);
  
  // Add the new token to response headers
  const headers = new Headers(response.headers);
  headers.set(CSRF_HEADER, newToken);
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};