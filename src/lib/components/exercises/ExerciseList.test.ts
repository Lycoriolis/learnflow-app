// src/lib/components/exercises/ExerciseList.test.ts
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ExerciseList from './ExerciseList.svelte';
import * as filterService from '$lib/services/exerciseFilterService';

// Mock the exerciseFilterService
vi.mock('$lib/services/exerciseFilterService', () => {
  return {
    initExerciseFilterService: vi.fn(),
    filteredExercises: { subscribe: vi.fn() },
    setFilters: vi.fn()
  };
});

// Mock the $app/navigation
vi.mock('$app/navigation', () => {
  return {
    goto: vi.fn()
  };
});

describe('ExerciseList', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default mock implementation for filteredExercises
    (filterService.filteredExercises.subscribe as any).mockImplementation((callback) => {
      callback([]);
      return () => {};
    });
  });
  
  it('should render the title and initialize the filter service', () => {
    // Arrange & Act
    render(ExerciseList, { props: { title: 'Test Exercises', exercises: [] } });
    
    // Assert
    expect(screen.getByText('Test Exercises')).toBeInTheDocument();
    expect(filterService.initExerciseFilterService).toHaveBeenCalled();
  });
  
  it('should display filters when showFilters is true', () => {
    // Arrange
    render(ExerciseList, { 
      props: { 
        exercises: [], 
        showFilters: true 
      } 
    });
    
    // Assert - should render the ExerciseFilters component
    // Since we can't easily test for the component itself, we'll check for elements that would be rendered by it
    // This might be tricky since the filters are collapsed by default, so we'll check for the Filters button
    expect(screen.getByText(/Filters/i)).toBeInTheDocument();
  });
  
  it('should show loading state initially', () => {
    // Arrange & Act
    render(ExerciseList, { props: { exercises: [] } });
    
    // Assert
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  
  it('should show empty state when no exercises match filters', () => {
    // Arrange - mock filtered exercises as empty array
    (filterService.filteredExercises.subscribe as any).mockImplementation((callback) => {
      callback([]);
      return () => {};
    });
    
    // Act
    render(ExerciseList, { 
      props: { 
        exercises: [{ id: '1', title: 'Test', description: 'Test', type: 'coding', difficulty: 'beginner', tags: [], createdAt: new Date(), updatedAt: new Date() }],
        showFilters: true
      } 
    });
    
    // Fast-forward past loading state
    vi.runAllTimers();
    
    // Assert
    expect(screen.getByText(/No exercises match your filters/i)).toBeInTheDocument();
  });
  
  it('should display exercise cards when exercises are available', () => {
    // Arrange - mock filtered exercises with data
    const mockExercises = [
      { 
        id: 'ex1', 
        title: 'JavaScript Variables', 
        description: 'Learn about JavaScript variables', 
        type: 'multiple-choice', 
        difficulty: 'beginner',
        tags: ['javascript', 'basics'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'ex2',
        title: 'CSS Flexbox',
        description: 'Master CSS Flexbox layout',
        type: 'coding',
        difficulty: 'intermediate',
        tags: ['css', 'layout'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    (filterService.filteredExercises.subscribe as any).mockImplementation((callback) => {
      callback(mockExercises);
      return () => {};
    });
    
    // Act
    render(ExerciseList, { props: { exercises: mockExercises } });
    
    // Assert
    expect(screen.getByText('JavaScript Variables')).toBeInTheDocument();
    expect(screen.getByText('CSS Flexbox')).toBeInTheDocument();
  });
  
  it('should call setFilters when filter changes are received', () => {
    // Arrange
    const { component } = render(ExerciseList, { props: { exercises: [], showFilters: true } });
    
    // Act - simulate filter change event from child component
    component.$emit('change', {
      status: ['completed'],
      type: ['coding'],
      difficulty: ['intermediate'],
      sortBy: 'newest'
    });
    
    // Assert
    expect(filterService.setFilters).toHaveBeenCalledWith({
      status: ['completed'],
      type: ['coding'],
      difficulty: ['intermediate'],
      sortBy: 'newest'
    });
  });
});
