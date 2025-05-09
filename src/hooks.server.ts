// hooks.server.ts - Server-side only hooks
import { json, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { generateToken, validateCsrfToken } from '$lib/utils/csrf.server'; // Corrected imports
import { CSRF_HEADER, CSRF_COOKIE } from '$lib/utils/csrf.types.js'; // Import CSRF_HEADER and CSRF_COOKIE
import { populateAuthLocals } from './routes/api/authMiddleware.server'; // Adjusted path

const handleCsrf: Handle = async ({ event, resolve }) => {
    if (event.request.method === 'GET') {
        // For GET requests, ensure a CSRF token is available to be embedded in forms
        // It might be set by a previous request or needs to be generated now.
        let token = event.cookies.get(CSRF_COOKIE);
        if (!token) {
            token = generateToken();
            event.cookies.set(CSRF_COOKIE, token, {
                path: '/',
                httpOnly: true,
                secure: import.meta.env.PROD, // Use import.meta.env.PROD for SvelteKit
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });
        }
        event.locals.csrfToken = token; // Make it available for +layout.server.ts
    } else if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(event.request.method)) {
        // Verify CSRF token for mutating requests
        const headerToken = event.request.headers.get(CSRF_HEADER);
        if (!validateCsrfToken(event.cookies, headerToken)) {
            return json({ message: 'Invalid CSRF token' }, { status: 403 });
        }
    }
    // For GET requests that already had a cookie, or for verified mutating requests, proceed.
    return resolve(event);
};

const handleAuth: Handle = async ({ event, resolve }) => {
    await populateAuthLocals(event); // Populates event.locals.user and event.locals.isAuthenticated
    return resolve(event);
};

// The sequence of handlers is important.
// CSRF token generation (for GET) should ideally happen before auth might redirect.
// Auth population should happen early so subsequent hooks or endpoints can use it.
// CSRF verification (for POST etc.) should happen after auth is populated if CSRF logic depends on auth state,
// or before if it's independent. Here, it's placed first but verifyCsrfToken might need event.locals.user if tokens are user-bound.
// For now, assuming verifyCsrfToken is independent or handles it.

export const handle = sequence(
    handleAuth, // Populate auth info first
    handleCsrf  // Then handle CSRF logic
    // Other global handlers if any
);

// Note: `requireAuth` and `requireAdminAuth` are typically used by importing them
// directly into specific `+layout.server.ts` or `+server.ts` files for route-specific protection,
// e.g.:
// import { requireAuth } from '$routes/api/authMiddleware.server';
// export const load = requireAuth; // If it were a load function
// Or for handles:
// import { requireAuth } from '$routes/api/authMiddleware.server';
// export const handle = requireAuth; // This would make it the layout's handle
// Or more commonly, composed with other logic in a layout's handle or load.