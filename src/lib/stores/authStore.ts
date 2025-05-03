import { writable, derived } from 'svelte/store';
import type { User } from 'firebase/auth';
import { logout as firebaseLogout } from '../authService.js';

export const isAuthenticated = writable<boolean>(false);
export const user = writable<User | null>(null);
export const loading = writable<boolean>(true);
export const authError = writable<string | null>(null);

// Add custom user type that extends Firebase User
interface CustomUser extends User {
  isAdmin?: boolean;
}

export const isAdmin = derived(user, ($user) => {
  // Example: check for a custom claim or email
  if (!$user) return false;
  // You can customize this logic as needed
  return $user.email === 'admin@example.com' || ($user as CustomUser)?.isAdmin === true;
});

export const logout = firebaseLogout;