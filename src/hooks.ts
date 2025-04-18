import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { auth } from '$lib/firebase';
import { csrfProtect } from './routes/api/csrfMiddleware';

// Authenticate user and add to locals
const authenticate: Handle = async ({ event, resolve }) => {
    const session = event.cookies.get('session');
    
    if (session) {
        try {
            const decodedClaims = await auth.verifySessionCookie(session, true);
            event.locals.user = {
                uid: decodedClaims.uid,
                email: decodedClaims.email,
                emailVerified: decodedClaims.email_verified,
            };
        } catch (e) {
            event.locals.user = null;
        }
    }
    
    return resolve(event);
};

export const handle = sequence(csrfProtect, authenticate);