export declare const pipVisible: import("svelte/store").Writable<boolean>;
export declare const pipMinimized: import("svelte/store").Writable<boolean>;
export declare const activePipTool: import("svelte/store").Writable<null>;
export declare const activeTool: import("svelte/store").Writable<string>;
export interface TimerMode {
    type: 'work' | 'shortBreak' | 'longBreak';
}
export interface TimerState {
    mode: TimerMode;
    timeLeft: number;
    isRunning: boolean;
    cycle: number;
}
export interface TimerSettings {
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    longBreakInterval: number;
}
export declare const timerState: import("svelte/store").Writable<TimerState>;
export declare const timerSettings: import("svelte/store").Writable<TimerSettings>;
export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
    description?: string;
    deadline?: string;
    emergency?: number;
    tag?: string;
}
export declare const todos: import("svelte/store").Writable<TodoItem[]>;
export interface NoteItem {
    id: string;
    title: string;
    content: string;
    createdAt: number;
    updatedAt: number;
}
export declare const notes: import("svelte/store").Writable<NoteItem[]>;
export declare const notepadContent: import("svelte/store").Writable<string>;
export interface FocusSession {
    timestamp: number;
    duration: number;
}
export declare const focusSessions: import("svelte/store").Writable<FocusSession[]>;
export interface ExerciseSession {
    exerciseId: string;
    timestamp: number;
    completed: boolean;
}
export declare const exerciseSessions: import("svelte/store").Writable<ExerciseSession[]>;
export interface Flashcard {
    id: string;
    front: string;
    back: string;
    lastReviewed?: number;
    nextReview?: number;
    level: number;
    tags: string[];
}
export declare const flashcards: import("svelte/store").Writable<Flashcard[]>;
export declare const flashcardStats: import("svelte/store").Writable<{
    totalReviews: number;
    correctReviews: number;
    streakDays: number;
    lastReviewDate: number | null;
}>;
export declare const calcDisplay: import("svelte/store").Writable<string>;
export declare const calcCurrentInput: import("svelte/store").Writable<string>;
export declare const calcOperator: import("svelte/store").Writable<string | null>;
export declare const calcPreviousValue: import("svelte/store").Writable<number | null>;
export declare const calcWaitingForSecondOperand: import("svelte/store").Writable<boolean>;
