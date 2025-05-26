export interface UserProfile {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    emailVerified?: boolean;
    preferences?: UserPreferences;
    enrollments?: CourseEnrollment[];
    providerId?: string; // Added providerId as optional
}

export interface UserPreferences {
    theme?: string;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    enrollments?: CourseEnrollment[];
}

export interface CourseEnrollment {
    courseId: string;
    progress: number;
    completed: boolean;
    lastAccessed?: string;
}

export interface UserProgressMetrics {
    totalCoursesStarted?: number;
    totalCoursesCompleted?: number;
    totalExercisesAttempted?: number;
    totalExercisesCompleted?: number;
    averageExerciseScore?: number;
    totalLearningTime?: number;
}

export interface Exercise {
    id: string;
    title: string;
    description?: string;
    difficulty?: string;
    category?: string;
    tags?: string[];
    points?: number;
    estimatedTime?: string;
    isCompleted?: boolean;
    isInProgress?: boolean;
    isLoading?: boolean;
}
