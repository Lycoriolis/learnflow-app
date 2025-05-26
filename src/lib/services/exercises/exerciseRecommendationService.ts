import { browser } from '$app/environment';
import { ExerciseContentService } from './exerciseContentService';
import { exerciseProgressService, type ExerciseProgress } from './exerciseProgressService';

export interface RecommendationSettings {
    considerProgress: boolean;
    considerBookmarks: boolean;
    considerDifficulty: boolean;
    considerCategory: boolean;
    considerTags: boolean;
    maxRecommendations: number;
    includeCompleted: boolean;
}

export interface ExerciseRecommendation {
    exercise: any;
    score: number;
    reasons: string[];
    confidence: number;
}

export interface SearchOptions {
    query: string;
    categories?: string[];
    difficulties?: string[];
    tags?: string[];
    includeCompleted?: boolean;
    sortBy?: 'relevance' | 'difficulty' | 'category' | 'recent' | 'popular';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
}

export interface SearchResult {
    exercise: any;
    relevanceScore: number;
    matchedFields: string[];
    highlight?: string;
}

export class ExerciseRecommendationService {
    private static instance: ExerciseRecommendationService;
    private exerciseService: ExerciseContentService;
    private defaultSettings: RecommendationSettings = {
        considerProgress: true,
        considerBookmarks: true,
        considerDifficulty: true,
        considerCategory: true,
        considerTags: true,
        maxRecommendations: 10,
        includeCompleted: false
    };

    constructor() {
        this.exerciseService = new ExerciseContentService();
    }

    static getInstance(): ExerciseRecommendationService {
        if (!ExerciseRecommendationService.instance) {
            ExerciseRecommendationService.instance = new ExerciseRecommendationService();
        }
        return ExerciseRecommendationService.instance;
    }

    // Main recommendation engine
    async getRecommendations(
        settings: Partial<RecommendationSettings> = {}
    ): Promise<ExerciseRecommendation[]> {
        const finalSettings = { ...this.defaultSettings, ...settings };
        
        try {
            const allExercises = await this.exerciseService.getAllExercises('exercises');
            const userProgress = exerciseProgressService.getAllProgress();
            const bookmarked = exerciseProgressService.getBookmarkedExercises();
            const completed = exerciseProgressService.getCompletedExercises();
            
            const recommendations: ExerciseRecommendation[] = [];
            
            for (const exercise of allExercises) {
                const progress = userProgress.find(p => p.exerciseId === exercise.href);
                const isCompleted = completed.some(c => c.exerciseId === exercise.href);
                
                // Skip completed exercises if not included
                if (isCompleted && !finalSettings.includeCompleted) {
                    continue;
                }
                
                const recommendation = this.calculateRecommendationScore(
                    exercise,
                    progress,
                    userProgress,
                    bookmarked,
                    finalSettings
                );
                
                if (recommendation.score > 0) {
                    recommendations.push(recommendation);
                }
            }
            
            // Sort by score and limit results
            return recommendations
                .sort((a, b) => b.score - a.score)
                .slice(0, finalSettings.maxRecommendations);
                
        } catch (error) {
            console.error('Error getting recommendations:', error);
            return [];
        }
    }

    // Get recommendations for a specific exercise
    async getRelatedExercises(
        exerciseId: string,
        limit: number = 5
    ): Promise<ExerciseRecommendation[]> {
        try {
            const allExercises = await this.exerciseService.getAllExercises('exercises');
            const targetExercise = allExercises.find(e => e.href === exerciseId);
            
            if (!targetExercise) {
                return [];
            }
            
            const related: ExerciseRecommendation[] = [];
            
            for (const exercise of allExercises) {
                if (exercise.href === exerciseId) continue;
                
                const similarity = this.calculateSimilarity(targetExercise, exercise);
                
                if (similarity.score > 0.1) {
                    related.push({
                        exercise,
                        score: similarity.score,
                        reasons: similarity.reasons,
                        confidence: similarity.score
                    });
                }
            }
            
            return related
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);
                
        } catch (error) {
            console.error('Error getting related exercises:', error);
            return [];
        }
    }

    // Advanced search functionality
    async searchExercises(options: SearchOptions): Promise<SearchResult[]> {
        try {
            const allExercises = await this.exerciseService.getAllExercises('exercises');
            const userProgress = exerciseProgressService.getAllProgress();
            const completed = exerciseProgressService.getCompletedExercises();
            
            let filteredExercises = allExercises;
            
            // Apply filters
            if (options.categories && options.categories.length > 0) {
                filteredExercises = filteredExercises.filter(e => 
                    options.categories!.includes(e.category)
                );
            }
            
            if (options.difficulties && options.difficulties.length > 0) {
                filteredExercises = filteredExercises.filter(e => 
                    options.difficulties!.includes(e.difficulty)
                );
            }
            
            if (options.tags && options.tags.length > 0) {
                filteredExercises = filteredExercises.filter(e => 
                    e.tags && options.tags!.some(tag => e.tags.includes(tag))
                );
            }
            
            if (!options.includeCompleted) {
                const completedIds = new Set(completed.map(c => c.exerciseId));
                filteredExercises = filteredExercises.filter(e => 
                    !completedIds.has(e.href)
                );
            }
            
            // Calculate search relevance
            const searchResults: SearchResult[] = filteredExercises.map(exercise => {
                const searchScore = this.calculateSearchRelevance(exercise, options.query);
                return {
                    exercise,
                    relevanceScore: searchScore.score,
                    matchedFields: searchScore.matchedFields,
                    highlight: searchScore.highlight
                };
            }).filter(result => result.relevanceScore > 0);
            
            // Sort results
            const sortedResults = this.sortSearchResults(searchResults, options);
            
            // Apply limit
            return options.limit ? sortedResults.slice(0, options.limit) : sortedResults;
            
        } catch (error) {
            console.error('Error searching exercises:', error);
            return [];
        }
    }

    // Get personalized learning path
    async getLearningPath(
        targetCategory?: string,
        targetDifficulty?: string
    ): Promise<ExerciseRecommendation[]> {
        try {
            const allExercises = await this.exerciseService.getAllExercises('exercises');
            const userProgress = exerciseProgressService.getAllProgress();
            const completed = exerciseProgressService.getCompletedExercises();
            
            let exercises = allExercises;
            
            // Filter by category if specified
            if (targetCategory) {
                exercises = exercises.filter(e => e.category === targetCategory);
            }
            
            // Remove completed exercises
            const completedIds = new Set(completed.map(c => c.exerciseId));
            exercises = exercises.filter(e => !completedIds.has(e.href));
            
            // Calculate learning path scores
            const pathExercises: ExerciseRecommendation[] = exercises.map(exercise => {
                const pathScore = this.calculateLearningPathScore(
                    exercise,
                    userProgress,
                    targetDifficulty
                );
                
                return {
                    exercise,
                    score: pathScore.score,
                    reasons: pathScore.reasons,
                    confidence: pathScore.confidence
                };
            }).filter(item => item.score > 0);
            
            // Sort by learning progression
            return pathExercises.sort((a, b) => b.score - a.score);
            
        } catch (error) {
            console.error('Error generating learning path:', error);
            return [];
        }
    }

    // Private helper methods
    private calculateRecommendationScore(
        exercise: any,
        progress: ExerciseProgress | undefined,
        allProgress: ExerciseProgress[],
        bookmarked: ExerciseProgress[],
        settings: RecommendationSettings
    ): ExerciseRecommendation {
        let score = 0;
        const reasons: string[] = [];
        
        // Base interest score
        score += 0.1;
        
        // Category-based scoring
        if (settings.considerCategory) {
            const categoryProgress = allProgress.filter(p => p.category === exercise.category);
            if (categoryProgress.length > 0) {
                const categoryEngagement = categoryProgress.reduce((sum, p) => 
                    sum + p.timeSpent, 0) / categoryProgress.length;
                score += Math.min(categoryEngagement / 300000, 0.3); // Max 5 minutes = 0.3 points
                reasons.push(`Active in ${exercise.category} category`);
            }
        }
        
        // Difficulty progression scoring
        if (settings.considerDifficulty) {
            const userLevel = this.estimateUserLevel(allProgress, exercise.category);
            const exerciseDifficulty = this.getDifficultyLevel(exercise.difficulty);
            
            if (Math.abs(userLevel - exerciseDifficulty) <= 1) {
                score += 0.4;
                reasons.push('Appropriate difficulty level');
            } else if (exerciseDifficulty === userLevel + 1) {
                score += 0.2;
                reasons.push('Next difficulty level');
            }
        }
        
        // Tag-based scoring
        if (settings.considerTags && exercise.tags) {
            const userTags = new Set(
                allProgress.flatMap(p => p.tags || [])
            );
            
            const commonTags = exercise.tags.filter(tag => userTags.has(tag));
            if (commonTags.length > 0) {
                score += commonTags.length * 0.1;
                reasons.push(`Matches interests: ${commonTags.join(', ')}`);
            }
        }
        
        // Bookmark pattern scoring
        if (settings.considerBookmarks) {
            const bookmarkedCategories = new Set(
                bookmarked.map(b => b.category).filter(Boolean)
            );
            
            if (exercise.category && bookmarkedCategories.has(exercise.category)) {
                score += 0.2;
                reasons.push('Similar to bookmarked exercises');
            }
        }
        
        // Recency and engagement scoring
        if (settings.considerProgress && allProgress.length > 0) {
            const recentActivity = allProgress.filter(p => 
                Date.now() - p.lastAccessedAt < 7 * 24 * 60 * 60 * 1000 // Last week
            );
            
            if (recentActivity.length > 0) {
                score += 0.1;
                reasons.push('Continuing recent learning momentum');
            }
        }
        
        const confidence = Math.min(score, 1);
        
        return {
            exercise,
            score,
            reasons,
            confidence
        };
    }

    private calculateSimilarity(exercise1: any, exercise2: any): { score: number; reasons: string[] } {
        let score = 0;
        const reasons: string[] = [];
        
        // Category similarity
        if (exercise1.category === exercise2.category) {
            score += 0.4;
            reasons.push('Same category');
        }
        
        // Difficulty similarity
        if (exercise1.difficulty === exercise2.difficulty) {
            score += 0.2;
            reasons.push('Same difficulty');
        }
        
        // Tag similarity
        if (exercise1.tags && exercise2.tags) {
            const commonTags = exercise1.tags.filter((tag: string) => 
                exercise2.tags.includes(tag)
            );
            
            if (commonTags.length > 0) {
                score += commonTags.length * 0.1;
                reasons.push(`Common topics: ${commonTags.join(', ')}`);
            }
        }
        
        // Title/description similarity (basic keyword matching)
        const keywords1 = this.extractKeywords(exercise1.title + ' ' + (exercise1.description || ''));
        const keywords2 = this.extractKeywords(exercise2.title + ' ' + (exercise2.description || ''));
        
        const commonKeywords = keywords1.filter(keyword => keywords2.includes(keyword));
        if (commonKeywords.length > 0) {
            score += Math.min(commonKeywords.length * 0.05, 0.2);
            reasons.push('Similar content');
        }
        
        return { score, reasons };
    }

    private calculateSearchRelevance(exercise: any, query: string): {
        score: number;
        matchedFields: string[];
        highlight?: string;
    } {
        const lowercaseQuery = query.toLowerCase();
        const queryTerms = lowercaseQuery.split(/\s+/).filter(term => term.length > 2);
        
        let score = 0;
        const matchedFields: string[] = [];
        let highlight = '';
        
        // Title matching (highest weight)
        if (exercise.title.toLowerCase().includes(lowercaseQuery)) {
            score += 1.0;
            matchedFields.push('title');
            highlight = exercise.title;
        } else {
            const titleMatches = queryTerms.filter(term => 
                exercise.title.toLowerCase().includes(term)
            );
            if (titleMatches.length > 0) {
                score += titleMatches.length * 0.3;
                matchedFields.push('title');
            }
        }
        
        // Description matching
        if (exercise.description) {
            if (exercise.description.toLowerCase().includes(lowercaseQuery)) {
                score += 0.7;
                matchedFields.push('description');
                if (!highlight) highlight = exercise.description.substring(0, 100) + '...';
            } else {
                const descMatches = queryTerms.filter(term => 
                    exercise.description.toLowerCase().includes(term)
                );
                if (descMatches.length > 0) {
                    score += descMatches.length * 0.2;
                    matchedFields.push('description');
                }
            }
        }
        
        // Category matching
        if (exercise.category && exercise.category.toLowerCase().includes(lowercaseQuery)) {
            score += 0.5;
            matchedFields.push('category');
        }
        
        // Tag matching
        if (exercise.tags) {
            const tagMatches = exercise.tags.filter((tag: string) => 
                tag.toLowerCase().includes(lowercaseQuery) ||
                queryTerms.some(term => tag.toLowerCase().includes(term))
            );
            if (tagMatches.length > 0) {
                score += tagMatches.length * 0.3;
                matchedFields.push('tags');
            }
        }
        
        // Difficulty matching
        if (exercise.difficulty && exercise.difficulty.toLowerCase().includes(lowercaseQuery)) {
            score += 0.2;
            matchedFields.push('difficulty');
        }
        
        return { score, matchedFields, highlight };
    }

    private calculateLearningPathScore(
        exercise: any,
        allProgress: ExerciseProgress[],
        targetDifficulty?: string
    ): { score: number; reasons: string[]; confidence: number } {
        let score = 0;
        const reasons: string[] = [];
        
        const userLevel = this.estimateUserLevel(allProgress, exercise.category);
        const exerciseDifficulty = this.getDifficultyLevel(exercise.difficulty);
        
        // Optimal difficulty progression
        if (exerciseDifficulty === userLevel + 1) {
            score += 0.8;
            reasons.push('Next logical difficulty step');
        } else if (exerciseDifficulty === userLevel) {
            score += 0.6;
            reasons.push('Reinforces current level');
        } else if (exerciseDifficulty === userLevel - 1) {
            score += 0.3;
            reasons.push('Good for review');
        }
        
        // Target difficulty alignment
        if (targetDifficulty && exercise.difficulty === targetDifficulty) {
            score += 0.4;
            reasons.push(`Matches target difficulty: ${targetDifficulty}`);
        }
        
        // Prerequisites satisfaction (simplified)
        const categoryProgress = allProgress.filter(p => p.category === exercise.category);
        if (categoryProgress.length > 0) {
            score += 0.2;
            reasons.push('Builds on existing knowledge');
        }
        
        const confidence = Math.min(score, 1);
        
        return { score, reasons, confidence };
    }

    private sortSearchResults(results: SearchResult[], options: SearchOptions): SearchResult[] {
        const { sortBy = 'relevance', sortOrder = 'desc' } = options;
        
        return results.sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'relevance':
                    comparison = a.relevanceScore - b.relevanceScore;
                    break;
                case 'difficulty':
                    comparison = this.getDifficultyLevel(a.exercise.difficulty) - 
                                this.getDifficultyLevel(b.exercise.difficulty);
                    break;
                case 'category':
                    comparison = (a.exercise.category || '').localeCompare(b.exercise.category || '');
                    break;
                case 'recent':
                    // Would need creation/update dates in exercise data
                    comparison = 0;
                    break;
                case 'popular':
                    // Would need popularity metrics
                    comparison = 0;
                    break;
                default:
                    comparison = a.relevanceScore - b.relevanceScore;
            }
            
            return sortOrder === 'desc' ? -comparison : comparison;
        });
    }

    private estimateUserLevel(progress: ExerciseProgress[], category?: string): number {
        const relevantProgress = category 
            ? progress.filter(p => p.category === category)
            : progress;
            
        if (relevantProgress.length === 0) return 1; // Beginner
        
        const completedExercises = relevantProgress.filter(p => p.isCompleted);
        if (completedExercises.length === 0) return 1;
        
        const averageDifficulty = completedExercises.reduce((sum, p) => 
            sum + this.getDifficultyLevel(p.difficulty), 0
        ) / completedExercises.length;
        
        return Math.round(averageDifficulty);
    }

    private getDifficultyLevel(difficulty?: string): number {
        switch (difficulty?.toLowerCase()) {
            case 'beginner':
            case 'easy':
                return 1;
            case 'intermediate':
            case 'medium':
                return 2;
            case 'advanced':
            case 'hard':
                return 3;
            default:
                return 1;
        }
    }

    private extractKeywords(text: string): string[] {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3)
            .slice(0, 10); // Limit to prevent performance issues
    }
}

// Export singleton instance
export const exerciseRecommendationService = ExerciseRecommendationService.getInstance();
