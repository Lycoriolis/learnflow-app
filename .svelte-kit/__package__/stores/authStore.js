import { writable } from 'svelte/store';
import { logout as firebaseLogout } from '../authService.js';
export const isAuthenticated = writable(false);
export const user = writable(null);
export const loading = writable(true);
export const authError = writable(null);
export const logout = firebaseLogout;
