/**
 * Client-side CSRF protection utilities
 *
 * This module provides functions to retrieve and manage CSRF tokens
 * to protect against Cross-Site Request Forgery attacks.
 */
export declare const CSRF_HEADER = "X-CSRF-Token";
/**
 * Retrieves the CSRF token from the page's meta tags
 * This token is initially set by the server during page load
 */
export declare function getCsrfToken(): string | null;
/**
 * Stores a CSRF token for future use
 * This is typically called after receiving a new token from the server
 */
export declare function storeCsrfToken(token: string): void;
/**
 * Updates the CSRF token from response headers if present
 * Call this after each fetch request to keep the token fresh
 */
export declare function updateCsrfTokenFromResponse(response: Response): void;
