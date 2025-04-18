/**
 * Secure Fetch Utility
 * 
 * This utility wraps the browser's fetch API with security enhancements:
 * - Automatically adds CSRF token headers for non-GET/HEAD requests
 * - Includes credentials for session cookies
 * - Provides standardized error handling
 */

import { getCsrfToken, CSRF_HEADER } from './csrfProtection';

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
export async function safeFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Default request options
    const requestOptions: RequestInit = {
      credentials: 'same-origin', // Include cookies with the request
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };
    
    // Add CSRF token for non-GET/HEAD requests
    const method = options.method || 'GET';
    if (!['GET', 'HEAD'].includes(method.toUpperCase())) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        (requestOptions.headers as Record<string, string>)[CSRF_HEADER] = csrfToken;
      } else {
        console.warn('CSRF token not available for non-GET request');
      }
    }

    // Make the fetch request
    const response = await fetch(url, requestOptions);
    
    // Parse the response
    let data: any = null;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // For non-JSON responses, just get the text
      data = await response.text();
    }
    
    // Return a standardized response format
    if (response.ok) {
      return {
        success: true,
        data,
        status: response.status
      };
    } else {
      // Handle API error responses
      return {
        success: false,
        error: typeof data === 'object' && data.message ? data.message : 'API request failed',
        status: response.status
      };
    }
  } catch (error) {
    // Handle network errors or exceptions
    console.error('Fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during API request',
      status: 0 // Use 0 to indicate a network/client-side error
    };
  }
}