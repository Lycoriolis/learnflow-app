import { json, redirect, type RequestEvent, type Handle } from '@sveltejs/kit';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { admin } from '$lib/server/firebaseAdmin';
import { env } from '$env/dynamic/private';

// Function to populate event.locals with auth information
export async function populateAuthLocals(event: RequestEvent): Promise<void> {
    const token = event.request.headers.get('Authorization')?.split('Bearer ')[1];

    if (token) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            event.locals.user = decodedToken;
            event.locals.isAuthenticated = true;
        } catch (error) {
            // Log less verbosely or use a more specific error check if needed
            if ((error as any).code !== 'auth/id-token-expired' && (error as any).code !== 'auth/argument-error') {
                 console.error('Auth middleware error verifying token:', (error as any).code || error);
            }
            event.locals.user = null;
            event.locals.isAuthenticated = false;
        }
    } else {
        event.locals.user = null;
        event.locals.isAuthenticated = false;
    }
}

// Handle for protecting routes that require authentication
export const requireAuth: Handle = async ({ event, resolve }) => {
  // Ensure auth locals are populated if not already done by a global hook
  // This check helps if requireAuth is used standalone without a preceding global populateAuthLocals call.
  if (typeof event.locals.isAuthenticated === 'undefined') {
    await populateAuthLocals(event);
  }

  if (!event.locals.isAuthenticated || !event.locals.user) {
    if (event.request.headers.get('Accept')?.includes('application/json')) {
      return json({ message: 'Authentication required' }, { status: 401 });
    }
    throw redirect(303, `/login?redirectTo=${encodeURIComponent(event.url.pathname + event.url.search)}`);
  }
  return resolve(event);
};

// Handle for protecting routes that require admin privileges
const ADMIN_EMAILS = (env.VITE_ADMIN_EMAILS || '').split(',').map((email: string) => email.trim()).filter((email: string) => email);

export const requireAdminAuth: Handle = async ({ event, resolve }) => {
  if (typeof event.locals.isAuthenticated === 'undefined') {
    await populateAuthLocals(event);
  }

  if (!event.locals.isAuthenticated || !event.locals.user) {
    if (event.request.headers.get('Accept')?.includes('application/json')) {
      return json({ message: 'Authentication required' }, { status: 401 });
    }
    throw redirect(303, `/login?redirectTo=${encodeURIComponent(event.url.pathname + event.url.search)}`);
  }

  const userEmail = event.locals.user.email;
  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    if (event.request.headers.get('Accept')?.includes('application/json')) {
      return json({ message: 'Forbidden: Administrator access required' }, { status: 403 });
    }
    // Consider redirecting to a specific 'unauthorized' page or home with an error message
    throw redirect(303, '/?error=admin_required');
  }
  return resolve(event);
};