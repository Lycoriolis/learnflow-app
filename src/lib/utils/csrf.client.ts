/**
 * Client-side CSRF protection utilities
 */
import { CSRF_HEADER, CSRF_COOKIE } from './csrf.types.js';

/**
 * Retrieves the current CSRF token from either meta tag or localStorage
 */
export function getCsrfToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // First check for token in meta tag (set during initial page load)
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  if (metaTag && metaTag.getAttribute('content')) {
    return metaTag.getAttribute('content');
  }
  
  // Fallback to localStorage
  return localStorage.getItem(CSRF_COOKIE);
}

/**
 * Stores a CSRF token in localStorage and updates meta tag
 */
export function storeCsrfToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(CSRF_COOKIE, token);
  
  // Also update the meta tag if it exists
  let metaTag = document.querySelector('meta[name="csrf-token"]');
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'csrf-token');
    document.head.appendChild(metaTag);
  }
  metaTag.setAttribute('content', token);
}

/**
 * Updates CSRF token from response headers if present
 */
export function updateCsrfTokenFromResponse(response: Response): void {
  const newToken = response.headers.get(CSRF_HEADER);
  if (newToken) {
    storeCsrfToken(newToken);
  }
}

/**
 * Initializes CSRF protection by requesting a new token from server
 */
export async function initializeCsrf(): Promise<void> {
  try {
    const response = await fetch('/api/csrf/refresh', {
      method: 'GET',
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      console.warn('Failed to initialize CSRF token');
      return;
    }
    
    const token = response.headers.get(CSRF_HEADER);
    if (token) {
      storeCsrfToken(token);
    }
  } catch (error) {
    console.error('Error initializing CSRF token:', error);
  }
}