// CSRF protection type definitions
export const CSRF_HEADER = 'x-csrf-token';

export interface CsrfResponse {
  csrfToken: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  ok: boolean;
  status: number;
  json: () => Promise<T>;
}