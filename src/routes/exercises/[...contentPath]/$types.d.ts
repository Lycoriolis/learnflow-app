import type { PageServerLoad as PageServerLoad_1 } from '../../../$types';

export type PageServerLoad = PageServerLoad_1<{
    contentPath: string;
}>;

export interface Exercise {
    href: string;
    title: string;
    description?: string;
    content?: string;
    rawMdxContent?: string;
    difficulty?: 'easy' | 'medium' | 'hard' | 'beginner' | 'intermediate' | 'advanced';
    duration?: string;
    level?: string;
    category?: string;
    tags?: string[];
    isCompleted?: boolean;
    type?: string;
}

export interface CategoryNode {
    title: string;
    description?: string;
    content?: string;
    rawMdxContent?: string;
    childContentType?: 'lesson' | 'exercise';
    type?: string;
}

export interface Statistics {
    totalExercises: number;
    difficultyDistribution: Record<string, number>;
    estimatedDuration: number;
}

export interface Breadcrumb {
    title: string;
    href: string;
}

export interface Analytics {
    viewTime: number;
    contentPath: string;
}

export interface PageData {
    type: 'exercise' | 'category';
    exercise?: Exercise;
    categoryNode?: CategoryNode;
    items?: Exercise[];
    breadcrumbs?: Breadcrumb[];
    relatedExercises?: Exercise[];
    statistics?: Statistics;
    analytics?: Analytics;
}
