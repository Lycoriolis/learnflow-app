export declare const sidebarOpen: import("svelte/store").Writable<boolean>;
export declare const courseModalOpen: import("svelte/store").Writable<boolean>;
export declare const currentCourse: import("svelte/store").Writable<null>;
export declare const user: import("svelte/store").Writable<{
    name: string;
    email: string;
    avatar: string;
    streak: number;
}>;
export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    streakDays: number;
}
export declare const progressStats: import("svelte/store").Writable<{
    coursesInProgress: number;
    exercisesCompleted: number;
    learningStreak: number;
    totalHoursSpent: number;
}>;
export declare const modals: import("svelte/store").Writable<{
    courseContentOpen: boolean;
}>;
