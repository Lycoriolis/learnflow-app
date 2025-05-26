import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { userId } = params;
  
  if (!userId) {
    throw error(404, 'User not found');
  }
  
  // Here you would typically fetch user data from a database
  // For now, we'll just return the userId and let the client handle it
  
  return {
    userId
  };
};
