import { derived } from 'svelte/store';
import { user } from './authStore.js';
import { env } from '$env/dynamic/public';

const ADMIN_EMAILS = (env.PUBLIC_VITE_ADMIN_EMAILS || '').split(',').map(email => email.trim());

export const isAdmin = derived(user, $user => {
    if (!$user || !$user.email) return false;
    return ADMIN_EMAILS.includes($user.email);
});