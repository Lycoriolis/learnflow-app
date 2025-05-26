import { browser } from '$app/environment';

export interface ExerciseProgress {
    exerciseId: string;
    href: string;
    title: string;
    startedAt: number;
    lastAccessedAt: number;
    completedAt?: number;
    timeSpent: number; // in milliseconds
    readingProgress: number; // percentage (0-100)
    difficulty?: string;
    category?: string;
    tags?: string[];
    isCompleted: boolean;
    isBookmarked: boolean;
    attempts: number;
    notes?: string;
}

export interface ExerciseSession {
    exerciseId: string;
    sessionStart: number;
    sessionEnd?: number;
    duration: number;
    progressBefore: number;
    progressAfter: number;
    completed: boolean;
}

export interface ProgressStatistics {
    totalExercises: number;
    completedExercises: number;
    totalTimeSpent: number;
    averageProgress: number;
    completionRate: number;
    streak: number;
    lastActiveDate: number;
    categoriesProgress: Record<string, {
        total: number;
        completed: number;
        timeSpent: number;
    }>;
    difficultyProgress: Record<string, {
        total: number;
        completed: number;
        timeSpent: number;
    }>;
    weeklyProgress: Array<{
        week: string;
        exercisesCompleted: number;
        timeSpent: number;
    }>;
}

export class ExerciseProgressService {
    private static instance: ExerciseProgressService;
    private progressData: Map<string, ExerciseProgress> = new Map();
    private sessionData: Map<string, ExerciseSession> = new Map();
    private currentSession: ExerciseSession | null = null;
    private progressStorageKey = 'exercise-progress-data';
    private sessionStorageKey = 'exercise-session-data';
    private statsStorageKey = 'exercise-stats-data';

    constructor() {
        if (browser) {
            this.loadProgressData();
            this.loadSessionData();
            this.startPeriodicSave();
        }
    }

    static getInstance(): ExerciseProgressService {
        if (!ExerciseProgressService.instance) {
            ExerciseProgressService.instance = new ExerciseProgressService();
        }
        return ExerciseProgressService.instance;
    }

    // Progress Management
    startExercise(exerciseId: string, exerciseData: {
        href: string;
        title: string;
        difficulty?: string;
        category?: string;
        tags?: string[];
    }): void {
        if (!browser) return;

        const now = Date.now();
        let progress = this.progressData.get(exerciseId);

        if (!progress) {
            progress = {
                exerciseId,
                href: exerciseData.href,
                title: exerciseData.title,
                startedAt: now,
                lastAccessedAt: now,
                timeSpent: 0,
                readingProgress: 0,
                difficulty: exerciseData.difficulty,
                category: exerciseData.category,
                tags: exerciseData.tags,
                isCompleted: false,
                isBookmarked: false,
                attempts: 0
            };
        } else {
            progress.lastAccessedAt = now;
            progress.attempts += 1;
        }

        this.progressData.set(exerciseId, progress);

        // Start new session
        this.currentSession = {
            exerciseId,
            sessionStart: now,
            duration: 0,
            progressBefore: progress.readingProgress,
            progressAfter: progress.readingProgress,
            completed: false
        };

        this.saveProgressData();
    }

    updateProgress(exerciseId: string, readingProgress: number): void {
        if (!browser) return;

        const progress = this.progressData.get(exerciseId);
        if (!progress) return;

        const now = Date.now();
        progress.readingProgress = Math.max(progress.readingProgress, readingProgress);
        progress.lastAccessedAt = now;

        // Update session
        if (this.currentSession && this.currentSession.exerciseId === exerciseId) {
            this.currentSession.progressAfter = readingProgress;
            this.currentSession.duration = now - this.currentSession.sessionStart;
        }

        this.progressData.set(exerciseId, progress);
    }

    completeExercise(exerciseId: string): void {
        if (!browser) return;

        const progress = this.progressData.get(exerciseId);
        if (!progress) return;

        const now = Date.now();
        progress.completedAt = now;
        progress.lastAccessedAt = now;
        progress.readingProgress = 100;
        progress.isCompleted = true;

        // Complete session
        if (this.currentSession && this.currentSession.exerciseId === exerciseId) {
            this.currentSession.sessionEnd = now;
            this.currentSession.completed = true;
            this.currentSession.progressAfter = 100;
            
            // Add session time to total time spent
            progress.timeSpent += this.currentSession.duration;
            
            // Save session data
            this.sessionData.set(`${exerciseId}-${now}`, { ...this.currentSession });
            this.currentSession = null;
        }

        this.progressData.set(exerciseId, progress);
        this.saveProgressData();
        this.saveSessionData();
    }

    endSession(exerciseId: string): void {
        if (!browser || !this.currentSession || this.currentSession.exerciseId !== exerciseId) return;

        const now = Date.now();
        const progress = this.progressData.get(exerciseId);
        
        if (progress && this.currentSession) {
            this.currentSession.sessionEnd = now;
            this.currentSession.duration = now - this.currentSession.sessionStart;
            
            // Add session time to total time spent
            progress.timeSpent += this.currentSession.duration;
            progress.lastAccessedAt = now;
            
            // Save session data
            this.sessionData.set(`${exerciseId}-${now}`, { ...this.currentSession });
            
            this.progressData.set(exerciseId, progress);
            this.currentSession = null;
            
            this.saveProgressData();
            this.saveSessionData();
        }
    }

    // Bookmark Management
    toggleBookmark(exerciseId: string, exerciseData: {
        href: string;
        title: string;
        difficulty?: string;
        category?: string;
        tags?: string[];
    }): boolean {
        if (!browser) return false;

        let progress = this.progressData.get(exerciseId);
        
        if (!progress) {
            progress = {
                exerciseId,
                href: exerciseData.href,
                title: exerciseData.title,
                startedAt: Date.now(),
                lastAccessedAt: Date.now(),
                timeSpent: 0,
                readingProgress: 0,
                difficulty: exerciseData.difficulty,
                category: exerciseData.category,
                tags: exerciseData.tags,
                isCompleted: false,
                isBookmarked: false,
                attempts: 0
            };
        }

        progress.isBookmarked = !progress.isBookmarked;
        progress.lastAccessedAt = Date.now();
        
        this.progressData.set(exerciseId, progress);
        this.saveProgressData();
        
        return progress.isBookmarked;
    }

    addNote(exerciseId: string, note: string): void {
        if (!browser) return;

        const progress = this.progressData.get(exerciseId);
        if (!progress) return;

        progress.notes = note;
        progress.lastAccessedAt = Date.now();
        
        this.progressData.set(exerciseId, progress);
        this.saveProgressData();
    }

    // Data Retrieval
    getProgress(exerciseId: string): ExerciseProgress | undefined {
        return this.progressData.get(exerciseId);
    }

    getAllProgress(): ExerciseProgress[] {
        return Array.from(this.progressData.values());
    }

    getBookmarkedExercises(): ExerciseProgress[] {
        return Array.from(this.progressData.values()).filter(p => p.isBookmarked);
    }

    getCompletedExercises(): ExerciseProgress[] {
        return Array.from(this.progressData.values()).filter(p => p.isCompleted);
    }

    getInProgressExercises(): ExerciseProgress[] {
        return Array.from(this.progressData.values()).filter(p => 
            p.readingProgress > 0 && !p.isCompleted
        );
    }

    getRecentExercises(limit: number = 10): ExerciseProgress[] {
        return Array.from(this.progressData.values())
            .sort((a, b) => b.lastAccessedAt - a.lastAccessedAt)
            .slice(0, limit);
    }

    // Statistics
    getStatistics(): ProgressStatistics {
        const allProgress = Array.from(this.progressData.values());
        const totalExercises = allProgress.length;
        const completedExercises = allProgress.filter(p => p.isCompleted).length;
        const totalTimeSpent = allProgress.reduce((sum, p) => sum + p.timeSpent, 0);
        const averageProgress = totalExercises > 0 
            ? allProgress.reduce((sum, p) => sum + p.readingProgress, 0) / totalExercises
            : 0;
        const completionRate = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

        // Calculate categories progress
        const categoriesProgress: Record<string, any> = {};
        allProgress.forEach(p => {
            if (p.category) {
                if (!categoriesProgress[p.category]) {
                    categoriesProgress[p.category] = { total: 0, completed: 0, timeSpent: 0 };
                }
                categoriesProgress[p.category].total++;
                if (p.isCompleted) categoriesProgress[p.category].completed++;
                categoriesProgress[p.category].timeSpent += p.timeSpent;
            }
        });

        // Calculate difficulty progress
        const difficultyProgress: Record<string, any> = {};
        allProgress.forEach(p => {
            if (p.difficulty) {
                if (!difficultyProgress[p.difficulty]) {
                    difficultyProgress[p.difficulty] = { total: 0, completed: 0, timeSpent: 0 };
                }
                difficultyProgress[p.difficulty].total++;
                if (p.isCompleted) difficultyProgress[p.difficulty].completed++;
                difficultyProgress[p.difficulty].timeSpent += p.timeSpent;
            }
        });

        // Calculate streak and weekly progress
        const streak = this.calculateStreak();
        const weeklyProgress = this.calculateWeeklyProgress();
        const lastActiveDate = allProgress.length > 0 
            ? Math.max(...allProgress.map(p => p.lastAccessedAt))
            : 0;

        return {
            totalExercises,
            completedExercises,
            totalTimeSpent,
            averageProgress,
            completionRate,
            streak,
            lastActiveDate,
            categoriesProgress,
            difficultyProgress,
            weeklyProgress
        };
    }

    private calculateStreak(): number {
        const completedExercises = this.getCompletedExercises()
            .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
        
        if (completedExercises.length === 0) return 0;
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        for (const exercise of completedExercises) {
            if (!exercise.completedAt) continue;
            
            const exerciseDate = new Date(exercise.completedAt);
            exerciseDate.setHours(0, 0, 0, 0);
            
            const daysDiff = Math.floor((currentDate.getTime() - exerciseDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === streak) {
                streak++;
            } else if (daysDiff > streak) {
                break;
            }
        }
        
        return streak;
    }

    private calculateWeeklyProgress(): Array<{week: string, exercisesCompleted: number, timeSpent: number}> {
        const weeks: Record<string, {exercisesCompleted: number, timeSpent: number}> = {};
        const sessions = Array.from(this.sessionData.values());
        
        sessions.forEach(session => {
            const date = new Date(session.sessionStart);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            const weekKey = weekStart.toISOString().split('T')[0];
            
            if (!weeks[weekKey]) {
                weeks[weekKey] = { exercisesCompleted: 0, timeSpent: 0 };
            }
            
            if (session.completed) {
                weeks[weekKey].exercisesCompleted++;
            }
            weeks[weekKey].timeSpent += session.duration;
        });
        
        return Object.entries(weeks)
            .map(([week, data]) => ({ week, ...data }))
            .sort((a, b) => a.week.localeCompare(b.week))
            .slice(-12); // Last 12 weeks
    }

    // Data Persistence
    private loadProgressData(): void {
        if (!browser) return;
        
        try {
            const data = localStorage.getItem(this.progressStorageKey);
            if (data) {
                const parsed = JSON.parse(data);
                this.progressData = new Map(Object.entries(parsed));
            }
        } catch (error) {
            console.error('Error loading progress data:', error);
        }
    }

    private saveProgressData(): void {
        if (!browser) return;
        
        try {
            const data = Object.fromEntries(this.progressData);
            localStorage.setItem(this.progressStorageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving progress data:', error);
        }
    }

    private loadSessionData(): void {
        if (!browser) return;
        
        try {
            const data = localStorage.getItem(this.sessionStorageKey);
            if (data) {
                const parsed = JSON.parse(data);
                this.sessionData = new Map(Object.entries(parsed));
            }
        } catch (error) {
            console.error('Error loading session data:', error);
        }
    }

    private saveSessionData(): void {
        if (!browser) return;
        
        try {
            const data = Object.fromEntries(this.sessionData);
            localStorage.setItem(this.sessionStorageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving session data:', error);
        }
    }

    private startPeriodicSave(): void {
        if (!browser) return;
        
        setInterval(() => {
            this.saveProgressData();
            this.saveSessionData();
        }, 30000); // Save every 30 seconds
    }

    // Export/Import functionality
    exportData(): string {
        return JSON.stringify({
            progress: Object.fromEntries(this.progressData),
            sessions: Object.fromEntries(this.sessionData),
            exportDate: Date.now()
        });
    }

    importData(data: string): boolean {
        try {
            const parsed = JSON.parse(data);
            if (parsed.progress) {
                this.progressData = new Map(Object.entries(parsed.progress));
            }
            if (parsed.sessions) {
                this.sessionData = new Map(Object.entries(parsed.sessions));
            }
            this.saveProgressData();
            this.saveSessionData();
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    clearAllData(): void {
        if (!browser) return;
        
        this.progressData.clear();
        this.sessionData.clear();
        this.currentSession = null;
        
        localStorage.removeItem(this.progressStorageKey);
        localStorage.removeItem(this.sessionStorageKey);
        localStorage.removeItem(this.statsStorageKey);
    }
}

// Export singleton instance
export const exerciseProgressService = ExerciseProgressService.getInstance();
