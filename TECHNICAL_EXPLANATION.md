# Technical Explanation: Recommendations, Courses & Exercises Integration

## 1. Recommendations Service

- **Actions Tracked**: `view_lesson`, `flashcard_review`, `start_exercise`, `start_course` events recorded in Firestore `activities` collection.
- **Algorithm**:
  1. Query recent activities for user, sorted by timestamp.
  2. Detect context:
     - Next lesson in a course (`view_lesson`).
     - Flashcards due for review (`flashcard_review`).
     - Exercises related by tag to the last started exercise.
     - Courses related by tag to the last started course.
     - Generic fallback recommendations based on other recent activity types.
  3. Build `Recommendation` objects with `type`, `referenceId`, `title`, `description`, and optional `metadata`.
  4. Return top N (`limit`) items.

- **Service API**: `getRecommendations(userId: string, limit?: number): Promise<Recommendation[]>`

## 2. Content & Course Services

### Content Service (`contentService.ts`)
- **Purpose**: Central service for loading and managing markdown-based content
- **Key Functions**:
  - `listContent('course' | 'exercise')`: Lists available content from index.json
  - `loadContent(type, id)`: Loads content and metadata from markdown files
  - `extractMetadata(content, id, type)`: Parses frontmatter and content for metadata

### Course Service (`courseService.ts`)
- **Purpose**: Course-specific functionality and backward compatibility
- **Key Functions**:
  - `listCourses()`: Returns available courses with structure and progress
  - `getCourse(id)`: Loads a specific course with modules and lessons
  - `extractModulesFromContent(content)`: Parses course structure from markdown

### Content Structure
- **Metadata Interface**:
  ```typescript
  interface ContentMetadata {
    id: string;
    title: string;
    type: 'course' | 'exercise';
    slug: string;
    description?: string;
    tags?: string[];
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    prerequisites?: string[];
    estimatedTime?: string;
    created?: string;
    updated?: string;
  }
  ```

- **Course Structure Interface**:
  ```typescript
  interface CourseStructure {
    id: string;
    title: string;
    description: string;
    progress: number;
    modules: Module[];
  }

  interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
  }

  interface Lesson {
    id: string;
    title: string;
  }
  ```

### Content Loading Flow
1. List Content:
   ```mermaid
   graph TD
     A[listContent] --> B{Check Content Type}
     B -->|course| C[Load index.json]
     B -->|exercise| D[Call API]
     C --> E[Parse Metadata]
     D --> E
     E --> F[Return ContentMetadata[]]
   ```

2. Load Content:
   ```mermaid
   graph TD
     A[loadContent] --> B[Fetch .md file]
     B --> C{Parse Frontmatter}
     C -->|Success| D[Return ContentItem]
     C -->|Fail| E[Extract Manual]
     E --> D
   ```

### Content Loading Architecture
1. **Index-Based Discovery**:
   ```mermaid
   graph TD
     A[User Requests Course List] --> B[listContent('course')]
     B --> C[Load index.json]
     C --> D[Parse Course Metadata]
     D --> E[For Each Course]
     E --> F[Load .md Content]
     F --> G[Parse Modules/Lessons]
     G --> H[Return Complete Course List]
   ```

2. **Course Content Resolution**:
   ```mermaid
   graph TD
     A[Request Course] --> B[Load index.json metadata]
     B --> C[Find course entry]
     C --> D[Load course.md]
     D --> E[Parse frontmatter]
     E --> F[Extract modules/lessons]
     F --> G[Combine metadata + content]
     G --> H[Return CourseStructure]
   ```

### Hierarchical Course Organization
1. **Category-Based Structure**:
   ```mermaid
   graph TD
     A[Courses Page] --> B[Course Categories]
     A --> C[Standalone Courses]
     B --> D[Category Page]
     D --> E[Subcourses List]
     E --> F[Course Detail]
     C --> F[Course Detail]
   ```

2. **Directory Structure**:
   ```mermaid
   graph TD
     A[/content/courses/] --> B[index.json]
     A --> C[course-file.md]
     A --> D[category-dir/]
     D --> E[index.json]
     D --> F[subcourse-1.md]
     D --> G[subcourse-2.md]
   ```

3. **Navigation Flow**:
   ```mermaid
   graph LR
     A[Courses List] --> B{Is Category?}
     B -->|Yes| C[Category Page]
     B -->|No| D[Course Detail]
     C --> E[Subcourse Detail]
   ```

## 3. Component & Routing Updates

### Course Components
- **CourseCard.svelte**:
  - Dynamic gradient based on course category
  - Activity logging on course start
  - Progress indicator
  - Responsive hover effects
  - Special rendering for course categories

- **Course List** (`/courses/+page.svelte`):
  - Grid layout with responsive breakpoints
  - Loading & error states
  - Activity logging
  - Visual distinction between categories and individual courses
  - Direct fetch from course index.json

- **Category Page** (`/[category]/+page.svelte`):
  - Specialized listing of courses within a category
  - Breadcrumb navigation showing hierarchy
  - Consistent styling with main courses page
  - Derived from category's index.json

- **Course Detail** (`/courses/[slug]/+page.svelte`):
  - Markdown content rendering
  - Module/lesson navigation
  - Breadcrumb trail with category context (if applicable)
  - Smart back-navigation to appropriate parent page
  - Path-aware content loading for nested courses

- **Course Lesson** (`/courses/[slug]/[lessonId]/+page.svelte`):
  - Content loading
  - Navigation between lessons
  - Progress tracking
  - Activity logging

### Admin Interface
- **Course Management** (`/admin/courses/+page.svelte`):
  - Course listing with metadata
  - Edit/Delete actions
  - Validation of required fields
  - Preview functionality

### Visual Styling System
- **Dynamic Course Gradients**:
  ```typescript
  function getCourseGradient(course: CourseStructure) {
    // Match by course ID and title keywords
    const text = (course.id + ' ' + course.title).toLowerCase();
    
    if (text.includes('math') || text.includes('calcul') || text.includes('mpsi')) {
      return { from: 'blue-500', to: 'blue-400' };
    } else if (text.includes('python') || text.includes('programming')) {
      return { from: 'green-500', to: 'green-400' };
    } // ... etc
  }
  ```

- **Category vs Course Display**:
  - Categories: Special hover effects with "Browse courses" action
  - Indicator icons specific to category type
  - Consistent breadcrumb trail showing current level
  - Path-aware navigation that preserves hierarchy

- **Card Styling**:
  - Dark theme optimized backgrounds
  - Consistent text contrast ratios
  - Responsive hover states
  - Accessible color combinations

### Error Handling
1. **Content Not Found**:
   - Graceful fallbacks for missing files
   - User-friendly error messages
   - Logging for content issues

2. **Parse Errors**:
   - Validation of markdown structure
   - Frontmatter schema checking
   - Module/lesson hierarchy verification

## 4. Content Migration

### Migration Strategy
1. **Phase 1** - Dual System:
   - New markdown content
   - Legacy mock data fallback
   - Content validation

2. **Phase 2** - Content Migration:
   - Convert existing courses to markdown
   - Transfer metadata
   - Validate content structure

3. **Phase 3** - Full Migration:
   - Remove mock data
   - Clean up legacy code
   - Update documentation

### Directory Structure
```
/static/content/
├── courses/
│   ├── index.json              # Main courses index
│   ├── intro-python.md         # Standalone course
│   ├── intro-python/           # Course-specific content
│   │   ├── variables.md        # Lesson content
│   │   └── operators.md        # Lesson content
│   └── mpsi-maths/             # Category directory
│       ├── index.json          # Category courses index
│       ├── mpsi-mathematiques.md  # Overview course
│       ├── calculs_algebriques.md # Math subcourse
│       └── nombres-complexes-trigonometrie.md # Math subcourse
└── exercises/
    └── ...
```

## 5. Future Enhancements

1. **Content Management**:
   - Rich text editor for course creation
   - Bulk import/export functionality
   - Version control integration
   - Media asset management

2. **Learning Experience**:
   - Interactive code execution
   - Quiz integration
   - Progress synchronization
   - Social learning features

3. **Performance**:
   - Content caching
   - Lazy loading of lessons
   - Offline support
   - Content preloading

4. **Analytics**:
   - Learning path analysis
   - Completion rates
   - Time spent per lesson
   - Engagement metrics

---

*Last updated: 1 May 2025*
