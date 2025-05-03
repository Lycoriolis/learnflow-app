import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Creates a Svelte writable store that automatically persists to localStorage.
 * @template T - The type of the store's value
 * @param key - The localStorage key to use for persistence
 * @param initialValue - The initial value if nothing is found in localStorage
 * @returns A writable store that syncs with localStorage
 */
export function persistentStore<T>(key: string, initialValue: T): Writable<T> {
    let initial = initialValue;
    
    // Only access localStorage in browser context
    if (browser) {
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

    const store = writable<T>(initial);

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

// Typed persistent stores for application use
export const completedExercises = persistentStore<string[]>('completedExercises', []);

// Bookmark interface for type safety
export interface Bookmark {
    id: string;
    title: string;
    reason?: string;
    addedAt: number; // timestamp
    courseId?: string;
    type: 'exercise' | 'course' | 'article';
}

export const bookmarks = persistentStore<Bookmark[]>('bookmarkedExercises', []);