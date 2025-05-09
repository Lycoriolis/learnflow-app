export const CSRF_HEADER = 'X-CSRF-Token';

export interface CsrfResponse {
  csrfToken: string;
}
