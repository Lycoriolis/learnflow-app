# Metadata Implementation Documentation

## Overview

Our new metadata implementation separates the actual content (markdown/MDX files) from the metadata and relationships stored in Firestore. This approach enhances performance, scalability, and maintainability by:

- **Storing content statically**: Actual lesson, module, and exercise content is stored as markdown/MDX files in `static/content/`.
- **Storing metadata in Firestore**: Metadata (titles, slugs, order, relationships, etc.) is stored in Firestore for quick access and dynamic updates.
- **Tracking user progress and activity**: User progress and activity are stored in Firestore for personalized recommendations and analytics.

## Data Model

### Firestore Collections

1. **`courses`**: Stores course metadata.
   - Fields: `id`, `title`, `description`, `slug`, `order`, `category`, `tags`, `metadata` (createdAt, updatedAt, author).

2. **`modules`**: Stores module metadata.
   - Fields: `id`, `courseId`, `title`, `description`, `order`, `metadata`.

3. **`lessons`**: Stores lesson metadata.
   - Fields: `id`, `moduleId`, `title`, `description`, `order`, `metadata`.

4. **`exercises`**: Stores exercise metadata.
   - Fields: `id`, `lessonId`, `title`, `description`, `order`, `metadata`.

5. **`categories`**: Stores category metadata.
   - Fields: `id`, `title`, `description`, `order`.

6. **`userProgress`**: Tracks user progress.
   - Fields: `id`, `userId`, `itemId`, `itemType`, `status`, `lastAccessedAt`.

7. **`userActivity`**: Logs user activity.
   - Fields: `id`, `userId`, `eventType`, `referenceId`, `metadata`, `timestampStart`, `timestampEnd`.

### Static Content

- **Location**: `static/content/`
- **Structure**: Organized by course, module, and lesson (e.g., `static/content/courses/maths/algebra/module-1-equations/lesson-1-linear-equations.mdx`).
- **Format**: Markdown/MDX files with frontmatter for metadata.

## Services

### 1. **Course Service (`courseService.ts`)**
- Fetches course metadata from Firestore.
- Provides CRUD operations for courses (admin only).

### 2. **Module Service (`moduleService.ts`)**
- Fetches module metadata from Firestore.
- Provides CRUD operations for modules (admin only).

### 3. **Lesson Service (`lessonService.ts`)**
- Fetches lesson metadata from Firestore.
- Provides CRUD operations for lessons (admin only).

### 4. **Exercise Service (`exerciseService.ts`)**
- Fetches exercise metadata from Firestore.
- Provides CRUD operations for exercises (admin only).

### 5. **User Progress Service (`userProgressService.ts`)**
- Tracks and fetches user progress from Firestore.
- Provides CRUD operations for user progress.

### 6. **Activity Service (`activityService.ts`)**
- Logs and fetches user activity from Firestore.
- Uses the `userActivity` collection for consistency.

## Firestore Rules

- **Public Read**: Courses, modules, lessons, exercises, and categories are publicly readable.
- **Admin Write**: Only admins can create, update, or delete courses, modules, lessons, exercises, and categories.
- **User-Specific**: User progress and activity are only accessible to the user or admins.

## Workflow

1. **Content Creation**:
   - Create markdown/MDX files in `static/content/`.
   - Add metadata to Firestore using admin services.

2. **Content Fetching**:
   - Fetch metadata from Firestore to display course/module/lesson/exercise listings.
   - Fetch actual content from `static/content/` for display.

3. **User Progress**:
   - Track user progress in Firestore.
   - Use progress data for recommendations and analytics.

4. **User Activity**:
   - Log user activity in Firestore.
   - Use activity data for analytics and personalized recommendations.

## Benefits

- **Performance**: Static content is served quickly, while metadata is fetched dynamically.
- **Scalability**: Firestore handles metadata and user data, while static files handle content.
- **Maintainability**: Clear separation of concerns between content and metadata.
- **Personalization**: User progress and activity enable personalized recommendations. 