/**
 * CSRF token initialization endpoint
 * 
 * Generates a new CSRF token and returns it in the response headers
 */
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { setupCsrfToken } from '$lib/utils/csrf.server.js';
import { CSRF_HEADER } from '$lib/utils/csrf.types.js';

// Server-side only check
if (typeof window !== 'undefined') {
  throw new Error('This endpoint should only be imported on the server!');
}

export const GET: RequestHandler = async ({ cookies }) => {
  // Generate a new CSRF token using our standard utility
  const token = setupCsrfToken(cookies);
  
  // Return the token in both the response headers and body
  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: {
      [CSRF_HEADER]: token
    }
  });
};