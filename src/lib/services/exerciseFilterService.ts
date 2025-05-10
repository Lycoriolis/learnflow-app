// src/lib/services/exerciseFilterService.ts
import { writable, derived, get } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import { user } from '$lib/stores/authStore';
import { getUserProgress } from '$lib/services/progressService';
import { browser } from '$app/environment';

// Define exercise interface
export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'multiple-choice' | 'coding' | 'written' | 'interactive';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  rating?: number;
  completions?: number;
  lastViewed?: Date | null;
  status?: 'completed' | 'in-progress' | 'not-started';
}

// Define filter options
export interface ExerciseFilters {
  status: string[];
  type: string[];
  difficulty: string[];
  tags: string[];
  searchQuery: string;
  sortBy: string;
}

// Store for all exercises
export const allExercises: Writable<Exercise[]> = writable([]);

// Store for filter options
export const filterOptions: Writable<ExerciseFilters> = writable({
  status: [],
  type: [],
  difficulty: [],
  tags: [],
  searchQuery: '',
  sortBy: 'newest'
});

// Store for filtered exercises based on filter options
export const filteredExercises: Readable<Exercise[]> = derived(
  [allExercises, filterOptions, user],
  ([$allExercises, $filterOptions, $user]) => {
    // Start with all exercises
    let filtered = [...$allExercises];
    
    // Apply status filter
    if ($filterOptions.status.length > 0) {
      filtered = filtered.filter(exercise => 
        $filterOptions.status.includes(exercise.status || 'not-started')
      );
    }
    
    // Apply type filter
    if ($filterOptions.type.length > 0) {
      filtered = filtered.filter(exercise => 
        $filterOptions.type.includes(exercise.type)
      );
    }
    
    // Apply difficulty filter
    if ($filterOptions.difficulty.length > 0) {
      filtered = filtered.filter(exercise => 
        $filterOptions.difficulty.includes(exercise.difficulty)
      );
    }
    
    // Apply tags filter
    if ($filterOptions.tags.length > 0) {
      filtered = filtered.filter(exercise => 
        $filterOptions.tags.some(tag => exercise.tags.includes(tag))
      );
    }
    
    // Apply search query
    if ($filterOptions.searchQuery) {
      const query = $filterOptions.searchQuery.toLowerCase();
      filtered = filtered.filter(exercise => 
        exercise.title.toLowerCase().includes(query) || 
        exercise.description.toLowerCase().includes(query) ||
        exercise.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Sort the filtered exercises
    filtered = sortExercises(filtered, $filterOptions.sortBy);
    
    return filtered;
  }
);

// Helper to sort exercises
function sortExercises(exercises: Exercise[], sortMethod: string): Exercise[] {
  switch (sortMethod) {
    case 'newest':
      return [...exercises].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
    case 'oldest':
      return [...exercises].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
    case 'highest-rated':
      return [...exercises].sort((a, b) => 
        (b.rating || 0) - (a.rating || 0)
      );
      
    case 'most-completed':
      return [...exercises].sort((a, b) => 
        (b.completions || 0) - (a.completions || 0)
      );
      
    case 'recently-viewed':
      return [...exercises].sort((a, b) => {
        if (!a.lastViewed) return 1;
        if (!b.lastViewed) return -1;
        return new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime();
      });
      
    default:
      return exercises;
  }
}

// Load user's progress status for exercises
export async function loadExerciseProgress(exercises: Exercise[]): Promise<Exercise[]> {
  const currentUser = get(user);
  if (!currentUser) return exercises;
  
  try {
    const progress = await getUserProgress(currentUser.uid);
    
    // Merge progress data with exercises
    return exercises.map(exercise => {
      const exerciseProgress = progress.exercises[exercise.id];
      if (!exerciseProgress) return { ...exercise, status: 'not-started' };
      
      return {
        ...exercise,
        status: exerciseProgress.completed ? 'completed' : 
                exerciseProgress.started ? 'in-progress' : 'not-started',
        lastViewed: exerciseProgress.lastViewed ? new Date(exerciseProgress.lastViewed) : null
      };
    });
  } catch (error) {
    console.error('Error loading exercise progress:', error);
    return exercises;
  }
}

// Set filter options
export function setFilters(filters: Partial<ExerciseFilters>): void {
  filterOptions.update(current => ({ ...current, ...filters }));
  
  // Save preferences to localStorage
  if (browser) {
    try {
      localStorage.setItem('exercise-filters', JSON.stringify(get(filterOptions)));
    } catch (error) {
      console.error('Error saving filter preferences:', error);
    }
  }
}

// Reset filters to default
export function resetFilters(): void {
  filterOptions.set({
    status: [],
    type: [],
    difficulty: [],
    tags: [],
    searchQuery: '',
    sortBy: 'newest'
  });
  
  // Clear saved preferences
  if (browser) {
    try {
      localStorage.removeItem('exercise-filters');
    } catch (error) {
      console.error('Error clearing filter preferences:', error);
    }
  }
}

// Load saved filter preferences
export function loadSavedFilters(): void {
  if (!browser) return;
  
  try {
    const savedFilters = localStorage.getItem('exercise-filters');
    if (savedFilters) {
      filterOptions.set(JSON.parse(savedFilters));
    }
  } catch (error) {
    console.error('Error loading saved filter preferences:', error);
  }
}

// Initialize the service by loading saved filters
export function initExerciseFilterService(initialExercises: Exercise[] = []): void {
  // Load saved filters first
  loadSavedFilters();
  
  // Set initial exercises
  allExercises.set(initialExercises);
  
  // Load progress if exercises are provided
  if (initialExercises.length > 0) {
    loadExerciseProgress(initialExercises).then(updatedExercises => {
      allExercises.set(updatedExercises);
    });
  }
}
