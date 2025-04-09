import { writable } from 'svelte/store';
import { persistentStore } from './persistentStore.js';

// State for the PiP widget itself
export const pipVisible = writable(false);
export const pipMinimized = writable(false);
export const activePipTool = persistentStore('learnflow-active-pip-tool', null); // Persist active tool

// Currently active tool in the PIP widget
export const activeTool = writable('timer');

// --- Timer Store --- (Types defined inline for simplicity, move to $types later if needed)
export type TimerMode = 'work' | 'shortBreak' | 'longBreak';
export interface TimerState {
	mode: TimerMode;
	timeLeft: number;
	isRunning: boolean;
	cycle: number; // Number of work cycles completed
}
export interface TimerSettings {
	workDuration: number;
	shortBreakDuration: number;
	longBreakDuration: number;
	longBreakInterval: number;
}

const initialTimerState: TimerState = {
	mode: 'work',
	timeLeft: 25 * 60, // Default 25 mins work
	isRunning: false,
	cycle: 0
};

// Active timer state (non-persistent)
export const timerState = writable<TimerState>(initialTimerState);

// Timer settings (persistent)
export const timerSettings = persistentStore<TimerSettings>('learnflow-timer-settings', {
	workDuration: 25 * 60,
	shortBreakDuration: 5 * 60,
	longBreakDuration: 15 * 60,
	longBreakInterval: 4
});

// --- Todo Store ---
export interface TodoItem {
	id: string;
	text: string;
	completed: boolean;
	createdAt: number;
}
export const todos = persistentStore<TodoItem[]>('learnflow-todos', []);

// --- Notes Store ---
export interface NoteItem {
	id: string;
	title: string;
	content: string; // Markdown content
	createdAt: number;
	updatedAt: number;
}
export const notes = persistentStore<NoteItem[]>('learnflow-notes', []);

// --- Focus Session Store ---
export interface FocusSession {
	timestamp: number; // When the session ended (Date.now())
	duration: number;  // Duration in seconds
}

// Store an array of completed focus sessions (persistent)
export const focusSessions = persistentStore<FocusSession[]>('learnflow-focus-sessions', []);

// --- Calculator Store --- (Transient state)
export const calcDisplay = writable('0');
export const calcCurrentInput = writable('');
export const calcOperator = writable<string | null>(null);
export const calcPreviousValue = writable<number | null>(null);
export const calcWaitingForSecondOperand = writable(false);

// --- Chat Store ---
export interface ChatMessage {
	id: string;
	text: string;
	sender: 'user' | 'bot';
	timestamp: number;
}

// Store an array of chat messages (persistent)
export const chatMessages = persistentStore<ChatMessage[]>('learnflow-chat-messages', []);