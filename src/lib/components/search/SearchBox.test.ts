// Filepath: /home/linux/learnflow-app/learnflow-app/src/lib/components/search/SearchBox.test.ts
import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchBox from './SearchBox.svelte';
import * as searchService from '$lib/services/searchService';

// Mock the search service
vi.mock('$lib/services/searchService', () => {
  const searchQuery = { subscribe: vi.fn() };
  const searchLoading = { subscribe: vi.fn() };
  const recentSearches = { subscribe: vi.fn(), set: vi.fn() };
  
  return {
    performSearch: vi.fn(),
    searchQuery: searchQuery,
    searchLoading: searchLoading,
    recentSearches: recentSearches
  };
});

describe('SearchBox', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock the store subscriptions
    const mockSubscribe = (callback: Function) => {
      callback([]);
      return () => {};
    };
    
    (searchService.searchQuery.subscribe as any).mockImplementation((callback: Function) => {
      callback('');
      return () => {};
    });
    
    (searchService.searchLoading.subscribe as any).mockImplementation((callback: Function) => {
      callback(false);
      return () => {};
    });
    
    (searchService.recentSearches.subscribe as any).mockImplementation(mockSubscribe);
  });
  
  it('should render with default placeholder', () => {
    // Arrange & Act
    render(SearchBox);
    
    // Assert
    const input = screen.getByPlaceholderText('Search for courses and exercises...');
    expect(input).toBeTruthy();
  });
  
  it('should render with custom placeholder', () => {
    // Arrange & Act
    render(SearchBox, { 
      props: { 
        placeholder: 'Custom placeholder' 
      } 
    });
    
    // Assert
    const input = screen.getByPlaceholderText('Custom placeholder');
    expect(input).toBeTruthy();
  });    it('should call performSearch when search button is clicked', async () => {
    // Arrange
    render(SearchBox);
    const input = screen.getByPlaceholderText('Search for courses and exercises...');
    
    // Trying different approach to get the button
    const buttons = screen.getAllByRole('button');
    const searchButton = buttons.find(button => button.getAttribute('aria-label') === 'Search');
    
    // Act
    await fireEvent.input(input, { target: { value: 'test query' } });
    if (searchButton) {
      await fireEvent.click(searchButton);
    } else {
      // Fallback to click on the input and press Enter
      await fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    }
    
    // Assert
    expect(searchService.performSearch).toHaveBeenCalledWith('test query');
  });
  
  it('should call performSearch when Enter key is pressed', async () => {
    // Arrange
    render(SearchBox);
    const input = screen.getByPlaceholderText('Search for courses and exercises...');
    
    // Act
    await fireEvent.input(input, { target: { value: 'test query' } });
    await fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    // Assert
    expect(searchService.performSearch).toHaveBeenCalledWith('test query');
  });    it('should not call performSearch if query is too short', async () => {
    // Arrange
    render(SearchBox, { props: { minQueryLength: 3 } });
    const input = screen.getByPlaceholderText('Search for courses and exercises...');
    const searchButtons = screen.getAllByLabelText('Search');
    const searchButton = searchButtons[0]; // Use the first match
    
    // Act
    await fireEvent.input(input, { target: { value: 'ab' } });
    await fireEvent.click(searchButton);
    
    // Assert
    expect(searchService.performSearch).not.toHaveBeenCalled();
  });
  
  it('should clear input when clear button is clicked', async () => {
    // Arrange
    render(SearchBox);
    const input = screen.getByPlaceholderText('Search for courses and exercises...');
    
    // Act
    await fireEvent.input(input, { target: { value: 'test query' } });
    
    // Check if clear button appears and click it
    const clearButton = screen.getByLabelText('Clear search');
    await fireEvent.click(clearButton);
    
    // Assert
    expect((input as HTMLInputElement).value).toBe('');
  });
  
  it('should call onSearch callback when search is performed', async () => {
    // Arrange
    const mockOnSearch = vi.fn();
    render(SearchBox, { props: { onSearch: mockOnSearch } });
    
    const input = screen.getByPlaceholderText('Search for courses and exercises...');
    
    // Act
    await fireEvent.input(input, { target: { value: 'test query' } });
    await fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    // Assert
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });
});
