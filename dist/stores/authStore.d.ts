import type { User } from 'firebase/auth';
export declare const isAuthenticated: import("svelte/store").Writable<boolean>;
export declare const user: import("svelte/store").Writable<User | null>;
export declare const loading: import("svelte/store").Writable<boolean>;
export declare const authError: import("svelte/store").Writable<string | null>;
