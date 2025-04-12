/**
 * Creates a Svelte writable store that automatically persists to localStorage.
 * @template T
 * @param {string} key The localStorage key.
 * @param {T} initialValue The initial value if nothing is in localStorage.
 * @returns {import('svelte/store').Writable<T>}
 */
export function persistentStore<T>(key: string, initialValue: T): import("svelte/store").Writable<T>;
