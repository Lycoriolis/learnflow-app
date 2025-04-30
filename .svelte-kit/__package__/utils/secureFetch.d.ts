/**
 * Secure Fetch Utility
 *
 * This utility wraps the browser's fetch API with security enhancements:
 * - Automatically adds CSRF token headers for non-GET/HEAD requests
 * - Includes credentials for session cookies
 * - Provides standardized error handling
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    status: number;
}
/**
 * Enhanced fetch function with CSRF protection and error handling
 *
 * @param url The URL to fetch
 * @param options Fetch options (similar to the standard fetch API)
 * @returns A promise resolving to the parsed response with standardized format
 */
export declare function safeFetch<T = any>(url: string, options?: RequestInit): Promise<ApiResponse<T>>;
