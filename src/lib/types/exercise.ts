export interface Exercise {
    id: string;
    title: string;
    description?: string;
    category?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
    points?: number;
    estimatedTime?: string;
    isCompleted?: boolean;
    isInProgress?: boolean;
}

export interface ExerciseFilterOptions {
    category?: string;
    difficulty?: string;
    tags?: string[];
    searchTerm?: string;
}

export interface ExerciseProgress {
    userId: string;
    exerciseId: string;
    completed: boolean;
    score?: number;
    lastAttempt?: Date;
    attempts: number;
}

export interface ExerciseSubmission {
    userId: string;
    exerciseId: string;
    code: string;
    language: string;
    timestamp: Date;
    result?: {
        success: boolean;
        output?: string;
        error?: string;
        testResults?: any[]; // Changed TestResult[] to any[]
    };
}

export interface ExerciseAttempt {
    userId: string;
    exerciseId: string;
    attemptId: string;
    answers: Record<string, any>; // User's answers
    score?: number; // Score obtained for this attempt
    passed?: boolean; // Whether the user passed this attempt
    feedback?: Record<string, string>; // Feedback per question or general
    timestamp: Date | string; // When the attempt was made
    solutionViewed?: boolean; // Whether the solution was viewed during this attempt
    hintsUsed?: number; // Number of hints used
    timeTaken?: number; // Time in seconds taken for the attempt
    evaluation?: {
        isCorrect: boolean;
        correctAnswer?: any;
        explanation?: string;
        error?: string;
        testResults?: any[]; // Changed TestResult[] to any[]
    };
}
