import { writable } from 'svelte/store';
import { browser } from '$app/environment'; // Ensure code only runs in browser

/**
 * Creates a Svelte writable store that automatically persists to localStorage.
 * @template T
 * @param {string} key The localStorage key.
 * @param {T} initialValue The initial value if nothing is in localStorage.
 * @returns {import('svelte/store').Writable<T>}
 */
export function persistentStore(key, initialValue) {
    let initial = initialValue;
    if (browser) { // Check if running in the browser context
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null) {
            try {
                initial = JSON.parse(storedValue);
            } catch (e) {
                console.error(`Error parsing localStorage key "${key}":`, e);
                localStorage.removeItem(key); // Remove corrupted data
                initial = initialValue;
            }
        }
    }

    const store = writable(initial);

    if (browser) {
        store.subscribe(value => {
            // Prevent writing undefined to localStorage
            if (value !== undefined) {
              localStorage.setItem(key, JSON.stringify(value));
            }
        });
    }

    return store;
}

// Track completed exercises (array of exercise IDs)
export const completedExercises = persistentStore('completedExercises', []);
// Track bookmarked exercises with reason and date
export const bookmarks = persistentStore('bookmarkedExercises', []);