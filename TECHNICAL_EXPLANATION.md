# Technical Explanation: Recommendations, Courses & Exercises Integration

This document describes the end-to-end implementation of personalized recommendations and content navigation in LearnFlow.

## 1. Recommendation Service Enhancements

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

- **`contentService.ts`**:
  - `listContent('exercise')`: returns all exercises with metadata from markdown files or frontmatter.
  - `loadContent('exercise', id)`: fetches content and metadata for a single exercise.

- **`courseService.ts`**:
  - `listCourses()`: returns mock courses with structure and progress.
  - `getCourse(id)`: returns a single course structure (modules and lessons).

## 3. Component & Routing Updates

- **ExercisesSection.svelte**
  - Fetches `getRecommendations(userId, 6)` on mount.
  - Filters for `type.includes('exercise')`, loads each exercise via `loadContent`, displays title, description, category.
  - Logs `start_exercise` on click, then navigates to `/exercises/:id`.
  - Handles loading and error states.

- **CourseCarousel.svelte**
  - Displays continuing courses using `listCourses()`.
  - Logs `view_continuing_learning` on mount.

- **CourseCard.svelte**
  - Wrapped in `<a>` that logs `start_course`, then navigates to `/courses/:id`.

- **ExerciseCard.svelte**
  - Wrapped in `<a>` that logs `start_exercise`, then navigates to `/exercises/:id`.

- **RecommendationsSection.svelte**
  - Uses client-side `getRecommendations(userId, limit)` instead of API fetch.
  - Link routes for:
    - `next_lesson` → `/courses/:slug/:lessonId`
    - `review_flashcards` → `/tools/flashcards`
    - `view_courses` → `/courses`
    - `course` → `/courses/:slug`
    - `exercise` → `/exercises/:id`

- **Route Pages**
  - Courses list: `/courses` logs `view_courses`, displays `CourseCard`s.
  - Course detail: `/courses/[slug]` logs `view_course_detail`, shows modules and lesson links.
  - Lesson page: `/courses/[slug]/[lessonId]` displays placeholder content.
  - Exercises list: `/exercises` logs `view_exercises`, displays `ExerciseCard`s.
  - Exercise detail: `/exercises/[slug]` logs `view_exercise`, renders markdown content.

## 4. Activity Logging

| Event                 | Trigger                                          | Route/Component                          |
|-----------------------|--------------------------------------------------|------------------------------------------|
| view_continuing_learning | Course carousel mount                        | CourseCarousel.svelte                    |
| view_courses          | Courses list page mount                          | /courses/+page.svelte                    |
| view_course_detail    | Course detail page mount                         | /courses/[slug]/+page.svelte             |
| view_lesson           | Lesson navigation                                | selection in RecommendationsSection      |
| start_course          | Click on CourseCard                             | CourseCard.svelte                        |
| view_exercises        | Exercises list page mount                        | /exercises/+page.svelte                  |
| view_exercise         | Exercise detail page mount                       | /exercises/[slug]/+page.svelte           |
| start_exercise        | Click on ExerciseCard or ExercisesSection button | ExerciseCard.svelte, ExercisesSection    |
| flashcard_review      | Flashcard tool review trigger                    | courseService recommendations logic      |

## 5. Future Improvements

- Integrate real user progress instead of mock data.
- Move recommendation logic to a server API endpoint with caching.
- Add machine learning or collaborative filtering support.
- Enhance UI with fallback images, A/B testing, and user feedback flows.
- Complete lesson content pages and dynamic progress tracking.
