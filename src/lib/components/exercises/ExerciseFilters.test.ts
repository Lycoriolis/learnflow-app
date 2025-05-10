// src/lib/components/exercises/ExerciseFilters.test.ts
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ExerciseFilters from './ExerciseFilters.svelte';

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

// Replace the global localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('ExerciseFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });
  
  it('should render with all filter types by default', () => {
    // Arrange & Act
    render(ExerciseFilters);
    
    // Assert
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });
  
  it('should show/hide filters when toggle button is clicked', async () => {
    // Arrange
    render(ExerciseFilters);
    const toggleButton = screen.getByText('Filters');
    
    // Act - expand filters
    await fireEvent.click(toggleButton);
    
    // Assert - check if filter content is visible
    expect(screen.getByText('Completion Status')).toBeInTheDocument();
    expect(screen.getByText('Exercise Type')).toBeInTheDocument();
    expect(screen.getByText('Difficulty Level')).toBeInTheDocument();
    expect(screen.getByText('Sort By')).toBeInTheDocument();
    
    // Act - collapse filters
    await fireEvent.click(toggleButton);
    
    // Assert - this is trickier to test with transitions, we'd need to wait for the transition
    // In a real test, you might want to check if the DOM elements no longer exist, but for simplicity:
    // We'll verify the aria-expanded state
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });
  
  it('should emit a change event when filters are selected', async () => {
    // Arrange
    const { component } = render(ExerciseFilters);
    const mockHandler = vi.fn();
    component.$on('change', mockHandler);
    
    // Expand filters first
    await fireEvent.click(screen.getByText('Filters'));
    
    // Act - select a status filter
    const completedCheckbox = screen.getByLabelText('Completed');
    await fireEvent.click(completedCheckbox);
    
    // Assert
    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler.mock.calls[0][0].detail).toHaveProperty('status');
    expect(mockHandler.mock.calls[0][0].detail.status).toContain('completed');
  });
  
  it('should save filter preferences to localStorage', async () => {
    // Arrange
    render(ExerciseFilters);
    
    // Expand filters first
    await fireEvent.click(screen.getByText('Filters'));
    
    // Act - select filters
    await fireEvent.click(screen.getByLabelText('Completed'));
    await fireEvent.click(screen.getByLabelText('Coding Challenge'));
    
    // Select a sort option
    const sortDropdown = screen.getByRole('combobox');
    await fireEvent.change(sortDropdown, { target: { value: 'highest-rated' } });
    
    // Assert
    expect(localStorageMock.setItem).toHaveBeenCalled();
    
    // Check the first call's arguments
    const calls = localStorageMock.setItem.mock.calls;
    const lastCall = calls[calls.length - 1];
    
    expect(lastCall[0]).toBe('exercise-filters');
    
    // Parse the saved JSON
    const savedFilters = JSON.parse(lastCall[1]);
    expect(savedFilters.status).toContain('completed');
    expect(savedFilters.types).toContain('coding');
    expect(savedFilters.sort).toBe('highest-rated');
  });
  
  it('should load saved preferences from localStorage on mount', () => {
    // Arrange - set up saved preferences
    const savedPreferences = {
      status: ['completed', 'in-progress'],
      types: ['multiple-choice'],
      difficulty: ['beginner'],
      sort: 'oldest'
    };
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedPreferences));
    
    // Act
    render(ExerciseFilters);
    
    // Expand filters to see them
    fireEvent.click(screen.getByText('Filters'));
    
    // Assert - check that active filters count is shown (4 filters)
    const filterButton = screen.getByText('Filters');
    expect(filterButton.textContent).toMatch(/\b4\b/); // Contains the number 4
    
    // Check that all active filters are displayed once expanded
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Multiple Choice')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Oldest First')).toBeInTheDocument();
  });
  
  it('should reset filters when clear button is clicked', async () => {
    // Arrange - set up saved preferences
    const savedPreferences = {
      status: ['completed'],
      types: ['coding'],
      difficulty: [],
      sort: 'highest-rated'
    };
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedPreferences));
    
    // Render and expand filters
    const { component } = render(ExerciseFilters);
    const changeHandler = vi.fn();
    component.$on('change', changeHandler);
    
    await fireEvent.click(screen.getByText('Filters'));
    
    // Act - click clear all button
    await fireEvent.click(screen.getByText('Clear all'));
    
    // Assert
    expect(localStorageMock.setItem).toHaveBeenCalled();
    
    // The most recent call should have empty arrays
    const calls = localStorageMock.setItem.mock.calls;
    const lastCall = calls[calls.length - 1];
    const savedFilters = JSON.parse(lastCall[1]);
    
    expect(savedFilters.status).toEqual([]);
    expect(savedFilters.types).toEqual([]);
    expect(savedFilters.sort).toBe('newest');
    
    // Check that the change event was emitted with reset values
    expect(changeHandler).toHaveBeenCalled();
    const eventDetail = changeHandler.mock.calls[changeHandler.mock.calls.length - 1][0].detail;
    expect(eventDetail.status).toEqual([]);
    expect(eventDetail.type).toEqual([]);
    expect(eventDetail.sortBy).toBe('newest');
  });
});
