import type { LayoutServerLoad } from './$types.js';
import type { Cookies } from '@sveltejs/kit';
import { setupCsrfToken } from '$lib/utils/csrf.server.js';

export const load: LayoutServerLoad = async ({ cookies }: { cookies: Cookies }) => {
  // Generate and set CSRF token in cookies
  const csrfToken = setupCsrfToken(cookies);
  return { csrfToken };
};