/**
 * CSRF Middleware for SvelteKit API endpoints
 * 
 * This module provides server-side CSRF protection for API endpoints.
 */

import { error, type RequestEvent } from '@sveltejs/kit';
import { CSRF_HEADER } from '$lib/utils/csrfProtection';

/**
 * Middleware to validate CSRF tokens on server-side API requests.
 * Use this in API routes that modify state (POST, PUT, DELETE, etc.)
 * 
 * Usage:
 * 
 * // In a +server.ts file:
 * import { validateCsrfToken } from '../csrfMiddleware';
 * 
 * export async function POST(event) {
 *   // Validate CSRF token first
 *   validateCsrfToken(event);
 *   
 *   // Rest of your handler code...
 * }
 */
export function validateCsrfToken(event: RequestEvent): void {
  // Skip CSRF validation for GET and HEAD requests (they should be idempotent)
  if (['GET', 'HEAD'].includes(event.request.method)) {
    return;
  }
  
  // Get the CSRF token from the request header
  const token = event.request.headers.get(CSRF_HEADER);
  
  // Get CSRF secret from environment variables
  const csrfSecret = import.meta.env.VITE_CSRF_SECRET || 'default-csrf-secret-change-in-production';
  
  // In a real application, you'd validate against a token stored in the user's session
  // For this simplified example, we'll just check if a token exists
  if (!token) {
    throw error(403, {
      message: 'CSRF token missing'
    });
  }
  
  // In a real implementation, you would verify the token against one stored in the user's session
  // This is a simplified placeholder implementation
  
  // For now, we're just checking if the token exists and has a reasonable length
  if (token.length < 16) {
    throw error(403, {
      message: 'Invalid CSRF token'
    });
  }
  
  // Token is valid, continue with the request
  return;
} 