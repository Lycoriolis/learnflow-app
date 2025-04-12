import { writable } from 'svelte/store';
import { persistentStore } from './persistentStore.js';
// UI State
export const sidebarOpen = writable(false);
export const courseModalOpen = writable(false);
export const currentCourse = writable(null);
// User-related State
export const user = writable({
    name: 'Alex Morgan',
    email: 'alex@example.com',
    avatar: '',
    streak: 7
});
// Progress stats
export const progressStats = writable({
    coursesInProgress: 3,
    exercisesCompleted: 28,
    learningStreak: 5,
    totalHoursSpent: 42
});
// Modal visibility state
export const modals = writable({
    courseContentOpen: false,
});
