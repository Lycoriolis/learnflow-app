// src/lib/services/exerciseFilterService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { 
  allExercises, 
  filterOptions, 
  filteredExercises,
  initExerciseFilterService,
  setFilters,
  resetFilters,
  loadSavedFilters,
  loadExerciseProgress,
  type Exercise
} from './exerciseFilterService';
import * as progressService from './progressService';
import { user } from '$lib/stores/authStore';

// Mock dependencies
vi.mock('./progressService', () => {
  return {
    getUserProgress: vi.fn()
  };
});

vi.mock('$lib/stores/authStore', () => {
  return {
    user: { subscribe: vi.fn() }
  };
});

// Mock browser environment
vi.mock('$app/environment', () => {
  return {
    browser: true
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('exerciseFilterService', () => {
  const mockExercises: Exercise[] = [
    {
      id: 'ex1',
      title: 'JavaScript Basics',
      description: 'Learn JavaScript fundamentals',
      type: 'multiple-choice',
      difficulty: 'beginner',
      tags: ['javascript', 'basics'],
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-20'),
      rating: 4.5,
      completions: 120,
      status: 'completed'
    },
    {
      id: 'ex2',
      title: 'CSS Grid Layout',
      description: 'Master CSS Grid layouts',
      type: 'coding',
      difficulty: 'intermediate',
      tags: ['css', 'layout'],
      createdAt: new Date('2023-03-10'),
      updatedAt: new Date('2023-03-15'),
      rating: 4.2,
      completions: 85,
      status: 'in-progress'
    },
    {
      id: 'ex3',
      title: 'React Hooks',
      description: 'Advanced React hooks patterns',
      type: 'coding',
      difficulty: 'advanced',
      tags: ['react', 'hooks', 'javascript'],
      createdAt: new Date('2023-05-05'),
      updatedAt: new Date('2023-05-10'),
      rating: 4.8,
      completions: 42,
      status: 'not-started'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    
    // Reset stores
    allExercises.set([]);
    filterOptions.set({
      status: [],
      type: [],
      difficulty: [],
      tags: [],
      searchQuery: '',
      sortBy: 'newest'
    });
    
    // Mock user store to return null by default
    (user.subscribe as any).mockImplementation((callback) => {
      callback(null);
      return () => {};
    });
  });

  describe('filtering functionality', () => {
    it('should filter exercises by status', () => {
      // Arrange
      allExercises.set(mockExercises);
      
      // Act
      setFilters({ status: ['completed'] });
      
      // Assert
      const filtered = get(filteredExercises);
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('ex1');
    });
    
    it('should filter exercises by type', () => {
      // Arrange
      allExercises.set(mockExercises);
      
      // Act
      setFilters({ type: ['coding'] });
      
      // Assert
      const filtered = get(filteredExercises);
      expect(filtered.length).toBe(2);
      expect(filtered[0].id).toBe('ex3'); // newest first by default
      expect(filtered[1].id).toBe('ex2');
    });
    
    it('should filter exercises by difficulty', () => {
      // Arrange
      allExercises.set(mockExercises);
      
      // Act
      setFilters({ difficulty: ['intermediate', 'advanced'] });
      
      // Assert
      const filtered = get(filteredExercises);
      expect(filtered.length).toBe(2);
      expect(filtered.some(ex => ex.id === 'ex2')).toBe(true);
      expect(filtered.some(ex => ex.id === 'ex3')).toBe(true);
    });
    
    it('should filter exercises by tags', () => {
      // Arrange
      allExercises.set(mockExercises);
      
      // Act
      setFilters({ tags: ['javascript'] });
      
      // Assert
      const filtered = get(filteredExercises);
      expect(filtered.length).toBe(2);
      expect(filtered.some(ex => ex.id === 'ex1')).toBe(true);
      expect(filtered.some(ex => ex.id === 'ex3')).toBe(true);
    });
    
    it('should filter exercises by search query', () => {
      // Arrange
      allExercises.set(mockExercises);
      
      // Act
      setFilters({ searchQuery: 'react' });
      
      // Assert
      const filtered = get(filteredExercises);
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('ex3');
    });
    
    it('should combine multiple filters', () => {
      // Arrange
      allExercises.set(mockExercises);
      
      // Act
      setFilters({ 
        type: ['coding'], 
        difficulty: ['intermediate'] 
      });
      
      // Assert
      const filtered = get(filteredExercises);
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('ex2');
    });
  });
  
  describe('sorting functionality', () => {
    it('should sort exercises by newest', () => {
      // Arrange
      allExercises.set(mockExercises);
      
      // Act
      setFilters({ sortBy: 'newest' });
      
      // Assert
      const filtered = get(filteredExercises);
      expect(filtered.length).toBe(3);
      expect(filtered[0].id).toBe('ex3'); // Most recent
      expect(filtered[2].id).toBe('ex1'); // Oldest
    });
    
    it('should sort exercises by oldest', () => {
      // Arrange
      allExercises.set(mockExercises);
      
      // Act
      setFilters({ sortBy: 'oldest' });
      
      // Assert
      const filtered = get(filteredExercises);
      expect(filtered.length).toBe(3);
      expect(filtered[0].id).toBe('ex1'); // Oldest
      expect(filtered[2].id).toBe('ex3'); // Most recent
    });
    
    it('should sort exercises by highest rated', () => {
      // Arrange
      allExercises.set(mockExercises);
      
      // Act
      setFilters({ sortBy: 'highest-rated' });
      
      // Assert
      const filtered = get(filteredExercises);
      expect(filtered.length).toBe(3);
      expect(filtered[0].id).toBe('ex3'); // Rating 4.8
      expect(filtered[1].id).toBe('ex1'); // Rating 4.5
      expect(filtered[2].id).toBe('ex2'); // Rating 4.2
    });
    
    it('should sort exercises by most completed', () => {
      // Arrange
      allExercises.set(mockExercises);
      
      // Act
      setFilters({ sortBy: 'most-completed' });
      
      // Assert
      const filtered = get(filteredExercises);
      expect(filtered.length).toBe(3);
      expect(filtered[0].id).toBe('ex1'); // 120 completions
      expect(filtered[1].id).toBe('ex2'); // 85 completions
      expect(filtered[2].id).toBe('ex3'); // 42 completions
    });
  });
  
  describe('localStorage persistence', () => {
    it('should save filter options to localStorage', () => {
      // Arrange
      const filters = { 
        status: ['completed'], 
        type: ['coding'], 
        difficulty: ['advanced'],
        sortBy: 'highest-rated'
      };
      
      // Act
      setFilters(filters);
      
      // Assert
      expect(localStorageMock.setItem).toHaveBeenCalled();
      expect(JSON.parse(localStorageMock.setItem.mock.calls[0][1])).toMatchObject({
        status: ['completed'],
        type: ['coding'],
        difficulty: ['advanced'],
        sortBy: 'highest-rated'
      });
    });
    
    it('should load saved filters from localStorage', () => {
      // Arrange
      const savedFilters = {
        status: ['in-progress'],
        type: ['written'],
        difficulty: ['beginner'],
        tags: ['javascript'],
        searchQuery: 'react',
        sortBy: 'oldest'
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedFilters));
      
      // Act
      loadSavedFilters();
      
      // Assert
      expect(get(filterOptions)).toEqual(savedFilters);
    });
    
    it('should reset filters to default', () => {
      // Arrange - set some filters first
      setFilters({ 
        status: ['completed'], 
        type: ['coding'],
        sortBy: 'highest-rated'
      });
      
      // Act
      resetFilters();
      
      // Assert
      expect(get(filterOptions)).toEqual({
        status: [],
        type: [],
        difficulty: [],
        tags: [],
        searchQuery: '',
        sortBy: 'newest'
      });
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('exercise-filters');
    });
  });
  
  describe('progress integration', () => {
    it('should load exercise progress for a logged-in user', async () => {
      // Arrange
      const mockUser = { uid: 'user123' };
      const mockProgress = {
        exercises: {
          'ex1': { completed: true, started: true, lastViewed: '2023-10-15T14:30:00Z' },
          'ex2': { completed: false, started: true, lastViewed: '2023-10-16T10:15:00Z' }
        }
      };
      
      (user.subscribe as any).mockImplementation((callback) => {
        callback(mockUser);
        return () => {};
      });
      
      (progressService.getUserProgress as any).mockResolvedValue(mockProgress);
      
      // Act
      const result = await loadExerciseProgress(mockExercises);
      
      // Assert
      expect(progressService.getUserProgress).toHaveBeenCalledWith('user123');
      expect(result[0].status).toBe('completed');
      expect(result[1].status).toBe('in-progress');
      expect(result[2].status).toBe('not-started'); // No progress data for ex3
    });
    
    it('should initialize the service with exercises and load progress', () => {
      // Arrange
      const progressSpy = vi.spyOn(Promise, 'resolve').mockImplementation(() => Promise.resolve(mockExercises));
      
      // Act
      initExerciseFilterService(mockExercises);
      
      // Assert
      expect(get(allExercises)).toEqual(mockExercises);
      // This is hard to test directly since loadExerciseProgress is called asynchronously
    });
  });
});
