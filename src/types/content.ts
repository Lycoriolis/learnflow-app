export type ContentMetadata = {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    tags: string[];
    categoryId: string;
    createdAt?: string | Date;
    // ...other properties...
};

export type ContentManifestItem = {
    id: string;
    title: string;
    content: string;
    description: string;
    difficulty: string;
    tags: string[];
    categoryId: string;
    estimatedTime: string | number;
    // ...other properties...
};

export type CourseStructure =
    | {
          type: 'root';
          children: CourseStructure[];
      }
    | ContentManifestItem;