/**
 * Shared CSRF types and constants for both client and server
 * This file should only contain types, interfaces, and constants
 * No implementation code should be here
 */

// The header name used for CSRF token transmission
export const CSRF_HEADER = 'X-CSRF-Token';

// Cookie name for CSRF token storage
export const CSRF_COOKIE = 'csrf_token';

// Interface for CSRF token responses
export interface CsrfToken {
  token: string;
}