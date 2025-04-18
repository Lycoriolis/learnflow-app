import { writable } from 'svelte/store';
import { persistentStore } from './persistentStore.js';
// State for the PiP widget itself
export const pipVisible = writable(false);
export const pipMinimized = writable(false);
export const activePipTool = persistentStore('learnflow-active-pip-tool', null); // Persist active tool
// Currently active tool in the PIP widget
export const activeTool = writable('timer');
const initialTimerState = {
    mode: { type: 'work' },
    timeLeft: 25 * 60, // Default 25 mins work
    isRunning: false,
    cycle: 0
};
// Active timer state (persistent)
export const timerState = persistentStore('learnflow-timer-state', initialTimerState);
// Timer settings with default values
export const timerSettings = persistentStore('learnflow-timer-settings', {
    workDuration: 25 * 60, // 25 minutes
    shortBreakDuration: 5 * 60, // 5 minutes
    longBreakDuration: 15 * 60, // 15 minutes
    longBreakInterval: 4 // Long break after 4 work sessions
});
export const todos = persistentStore('learnflow-todos', []);
export const notes = persistentStore('learnflow-notes', []);
// --- Notepad Content Store ---
export const notepadContent = persistentStore('learnflow-notepad-content', '');
// Store an array of completed focus sessions (persistent)
export const focusSessions = persistentStore('learnflow-focus-sessions', []);
// Store an array of completed exercise sessions (persistent)
export const exerciseSessions = persistentStore('learnflow-exercise-sessions', []);
export const flashcards = persistentStore('learnflow-flashcards', []);
export const flashcardStats = writable({
    totalReviews: 0,
    correctReviews: 0,
    streakDays: 0,
    lastReviewDate: null
});
// --- Calculator Store --- (Transient state)
export const calcDisplay = writable('0');
export const calcCurrentInput = writable('');
export const calcOperator = writable(null);
export const calcPreviousValue = writable(null);
export const calcWaitingForSecondOperand = writable(false);
