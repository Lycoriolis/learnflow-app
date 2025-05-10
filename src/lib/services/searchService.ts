// src/lib/services/searchService.ts
import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';
import { searchContent } from './enhancedContentService';
import type { ContentMetadata } from './contentService';
import { get } from 'svelte/store';

/**
 * Interface for search results with pagination
 */
export interface SearchResults {
  items: ContentMetadata[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

/**
 * Interface for search options
 */
export interface SearchOptions {
  types?: ('course' | 'exercise')[];
  page?: number;
  pageSize?: number;
  sortBy?: 'relevance' | 'date' | 'title';
  filterTags?: string[];
}

// Store to hold the latest search results
export const searchResults: Writable<SearchResults> = writable({
  items: [],
  currentPage: 1,
  totalPages: 1,
  totalResults: 0
});

// Store to hold the search query
export const searchQuery: Writable<string> = writable('');

// Store to hold the loading state
export const searchLoading: Writable<boolean> = writable(false);

// Store to track recent searches
export const recentSearches: Writable<string[]> = writable([]);

// Cache for search results
const searchCache = new Map<string, SearchResults>();

// Load saved recent searches from localStorage on initialization
if (browser) {
  const savedSearches = localStorage.getItem('recentSearches');
  if (savedSearches) {
    recentSearches.set(JSON.parse(savedSearches));
  }
}

// Save recent searches to localStorage whenever they change
recentSearches.subscribe(searches => {
  if (browser) {
    localStorage.setItem('recentSearches', JSON.stringify(searches));
  }
});

// Debounce function to limit how frequently a function is called
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Function to search with debouncing
const debouncedSearch = debounce(async (query: string, options: SearchOptions = {}) => {
  if (!browser || !query.trim()) {
    searchResults.set({
      items: [],
      currentPage: 1,
      totalPages: 1,
      totalResults: 0
    });
    searchLoading.set(false);
    return;
  }

  // Cache key based on query and options
  const cacheKey = JSON.stringify({ query, options });
  
  // Check if results are in cache
  if (searchCache.has(cacheKey)) {
    searchResults.set(searchCache.get(cacheKey)!);
    searchLoading.set(false);
    return;
  }

  try {
    const { page = 1, pageSize = 10 } = options;
    const allResults = await searchContent(query, options.types);
    
    // Sort results based on options
    let sortedResults = [...allResults];
    if (options.sortBy === 'title') {
      sortedResults.sort((a, b) => a.title.localeCompare(b.title));
    } else if (options.sortBy === 'date' && sortedResults[0]?.metadata?.dateUpdated) {
      sortedResults.sort((a, b) => {
        const dateA = a.metadata?.dateUpdated ? new Date(a.metadata.dateUpdated).getTime() : 0;
        const dateB = b.metadata?.dateUpdated ? new Date(b.metadata.dateUpdated).getTime() : 0;
        return dateB - dateA; // Sort by most recent first
      });
    }
    
    // Filter by tags if specified
    if (options.filterTags && options.filterTags.length > 0) {
      sortedResults = sortedResults.filter(item => 
        item.tags && item.tags.some(tag => options.filterTags!.includes(tag))
      );
    }
    
    // Calculate pagination
    const totalResults = sortedResults.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
    const paginatedResults = sortedResults.slice((page - 1) * pageSize, page * pageSize);
    
    const results: SearchResults = {
      items: paginatedResults,
      currentPage: page,
      totalPages,
      totalResults
    };
    
    // Store in cache
    searchCache.set(cacheKey, results);
    
    // Update results store
    searchResults.set(results);
    
    // Add to recent searches if not already in the list
    recentSearches.update(searches => {
      const trimmedQuery = query.trim();
      // Avoid duplicates and limit to 5 recent searches
      const filtered = searches.filter(s => s !== trimmedQuery);
      return [trimmedQuery, ...filtered].slice(0, 5);
    });
  } catch (error) {
    console.error('Error during search:', error);
    searchResults.set({
      items: [],
      currentPage: 1,
      totalPages: 1,
      totalResults: 0
    });
  } finally {
    searchLoading.set(false);
  }
}, 300); // 300ms debounce time

/**
 * Perform a search with the given query and options
 */
export async function performSearch(query: string, options: SearchOptions = {}) {
  searchLoading.set(true);
  searchQuery.set(query);
  debouncedSearch(query, options);
}

/**
 * Change page for current search results
 */
export function changePage(newPage: number, options: SearchOptions = {}) {
  const currentQuery = get(searchQuery);
  if (currentQuery) {
    performSearch(currentQuery, { ...options, page: newPage });
  }
}

/**
 * Clear the search cache
 */
export function clearSearchCache() {
  searchCache.clear();
}

/**
 * Get highlighted HTML for a search result based on the query
 * This will wrap matching terms in <mark> tags
 */
export function highlightSearchResult(text: string, query: string): string {
  if (!text || !query) return text;
  
  const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const words = sanitizedQuery.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length === 0) return text;
  
  let result = text;
  words.forEach(word => {
    if (word.length < 2) return; // Skip very short words
    
    const regex = new RegExp(`(${word})`, 'gi');
    result = result.replace(regex, '<mark>$1</mark>');
  });
  
  return result;
}
