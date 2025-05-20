import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { verifyAdminServer } from '$lib/services/adminService.server';

/**
 * Server-side guard for admin routes
 * Use this in +page.server.ts or +layout.server.ts files
 */
export async function adminGuard(event: RequestEvent) {
  const session = event.cookies.get('session');
  
  // If no session, redirect to admin login
  if (!session) {
    throw redirect(303, '/admin/login');
  }
  
  try {
    // Verify the session and get the user ID
    // This depends on how your auth session is stored - adjust accordingly
    const userId = session; // Simplified - you may need to decode/verify the session
    
    // Check if the user has admin privileges
    const isAdmin = await verifyAdminServer(userId);
    
    if (!isAdmin) {
      // If not an admin, redirect to login
      throw redirect(303, '/admin/login');
    }
    
    // Allow access if admin
    return { userId, isAdmin };
  } catch (error) {
    console.error('Admin guard error:', error);
    throw redirect(303, '/admin/login');
  }
}