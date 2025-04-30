// @ts-nocheck
import type { LayoutServerLoad } from './$types.js';
import type { Cookies } from '@sveltejs/kit';
import { setupCsrfToken } from '$lib/utils/csrf.server.js';

export const load = async ({ cookies }: { cookies: Cookies }) => {
  // Generate and set CSRF token in cookies
  const csrfToken = setupCsrfToken(cookies);
  return { csrfToken };
};;null as any as LayoutServerLoad;