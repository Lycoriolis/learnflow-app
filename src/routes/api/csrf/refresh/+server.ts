/**
 * CSRF token refresh endpoint
 * 
 * Generates a new CSRF token and returns it in the response headers
 */
import { setupCsrfToken } from '$lib/utils/csrf.server.js';
import { CSRF_HEADER } from '$lib/utils/csrf.types.js';
import type { RequestEvent } from '@sveltejs/kit';

// Server-side only check
if (typeof window !== 'undefined') {
  throw new Error('This endpoint should only be imported on the server!');
}

export function GET(event: RequestEvent) {
  // Generate a new CSRF token
  const token = setupCsrfToken(event.cookies);
  
  // Return an empty response with the token in headers
  return new Response(null, {
    status: 200,
    headers: {
      [CSRF_HEADER]: token
    }
  });
}