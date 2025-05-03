export interface ContentMetadata {
  title: string;
  slug: string;
  type: string;
  difficulty?: string;
  description?: string;
  tags?: string[];
  estimatedTime?: string; // Ensure this is string, not number
}

export interface ContentManifestItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  content?: string;
  description?: string;
  difficulty?: string;
  tags?: string[];
  emergency?: boolean;
  estimatedTime?: string;
}

export interface CourseStructure {
  metadata: ContentMetadata;
  sections: CourseSection[];
  content?: string;
  description?: string;
  difficulty?: string;
  tags?: string[];
}

export interface CourseSection {
  title: string;
  lessons: ContentManifestItem[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  emergency?: boolean;
  dueDate?: Date;
}
