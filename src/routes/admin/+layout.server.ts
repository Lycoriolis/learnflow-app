import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: LayoutServerLoad = async ({ locals }) => {
    const user = locals.user;
    const ADMIN_EMAILS = (env.VITE_ADMIN_EMAILS || '').split(',').map(email => email.trim());
    
    if (!user || !ADMIN_EMAILS.includes(user.email)) {
        throw redirect(302, '/');
    }
    
    return {
        user
    };
};