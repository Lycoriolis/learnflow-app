import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: LayoutServerLoad = async ({ locals }) => {
    const user = locals.user;
    // Ensure ADMIN_EMAILS are correctly parsed and typed
    const ADMIN_EMAILS = (env.VITE_ADMIN_EMAILS || '')
        .split(',')
        .map((email: string) => email.trim())
        .filter((email: string) => email);
    
    // Add null check for user.email
    if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
        throw redirect(302, '/login?redirectTo=/admin'); // Redirect to login, then to admin
    }
    
    return {
        user
    };
};