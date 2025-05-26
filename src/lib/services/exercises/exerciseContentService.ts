import type { ServerContentNode } from '$lib/server/contentService';
import { 
  getChildNodesList, 
  getNodeByContentPath, 
  getExerciseByContentPath 
} from '$lib/server/contentService';

export interface ExerciseFilterOptions {
  searchQuery?: string;
  difficulty?: string;
  category?: string;
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ExerciseStats {
  totalExercises: number;
  totalCategories: number;
  difficultyBreakdown: Record<string, number>;
  tagBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
}

export class ExerciseContentService {
  private static instance: ExerciseContentService;
  private cache = new Map<string, { data: any; timestamp: number; expiry: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): ExerciseContentService {
    if (!ExerciseContentService.instance) {
      ExerciseContentService.instance = new ExerciseContentService();
    }
    return ExerciseContentService.instance;
  }

  private getCacheKey(prefix: string, params: any): string {
    return `${prefix}:${JSON.stringify(params)}`;
  }

  private isCacheValid(cacheEntry: any): boolean {
    return cacheEntry && Date.now() < cacheEntry.timestamp + cacheEntry.expiry;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: this.CACHE_DURATION
    });
  }

  private getCache(key: string): any {
    const cacheEntry = this.cache.get(key);
    if (this.isCacheValid(cacheEntry)) {
      return cacheEntry.data;
    }
    this.cache.delete(key);
    return null;
  }

  /**
   * Get exercises with filtering and sorting
   */
  async getFilteredExercises(
    contentPath: string,
    options: ExerciseFilterOptions = {}
  ): Promise<ServerContentNode[]> {
    const cacheKey = this.getCacheKey('filtered-exercises', { contentPath, options });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      // Get all exercises from the path
      const exercises = await this.getAllExercises(contentPath);
      
      // Apply filters
      let filtered = [...exercises];

      // Search filter
      if (options.searchQuery) {
        const query = options.searchQuery.toLowerCase();
        filtered = filtered.filter(exercise => 
          exercise.title?.toLowerCase().includes(query) ||
          exercise.description?.toLowerCase().includes(query) ||
          exercise.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }

      // Difficulty filter
      if (options.difficulty && options.difficulty !== 'all') {
        filtered = filtered.filter(exercise => 
          exercise.difficulty?.toLowerCase() === options.difficulty?.toLowerCase()
        );
      }

      // Category filter
      if (options.category && options.category !== 'all') {
        filtered = filtered.filter(exercise => 
          exercise.category?.toLowerCase() === options.category?.toLowerCase()
        );
      }

      // Tags filter
      if (options.tags && options.tags.length > 0) {
        filtered = filtered.filter(exercise => 
          options.tags!.every(tag => 
            exercise.tags?.some(exerciseTag => 
              exerciseTag.toLowerCase() === tag.toLowerCase()
            )
          )
        );
      }

      // Apply sorting
      if (options.sortBy) {
        filtered.sort((a, b) => {
          let aValue: any, bValue: any;

          switch (options.sortBy) {
            case 'title':
              aValue = a.title || '';
              bValue = b.title || '';
              break;
            case 'difficulty':
              aValue = this.getDifficultyOrder(a.difficulty);
              bValue = this.getDifficultyOrder(b.difficulty);
              break;
            case 'estimatedTime':
              aValue = this.parseEstimatedTime(a.estimatedTime);
              bValue = this.parseEstimatedTime(b.estimatedTime);
              break;
            case 'createdAt':
              aValue = new Date(a.metadata?.createdAt || 0);
              bValue = new Date(b.metadata?.createdAt || 0);
              break;
            default:
              return 0;
          }

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return options.sortOrder === 'desc' 
              ? bValue.localeCompare(aValue)
              : aValue.localeCompare(bValue);
          }

          return options.sortOrder === 'desc' 
            ? bValue - aValue 
            : aValue - bValue;
        });
      }

      this.setCache(cacheKey, filtered);
      return filtered;
    } catch (error) {
      console.error('Error filtering exercises:', error);
      throw error;
    }
  }

  /**
   * Get all exercises from a path
   */
  async getAllExercises(contentPath: string): Promise<ServerContentNode[]> {
    const cacheKey = this.getCacheKey('all-exercises', contentPath);
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const exercises = await getChildNodesList('exercises', contentPath);
      this.setCache(cacheKey, exercises);
      return exercises;
    } catch (error) {
      console.error('Error fetching all exercises:', error);
      throw error;
    }
  }

  /**
   * Get exercise categories (top-level directories)
   */
  async getExerciseCategories(): Promise<ServerContentNode[]> {
    const cacheKey = 'exercise-categories';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const categories = await getChildNodesList('exercises', '/exercises');
      this.setCache(cacheKey, categories);
      return categories;
    } catch (error) {
      console.error('Error fetching exercise categories:', error);
      throw error;
    }
  }

  /**
   * Get exercise by content path
   */
  async getExercise(contentPath: string): Promise<ServerContentNode | null> {
    const cacheKey = this.getCacheKey('exercise', contentPath);
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      // Try to get as individual exercise first
      let exercise = null;
      try {
        exercise = await getExerciseByContentPath(contentPath);
      } catch (error) {
        // Not an individual exercise, try as category node
        exercise = await getNodeByContentPath('exercises', contentPath);
      }

      if (exercise) {
        // Map rawMdxContent to content for consistency
        const exerciseWithContent = {
          ...exercise,
          content: exercise.rawMdxContent
        };
        this.setCache(cacheKey, exerciseWithContent);
        return exerciseWithContent;
      }

      return null;
    } catch (error) {
      console.error('Error fetching exercise:', error);
      throw error;
    }
  }

  /**
   * Get exercise statistics
   */
  async getExerciseStats(contentPath: string = '/exercises'): Promise<ExerciseStats> {
    const cacheKey = this.getCacheKey('exercise-stats', contentPath);
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const exercises = await this.getAllExercises(contentPath);
      const categories = await this.getExerciseCategories();

      const stats: ExerciseStats = {
        totalExercises: exercises.length,
        totalCategories: categories.length,
        difficultyBreakdown: {},
        tagBreakdown: {},
        categoryBreakdown: {}
      };

      // Calculate breakdowns
      exercises.forEach(exercise => {
        // Difficulty breakdown
        const difficulty = exercise.difficulty || 'unspecified';
        stats.difficultyBreakdown[difficulty] = (stats.difficultyBreakdown[difficulty] || 0) + 1;

        // Category breakdown
        const category = exercise.category || 'uncategorized';
        stats.categoryBreakdown[category] = (stats.categoryBreakdown[category] || 0) + 1;

        // Tag breakdown
        if (exercise.tags) {
          exercise.tags.forEach(tag => {
            stats.tagBreakdown[tag] = (stats.tagBreakdown[tag] || 0) + 1;
          });
        }
      });

      this.setCache(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Error calculating exercise stats:', error);
      throw error;
    }
  }

  /**
   * Get unique tags from all exercises
   */
  async getAvailableTags(contentPath: string = '/exercises'): Promise<string[]> {
    const cacheKey = this.getCacheKey('available-tags', contentPath);
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const exercises = await this.getAllExercises(contentPath);
      const tags = new Set<string>();

      exercises.forEach(exercise => {
        if (exercise.tags) {
          exercise.tags.forEach(tag => tags.add(tag));
        }
      });

      const sortedTags = Array.from(tags).sort();
      this.setCache(cacheKey, sortedTags);
      return sortedTags;
    } catch (error) {
      console.error('Error fetching available tags:', error);
      throw error;
    }
  }

  /**
   * Get unique categories from all exercises
   */
  async getAvailableCategories(contentPath: string = '/exercises'): Promise<string[]> {
    const cacheKey = this.getCacheKey('available-categories', contentPath);
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const exercises = await this.getAllExercises(contentPath);
      const categories = new Set<string>();

      exercises.forEach(exercise => {
        if (exercise.category) {
          categories.add(exercise.category);
        }
      });

      const sortedCategories = Array.from(categories).sort();
      this.setCache(cacheKey, sortedCategories);
      return sortedCategories;
    } catch (error) {
      console.error('Error fetching available categories:', error);
      throw error;
    }
  }

  /**
   * Generate breadcrumbs for a content path
   */
  generateBreadcrumbs(contentPath: string): Array<{ title: string; href: string }> {
    const segments = contentPath.replace(/^\/exercises\/?/, '').split('/').filter(Boolean);
    const breadcrumbs = [
      { title: 'Exercises', href: '/exercises' }
    ];
    
    let currentPath = '';
    for (const segment of segments) {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        title: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href: `/exercises${currentPath}`
      });
    }
    
    return breadcrumbs;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Helper methods
   */
  private getDifficultyOrder(difficulty?: string): number {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 1;
      case 'intermediate': return 2;
      case 'advanced': return 3;
      default: return 0;
    }
  }

  private parseEstimatedTime(estimatedTime?: string | number): number {
    if (typeof estimatedTime === 'number') return estimatedTime;
    if (typeof estimatedTime === 'string') {
      const match = estimatedTime.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  }
}
