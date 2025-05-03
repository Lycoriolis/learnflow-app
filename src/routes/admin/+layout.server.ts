import { adminGuard } from '../adminGuard';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  // Skip admin guard for login page
  if (event.url.pathname === '/admin/login') {
    return {};
  }
  
  // Apply admin guard for all other admin routes
  return adminGuard(event);
};