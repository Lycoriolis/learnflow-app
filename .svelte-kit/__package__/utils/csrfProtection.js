/**
 * Client-side CSRF protection utilities
 *
 * This module provides functions to retrieve and manage CSRF tokens
 * to protect against Cross-Site Request Forgery attacks.
 */
// The header name used for CSRF token transmission
export const CSRF_HEADER = 'X-CSRF-Token';
/**
 * Retrieves the CSRF token from the page's meta tags
 * This token is initially set by the server during page load
 */
export function getCsrfToken() {
    // First check for token in meta tag (set during initial page load)
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag && metaTag.getAttribute('content')) {
        return metaTag.getAttribute('content');
    }
    // Fallback to localStorage (may have been set by a previous fetch response)
    return localStorage.getItem('csrf_token');
}
/**
 * Stores a CSRF token for future use
 * This is typically called after receiving a new token from the server
 */
export function storeCsrfToken(token) {
    localStorage.setItem('csrf_token', token);
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
 * Updates the CSRF token from response headers if present
 * Call this after each fetch request to keep the token fresh
 */
export function updateCsrfTokenFromResponse(response) {
    const newToken = response.headers.get(CSRF_HEADER);
    if (newToken) {
        storeCsrfToken(newToken);
    }
}
