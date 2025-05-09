import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';
import { logout as firebaseLogout } from '../services/authService.js';

export const isAuthenticated = writable<boolean>(false);
export const user = writable<User | null>(null);
export const loading = writable<boolean>(true);
export const authError = writable<string | null>(null);

export const logout = firebaseLogout;