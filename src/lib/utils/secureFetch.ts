/**
 * Enhanced fetch wrapper with CSRF protection and error handling
 */
import { getCsrfToken, updateCsrfTokenFromResponse } from './csrf.client.js';
import { CSRF_HEADER } from './csrf.types.js';
import { get } from 'svelte/store';
import { isAuthenticated, user } from '../stores/authStore.js';
import { auth } from '../firebase.js';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Secure fetch wrapper that:
 * 1. Adds CSRF tokens to requests
 * 2. Updates CSRF tokens from responses
 * 3. Adds Firebase auth token for authenticated requests
 * 4. Handles errors in a consistent way
 * 5. Provides type safety for API responses
 */
export async function secureFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Merge default options with provided options
  const requestOptions: RequestInit = {
    credentials: 'same-origin',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  // Add auth token if user is authenticated
  const headers = requestOptions.headers as Record<string, string>;
  if (get(isAuthenticated) && auth.currentUser) {
    try {
      const idToken = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${idToken}`;
    } catch (error) {
      console.error('Failed to get auth token:', error);
    }
  }

  // Add CSRF token to non-GET requests
  if (options.method && options.method !== 'GET') {
    const csrfToken = getCsrfToken();
    
    // If no CSRF token, try to obtain one first
    if (!csrfToken) {
      try {
        const response = await fetch('/api/csrf/refresh', {
          credentials: 'same-origin'
        });
        
        const newToken = response.headers.get(CSRF_HEADER);
        if (newToken) {
          headers[CSRF_HEADER] = newToken;
        } else {
          return {
            error: 'CSRF token required',
            status: 401
          };
        }
      } catch (error) {
        return {
          error: 'Failed to obtain CSRF token',
          status: 500
        };
      }
    } else {
      headers[CSRF_HEADER] = csrfToken;
    }
  }

  try {
    // Make the fetch request
    const response = await fetch(url, requestOptions);
    
    // Update CSRF token if present in response
    updateCsrfTokenFromResponse(response);
    
    // Check for CSRF errors (401/403) and retry once if needed
    if ((response.status === 401 || response.status === 403) && 
        response.headers.get('X-CSRF-Error') === 'true') {
      try {
        // Refresh token and retry
        await fetch('/api/csrf/refresh', { credentials: 'same-origin' });
        
        // Retry the original request with updated token
        const retryToken = getCsrfToken();
        if (retryToken) {
          (requestOptions.headers as Record<string, string>)[CSRF_HEADER] = retryToken;
          const retryResponse = await fetch(url, requestOptions);
          updateCsrfTokenFromResponse(retryResponse);
          
          // Parse and return response
          try {
            const data = await retryResponse.json();
            return {
              data,
              status: retryResponse.status
            };
          } catch {
            // If not JSON, return empty data
            return {
              status: retryResponse.status
            };
          }
        }
      } catch {
        // Fall through to original error handling
      }
    }
    
    // Parse and return response
    try {
      const data = await response.json();
      return {
        data,
        status: response.status
      };
    } catch {
      // If not JSON, return empty data
      return {
        status: response.status
      };
    }
  } catch (error) {
    console.error('Request failed:', error);
    return {
      error: error instanceof Error ? error.message : 'Network request failed',
      status: 0
    };
  }
}