export type ContentType = 'video' | 'article' | 'quiz';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ContentNode {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  level?: DifficultyLevel;  // This is level, not difficulty
  duration?: number;        // This is duration, not estimatedTime
}