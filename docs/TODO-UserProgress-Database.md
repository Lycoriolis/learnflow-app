# TODO: User Progress Tracking & Database Integration

**Context:** Tracking user progress through courses, modules, lessons, and exercises.

**Core Requirements:**

1.  **Database Schema:**
    *   `user_progress` table:
        *   `id` (Primary Key)
        *   `userId` (Foreign Key to users table)
        *   `contentId` (String, unique ID of the lesson/module/course/exercise - e.g., the `id` generated in `ContentData`)
        *   `contentType` (String, e.g., 'lesson', 'module', 'course', 'exercise', 'theme')
        *   `status` (String/Enum, e.g., 'not-started', 'in-progress', 'completed')
        *   `completedAt` (Timestamp, nullable)
        *   `lastAccessedAt` (Timestamp)
        *   `progressPercentage` (Integer, 0-100, optional, more relevant for videos or multi-part content)
        *   `score` (Integer, optional, for quizzes/exercises)
        *   `data` (JSON, optional, for storing specific answers or exercise state)

2.  **API Endpoints (SvelteKit server routes):**
    *   `POST /api/progress/update`: Update progress for a content item.
        *   Request body: `{ contentId, contentType, status, progressPercentage (optional), score (optional), data (optional) }`
        *   Requires authentication.
        *   Upsert logic (create if not exists, update if exists).
    *   `GET /api/progress?userId={userId}`: Fetch all progress for a user.
    *   `GET /api/progress/content?userId={userId}&contentId={contentId}`: Fetch progress for a specific item for a user.
    *   `GET /api/progress/course_summary?userId={userId}&courseId={courseId}`: Fetch summary progress for a whole course (e.g., percentage of lessons completed).

3.  **Client-Side Integration:**
    *   **Content Pages (`[...courseContentSlug]/+page.svelte`):**
        *   On load, fetch progress for the current content item.
        *   Display completion status (e.g., a checkmark).
        *   Automatically mark as 'in-progress' or 'completed' based on user actions (e.g., scrolling to end, clicking "Mark as Complete" button, submitting an exercise).
    *   **Navigation Components (`CourseSidebar.svelte`, `NextPrevNavigation.svelte`):**
        *   Visually indicate completed items in the sidebar.
        *   `NextPrevNavigation` could use progress to suggest the next uncompleted item.
    *   **Dashboard/User Profile:**
        *   Display overall progress, completed courses, certificates (if any).

4.  **Triggers for Marking Completion:**
    *   Explicit "Mark as Complete" button.
    *   Automatic on viewing a lesson for a certain duration or scrolling to the bottom.
    *   Automatic on successful submission of an exercise/quiz.

5.  **Roll-up Progress:**
    *   Logic to calculate module completion based on its lessons.
    *   Logic to calculate course completion based on its modules.
    *   Logic to calculate theme completion based on its courses.

6.  **Offline Support (Optional, Advanced):**
    *   Store progress locally if offline and sync when back online.
