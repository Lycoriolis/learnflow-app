import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import type { User } from 'firebase/auth';

// Custom event type that includes user
type AuthenticatedRequestEvent = RequestEvent & {
    locals: {
        user: User | null;
    };
};

const ADMIN_EMAILS = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];

export async function adminGuard(event: AuthenticatedRequestEvent) {
    const user = event.locals.user;
    
    if (!user) {
        throw redirect(302, '/login?redirect=' + encodeURIComponent(event.url.pathname));
    }

    if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
        throw redirect(302, '/');
    }
}