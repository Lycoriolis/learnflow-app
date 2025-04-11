import { writable } from 'svelte/store';
import type { User } from 'firebase/auth'; // Import the User type from Firebase

export const isAuthenticated = writable<boolean>(false);
export const user = writable<User | null>(null); // Use the Firebase User type
export const loading = writable<boolean>(true); // Start in loading state
export const authError = writable<string | null>(null); // Add error state 