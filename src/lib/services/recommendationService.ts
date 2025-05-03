// src/lib/services/recommendationService.ts

export interface Recommendation {
  type: string;
  referenceId: string;
  title: string;
  description: string;
  metadata?: Record<string, any>;
}