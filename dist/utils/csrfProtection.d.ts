/**
 * CSRF Protection Utilities
 *
 * This module provides functions to generate and validate CSRF tokens for
 * protecting forms and API endpoints from Cross-Site Request Forgery attacks.
 */
/**
 * Generates a CSRF token for the current user session
 * In a real application, this should be tied to the user's session
 */
export declare function generateCsrfToken(): string;
/**
 * Get the current CSRF token or generate a new one
 */
export declare function getCsrfToken(): string;
/**
 * Validates a CSRF token against the stored token
 */
export declare function validateCsrfToken(token: string): boolean;
/**
 * Header name for CSRF token
 */
export declare const CSRF_HEADER = "X-CSRF-Token";
/**
 * Adds CSRF token to a fetch request's headers
 */
export declare function addCsrfHeader(headers?: HeadersInit): HeadersInit;
