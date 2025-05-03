import { 
  fetchContent, 
  fetchContentById, 
  fetchContentBySlug, 
  type ContentNode 
} from './contentService';
import { getAuth } from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  getFirestore, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  increment,
  Timestamp,
  FieldValue
} from 'firebase/firestore';

/**
 * Interface for user's progress on an exercise
 */
export interface ExerciseProgress {
  completed: boolean;
  inProgress: boolean;
  timeSpent?: number;
  lastAttemptDate?: Date;
  notes?: string;
  checkedHints?: string[];
}

/**
 * Interface for raw progress data from Firestore
 */
interface RawProgressData {
  completed?: Record<string, boolean>;
  inProgress?: Record<string, boolean>;
  timestamp?: Timestamp;
}

/**
 * Interface for exercise detail data from Firestore
 */
interface ExerciseDetailData {
  timeSpent?: number;
  lastAttemptDate?: Timestamp;
  notes?: string;
  checkedHints?: string[];
  lastUpdatedAt?: Timestamp;
}

/**
 * Interface for scored exercise used in recommendations
 */
export interface ScoredExercise {
  exercise: ContentNode;
  score: number;
}

/**
 * Valid difficulty levels for user preferences
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Interface for user learning preferences
 */
export interface UserPreferences {
  interests: string[];
  difficulty?: DifficultyLevel;
  preferredCategories?: string[];
  lastUpdated?: Timestamp;
}

/**
 * Interface for user exercise stats
 */
export interface UserExerciseStats {
  completedCount: number;
  lastCompletedAt: Timestamp;
  completedExercises: string[];
}

/**
 * Valid sort options for recommendations
 */
export type RecommendationSortOption = 'relevance' | 'popularity' | 'difficulty' | 'newest';

/**
 * Interface for recommendation algorithm options
 */
export interface RecommendationOptions {
  maxResults?: number;
  excludeCompleted?: boolean;
  preferCategories?: string[];
  difficultyRange?: {
    min?: number;
    max?: number;
  };
  sortBy?: RecommendationSortOption;
  tags?: string[];
}

/**
 * Exercise progress status options
 */
export type ExerciseProgressStatus = 'started' | 'completed' | 'reset';

/**
 * Extended interface for Exercise content with specific properties
 */
export interface Exercise extends ContentNode {
  hints?: string[];
  solution?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  relatedExercises?: ContentNode[];
}

/**
 * Fetch all exercises
 * @returns Promise resolving to an array of ContentNode representing exercises
 */
export async function getAllExercises(): Promise<ContentNode[]> {
  return await fetchContent('exercises');
}

/**
 * Fetch exercises by category
 * @param category The category to filter exercises by
 * @returns Promise resolving to filtered exercise list
 */
export async function getExercisesByCategory(category: string): Promise<ContentNode[]> {
  const exercises = await fetchContent('exercises');
  return exercises.filter(exercise => exercise.category === category);
}

/**
 * Fetch exercise by ID
 * @param id The ID of the exercise to fetch
 * @returns Promise resolving to the exercise or null if not found
 */
export async function getExerciseById(id: string): Promise<ContentNode | null> {
  return await fetchContentById('exercises', id);
}

/**
 * Fetch exercise by slug
 * @param slug The URL slug of the exercise to fetch
 * @returns Promise resolving to the exercise or null if not found
 */
export async function getExerciseBySlug(slug: string): Promise<ContentNode | null> {
  return await fetchContentBySlug('exercises', slug);
}

/**
 * Get an exercise by ID with type safety for Exercise-specific properties
 * @param id The ID of the exercise to fetch
 * @returns Promise resolving to the exercise with proper typing or null if not found
 */
export async function getExercise(id: string): Promise<Exercise | null> {
  const exercise = await getExerciseById(id);
  
  if (!exercise) {
    return null;
  }
  
  // Convert standard ContentNode to Exercise type with specific properties
  return exercise as Exercise;
}

/**
 * Track exercise progress for the current user
 * @param exerciseId The ID of the exercise to track
 * @param status The new status to set for the exercise
 * @returns Promise resolving to a boolean indicating success
 */
export async function trackExerciseProgress(exerciseId: string, status: ExerciseProgressStatus): Promise<boolean> {
  const auth = getAuth();
  if (!auth.currentUser) return false;

  try {
    const db = getFirestore();
    const userId = auth.currentUser.uid;
    const userProgressRef = doc(db, 'users', userId, 'progress', 'exercises');

    // Define updates based on status
    const progressUpdates: Record<string, any> = {
      timestamp: serverTimestamp()
    };

    // Update the progress based on the status
    if (status === 'started') {
      progressUpdates[`inProgress.${exerciseId}`] = true;
    } else if (status === 'completed') {
      progressUpdates[`completed.${exerciseId}`] = true;
      progressUpdates[`inProgress.${exerciseId}`] = false;
      
      // Also update user stats
      const userStatsRef = doc(db, 'users', userId, 'stats', 'exercises');
      await setDoc(userStatsRef, {
        completedCount: increment(1),
        lastCompletedAt: serverTimestamp(),
        completedExercises: arrayUnion(exerciseId)
      }, { merge: true });
    } else if (status === 'reset') {
      progressUpdates[`inProgress.${exerciseId}`] = false;
      progressUpdates[`completed.${exerciseId}`] = false;
    }

    // Apply updates
    await setDoc(userProgressRef, progressUpdates, { merge: true });
    return true;
  } catch (error) {
    console.error('Error tracking exercise progress:', error);
    return false;
  }
}

/**
 * Gets the user's progress for all exercises
 * @returns A promise that resolves to the user's progress
 */
export async function getExerciseProgress(): Promise<Record<string, ExerciseProgress>> {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User must be logged in to get exercise progress');
  }
  
  const db = getFirestore();
  const progressRef = doc(db, 'users', user.uid, 'progress', 'exercises');
  const progressDoc = await getDoc(progressRef);
  
  if (!progressDoc.exists()) {
    return {};
  }
  
  const data = progressDoc.data() as RawProgressData;
  const completed = data.completed || {};
  const inProgress = data.inProgress || {};
  
  const exerciseIds = new Set([
    ...Object.keys(completed),
    ...Object.keys(inProgress)
  ]);
  
  const result: Record<string, ExerciseProgress> = {};
  
  const detailsPromises = Array.from(exerciseIds).map(async (id) => {
    const detailRef = doc(db, 'users', user.uid, 'exercises', id);
    const detailDoc = await getDoc(detailRef);
    
    result[id] = {
      completed: completed[id] || false,
      inProgress: inProgress[id] || false
    };
    
    if (detailDoc.exists()) {
      const detailData = detailDoc.data() as ExerciseDetailData;
      
      if (detailData.timeSpent) {
        result[id].timeSpent = detailData.timeSpent;
      }
      
      if (detailData.lastAttemptDate) {
        result[id].lastAttemptDate = detailData.lastAttemptDate.toDate();
      }
      
      if (detailData.notes) {
        result[id].notes = detailData.notes;
      }
      
      if (detailData.checkedHints) {
        result[id].checkedHints = detailData.checkedHints;
      }
    }
  });
  
  await Promise.all(detailsPromises);
  
  return result;
}

/**
 * Get exercise details including user's progress
 */
export async function getExerciseWithUserProgress(exerciseId: string): Promise<{
  exercise: ContentNode | null;
  userProgress: ExerciseProgress;
}> {
  const exercise = await getExerciseById(exerciseId);
  const auth = getAuth();
  
  let userProgress: ExerciseProgress = {
    completed: false,
    inProgress: false
  };

  if (auth.currentUser && exercise) {
    try {
      const db = getFirestore();
      const userProgressRef = doc(db, 'users', auth.currentUser.uid, 'progress', 'exercises');
      const userProgressDoc = await getDoc(userProgressRef);

      if (userProgressDoc.exists()) {
        const data: RawProgressData = userProgressDoc.data() as RawProgressData;
        userProgress.completed = data.completed?.[exerciseId] === true;
        userProgress.inProgress = data.inProgress?.[exerciseId] === true;
      }

      // Get additional exercise details - using consistent path
      const exerciseDetailRef = doc(db, 'users', auth.currentUser.uid, 'exercises', exerciseId);
      const exerciseDetailDoc = await getDoc(exerciseDetailRef);

      if (exerciseDetailDoc.exists()) {
        const data: ExerciseDetailData = exerciseDetailDoc.data() as ExerciseDetailData;
        userProgress = {
          ...userProgress,
          timeSpent: data.timeSpent,
          lastAttemptDate: data.lastAttemptDate?.toDate(),
          notes: data.notes,
          checkedHints: data.checkedHints || []
        };
      }
    } catch (error) {
      console.error('Error getting exercise with user progress:', error);
    }
  }

  return {
    exercise,
    userProgress
  };
}

/**
 * Track time spent on an exercise
 * @param exerciseId The ID of the exercise
 * @param timeInSeconds Time spent in seconds
 * @returns Promise resolving to a boolean indicating success
 */
export async function trackExerciseTime(exerciseId: string, timeInSeconds: number): Promise<boolean> {
  const auth = getAuth();
  if (!auth.currentUser) return false;

  try {
    const db = getFirestore();
    const userId = auth.currentUser.uid;
    const exerciseDetailRef = doc(db, 'users', userId, 'exercises', exerciseId);
    
    await setDoc(exerciseDetailRef, {
      timeSpent: increment(timeInSeconds),
      lastAttemptDate: serverTimestamp(),
      lastUpdatedAt: serverTimestamp()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error tracking exercise time:', error);
    return false;
  }
}

/**
 * Save exercise notes
 */
export async function saveExerciseNotes(exerciseId: string, notes: string): Promise<boolean> {
  const auth = getAuth();
  if (!auth.currentUser) return false;

  try {
    const db = getFirestore();
    const exerciseDetailRef = doc(db, 'users', auth.currentUser.uid, 'exercises', exerciseId);
    
    await setDoc(exerciseDetailRef, {
      notes,
      lastUpdatedAt: serverTimestamp()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error saving exercise notes:', error);
    return false;
  }
}

/**
 * Track checked hints for an exercise
 * @param exerciseId The ID of the exercise
 * @param hintId The ID of the hint that was checked
 * @returns Promise resolving to a boolean indicating success
 */
export async function trackHintChecked(exerciseId: string, hintId: string): Promise<boolean> {
  const auth = getAuth();
  if (!auth.currentUser) return false;

  try {
    const db = getFirestore();
    const exerciseDetailRef = doc(db, 'users', auth.currentUser.uid, 'exercises', exerciseId);
    
    await setDoc(exerciseDetailRef, {
      checkedHints: arrayUnion(hintId),
      lastUpdatedAt: serverTimestamp()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error tracking hint checked:', error);
    return false;
  }
}

/**
 * Gets recommended exercises for the user based on their progress and preferences
 * @param options Configuration options for the recommendation algorithm
 * @returns A promise that resolves to an array of scored and sorted exercise recommendations
 */
export async function getRecommendedExercises(
  options: RecommendationOptions = {}
): Promise<ScoredExercise[]> {
  const {
    maxResults = 10,
    excludeCompleted = true,
    preferCategories = [],
    difficultyRange = { min: 1, max: 10 },
    sortBy = 'relevance'
  } = options;

  // Get user progress
  const progress = await getExerciseProgress();
  
  // Get all exercises
  const allExercises = await getAllExercises();
  
  // Filter and score exercises
  const scoredExercises: ScoredExercise[] = allExercises
    .filter(exercise => {
      // Exclude completed exercises if requested
      if (excludeCompleted && progress[exercise.id]?.completed) {
        return false;
      }
      
      // Filter by difficulty if specified
      const difficulty = exercise.metadata?.difficulty || 5;
      if (difficultyRange.min !== undefined && difficulty < difficultyRange.min) {
        return false;
      }
      if (difficultyRange.max !== undefined && difficulty > difficultyRange.max) {
        return false;
      }
      
      return true;
    })
    .map(exercise => {
      let score = 0;
      
      // Base score - newer exercises get higher priority
      if (exercise.metadata?.dateAdded) {
        const ageInDays = (Date.now() - exercise.metadata.dateAdded.toDate().getTime()) / (1000 * 60 * 60 * 24);
        score += Math.max(0, 30 - ageInDays) * 0.5;
      }
      
      // Prefer categories specified in options
      if (preferCategories.length > 0 && exercise.categories) {
        const categoryMatch = exercise.categories.some(category => 
          preferCategories.includes(category)
        );
        if (categoryMatch) {
          score += 20;
        }
      }
      
      // Prefer exercises the user has started but not completed
      if (progress[exercise.id]?.inProgress && !progress[exercise.id]?.completed) {
        score += 15;
      }
      
      return {
        exercise,
        score
      };
    })
    .sort((a, b) => {
      // Sort based on the specified sort option
      if (sortBy === 'newest' && a.exercise.metadata?.dateAdded && b.exercise.metadata?.dateAdded) {
        return b.exercise.metadata.dateAdded.toDate().getTime() - 
               a.exercise.metadata.dateAdded.toDate().getTime();
      } else if (sortBy === 'difficulty') {
        const diffA = a.exercise.metadata?.difficulty || 5;
        const diffB = b.exercise.metadata?.difficulty || 5;
        return diffA - diffB;
      } else if (sortBy === 'popularity' && 
                a.exercise.metadata?.popularity && 
                b.exercise.metadata?.popularity) {
        return b.exercise.metadata.popularity - a.exercise.metadata.popularity;
      }
      // Default to relevance (score-based) sorting
      return b.score - a.score;
    })
    .slice(0, maxResults);
  
  return scoredExercises;
}
