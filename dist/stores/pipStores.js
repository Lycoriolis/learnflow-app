import { writable } from 'svelte/store';
import { persistentStore } from './persistentStore.js';
// State for the PiP widget itself
export const pipVisible = writable(false);
export const pipMinimized = writable(false);
export const activePipTool = persistentStore('learnflow-active-pip-tool', null); // Persist active tool
// Currently active tool in the PIP widget
export const activeTool = writable('timer');
const initialTimerState = {
    mode: 'work',
    timeLeft: 25 * 60, // Default 25 mins work
    isRunning: false,
    cycle: 0
};
// Active timer state (non-persistent)
export const timerState = writable(initialTimerState);
// Timer settings (persistent)
export const timerSettings = persistentStore('learnflow-timer-settings', {
    workDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    longBreakInterval: 4
});
export const todos = persistentStore('learnflow-todos', []);
export const notes = persistentStore('learnflow-notes', []);
// Store an array of completed focus sessions (persistent)
export const focusSessions = persistentStore('learnflow-focus-sessions', []);
// --- Calculator Store --- (Transient state)
export const calcDisplay = writable('0');
export const calcCurrentInput = writable('');
export const calcOperator = writable(null);
export const calcPreviousValue = writable(null);
export const calcWaitingForSecondOperand = writable(false);
