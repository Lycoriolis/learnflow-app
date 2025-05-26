import { CSRF_HEADER } from './csrfTypes';

/**
 * Retrieves the CSRF token from the page's meta tags
 */
export function getCsrfToken(): string | null {
  // First check for token in meta tag
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  if (metaTag && metaTag.getAttribute('content')) {
    return metaTag.getAttribute('content');
  }
  
  // Fallback to localStorage
  return localStorage.getItem('csrf_token');
}

/**
 * Stores a CSRF token for future use
 */
export function storeCsrfToken(token: string): void {
  localStorage.setItem('csrf_token', token);
  
  let metaTag = document.querySelector('meta[name="csrf-token"]');
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'csrf-token');
    document.head.appendChild(metaTag);
  }
  metaTag.setAttribute('content', token);
}

/**
 * Updates the CSRF token from response headers if present
 */
export function updateCsrfTokenFromResponse(response: Response): void {
  const newToken = response.headers.get(CSRF_HEADER);
  if (newToken) {
    storeCsrfToken(newToken);
  }
}

/**
 * Initializes CSRF protection by requesting a new token
 */
export async function initializeCsrf(): Promise<void> {
  try {
    const response = await fetch('/api/csrf/init', {
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