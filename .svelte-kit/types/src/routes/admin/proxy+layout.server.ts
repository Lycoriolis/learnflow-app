// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
    const user = locals.user;
    const ADMIN_EMAILS = (env.VITE_ADMIN_EMAILS || '').split(',').map(email => email.trim());
    
    if (!user || !ADMIN_EMAILS.includes(user.email)) {
        throw redirect(302, '/');
    }
    
    return {
        user
    };
};