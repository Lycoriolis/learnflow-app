/**
 * CSRF Protection Utilities
 * 
 * This module provides functions to generate and validate CSRF tokens for
 * protecting forms and API endpoints from Cross-Site Request Forgery attacks.
 */

import { browser } from '$app/environment';

// A secret key for CSRF token generation - in production, use server environment variables
const CSRF_SECRET = import.meta.env.VITE_CSRF_SECRET || 'default-csrf-secret-change-in-production';

/**
 * Generates a CSRF token for the current user session
 * In a real application, this should be tied to the user's session
 */
export function generateCsrfToken(): string {
  if (!browser) return '';
  
  // Generate a random token
  const randomBytes = new Uint8Array(16);
  window.crypto.getRandomValues(randomBytes);
  const token = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Store in localStorage (in production, consider using secure, HttpOnly cookies)
  localStorage.setItem('csrf_token', token);
  
  return token;
}

/**
 * Get the current CSRF token or generate a new one
 */
export function getCsrfToken(): string {
  if (!browser) return '';
  
  let token = localStorage.getItem('csrf_token');
  
  if (!token) {
    token = generateCsrfToken();
  }
  
  return token;
}

/**
 * Validates a CSRF token against the stored token
 */
export function validateCsrfToken(token: string): boolean {
  if (!browser) return false;
  
  const storedToken = localStorage.getItem('csrf_token');
  
  if (!storedToken || !token) {
    return false;
  }
  
  // Use constant-time comparison to prevent timing attacks
  return timingSafeEqual(token, storedToken);
}

/**
 * Simple constant-time string comparison to prevent timing attacks
 * Note: For production, consider using more robust implementations
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Header name for CSRF token
 */
export const CSRF_HEADER = 'X-CSRF-Token';

/**
 * Adds CSRF token to a fetch request's headers
 */
export function addCsrfHeader(headers: HeadersInit = {}): HeadersInit {
  if (!browser) return headers;
  
  const headersObj = headers instanceof Headers 
    ? new Headers(headers) 
    : new Headers(headers as Record<string, string>);
  
  headersObj.set(CSRF_HEADER, getCsrfToken());
  
  return headersObj;
} 