import { writable } from 'svelte/store';

// true = collapsed (icons only), false = expanded (full width)
export const sidebarCollapsed = writable(false);