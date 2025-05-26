import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Get user info from locals
  const user = locals.user;
  
  // If not authenticated, redirect to login
  if (!user) {
    throw redirect(302, '/login?returnTo=/profile');
  }
  
  // Return empty object as we'll load profile data client-side
  return {};
};
