import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { exerciseProgressService, type ExerciseProgress } from './exerciseProgressService';

export interface BookmarkCollection {
    id: string;
    name: string;
    description?: string;
    exerciseIds: string[];
    createdAt: number;
    updatedAt: number;
    color?: string;
    icon?: string;
}

export interface BookmarkTag {
    id: string;
    name: string;
    color: string;
    exerciseIds: string[];
}

// Stores
export const bookmarkedExercises = writable<ExerciseProgress[]>([]);
export const bookmarkCollections = writable<BookmarkCollection[]>([]);
export const bookmarkTags = writable<BookmarkTag[]>([]);

export class ExerciseBookmarkService {
    private static instance: ExerciseBookmarkService;
    private collections: Map<string, BookmarkCollection> = new Map();
    private tags: Map<string, BookmarkTag> = new Map();
    private collectionsStorageKey = 'exercise-bookmark-collections';
    private tagsStorageKey = 'exercise-bookmark-tags';

    constructor() {
        if (browser) {
            this.loadCollections();
            this.loadTags();
            this.updateStores();
        }
    }

    static getInstance(): ExerciseBookmarkService {
        if (!ExerciseBookmarkService.instance) {
            ExerciseBookmarkService.instance = new ExerciseBookmarkService();
        }
        return ExerciseBookmarkService.instance;
    }

    // Bookmark Management
    toggleBookmark(exerciseId: string, exerciseData: {
        href: string;
        title: string;
        difficulty?: string;
        category?: string;
        tags?: string[];
    }): boolean {
        const isBookmarked = exerciseProgressService.toggleBookmark(exerciseId, exerciseData);
        this.updateStores();
        return isBookmarked;
    }

    isBookmarked(exerciseId: string): boolean {
        const progress = exerciseProgressService.getProgress(exerciseId);
        return progress?.isBookmarked || false;
    }

    getBookmarkedExercises(): ExerciseProgress[] {
        return exerciseProgressService.getBookmarkedExercises();
    }

    // Collection Management
    createCollection(name: string, description?: string, color?: string, icon?: string): string {
        const id = this.generateId();
        const collection: BookmarkCollection = {
            id,
            name,
            description,
            exerciseIds: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            color: color || '#3B82F6',
            icon: icon || 'folder'
        };

        this.collections.set(id, collection);
        this.saveCollections();
        this.updateStores();
        return id;
    }

    updateCollection(id: string, updates: Partial<Omit<BookmarkCollection, 'id' | 'createdAt'>>): boolean {
        const collection = this.collections.get(id);
        if (!collection) return false;

        Object.assign(collection, updates, { updatedAt: Date.now() });
        this.collections.set(id, collection);
        this.saveCollections();
        this.updateStores();
        return true;
    }

    deleteCollection(id: string): boolean {
        const deleted = this.collections.delete(id);
        if (deleted) {
            this.saveCollections();
            this.updateStores();
        }
        return deleted;
    }

    addToCollection(collectionId: string, exerciseId: string): boolean {
        const collection = this.collections.get(collectionId);
        if (!collection) return false;

        if (!collection.exerciseIds.includes(exerciseId)) {
            collection.exerciseIds.push(exerciseId);
            collection.updatedAt = Date.now();
            this.collections.set(collectionId, collection);
            this.saveCollections();
            this.updateStores();
        }
        return true;
    }

    removeFromCollection(collectionId: string, exerciseId: string): boolean {
        const collection = this.collections.get(collectionId);
        if (!collection) return false;

        const index = collection.exerciseIds.indexOf(exerciseId);
        if (index > -1) {
            collection.exerciseIds.splice(index, 1);
            collection.updatedAt = Date.now();
            this.collections.set(collectionId, collection);
            this.saveCollections();
            this.updateStores();
            return true;
        }
        return false;
    }

    getCollection(id: string): BookmarkCollection | undefined {
        return this.collections.get(id);
    }

    getAllCollections(): BookmarkCollection[] {
        return Array.from(this.collections.values()).sort((a, b) => b.updatedAt - a.updatedAt);
    }

    getCollectionExercises(collectionId: string): ExerciseProgress[] {
        const collection = this.collections.get(collectionId);
        if (!collection) return [];

        return collection.exerciseIds
            .map(id => exerciseProgressService.getProgress(id))
            .filter((progress): progress is ExerciseProgress => progress !== undefined);
    }

    // Tag Management
    createTag(name: string, color: string): string {
        const id = this.generateId();
        const tag: BookmarkTag = {
            id,
            name,
            color,
            exerciseIds: []
        };

        this.tags.set(id, tag);
        this.saveTags();
        this.updateStores();
        return id;
    }

    updateTag(id: string, updates: Partial<Omit<BookmarkTag, 'id'>>): boolean {
        const tag = this.tags.get(id);
        if (!tag) return false;

        Object.assign(tag, updates);
        this.tags.set(id, tag);
        this.saveTags();
        this.updateStores();
        return true;
    }

    deleteTag(id: string): boolean {
        const deleted = this.tags.delete(id);
        if (deleted) {
            this.saveTags();
            this.updateStores();
        }
        return deleted;
    }

    addTagToExercise(tagId: string, exerciseId: string): boolean {
        const tag = this.tags.get(tagId);
        if (!tag) return false;

        if (!tag.exerciseIds.includes(exerciseId)) {
            tag.exerciseIds.push(exerciseId);
            this.tags.set(tagId, tag);
            this.saveTags();
            this.updateStores();
        }
        return true;
    }

    removeTagFromExercise(tagId: string, exerciseId: string): boolean {
        const tag = this.tags.get(tagId);
        if (!tag) return false;

        const index = tag.exerciseIds.indexOf(exerciseId);
        if (index > -1) {
            tag.exerciseIds.splice(index, 1);
            this.tags.set(tagId, tag);
            this.saveTags();
            this.updateStores();
            return true;
        }
        return false;
    }

    getTag(id: string): BookmarkTag | undefined {
        return this.tags.get(id);
    }

    getAllTags(): BookmarkTag[] {
        return Array.from(this.tags.values()).sort((a, b) => a.name.localeCompare(b.name));
    }

    getExerciseTags(exerciseId: string): BookmarkTag[] {
        return Array.from(this.tags.values()).filter(tag => 
            tag.exerciseIds.includes(exerciseId)
        );
    }

    getTagExercises(tagId: string): ExerciseProgress[] {
        const tag = this.tags.get(tagId);
        if (!tag) return [];

        return tag.exerciseIds
            .map(id => exerciseProgressService.getProgress(id))
            .filter((progress): progress is ExerciseProgress => progress !== undefined);
    }

    // Search and Filter
    searchBookmarks(query: string): ExerciseProgress[] {
        const bookmarked = this.getBookmarkedExercises();
        const lowercaseQuery = query.toLowerCase();

        return bookmarked.filter(exercise => 
            exercise.title.toLowerCase().includes(lowercaseQuery) ||
            exercise.category?.toLowerCase().includes(lowercaseQuery) ||
            exercise.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
            exercise.notes?.toLowerCase().includes(lowercaseQuery)
        );
    }

    filterBookmarksByCategory(category: string): ExerciseProgress[] {
        return this.getBookmarkedExercises().filter(exercise => 
            exercise.category === category
        );
    }

    filterBookmarksByDifficulty(difficulty: string): ExerciseProgress[] {
        return this.getBookmarkedExercises().filter(exercise => 
            exercise.difficulty === difficulty
        );
    }

    filterBookmarksByCompletion(completed: boolean): ExerciseProgress[] {
        return this.getBookmarkedExercises().filter(exercise => 
            exercise.isCompleted === completed
        );
    }

    // Organization features
    getBookmarksByCollection(): Record<string, ExerciseProgress[]> {
        const result: Record<string, ExerciseProgress[]> = {};
        
        for (const collection of this.collections.values()) {
            result[collection.name] = this.getCollectionExercises(collection.id);
        }

        // Add uncategorized bookmarks
        const allBookmarked = this.getBookmarkedExercises();
        const categorizedIds = new Set(
            Array.from(this.collections.values())
                .flatMap(c => c.exerciseIds)
        );
        
        const uncategorized = allBookmarked.filter(exercise => 
            !categorizedIds.has(exercise.exerciseId)
        );
        
        if (uncategorized.length > 0) {
            result['Uncategorized'] = uncategorized;
        }

        return result;
    }

    getBookmarksByTag(): Record<string, ExerciseProgress[]> {
        const result: Record<string, ExerciseProgress[]> = {};
        
        for (const tag of this.tags.values()) {
            if (tag.exerciseIds.length > 0) {
                result[tag.name] = this.getTagExercises(tag.id);
            }
        }

        return result;
    }

    // Statistics
    getBookmarkStatistics() {
        const bookmarked = this.getBookmarkedExercises();
        const collections = this.getAllCollections();
        const tags = this.getAllTags();

        const completedBookmarks = bookmarked.filter(e => e.isCompleted).length;
        const totalTimeSpent = bookmarked.reduce((sum, e) => sum + e.timeSpent, 0);
        
        const categoryDistribution = bookmarked.reduce((acc, exercise) => {
            const category = exercise.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const difficultyDistribution = bookmarked.reduce((acc, exercise) => {
            const difficulty = exercise.difficulty || 'Unknown';
            acc[difficulty] = (acc[difficulty] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalBookmarks: bookmarked.length,
            completedBookmarks,
            completionRate: bookmarked.length > 0 ? (completedBookmarks / bookmarked.length) * 100 : 0,
            totalTimeSpent,
            averageTimePerBookmark: bookmarked.length > 0 ? totalTimeSpent / bookmarked.length : 0,
            totalCollections: collections.length,
            totalTags: tags.length,
            categoryDistribution,
            difficultyDistribution,
            recentlyBookmarked: bookmarked
                .sort((a, b) => b.lastAccessedAt - a.lastAccessedAt)
                .slice(0, 5)
        };
    }

    // Utility methods
    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    private updateStores(): void {
        if (!browser) return;
        
        bookmarkedExercises.set(this.getBookmarkedExercises());
        bookmarkCollections.set(this.getAllCollections());
        bookmarkTags.set(this.getAllTags());
    }

    // Data Persistence
    private loadCollections(): void {
        if (!browser) return;
        
        try {
            const data = localStorage.getItem(this.collectionsStorageKey);
            if (data) {
                const parsed = JSON.parse(data);
                this.collections = new Map(Object.entries(parsed));
            }
        } catch (error) {
            console.error('Error loading bookmark collections:', error);
        }
    }

    private saveCollections(): void {
        if (!browser) return;
        
        try {
            const data = Object.fromEntries(this.collections);
            localStorage.setItem(this.collectionsStorageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving bookmark collections:', error);
        }
    }

    private loadTags(): void {
        if (!browser) return;
        
        try {
            const data = localStorage.getItem(this.tagsStorageKey);
            if (data) {
                const parsed = JSON.parse(data);
                this.tags = new Map(Object.entries(parsed));
            }
        } catch (error) {
            console.error('Error loading bookmark tags:', error);
        }
    }

    private saveTags(): void {
        if (!browser) return;
        
        try {
            const data = Object.fromEntries(this.tags);
            localStorage.setItem(this.tagsStorageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving bookmark tags:', error);
        }
    }

    // Export/Import functionality
    exportBookmarks(): string {
        return JSON.stringify({
            collections: Object.fromEntries(this.collections),
            tags: Object.fromEntries(this.tags),
            exportDate: Date.now()
        });
    }

    importBookmarks(data: string): boolean {
        try {
            const parsed = JSON.parse(data);
            if (parsed.collections) {
                this.collections = new Map(Object.entries(parsed.collections));
                this.saveCollections();
            }
            if (parsed.tags) {
                this.tags = new Map(Object.entries(parsed.tags));
                this.saveTags();
            }
            this.updateStores();
            return true;
        } catch (error) {
            console.error('Error importing bookmarks:', error);
            return false;
        }
    }

    clearAllBookmarks(): void {
        if (!browser) return;
        
        this.collections.clear();
        this.tags.clear();
        
        localStorage.removeItem(this.collectionsStorageKey);
        localStorage.removeItem(this.tagsStorageKey);
        
        this.updateStores();
    }
}

// Export singleton instance
export const exerciseBookmarkService = ExerciseBookmarkService.getInstance();
