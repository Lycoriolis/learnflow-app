import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  try {
    // Try to load parent data but catch any redirects
    await parent();
  } catch (e) {
    // Continue loading this page even if admin checks would normally redirect
    console.log('Bypassing admin check for debug page');
  }
  
  return {
    bypassAdminCheck: true
  };
}; 