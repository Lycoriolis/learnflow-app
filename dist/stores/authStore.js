import { writable } from 'svelte/store';
export const isAuthenticated = writable(false);
export const user = writable(null); // Use the Firebase User type
export const loading = writable(true); // Start in loading state
export const authError = writable(null); // Add error state 
