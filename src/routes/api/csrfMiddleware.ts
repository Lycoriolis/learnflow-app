/**
 * CSRF Middleware for SvelteKit API endpoints
 * 
 * This module provides server-side CSRF protection for API endpoints.
 */

import type { Handle } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import crypto from 'crypto';

// The header name used for CSRF token transmission (keep in sync with client)
export const CSRF_HEADER = 'X-CSRF-Token';

/**
 * Generates a cryptographically secure random token
 */
function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * CSRF protection middleware for SvelteKit
 * This should be used on all server-side API routes that modify data
 */
export const csrfProtect: Handle = async ({ event, resolve }) => {
  // Skip CSRF check for GET requests (they should be idempotent)
  if (event.request.method === 'GET') {
    // Generate a new token for the next request
    const newToken = generateCsrfToken();
    event.cookies.set('csrf_token', newToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    
    const response = await resolve(event);
    const headers = new Headers(response.headers);
    headers.set(CSRF_HEADER, newToken);
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
  
  // For non-GET requests, verify the token
  const cookieToken = event.cookies.get('csrf_token');
  const headerToken = event.request.headers.get(CSRF_HEADER);
  
  // Both tokens must exist and match
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    throw error(403, {
      message: 'CSRF token validation failed'
    });
  }
  
  // Generate a new token for the next request
  const newToken = generateCsrfToken();
  event.cookies.set('csrf_token', newToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 // 24 hours
  });
  
  const response = await resolve(event);
  const headers = new Headers(response.headers);
  headers.set(CSRF_HEADER, newToken);
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};

// Export a helper to initialize CSRF protection on first page load
export function initializeCsrf(cookies: any) {
  const existingToken = cookies.get('csrf_token');
  if (!existingToken) {
    const newToken = generateCsrfToken();
    cookies.set('csrf_token', newToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    return newToken;
  }
  return existingToken;
}