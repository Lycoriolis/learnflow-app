// Filepath: /home/linux/learnflow-app/learnflow-app/src/lib/components/search/SearchResults.test.ts
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchResults from './SearchResults.svelte';
import * as searchService from '$lib/services/searchService';

// Mock the search service
vi.mock('$lib/services/searchService', () => {
  return {
    searchResults: { subscribe: vi.fn() },
    searchQuery: { subscribe: vi.fn() },
    searchLoading: { subscribe: vi.fn() },
    changePage: vi.fn(),
    highlightSearchResult: vi.fn((text, query) => text)
  };
});

describe('SearchResults', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default mocked store values
    (searchService.searchResults.subscribe as any).mockImplementation((callback) => {
      callback({
        items: [],
        currentPage: 1,
        totalPages: 1,
        totalResults: 0
      });
      return () => {};
    });
    
    (searchService.searchQuery.subscribe as any).mockImplementation((callback) => {
      callback('');
      return () => {};
    });
    
    (searchService.searchLoading.subscribe as any).mockImplementation((callback) => {
      callback(false);
      return () => {};
    });
    
    (searchService.highlightSearchResult as any).mockImplementation((text, query) => {
      if (!query) return text;
      return text.replace(new RegExp(query, 'gi'), `<mark>${query}</mark>`);
    });
  });
  
  it('should render loading state', () => {
    // Arrange - mock loading state
    (searchService.searchLoading.subscribe as any).mockImplementation((callback) => {
      callback(true);
      return () => {};
    });
    
    (searchService.searchQuery.subscribe as any).mockImplementation((callback) => {
      callback('javascript');
      return () => {};
    });
    
    // Act
    render(SearchResults);
    
    // Assert
    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });
  
  it('should render empty state when no results found', () => {
    // Arrange
    (searchService.searchQuery.subscribe as any).mockImplementation((callback) => {
      callback('nonexistent');
      return () => {};
    });
    
    (searchService.searchResults.subscribe as any).mockImplementation((callback) => {
      callback({
        items: [],
        currentPage: 1,
        totalPages: 1,
        totalResults: 0
      });
      return () => {};
    });
    
    // Act
    render(SearchResults);
    
    // Assert
    expect(screen.getByText('No results found for "nonexistent"')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search term or filters')).toBeInTheDocument();
  });
  
  it('should render search results', () => {
    // Arrange
    const mockResults = {
      items: [
        {
          id: 'course-1',
          title: 'JavaScript Basics',
          description: 'Learn JavaScript fundamentals',
          type: 'course',
          tags: ['javascript', 'web development']
        },
        {
          id: 'exercise-1',
          title: 'Array Methods',
          description: 'Practice using JavaScript array methods',
          type: 'exercise',
          tags: ['javascript', 'arrays']
        }
      ],
      currentPage: 1,
      totalPages: 1,
      totalResults: 2
    };
    
    (searchService.searchResults.subscribe as any).mockImplementation((callback) => {
      callback(mockResults);
      return () => {};
    });
    
    (searchService.searchQuery.subscribe as any).mockImplementation((callback) => {
      callback('javascript');
      return () => {};
    });
    
    // Act
    render(SearchResults);
    
    // Assert
    expect(screen.getByText('2 results for "javascript"')).toBeInTheDocument();
    
    // For complex content like this, it's better to verify that key elements exist
    // rather than trying to match the exact text with its markup
    expect(screen.getByText('Array Methods')).toBeInTheDocument();
    
    // Rather than looking for exact text matches, check for key HTML elements
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThanOrEqual(1);
    
    // Verify tags are present
    expect(screen.getAllByText('javascript').length).toBeGreaterThanOrEqual(1);
  });
  
  it('should display pagination when multiple pages exist', () => {
    // Arrange
    const mockResults = {
      items: Array(5).fill(0).map((_, i) => ({
        id: `item-${i}`,
        title: `Result ${i + 1}`,
        description: `Description ${i + 1}`,
        type: i % 2 === 0 ? 'course' : 'exercise',
        tags: ['tag1', 'tag2']
      })),
      currentPage: 1,
      totalPages: 3,
      totalResults: 15
    };
    
    (searchService.searchResults.subscribe as any).mockImplementation((callback) => {
      callback(mockResults);
      return () => {};
    });
    
    (searchService.searchQuery.subscribe as any).mockImplementation((callback) => {
      callback('test');
      return () => {};
    });
    
    // Act
    render(SearchResults);
    
    // Assert
    expect(screen.getByText('1')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
  
  it('should call changePage when pagination button is clicked', async () => {
    // Arrange
    const mockResults = {
      items: Array(5).fill(0).map((_, i) => ({
        id: `item-${i}`,
        title: `Result ${i + 1}`,
        description: `Description ${i + 1}`,
        type: i % 2 === 0 ? 'course' : 'exercise',
        tags: ['tag1', 'tag2']
      })),
      currentPage: 1,
      totalPages: 3,
      totalResults: 15
    };
    
    (searchService.searchResults.subscribe as any).mockImplementation((callback) => {
      callback(mockResults);
      return () => {};
    });
    
    (searchService.searchQuery.subscribe as any).mockImplementation((callback) => {
      callback('test');
      return () => {};
    });
    
    // Act
    render(SearchResults, { props: { options: { pageSize: 5 } } });
    
    // Click on page 2
    const page2Button = screen.getByText('2');
    await fireEvent.click(page2Button);
    
    // Assert
    expect(searchService.changePage).toHaveBeenCalledWith(2, { pageSize: 5 });
  });
  
  it('should highlight search terms in results', () => {
    // Arrange
    const mockResults = {
      items: [
        {
          id: 'course-1',
          title: 'JavaScript Basics',
          description: 'Learn JavaScript fundamentals',
          type: 'course',
          tags: ['javascript', 'web development']
        }
      ],
      currentPage: 1,
      totalPages: 1,
      totalResults: 1
    };
    
    (searchService.searchResults.subscribe as any).mockImplementation((callback) => {
      callback(mockResults);
      return () => {};
    });
    
    (searchService.searchQuery.subscribe as any).mockImplementation((callback) => {
      callback('javascript');
      return () => {};
    });
    
    // Act
    render(SearchResults);
    
    // Assert
    // This is testing the highlighting indirectly by checking if highlightSearchResult is called
    expect(searchService.highlightSearchResult).toHaveBeenCalledWith('JavaScript Basics', 'javascript');
    expect(searchService.highlightSearchResult).toHaveBeenCalledWith('Learn JavaScript fundamentals', 'javascript');
  });
  
  it('should display tags for search results', () => {
    // Arrange
    const mockResults = {
      items: [
        {
          id: 'course-1',
          title: 'JavaScript Basics',
          description: 'Learn JavaScript fundamentals',
          type: 'course',
          tags: ['javascript', 'web development']
        }
      ],
      currentPage: 1,
      totalPages: 1,
      totalResults: 1
    };
    
    (searchService.searchResults.subscribe as any).mockImplementation((callback) => {
      callback(mockResults);
      return () => {};
    });
    
    (searchService.searchQuery.subscribe as any).mockImplementation((callback) => {
      callback('javascript');
      return () => {};
    });
    
    // Act
    render(SearchResults);
    
    // Assert
    // Use getAllByText since there may be multiple elements with the text "javascript"
    const jsTags = screen.getAllByText(/javascript/i);
    expect(jsTags.length).toBeGreaterThan(0);
    
    const webDevTags = screen.getAllByText(/web development/i);
    expect(webDevTags.length).toBeGreaterThan(0);
  });
  
  it('should show content type indicators', () => {
    // Arrange
    const mockResults = {
      items: [
        {
          id: 'course-1',
          title: 'JavaScript Basics',
          description: 'Learn JavaScript fundamentals',
          type: 'course',
          tags: ['javascript', 'web development']
        },
        {
          id: 'exercise-1',
          title: 'Array Methods',
          description: 'Practice using JavaScript array methods',
          type: 'exercise',
          tags: ['javascript', 'arrays']
        }
      ],
      currentPage: 1,
      totalPages: 1,
      totalResults: 2
    };
    
    (searchService.searchResults.subscribe as any).mockImplementation((callback) => {
      callback(mockResults);
      return () => {};
    });
    
    (searchService.searchQuery.subscribe as any).mockImplementation((callback) => {
      callback('javascript');
      return () => {};
    });
    
    // Act
    render(SearchResults);
    
    // Assert
    const courseTypes = screen.getAllByText('course');
    const exerciseTypes = screen.getAllByText('exercise');
    expect(courseTypes.length).toBe(1);
    expect(exerciseTypes.length).toBe(1);
  });
});
