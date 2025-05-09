# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed
- **Routing Conflicts & Structure Improvements**:
    - Fixed SvelteKit reserved file naming conflicts by renaming test files (from `+page.test.ts` to `Page.test.ts`)
    - Removed duplicate and conflicting route files (`.new` and `.n` variants)
    - Removed outdated direct lesson route (`/courses/[slug]/[lessonId]`) that conflicted with module-based structure
    - Established consistent hierarchical routing for courses, modules, and lessons
    - Added comprehensive documentation for routing structure in `/docs/routing-structure.md`

- **TypeScript Error Resolution**:
    - Fixed CourseStructure type reference in course pages (replaced with ContentMetadata)
    - Updated MarkdownRenderer mock implementation in tests
    - Implemented missing ExerciseRating component with proper TypeScript typing
    - Updated authService references in progressService (replaced getUser with getCurrentUser)
    - Fixed test implementations for proper component mocking
    - Ensured consistent test IDs for loading spinners across components

- **Svelte Warning Resolution (Accessibility, Styling, and Syntax)**:
    - Addressed various Svelte warnings across multiple components to improve accessibility, ensure correct styling application, and fix syntax issues.
    - **`src/routes/tools/tasks/+page.svelte`**:
        - Changed `<style>` to `<style lang="postcss">` for PostCSS processing.
        - Added `aria-label` to sort button, mobile close buttons (add task, task details), edit task button, and delete task button.
        - Made draggable task items keyboard accessible (`role="button"`, `tabindex="0"`, `on:keydown`).
        - Corrected self-closing `<option />` tags to `<option></option>`.
    - **`src/lib/components/pip/PipFlashcards.svelte`**:
        - Converted a clickable `div` to a `button` and added `aria-label="Flip card"` for accessibility.
    - **`src/lib/components/StickyNotes.svelte`**:
        - Added `aria-label="Edit note"` and `aria-label="Delete note"` to respective buttons.
    - **`src/lib/components/forums/NewPostForm.svelte`**:
        - Corrected self-closing `<textarea />` tag to `<textarea></textarea>`.
    - **`src/lib/components/utils/Draggable.svelte`**:
        - Marked `.dragging` as a global style (`:global(.dragging)`) to resolve unused CSS selector warning.
    - **`src/routes/forums/topic/[id]/+page.svelte`**:
        - Marked `.loader` as a global style (`:global(.loader)`) to resolve unused CSS selector warning.
    - **`src/routes/admin/forums/+page.svelte`**:
        - Added `aria-label` to close buttons for error and success messages.
    - **`src/routes/calendar/+page.svelte`**:
        - Added `aria-label` to edit, mark as completed, and delete event buttons.
    - **`src/routes/events/+page.svelte`**:
        - Added standard `line-clamp` property alongside `-webkit-line-clamp`.
    - **`src/routes/forums/+page.svelte`**:
        - Added `aria-label` to the close button of the create topic modal.
    - **`src/routes/groups/+page.svelte`**:
        - Added `aria-label` to the leave group button.
        - Added standard `line-clamp` property.
    - **`src/routes/tools/calculator/+page.svelte`**:
        - Added `aria-label` to the copy to clipboard button.
    - **`src/routes/tools/flashcards/+page.svelte`**:
        - Made clickable card div focusable and keyboard accessible (`role="button"`, `tabindex="0"`, `on:keydown`).
        - Added `aria-label="Delete card"` to delete button.
        - Associated labels with form controls using `for` and `id` attributes.
- **CSRF Token Handling**:
    - Verified `csrfToken` is passed from `+layout.server.ts` to `+layout.svelte`.
    - Ensured `storeCsrfToken` is called in `+layout.svelte`'s `onMount`.
- **TypeScript Error Resolution & Refactoring**:
    - **`CourseCard.svelte`**:
        - Modified `course` prop type: `title` is now `string | undefined`.
        - Set default `title` for `course` prop to `undefined`.
        - Corrected `goto` import path to `'$app/navigation'`.
    - **`src/routes/+layout.svelte`**:
        - Changed `onMount` callback to be synchronous (removed `async`).
        - Removed explicit `OnMount` type import.
    - **`src/lib/stores/appStore.ts`**:
        - Typed `currentCourse` store as `writable<CourseStructure | null>(null)`.
    - **`src/lib/components/FocusTimeChart.svelte`**:
        - Refactored x-axis time scale updates using type assertions for `xScale.time`.
        - Ensured `displayFormats` exists on `xScale.time.format()`.
    - **`src/lib/components/MarkdownRenderer.svelte`**:
        - Removed invalid `smartLists` and `smartypants` options from `MarkedOptions`.
        - Cast `marked(content)` result to `string`.
        - Ensured `block` in `querySelectorAll` callback is an `HTMLElement`.
    - **`src/lib/components/pip/PipTimer.svelte`**:
        - Imported `TimerMode` type from `../../../lib/stores/pipStores`.
        - Updated `resetTimer` to set `mode: { type: 'work' }`.
        - Changed mode comparisons to use `mode.type` (e.g., `$timerState.mode.type === 'work'`).
        - Adjusted `nextMode` variable to `nextModeType` to reflect it stores the type string.
        - Updated `timerState.set` to pass `mode: { type: nextModeType }`.
        - Modified display logic to use `$timerState.mode.type`.
    - **`src/lib/components/pip/PipFlashcards.svelte`**:
        - Resolved "currentCard is possibly 'null'" error in `reviewCard` by introducing a non-nullable local constant after a null check.
        - Corrected duplicate import of `writable`.
    - **`src/lib/components/forums/ForumList.svelte`**:
        - Defined and typed props: `topics: ForumTopic[]`, `categories: ForumCategory[]`, `user: FirebaseUser | null`.
        - Renamed imported `user` from `authStore.js` to `userStore` to avoid naming conflicts.
        - Refactored `getCategoryColorClass` for improved type safety and dark mode color handling.
        - Disabled voting and subscription buttons if `user` is null.
        - Applied various dark mode style enhancements.
    - **`src/routes/forums/topic/[id]/+page.svelte`**:
        - Removed the `posts` prop from the `<ForumTopic />` component, as it fetches its own data.
    - **`src/routes/my-learning/+page.svelte`**:
        - Imported `UserProfile` type from `userService.js`.
        - Allowed `profile` parameter in `loadCourses` to be `null`.
        - Imported `ContentItem` type from `contentService.js`.
        - Ensured `$userProfile` is not null before calling `loadCourses` in `onMount`.
        - Corrected type predicate in `coursesDataResults.filter` to align with `ContentItem` (though this was part of an intermediate step and might be superseded by further fixes based on `npm run check` output).

### Added
- **Enhanced Content Structure & Services:**
    - Refactored `enhancedContentService.ts` (`listCourses` function) to dynamically discover courses by listing directory contents and fetching `meta.json` for each, instead of using a hardcoded list.
    - Updated `enhancedContentService.ts` to include `frontmatter` in `Lesson` and `LessonMetadata` types and populate it during `loadLesson` and `loadCourseStructure`.
    - Ensured all tests in `src/lib/services/enhancedContentService.test.ts` are passing after refactoring and addition of `frontmatter` (including tests for `loadLesson`).
- **Lesson Display Page UI (`src/routes/courses/[slug]/[moduleId]/[lessonId]/+page.svelte`):**
    - Implemented basic structure for displaying lesson content.
    - Added display of learning objectives from `lesson.frontmatter.objectives`.

### Next Steps
- **[X] Install `@testing-library/svelte` for component testing.**
- **[X] Write component tests for Lesson Display Page (`src/routes/courses/[slug]/[moduleId]/[lessonId]/+page.svelte`).**
- **[ ] Run and debug tests for Lesson Display Page.**
- **[ ] Resume Svelte Warning Resolution**: Systematically address the remaining Svelte warnings (currently 41 warnings in 19 files) reported by `npm run check`, focusing on accessibility and unused code.
- **[ ] Implement Exercises Hub Page (`src/routes/exercises/+page.svelte`)**
- **[ ] Implement Individual Exercise Page (`src/routes/exercises/[category]/[slug]/+page.svelte`)**
- **[ ] Enhance `MarkdownRenderer.svelte` for custom markdown extensions.**
- **[ ] Implement Navigation & Routing for new content pages.**
- **[ ] Apply Styling & UX improvements to new pages.**

### TODO - Codebase Optimization Plan

This list outlines tasks to improve the project's structure, implementation, and code cleanliness.

#### I. High Priority: Stability & Configuration
- **[ ] Fix Svelte/TypeScript Environment Issues:**
    - **[ ] Run `npm run check` or `svelte-check`** and systematically address all reported errors.
    - **[ ] Investigate and resolve "Cannot find name 'svelteHTML'" errors:** This likely points to an issue with the Svelte language server or TypeScript setup for Svelte files.
    - **[ ] Investigate and resolve "File is not a module" errors (e.g., for Firebase, $app/navigation, $app/stores):** Check `tsconfig.json` path aliases (`$lib`, `$app`), `include`/`exclude` settings, and ensure SvelteKit's type generation is working correctly.
    - **[ ] Verify VS Code Svelte extension:** Ensure it's up-to-date and try restarting the Svelte Language Server.
- **[X] Resolve Type Definition Issues:**
    - **[X] `src/lib/services/userService.ts`:**
        - **[X] Ensure `UserProfile` type includes an optional `photoURL?: string` field if it's intended to be used (as seen in `settings/+page.svelte`). (Done)
        - **[X] Verify `UserPreferences` type is correctly defined and exported. If it's not, define and export it, or adjust imports. (Done - Defined and Exported)
    - **[X] `src/lib/stores/pipStores.ts`:**
        - **[X] Ensure `TimerSettings` type is correctly defined and exported. (Done - Verified Export)
- **[ ] Finalize `authService.ts` Relocation:**
    - **[ ] Once Svelte/TS errors are resolved, re-apply and verify all import path updates for `authService.ts` to point to `src/lib/services/authService.ts`. Affected files include:
        - `src/routes/+layout.svelte`
        - `src/routes/progress/+page.svelte`
        - `src/lib/components/GeneralWelcome.svelte`
        - `src/lib/components/Register.svelte`
        - `src/lib/components/Login.svelte`
        - `src/lib/components/Header.svelte`
        - `src/lib/components/ResetPassword.svelte`
        - `src/lib/components/Sidebar.svelte`

#### II. Structure & Consistency
- **[ ] Review `types/` directory (top-level):**
    - **[ ] Determine if these are global types or if they can be co-located with the modules they describe.
    - **[ ] Consider moving them to a more central `src/types/` or `src/lib/types/` for better organization within the application source.
- **[ ] Review `src/lib/index.ts`:**
    - **[ ] Clarify its purpose. If it's a barrel file for `src/lib/`, ensure it's used effectively and consistently for imports from the library.
- **[ ] Consolidate Utility Directories:**
    - **[ ] Review `src/lib/utils/` and `src/lib/components/pip/utils/`.
    - **[ ] If there's functional overlap or if a single location is preferred, merge them. Component-specific utilities can stay co-located if it improves clarity.
- **[ ] Convert JavaScript files to TypeScript:**
    - **[ ] `src/lib/utils/markdown.js` -> `markdown.ts`
    - **[ ] `src/lib/stores/persistentStore.js` -> `persistentStore.ts`
    - **[ ] Ensure type safety and update imports accordingly.
- **[ ] Test File Location:**
    - **[ ] `scoreService.test.ts` is in `src/lib/services/`. This co-location is acceptable. Ensure this is the consistent strategy for all test files, or define a global `tests/` directory structure.
- **[ ] Static Assets:**
    - **[ ] Review `static/` directory. Ensure all assets are necessary and optimally placed.

#### III. Implementation & Code Quality
- **[ ] Robust Error Handling:**
    - **[ ] Review all services (`src/lib/services/`) for consistent and comprehensive error handling (e.g., try-catch blocks, appropriate error types, logging).
    - **[ ] Ensure Svelte components gracefully handle errors from services or stores.
- **[ ] Code Duplication:**
    - **[ ] Actively look for and refactor duplicated code blocks within Svelte components (e.g., UI patterns, logic).
    - **[ ] Identify common logic in services that could be abstracted into utility functions.
- **[ ] State Management (`src/lib/stores/`):**
    - **[ ] Review each store for clarity, necessity, and efficiency.
    - **[ ] Utilize Svelte's derived stores where appropriate to compute values from other stores.
    - **[ ] Ensure stores are properly unsubscribed in components to prevent memory leaks, especially for manual subscriptions.
- **[ ] API Routes (`src/routes/api/`):**
    - **[ ] Implement consistent request validation (e.g., using Zod or similar libraries).
    - **[ ] Standardize API response formats (e.g., `{ success: boolean, data: any, error: string | null }`).
    - **[ ] Thoroughly review `authMiddleware.server.ts` for security and correctness.
- **[ ] Svelte Component Review (`src/lib/components/`):**
    - **[ ] Break down overly large or complex components into smaller, reusable sub-components.
    - **[ ] Ensure all component props are clearly typed using TypeScript.
    - **[ ] Implement accessibility (A11y) best practices (e.g., ARIA attributes, keyboard navigation, semantic HTML).
- **[ ] Dead Code Elimination:**
    - **[ ] Use tools or manual review to identify and remove any unused components, services, stores, or utility functions.
- **[ ] Dependency Management:**
    - **[ ] Review `package.json` for outdated dependencies (`npm outdated`).
    - **[ ] Remove any unused dependencies.
- **[ ] Asynchronous Code:**
    - **[ ] Ensure consistent use of `async/await` and proper handling of Promises.
    - **[ ] Avoid common pitfalls like unhandled promise rejections.

#### IV. Documentation
- **[ ] Code Comments:**
    - **[ ] Add JSDoc/TSDoc comments for all services, public functions, complex component props, and non-obvious logic.
- **[ ] Project Documentation:**
    - **[ ] Update `README.md`, `PROJECT.MD`, `AUTHENTICATION.MD`, etc., to reflect any structural changes, new architectural decisions, or setup instructions.
    - **[ ] Consider adding a section on coding standards or contribution guidelines if multiple developers are involved.

---
