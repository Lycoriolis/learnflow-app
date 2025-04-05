import { writable } from 'svelte/store';
import type { User } from '@auth0/auth0-spa-js'; // Import the User type from Auth0 SDK

export const isAuthenticated = writable<boolean>(false);
export const user = writable<User | null>(null); // Use the User type for the user store
export const loading = writable<boolean>(true); // Start in loading state 