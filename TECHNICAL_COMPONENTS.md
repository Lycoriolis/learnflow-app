# Component Documentation

## Component Name: [Name]

*   **Purpose:** [Brief description of what the component does]
*   **Props:**
    *   `propName`: ([type]) - [Description]
*   **Events:**
    *   `eventName`: ([payload type]) - [Description of when it's emitted]
*   **Slots:**
    *   `slotName`: [Description of slot content]
*   **Interactions/Usage:** [How it's typically used, any important notes]

---

*This is a basic template. Feel free to expand or modify it for each component.*

---

## Component Name: CourseModal (CourseModal.svelte)

*   **Purpose:** Displays course content (lessons, articles) in a modal dialog. The content is rendered from Markdown.
*   **Props:**
    *   `markdownContent`: (string) - The Markdown string to be rendered within the modal. Default: A sample Markdown string about JavaScript Closures.
*   **Stores Used:**
    *   `courseModalOpen` (writable boolean from `'$lib/stores/appStore'`): Controls the visibility of the modal. The modal is shown if this store's value is `true`.
    *   `currentCourse` (readable from `'$lib/stores/appStore'`): Used to display the title of the current course in the modal header. Defaults to 'Course Content' if no title is available.
*   **Events:** (None directly dispatched. User interactions call functions that modify stores.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   The modal is displayed when `$courseModalOpen` is true.
    *   It renders the `markdownContent` prop as HTML using the `marked` library.
    *   The modal header displays the title from `$currentCourse.title` or a default title.
    *   A close button in the header sets `$courseModalOpen` to `false` to hide the modal.
    *   Clicking the background overlay also closes the modal.
    *   Pressing the 'Escape' key when the overlay is focused closes the modal.
    *   Includes "Previous" and "Next Lesson" buttons, though their functionality is not fully implemented in this component (they are static buttons).
    *   The component uses Tailwind CSS for styling and aims for a modern, accessible modal dialog appearance.

---

## Component Name: CourseFlashcardGenerator (CourseFlashcardGenerator.svelte)

*   **Purpose:** Allows users to generate flashcards from provided course content (a string, typically Markdown) and add them to a global flashcard store.
*   **Props:**
    *   `content`: (string) - The text content (e.g., from a course lesson) from which to generate flashcards. Default: `''`.
    *   `courseName`: (string) - The name of the course, used to tag the generated flashcards. Default: `''`.
*   **Stores Used:**
    *   `flashcards` (writable array from `'$lib/stores/pipStores'`): The store where generated flashcards are added.
*   **Events:** (None directly dispatched. Button clicks trigger internal functions.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   **Generate Flashcards Button:**
        *   When clicked, it parses the `content` prop to identify potential flashcard material.
        *   The parsing logic splits content by headers (## or ###) and then tries to extract terms and explanations.
        *   It also looks for list items in the format `- term: definition` or `* term: definition`.
        *   A `generating` state provides visual feedback during this process.
        *   The identified potential flashcards are stored in an internal `generatedCards` array.
    *   **Add X Cards Button:**
        *   Visible only if `generatedCards` is not empty.
        *   When clicked, it filters out any cards from `generatedCards` that already exist in the `$flashcards` store (based on front and back content).
        *   The new, unique cards are then added to the `$flashcards` store with a unique ID, level 0, and tagged with the `courseName`.
        *   The `generatedCards` array is cleared after adding.
    *   Displays the list of `generatedCards` (front and back) for review before adding them.

---

## Component Name: Register (Register.svelte)

*   **Purpose:** Provides a user registration form, allowing new users to sign up with their email, password, and display name, or to register using Google.
*   **Props:** (None)
*   **Stores Used:**
    *   `loading` (readable boolean from `'$lib/stores/authStore.js'`): Indicates if an authentication operation is in progress. Used to disable form elements.
    *   `authError` (readable string|null from `'$lib/stores/authStore.js'`): Displays any global authentication errors (e.g., from Firebase).
*   **Events:** (None directly dispatched. Form submission and button clicks call authentication service functions.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   **Email/Password Registration:**
        *   Collects Full Name (`displayName`), Email (`email`), Password, and Confirm Password.
        *   Performs client-side validation:
            *   All fields are required.
            *   Passwords must match.
            *   Password must be at least 6 characters long.
        *   Displays local validation errors if any occur.
        *   On valid submission, calls the `register(email, password, displayName)` function from `'$lib/services/authService.js'`.
        *   Displays errors from `$authError` if the registration service call fails.
        *   Successful registration typically triggers a redirect handled by an auth state listener elsewhere in the application.
    *   **Google Login/Registration:**
        *   A "Continue with Google" button calls the `loginWithGoogle()` function from `'$lib/services/authService.js'`.
        *   Successful Google sign-in/registration also typically triggers a redirect via the auth state listener.
    *   The form and Google button are disabled when `$loading` is true.
    *   Provides a link to the login page for users who already have an account.

---

## Component Name: ExercisesSection (ExercisesSection.svelte)

*   **Purpose:** Displays a section of recommended exercises for the logged-in user, fetched from a recommendation service.
*   **Props:** (None)
*   **Stores Used:**
    *   `user` (readable from `'$lib/stores/authStore.js'`): Used to get the current user's ID for fetching personalized recommendations.
*   **Events:** (None directly dispatched. Navigation is handled by `goto` or `<a>` tags.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   On mount, if a user is authenticated, it calls `getRecommendations(currentUser.uid, 6)` from `'$lib/services/recommendationService.js'` to fetch up to 6 exercise recommendations.
    *   It then filters these recommendations to include only those of type 'exercise'.
    *   For each exercise recommendation, it calls `loadContent('exercise', rec.referenceId)` from `'$lib/services/contentService.js'` to get more details (like title, description, tags).
    *   Displays each recommended exercise as a card with:
        *   An icon (default `fa-code`).
        *   Title and description.
        *   Category (derived from content tags).
        *   A "Start" link that navigates to `/exercises/{exercise.id}`.
    *   Before navigating to the exercise, it logs a `start_exercise` event using `logEvent` from `'$lib/services/activityService.js'`.
    *   Shows loading and error states during the data fetching process.
    *   Includes a "View All" link that navigates to `/exercises`.

---

## Component Name: CourseCard

*   **Purpose:** A reusable UI component that presents a summary of a course, including its title, description, an icon, and the user's progress. It acts as a navigational link to the full course page.
*   **Props:**
    *   `course`: (object) - Object containing course details.
        *   `id`: (string) - Identifier for the course. Default: `''`.
        *   `title?`: (string) - Title of the course.
        *   `description?`: (string) - Description of the course. Default: `''`.
        *   `progress?`: (number) - User's progress in the course. Default: `0`.
        *   `icon?`: (string) - Icon for the course. Default: `'fa-book'`.
        *   `gradient?`: ({ from: string; to: string }) - Gradient colors for the card. Default: `{ from: 'blue-500', to: 'blue-400' }`.
*   **Events:** (None directly dispatched. Uses `goto` for navigation.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Accepts a `course` object prop containing details like `id`, `title`, `description`, `progress`, `icon`, and `gradient` for styling.
    *   Provides default values for optional `course` properties if they are not supplied (e.g., "Untitled Course", "No description available.").
    *   Displays the course title, description, and progress as a percentage with a visual progress bar.
    *   The card's background features a gradient, configurable via the `course.gradient` prop.
    *   When the card is clicked:
        *   Logs a `start_course` event with the `course.id` using `logEvent` from `'$lib/services/activityService.js'`.
        *   Navigates the user to the specific course page (e.g., `/courses/{course.id}`) using `goto` from `'$app/navigation'`.

---

## Component Name: ExerciseCard

*   **Purpose:** Presents a summary of an individual exercise, including its title, description, category, icon, difficulty level, and estimated time. It serves as a link to the detailed exercise page.
*   **Props:**
    *   `exercise`: (object) - Object containing exercise details.
        *   `id`: (string) - Default: `''`.
        *   `title`: (string) - Default: `''`.
        *   `description`: (string) - Default: `''`.
        *   `category`: ({ name: string; color: string }) - Default: `{ name: '', color: 'blue' }`.
        *   `icon`: (string) - Default: `'fa-code'`.
        *   `difficulty`: ('beginner' | 'intermediate' | 'advanced') - Default: `'beginner'`.
        *   `estimatedTime`: (string) - Default: `''`.
*   **Events:** (None directly dispatched. Uses `goto` for navigation.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Accepts an `exercise` object prop with details such as `id`, `title`, `description`, `category` (name and color), `icon`, `difficulty`, and `estimatedTime`.
    *   Displays the exercise's title, description, category name, and an icon.
    *   Shows the difficulty level (e.g., "beginner", "intermediate", "advanced") with a color-coded badge. The color is determined by mapping the difficulty string to predefined colors.
    *   Displays the estimated time if provided.
    *   When the card is clicked:
        *   Logs a `start_exercise` event with the `exercise.id` using `logEvent` from `'$lib/services/activityService.js'`.
        *   Navigates the user to the specific exercise page (e.g., `/exercises/{exercise.id}`) using `goto` from `'$app/navigation'`.

---

## Component Name: WelcomeBanner

*   **Purpose:** A prominent banner component used to greet users, typically displaying a personalized welcome message and a call to action.
*   **Props:**
    *   `username`: (string) - The name of the user to display. Default: `"Hakim"`.
*   **Events:** (None)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Accepts a `username` prop (defaults to "Hakim") to personalize the welcome message.
    *   Displays a welcome message like "Welcome back, {username}!".
    *   Includes a brief message encouraging users to continue their learning.
    *   Features an "Explore Courses" button that links to the `/courses` page.

---

## Component Name: RecentActivity

*   **Purpose:** Fetches and displays a feed of the current user's recent activities within the platform, such as viewing courses or completing lessons.
*   **Props:** (None explicitly exported)
*   **Events:** (None)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   On component mount, it calls `fetchRecentActivities` from `'$lib/services/activityService'` to get the last 10 activities.
    *   For each activity, it:
        *   Formats the timestamp into a human-readable "time ago" string (e.g., "5m ago", "2h ago").
        *   Maps the `eventType` (e.g., 'view_course', 'start_lesson') to a user-friendly title (e.g., "Viewed Course", "Started Lesson").
        *   Determines an appropriate icon and color based on the `eventType` for visual distinction.
        *   Displays the activity's title, associated content (usually `referenceId`), and the formatted time.
    *   If no activities are found, it displays a "No recent activity." message.

---

## Component Name: Draggable (utils/Draggable.svelte)

*   **Purpose:** A higher-order utility component that wraps its slotted content, making it draggable via mouse interactions. It supports boundary constraints and can be disabled.
*   **Props:**
    *   `element`: (HTMLElement | null) - The HTML element to be made draggable. Bound from parent. Default: `null`.
    *   `disabled`: (boolean) - Prop to disable dragging. Default: `false`.
    *   `boundaryElement`: (HTMLElement | 'window') - The element to constrain dragging within, or 'window' for viewport. Default: `'window'`.
*   **Events:** (None directly dispatched. Modifies element style.)
*   **Slots:**
    *   Default slot: Content placed inside this component will be draggable.
*   **Interactions/Usage:**
    *   Requires an `element` prop (typically bound to the direct child element in the slot) which is the target for dragging.
    *   The `disabled` prop (boolean) can prevent dragging.
    *   The `boundaryElement` prop (HTMLElement or string 'window') defines the area within which the element can be dragged. Defaults to the browser window.
    *   Uses `mousedown`, `mousemove`, and `mouseup` event listeners on the `element` and `window` respectively to manage the drag lifecycle.
    *   Calculates new positions using `transform: translate3d()` for smoother animations and performance.
    *   Prevents dragging initiation if the mousedown event originates from interactive elements like buttons, inputs, links, etc., within the draggable content.
    *   Adds a `:global(.dragging)` CSS class to the `element` during the drag operation, allowing for custom visual feedback (e.g., change in opacity, z-index).
    *   Ensures the element stays within the defined `boundaryElement` or viewport.
    *   Cleans up global event listeners `onDestroy`.

---

## Component Name: Quotes

*   **Purpose:** A simple component that displays a random motivational quote from a predefined list and cycles through them at a set interval.
*   **Props:** (None)
*   **Events:** (None)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Initializes with a random quote from an internal array of strings.
    *   Uses `setInterval` to automatically change to the next quote in the list every 5 minutes.
    *   The quote selection wraps around to the beginning of the list once the end is reached.
    *   Clears the interval timer when the component is destroyed (`onDestroy`) to prevent memory leaks.

---

## Component Name: Login

*   **Purpose:** A form component enabling users to log in to the application using their email and password, or through Google Sign-In. It handles input validation and displays authentication errors.
*   **Props:**
    *   `redirectTo`: (string) - Path to redirect the user to after successful login. Default: `'/'`.
*   **Events:** (No custom events dispatched directly. Calls authentication service functions.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Accepts an optional `redirectTo` prop (string, defaults to '/') to navigate the user to a specific page after a successful login. If provided and not '/', a message is shown.
    *   Binds to `email` and `password` input fields.
    *   Performs client-side validation for email format (using a regex) and password length (minimum 6 characters) on blur and before submission. Validation errors are displayed next to the respective fields.
    *   On email/password form submission:
        *   Calls the `login` function from `'$lib/services/authService.js'`.
        *   Uses the `$loading` store (from `'$lib/stores/authStore.js'`) and an internal `isSubmitting` flag to provide visual feedback (e.g., disabling the button, showing a spinner) during the login attempt.
    *   Provides a "Sign in with Google" button that calls the `loginWithGoogle` function from `'$lib/services/authService.js'`.
    *   Displays general authentication errors received from the `authService` (via the `$authError` store).
    *   Includes links to the registration page (`/register`) and the password reset page (`/reset-password`).
    *   Authentication state changes (and subsequent redirects) are typically handled by a global listener for the auth state, not directly within this component after calling login services.

---

## Component Name: ForumTopic (forums/ForumTopic.svelte)

*   **Purpose:** Displays the main content of a forum topic, including the initial post and its replies. It also allows authenticated users to add new replies by embedding the `NewPostForm` component.
*   **Props:**
    *   `topic`: (Topic object) - An object containing details of the forum topic.
        *   `id`: (string) - Identifier for the topic. Default: `''`.
        *   `title`: (string) - Title of the topic. Default: `'Loading...'`.
        *   `content`: (string) - The main content of the initial topic post. Default: `''`.
        *   `author`: (object `{ id: string; name: string; avatar?: string }` | string) - Details of the topic author or just their name. Default: `''`.
        *   `createdAt`: (string) - ISO date string representing when the topic was created. Default: `new Date().toISOString()`.
*   **Events:** (None directly dispatched by this component. It handles the `newPost` event from its child `NewPostForm`.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Receives a `topic` object as a prop to display its details (title, author, creation date, content).
    *   On mount, if `topic.id` is present, it fetches replies for the topic from the API endpoint `/api/forum/posts?topic_id={topic.id}`.
    *   Displays replies, showing the author's name, creation date, and content. The reply content is rendered using the `MarkdownRenderer` component.
    *   Implements pagination for replies: initially shows a certain number of posts (`repliesPerPage`) and provides a "Load more replies" button to fetch and display more.
    *   Embeds the `NewPostForm` component to allow users to add new replies.
    *   Handles the `newPost` event emitted by `NewPostForm`: if a user is logged in (checked via the `$user` store), it sends a POST request to `/api/forum/posts` with the new reply's content, topic ID, and author ID. On success, it updates the local list of posts to include the new reply.
    *   Displays loading messages (e.g., "Loading replies...") and error messages (e.g., "Failed to load replies.") during the process of fetching replies.
    *   If there are no replies, it displays "No replies yet."

---

## Component Name: ForumSidebar (forums/ForumSidebar.svelte)

*   **Purpose:** Displays a sidebar for the forum pages, typically containing a list of forum categories for navigation and a section with links to other learning resources.
*   **Props:**
    *   `categories`: (Array of objects `Array<{id: string, name: string, icon?: string}>`) - A list of category objects to display as navigation links. Each object should have an `id` and `name`, and can optionally include an `icon` class (e.g., from Font Awesome). Default: `[]`.
    *   `filterCategory`: (string) - The ID of the currently active category filter. This is used to apply distinct styling to the active category link.
*   **Events:** (None)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Receives an array of `categories` and the current `filterCategory` string as props.
    *   Renders a list of forum categories as navigation links. Each link navigates to `/forums/category/{category.id}`.
    *   Includes an "All Categories" link that navigates to `/forums`.
    *   Highlights the currently selected category link (or "All Categories") by applying specific CSS classes if its ID matches the `filterCategory` prop.
    *   Displays an optional icon next to each category name if an `icon` property is provided in the category object.
    *   Includes a static "Learning Resources" section with predefined links (e.g., Study Guides, Code Examples, Practice Exercises, Community Projects), each with a corresponding Font Awesome icon.

---

## Component Name: ForumFilters (forums/ForumFilters.svelte)

*   **Purpose:** Provides a set of UI controls—a search input and several dropdown menus (selects)—for filtering and sorting forum topics based on various criteria.
*   **Props:**
    *   `categories`: (Array of objects `Array<{id: string, name: string}>`) - A list of category objects used to populate the category filter dropdown. Each object should have an `id` and `name`. Default: `[]`.
    *   `filterCategory`: (string) - Bound value for the selected category in the category filter dropdown.
    *   `searchQuery`: (string) - Bound value for the text entered in the search input field.
    *   `sortOption`: (string) - Bound value for the selected sorting option (e.g., 'latest', 'created').
    *   `difficultyFilter`: (string) - Bound value for the selected difficulty level in the difficulty filter dropdown.
*   **Events:**
    *   `search`: (detail: string) - Dispatched with the current input value when the content of the search input field changes (`on:input`).
    *   `category`: (detail: string) - Dispatched with the selected category's ID when the value of the category filter dropdown changes (`on:change`).
    *   `sort`: (detail: string) - Dispatched with the selected sort option's value when the value of the sort option dropdown changes (`on:change`).
    *   `difficulty`: (detail: string) - Dispatched with the selected difficulty level's value when the value of the difficulty filter dropdown changes (`on:change`).
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   The props `filterCategory`, `searchQuery`, `sortOption`, and `difficultyFilter` are typically two-way bound (`bind:value`) to variables in the parent component, allowing the parent to control and react to the filtering state.
    *   Features a text input field for searching topics. It includes a search icon for visual cue. Dispatches a `search` event as the user types.
    *   Includes a dropdown (`select`) to filter topics by category. This dropdown is populated by the `categories` prop and includes an "All Categories" option. Dispatches a `category` event when a selection is made.
    *   Includes a dropdown to sort topics by criteria such as 'Latest Activity', 'Created', 'Most Viewed', 'Most Replies', 'Most Upvoted'. Dispatches a `sort` event upon selection change.
    *   Includes a dropdown to filter topics by difficulty level (e.g., 'All Levels', 'Beginner', 'Intermediate', 'Advanced'). Dispatches a `difficulty` event when a new level is selected.
    *   Each dropdown has a chevron icon to indicate it's a select input.

---

## Component Name: NewPostForm (forums/NewPostForm.svelte)

*   **Purpose:** A form component that allows authenticated users to write and submit new posts or replies within a forum topic.
*   **Props:** (None explicitly defined as component exports. It internally subscribes to the `$user` store from `'$lib/stores/authStore.js'` to check authentication status.)
*   **Events:**
    *   `newPost`: (detail: `{ content: string }`) - Dispatched when the form is submitted with non-empty content. The event detail contains an object with a `content` property, which is the trimmed text from the textarea.
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   The form (textarea and submit button) is only rendered if a user is currently logged in (i.e., `$user.uid` is truthy).
    *   If no user is logged in, it displays a message prompting the user to log in, with a hyperlink to the `/login` page.
    *   Provides a `textarea` for the user to input their post content. The `content` variable is bound to this textarea.
    *   A "Post Reply" button, when clicked, calls the `submit` function.
    *   The `submit` function first checks if the trimmed `content` is empty. If not, it dispatches the `newPost` event with the trimmed content.
    *   After dispatching the `newPost` event, the `content` (and thus the textarea) is cleared.
    *   The "Post Reply" button is dynamically disabled if the `content` (after trimming) is empty, preventing submission of blank posts.

---

## Component Name: CourseCarousel (CourseCarousel.svelte)

*   **Purpose:** Displays a horizontally scrollable carousel of course cards, typically used to showcase a collection of courses like "Featured Courses" or "New Courses". It uses the Splide.js library for carousel functionality.
*   **Props:**
    *   `title`: (string) - The title to be displayed above the carousel (e.g., "Featured Courses").
    *   `items`: (Array of `ContentMetadata` objects) - An array of course metadata objects. Each object is expected to be compatible with the `CourseCard` component's `course` prop.
*   **Events:** (None directly dispatched. Interacts with Splide.js events internally.)
*   **Slots:** (None. It iterates over `items` and renders `CourseCard` for each.)
*   **Interactions/Usage:**
    *   Dynamically loads the Splide.js library from a CDN on mount if it's not already available.
    *   Initializes a Splide carousel with the provided `items`.
    *   Configures Splide for loop type, number of slides per page (responsive breakpoints for 1024px and 640px), gap between slides, and disables pagination.
    *   Logs a `view_course_carousel` event with a generated `viewId` (based on the `title`) when the component mounts, and logs an end event when it's destroyed.
    *   If `items` change after the initial mount, it re-initializes the Splide instance.
    *   Displays the provided `title` and a "View All" link that navigates to `/courses`.
    *   If `items` is empty or undefined, it displays a "No courses to display in this section." message.
    *   Includes custom styling for the carousel container, track (with fade effects on the edges), and navigation arrows (which appear on hover).
    *   Destroys the Splide instance on component destruction to prevent memory leaks.

---

## Component Name: GeneralWelcome (GeneralWelcome.svelte)

*   **Purpose:** A presentational component displayed to users who are not logged in. It shows a welcoming message and highlights key features of the platform like exploring courses, practicing exercises, and tracking progress.
*   **Props:** (None)
*   **Events:** (None directly. An example button to trigger login is commented out.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Displays a prominent "Welcome to LearnFlow!" message with a brief introductory text.
    *   Features a grid of three sections, each highlighting a benefit/feature:
        *   "Explore Courses"
        *   "Practice Exercises"
        *   "Track Progress"
    *   The main welcome banner has a gradient background. The feature sections have a standard card appearance.
    *   A commented-out example shows how a "Get Started" button could be added to trigger a login action (by importing and calling `authService.login()`).

---

## Component Name: RecommendationsSection (RecommendationsSection.svelte)

*   **Purpose:** Fetches and displays a list of personalized recommendations for the currently authenticated user. These recommendations can be for various content types like courses, lessons, or flashcards.
*   **Props:**
    *   `limit`: (number) - The maximum number of recommendations to fetch and display. Default: `5`.
*   **Events:** (None directly dispatched. Uses navigation links.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   On component mount, if a user is authenticated (checked via the `$user` store), it calls `getRecommendations` from `recommendationService.js` with the user's UID and the `limit` prop.
    *   Displays a "Recommended for You" title.
    *   Shows a loading message while recommendations are being fetched.
    *   Displays an error message if fetching fails or if the user is not authenticated.
    *   If no recommendations are found, it shows a "No recommendations at this time." message.
    *   For each recommendation received, it displays:
        *   `title`: The title of the recommendation.
        *   `description`: A brief description.
        *   A navigation link (`<a>` tag) whose `href` is determined by the `rec.type`. The `getLink` internal function maps recommendation types (e.g., `next_lesson`, `review_flashcards`, `course`, `exercise`) to appropriate application routes (e.g., `/courses/{courseId}/{lessonId}`, `/tools/flashcards`, `/courses/{courseId}`).
    *   Each recommendation item is styled as a clickable card with a chevron icon indicating it's a link.

---

## Component Name: ProgressMetrics (ProgressMetrics.svelte)

*   **Purpose:** Displays a set of key performance indicators or metrics related to a user's learning progress. This is a presentational component that takes metric data as a prop.
*   **Props:**
    *   `metrics`: (Array of objects) - An array where each object represents a metric to display. Default: A predefined array with three example metrics: "Courses in Progress", "Exercises Completed", and "Learning Streak".
        *   Each metric object should have:
            *   `title`: (string) - The title of the metric (e.g., "Courses in Progress").
            *   `value`: (string) - The value of the metric (e.g., "3", "24", "7 days").
            *   `icon`: (string) - A Font Awesome icon class (e.g., "fa-book", "fa-check-circle").
            *   `color`: (string) - A color name (e.g., "indigo", "green", "yellow"), though this seems to be used for the icon container's background in a fixed way in the current implementation rather than dynamically setting text or border colors based on this prop.
*   **Events:** (None)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Iterates over the `metrics` array prop.
    *   For each metric, it displays a card containing:
        *   The metric's `title`.
        *   The metric's `value`.
        *   An icon (specified by `metric.icon`) inside a colored circular background. The icon container background is `bg-indigo-900` and icon color is `text-indigo-300` irrespective of the `metric.color` prop in the provided code snippet.
    *   The metrics are displayed in a responsive grid (1 column on small screens, 3 columns on medium screens and up).
    *   The cards have a distinct style with `bg-gray-700`, an `orange-500` border, and hover effects.

---

## Component Name: CreateTopicForm (forums/CreateTopicForm.svelte)

*   **Purpose:** Provides a form for authenticated users to create new discussion topics within the forum.
*   **Props:**
    *   `categories`: (Array of objects `Array<{id: string, name: string}>`) - A list of category objects to populate the category selection dropdown. Default: `[]`.
*   **Events:**
    *   `topicCreated`: (detail: `{ topicId: string, categoryId: string }`) - Dispatched after a new topic is successfully created. The detail includes the new topic's ID and the ID of the category it belongs to.
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   The form is only visible and usable if a user is logged in (checked via the `$user` store). Otherwise, it prompts the user to log in.
    *   Requires the user to input a topic title (minimum 5 characters) and content (minimum 10 characters).
    *   Requires the user to select a category for the new topic from a dropdown populated by the `categories` prop.
    *   On submission:
        *   Performs validation on title, content, and category selection.
        *   If valid, it makes a POST request to `/api/forum/topics` with the topic data (title, content, author ID, category ID).
        *   Displays success or error messages based on the API response.
        *   On successful topic creation, it dispatches the `topicCreated` event and clears the form fields.
    *   Uses an internal `isLoading` state to provide feedback during form submission.

---

## Component Name: ForumHeader (forums/ForumHeader.svelte)

*   **Purpose:** Displays a header section for forum pages, typically including a title, a brief description or breadcrumb, and a button to create a new topic.
*   **Props:**
    *   `title`: (string) - The main title to display for the forum section (e.g., "All Topics", "Category: JavaScript"). Default: `"Forum"`.
    *   `subtitle`: (string) - An optional subtitle or descriptive text displayed below the main title. Default: `""`.
    *   `showCreateButton`: (boolean) - Controls the visibility of the "Create New Topic" button. Default: `true`.
*   **Events:** (None directly dispatched. Navigation is handled by links.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Displays the provided `title` and `subtitle`.
    *   If `showCreateButton` is true (the default), it renders a "Create New Topic" button.
    *   The "Create New Topic" button is a link that navigates to `/forums/create`.
    *   The button's visibility can also be influenced by the user's authentication status (checked via the `$user` store); it's hidden if no user is logged in, regardless of the `showCreateButton` prop.

---

## Component Name: ForumList (forums/ForumList.svelte)

*   **Purpose:** Displays a list of forum topics, typically with pagination and information about each topic like title, author, category, replies, views, and last activity.
*   **Props:**
    *   `topics`: (Array of Topic objects) - An array of topic objects to display. Each topic object usually contains `id`, `title`, `author` (object or string), `category` (object), `replies_count`, `views_count`, `last_activity_at`. Default: `[]`.
    *   `isLoading`: (boolean) - Indicates if topics are currently being loaded, used to show a loading state. Default: `false`.
    *   `error`: (string | null) - An error message to display if fetching topics failed. Default: `null`.
*   **Events:** (None directly dispatched. Navigation is handled by links.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   If `isLoading` is true, it displays a loading indicator (e.g., "Loading topics...").
    *   If `error` is not null, it displays the error message.
    *   If `topics` is empty and not loading, it displays a "No topics found." message.
    *   For each topic in the `topics` array, it renders:
        *   Topic title, which links to the individual topic page (`/forums/topic/{topic.id}`).
        *   Author's name (and avatar if available, though avatar display is not explicitly in this component).
        *   Category name, which links to the category page (`/forums/category/{topic.category.id}`).
        *   Number of replies and views.
        *   Time of the last activity, formatted human-readably (e.g., "2 hours ago").
    *   Uses icons to visually represent replies, views, and categories.

---

## Component Name: StatCard (StatCard.svelte)

*   **Purpose:** A reusable UI component designed to display a single statistic or piece of data in a visually appealing card format, often with a title, value, and an icon.
*   **Props:**
    *   `title`: (string) - The title or label for the statistic. Default: `"Stat Title"`.
    *   `value`: (string | number) - The actual value of the statistic to be displayed. Default: `"N/A"`.
    *   `icon`: (string) - A CSS class name for an icon (e.g., from Font Awesome) to be displayed on the card. Default: `"fas fa-chart-bar"`.
    *   `color`: (string) - A Tailwind CSS color class (e.g., `text-blue-500`, `bg-green-100`) to customize the icon's color or card's appearance. Default: `"text-blue-500"`.
    *   `unit`: (string) - An optional unit or suffix to display next to the value (e.g., "ms", "%"). Default: `""`.
*   **Events:** (None)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Displays the `title`, `value` (with optional `unit`), and an `icon`.
    *   The `color` prop is typically used to set the color of the icon.
    *   The card has a consistent styling with a background, padding, rounded corners, and a shadow for a modern look.
    *   Suitable for dashboards or summary sections where key metrics need to be highlighted.

---

## Component Name: PipWidget (PipWidget.svelte)

*   **Purpose:** Provides a Picture-in-Picture (PiP) like floating widget that can be dragged around the screen. It's designed to contain other components, such as a timer or a mini-player.
*   **Props:**
    *   `initialPosition`: (object `{ x: number, y: number }`) - The initial x and y coordinates for the widget. Default: `{ x: 50, y: 50 }`.
    *   `boundaryElement`: (HTMLElement | 'window') - The element within which the widget can be dragged. Default: `'window'`.
    *   `store`: (Writable<boolean>) - A Svelte writable store that controls the visibility of the PiP widget. Default: `pipOpen` store from `'$lib/stores/pipStores'`.
*   **Events:** (None directly dispatched. Interacts with its store and the Draggable utility.)
*   **Slots:**
    *   `default`: Content to be displayed inside the draggable PiP widget.
*   **Interactions/Usage:**
    *   Uses the `Draggable` utility component to make itself draggable.
    *   Its visibility is controlled by the provided `store` (defaults to `$pipOpen`).
    *   When visible, it displays its slotted content.
    *   Includes a header with a title "PiP Widget" and a close button.
    *   The close button, when clicked, sets the controlling store's value to `false`, thereby hiding the widget.
    *   The widget has a fixed size and styling, including a shadow and rounded corners, to appear as a floating panel.
    *   The `boundaryElement` for dragging defaults to the window but can be customized.

---

## Component Name: ExerciseRating (ExerciseRating.svelte)

*   **Purpose:** Intended to allow users to rate an exercise, likely on a scale (e.g., 1-5 stars).
*   **Props:** (None defined in the current empty file)
*   **Events:** (None defined in the current empty file)
*   **Slots:** (None defined in the current empty file)
*   **Interactions/Usage:** (The component is currently empty and does not have any functionality.)
    *   *Note: This component file `src/lib/components/ExerciseRating.svelte` is currently empty. It needs to be implemented to provide rating functionality.*

---

## Component Name: MarkdownRenderer (MarkdownRenderer.svelte)

*   **Purpose:** Renders a string of Markdown text into HTML, applying syntax highlighting for code blocks and supporting KaTeX for mathematical expressions.
*   **Props:**
    *   `markdown`: (string) - The Markdown string to be rendered. Default: `''`.
    *   `inline`: (boolean) - If true, renders the Markdown as a single inline element (span) rather than a block (div). Default: `false`.
    *   `options`: (object) - Options to pass to the underlying Markdown-it instance. Default: `{ html: true, linkify: true, typographer: true }`.
*   **Events:** (None)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Uses `markdown-it` library for Markdown parsing.
    *   Uses `markdown-it-highlightjs` for syntax highlighting of code blocks. Requires Highlight.js CSS to be loaded separately for styling.
    *   Uses `markdown-it-katex` for rendering LaTeX mathematical expressions. Requires KaTeX CSS to be loaded separately.
    *   The `markdown` prop is watched, and the HTML is re-rendered whenever it changes.
    *   If `inline` is true, `md.renderInline(markdown)` is used; otherwise, `md.render(markdown)` is used.
    *   The rendered HTML is injected into a `div` (or `span` if `inline`) using `{@html ...}`.
    *   Provides default options for `markdown-it` enabling HTML tags, auto-linking, and typographic enhancements. These can be overridden via the `options` prop.

---

## Component Name: PipTimer (pip/PipTimer.svelte)

*   **Purpose:** A timer component specifically designed to be displayed within the `PipWidget`. It shows elapsed time and can be controlled (start, pause, reset) via Svelte stores.
*   **Props:** (None explicitly exported. It interacts with stores.)
*   **Events:** (None directly dispatched. Updates stores.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Subscribes to Svelte stores from `'$lib/stores/pipStores.js'`:
        *   `$pipTimerRunning`: (boolean) - Controls whether the timer is active.
        *   `$pipTimerValue`: (number) - Stores the current elapsed time in seconds.
        *   `$pipTimerDuration`: (number) - Stores the target duration for the timer (e.g., for a countdown, though current implementation is stopwatch).
    *   Displays the `$pipTimerValue` formatted as MM:SS.
    *   When `$pipTimerRunning` is true, an interval timer increments `$pipTimerValue` every second.
    *   The interval is cleared when `$pipTimerRunning` becomes false or when the component is destroyed.
    *   Provides three control buttons:
        *   **Play/Pause Button:** Toggles the `$pipTimerRunning` store. The icon changes between play and pause accordingly.
        *   **Reset Button:** Sets `$pipTimerValue` to 0 and `$pipTimerRunning` to false.
        *   **Close Button:** Sets `$pipOpen` (another store from `pipStores`) to `false`, which typically hides the parent `PipWidget`.
    *   The timer visually indicates its running state (e.g., text color changes).
    *   Designed to be compact for use within the small PiP window.

---

## Component Name: ActivityFeed (ActivityFeed.svelte)

*   **Purpose:** Displays a feed of recent activities, using the `ActivityItem` component to render each individual activity.
*   **Props:** (None explicitly defined. It uses a hardcoded sample `activities` array.)
*   **Events:** (None)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Internally defines a sample `activities` array. In a real application, this data would likely be fetched from an API or a Svelte store.
    *   Each object in the `activities` array represents a single activity and includes properties like `id`, `type` (e.g., 'completed', 'started', 'achievement'), `title`, `description`, `timestamp`, `icon`, and `color`.
    *   Iterates over the `activities` array and renders an `ActivityItem` component for each activity, passing the activity object as a prop to `ActivityItem`.
    *   Displays a heading "Recent Activity" above the feed.
    *   The feed is styled with a background, border, padding, and shadow.

---

## Component Name: ActivityItem (ActivityItem.svelte)

*   **Purpose:** Renders a single item within an activity feed, displaying its icon, title, description, and timestamp.
*   **Props:**
    *   `activity`: (object) - An object containing details for a single activity item. Expected properties:
        *   `id`: (string) - Unique identifier for the activity. Default: `''`.
        *   `type`: (string) - Type of activity (e.g., 'completed', 'started', 'achievement'). Default: `''`.
        *   `title`: (string) - Main title of the activity. Default: `''`.
        *   `description`: (string) - A brief description of the activity. Default: `''`.
        *   `timestamp`: (string) - When the activity occurred (e.g., "2 hours ago"). Default: `''`.
        *   `icon`: (string) - CSS class for the icon (e.g., 'fa-check-circle'). Default: `'fa-check-circle'`.
        *   `color`: (string) - A color theme hint (e.g., 'indigo', 'blue', 'green'). Default: `'indigo'`.
*   **Events:** (None)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Receives an `activity` object as a prop.
    *   Dynamically determines the `icon` and `color` based on `activity.type` if not explicitly provided in `activity.icon` or `activity.color`.
        *   `completed` type defaults to `fa-check-circle` icon and `indigo` color.
        *   `started` type defaults to `fa-book` icon and `blue` color.
        *   `achievement` type defaults to `fa-trophy` icon and `green` color.
        *   Other types default to `fa-circle` icon and `gray` color.
    *   Displays the activity's icon in a styled circular container.
    *   Shows the activity's `title`, `description`, and `timestamp`.

---

## Component Name: FocusTimeChart (FocusTimeChart.svelte)

*   **Purpose:** Renders a bar chart visualizing the user's focus session durations over time (daily, weekly, or monthly). It uses Chart.js for rendering.
*   **Props:**
    *   `sessions`: (Array of `FocusSession` objects) - An array of focus session data. Each `FocusSession` object is expected to have `timestamp` (ISO string or Date object) and `duration` (in seconds). Default: `[]`.
    *   `timeUnit`: ('day' | 'week' | 'month') - The unit of time for aggregating and displaying data on the x-axis. Default: `'day'`.
*   **Events:** (None)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Uses `Chart.js` (version with tree-shaking `registerables`) and `chartjs-adapter-date-fns` for time scale support.
    *   On mount, initializes a Chart.js bar chart instance on a `<canvas>` element.
    *   The `updateChart` function processes the `sessions` prop:
        *   Aggregates session durations (converted to minutes) based on the selected `timeUnit`.
        *   For 'day', it shows the last 7 days.
        *   For 'week', it shows the last 4 weeks (keyed by the Sunday of each week).
        *   For 'month', it shows the last 6 months.
        *   Updates the chart's labels (dates/months) and data points (aggregated durations).
    *   The x-axis is a time scale, configured according to the `timeUnit` prop (e.g., `MMM d` for days, `MMM yyyy` for months).
    *   The y-axis displays minutes and starts at zero.
    *   The chart is responsive and styled with specific colors for bars and grid lines.
    *   The legend is hidden as there's only one dataset.
    *   Tooltips show detailed information on hover.
    *   The chart updates automatically if the `sessions` or `timeUnit` props change (via `afterUpdate`).
    *   The Chart.js instance is destroyed `onDestroy` to prevent memory leaks.

---

## Component Name: Footer (Footer.svelte)

*   **Purpose:** A simple footer component that displays copyright information with the current year.
*   **Props:** (None)
*   **Events:** (None)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Calculates the `currentYear` using `new Date().getFullYear()`.
    *   Displays a centered text: "© {currentYear} LearnFlow. All rights reserved."
    *   Styled with a background color, top border, and padding, suitable for the bottom of a page.

---

## Component Name: Header (Header.svelte)

*   **Purpose:** Provides the main application header, including a search bar, notification icon, a button to toggle a Picture-in-Picture (PiP) widget, and user authentication status/actions (login/logout).
*   **Props:**
    *   `onTogglePip`: (function) - A callback function that is executed when the PiP toggle button is clicked. Default: A function that toggles the `pipVisible` store from `'$lib/stores/pipStores.js'`.
*   **Stores Used:**
    *   `pipVisible` (writable boolean from `'$lib/stores/pipStores.js'`): Used by the default `onTogglePip` handler.
    *   `isAuthenticated` (readable boolean from `'$lib/stores/authStore.js'`): Determines if a user is currently logged in.
    *   `user` (readable user object from `'$lib/stores/authStore.js'`): Contains details of the logged-in user (e.g., `displayName`, `email`).
    *   `loading` (readable boolean from `'$lib/stores/authStore.js'`): Indicates if an authentication operation is in progress.
*   **Events:** (None directly dispatched. Button clicks call internal functions or the `onTogglePip` prop.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   **Search Bar:** A text input for searching (placeholder "Search courses, exercises..."). Functionality for search is not implemented within this component itself.
    *   **Notifications Button:** An icon button for notifications (bell icon). Functionality is not implemented.
    *   **PiP Toggle Button:** An icon button (puzzle piece icon) that calls the `onTogglePip` function when clicked.
    *   **Authentication Section:**
        *   If `$loading` is true, shows a pulsing placeholder.
        *   If `$isAuthenticated` is true and `$user` is available:
            *   Displays a user avatar (initials from `displayName` or `email`).
            *   Shows a "Log out" button which calls the `logout` function from `'$lib/services/authService.js'`.
        *   If not authenticated, shows a "Log in" button which navigates to `/login` using `goto` from `'$app/navigation'`.
    *   The header is sticky at the top of the viewport.

---

## Component Name: ResetPassword (ResetPassword.svelte)

*   **Purpose:** Provides a form for users to request a password reset link by entering their email address.
*   **Props:** (None)
*   **Stores Used:**
    *   `loading` (readable boolean from `'$lib/stores/authStore.js'`): Indicates if an authentication operation (like sending a reset email) is in progress. Used to disable the submit button.
    *   `authError` (readable string|null from `'$lib/stores/authStore.js'`): Displays any global authentication errors returned by the `authService`.
*   **Events:** (None directly dispatched. Form submission calls an authentication service function.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   Collects the user's email address in an input field.
    *   Performs client-side validation: an email address must be entered.
    *   Displays local validation errors if the email field is empty.
    *   On form submission:
        *   Calls the `resetPassword(email)` function from `'$lib/services/authService.js'`.
        *   If successful, displays a success message ("Password reset email sent. Check your inbox.") and clears the email input field.
        *   Displays errors from the `$authError` store if the `resetPassword` service call fails (e.g., email not found).
    *   The submit button ("Send Reset Link") is disabled when `$loading` is true.
    *   Provides a "Back to login" link that navigates to `/login`.

---

## Component Name: ScoreCard (ScoreCard.svelte)

*   **Purpose:** Displays a user's score, typically fetched from an API, and represents it visually with star ratings.
*   **Props:** (None)
*   **Events:** (None)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   On component mount (`onMount`), it attempts to fetch a user's score from the API endpoint `/api/score`.
    *   Displays a loading message ("Loading...") while the fetch is in progress.
    *   If the fetch fails, it displays an error message (e.g., "Failed to fetch score").
    *   If the score is successfully fetched (expected format: `{ score: number }` where score is between 0 and 5):
        *   It displays the score numerically (e.g., "3.5/5").
        *   It uses an internal helper function `starArray(n)` to convert the numerical score into an array representing full, half, or empty stars.
        *   It then iterates over this array to render the star icons (using Font Awesome classes: `fas fa-star`, `fas fa-star-half-alt`, `far fa-star`).
    *   The component is styled as a card with a title "Score Utilisateur".

---

## Component Name: Sidebar (Sidebar.svelte)

*   **Purpose:** Provides the main navigation sidebar for the application, with collapsible sections and links. It adapts for mobile and desktop views and respects user authentication status for certain links.
*   **Props:** (None)
*   **Stores Used:**
    *   `$page` (readable store from `'$app/stores'`): Used to get the current URL path (`$page.url.pathname`) to highlight active navigation links.
    *   `isAuthenticated` (readable boolean from `'$lib/stores/authStore.js'`): To show/hide links that require authentication.
    *   `user` (readable user object from `'$lib/stores/authStore.js'`): To display user information in the account section.
    *   `loading` (readable boolean from `'$lib/stores/authStore.js'`): To show a loading state in the account section.
    *   `sidebarCollapsed` (writable boolean from `'$lib/stores/sidebarStore.js'`): Controls the collapsed/expanded state of the sidebar on desktop.
*   **Events:** (None directly dispatched. User interactions modify stores or navigate.)
*   **Slots:** (None)
*   **Interactions/Usage:**
    *   **Navigation Structure:** Defines a `navigation` array with categories (e.g., 'Main', 'Community', 'Resources', 'Tools'), each containing a list of `NavItem` objects (`name`, `href`, `icon`, `authRequired`).
    *   **Collapsible Sections:** Each category title is a button that toggles the visibility of its items. The expanded/collapsed state of these sections is managed by an internal `expanded` object and animated with `svelte/transition`'s `slide`.
    *   **Active Link Highlighting:** Links matching the current `$page.url.pathname` are styled differently.
    *   **Authentication:** Navigation items with `authRequired: true` are only displayed if `$isAuthenticated` is true.
    *   **Sidebar Collapse (Desktop):**
        *   An internal button (left/right angle icon) toggles the `$sidebarCollapsed` store.
        *   An external button (visible only when collapsed) also toggles this store.
        *   The sidebar width and translation are animated based on `$sidebarCollapsed`.
    *   **Mobile Menu:**
        *   A hamburger button (visible on `lg` and smaller screens) toggles an internal `mobileMenuOpen` state, which controls the sidebar's visibility on mobile.
    *   **Account Section (Bottom of Sidebar):**
        *   If `$loading` is true, shows a loading skeleton.
        *   If authenticated, displays the user's avatar (initials) and name/email, with a link to "/settings".
        *   If not authenticated, displays a message prompting login and a "Log In / Sign Up" button (currently, its `navigateToLogin` function is commented out).
    *   Includes a logo/header section at the top with an icon and "LearnFlow" title.

---

## Component Name: StickyNotes (StickyNotes.svelte)

*   **Purpose:** Provides a digital sticky notes feature for users to jot down and manage quick notes within the application.

*   **Key Features:**
    *   Allows users to create new sticky notes.
    *   Notes are displayed in a grid layout.
    *   Each note can be edited directly.
    *   Users can delete individual notes.
    *   Notes are persisted in `localStorage` under the key `workspace_notes`.
    *   Features a pastel color palette for notes, with colors and a slight rotation applied pseudo-randomly for visual distinction.

*   **Props:** (None)

*   **Events:** (None explicitly dispatched, but interacts with `localStorage` on add, update, and delete operations.)

*   **Functionality:**
    *   `loadNotes()`: Loads notes from `localStorage` when the component mounts.
    *   `saveNotes()`: Saves the current state of notes to `localStorage`.
    *   `addNote()`: Creates a new note with a unique ID (timestamp) and empty content.
    *   `deleteNote(id: number)`: Removes a note by its ID.
    *   `updateNote(id: number, content: string)`: Updates the content of a specific note.
    *   `getNoteStyle(id: number, index: number)`: Assigns a background color and rotation to a note for visual styling. If a style for a note ID doesn't exist, it creates one.

*   **Dependencies:**
    *   Svelte: `onMount`, `onDestroy`
    *   `$app/environment`: `browser` (to ensure `localStorage` is accessed only on the client-side)

*   **Styling:**
    *   Uses Tailwind CSS for layout and styling.
    *   Notes have a shadow, rounded corners, and a slight rotation.
    *   Textareas for note content are styled to be transparent and resizable.
    *   Edit and delete buttons are provided for each note.
    *   An "Add Note" button is positioned at the bottom right.

---

## Component Name: Timer (Timer.svelte)

*   **Purpose:** Implements a simple stopwatch timer that users can start, stop, and reset.

*   **Key Features:**
    *   Displays elapsed time in HH:MM:SS format.
    *   Provides "Start", "Stop", and "Reset" buttons.
    *   Timer updates every second when running.

*   **Props:** (None)

*   **Events:** (None)

*   **Functionality:**
    *   `formatTime(seconds: number)`: Converts total seconds into a formatted time string (HH:MM:SS).
    *   `start()`: Starts the timer if it's not already running. Sets an interval to increment `elapsed` every second.
    *   `stop()`: Stops the timer by clearing the interval.
    *   `reset()`: Stops the timer and resets `elapsed` time to 0.
    *   `onDestroy()`: Lifecycle hook to clear the interval when the component is destroyed, preventing memory leaks.

*   **State Variables:**
    *   `elapsed`: Stores the total elapsed time in seconds.
    *   `intervalId`: Holds the ID of the `setInterval` used for the timer.
    *   `isRunning`: Boolean flag to indicate if the timer is currently active.

*   **Dependencies:**
    *   Svelte: `onDestroy`

*   **Styling:**
    *   Uses Tailwind CSS for basic styling of the timer display and buttons.
    *   The timer display uses a monospaced font.

---

## Component Name: PipCalculator (pip/PipCalculator.svelte)

*   **Purpose:** A compact calculator widget, designed to be used within the PiP (Picture-in-Picture) panel. It provides basic arithmetic operations.

*   **Key Features:**
    *   Standard calculator layout with number buttons (0-9), decimal point, and operators (+, -, *, /).
    *   Displays current input and results.
    *   Supports operations: Add, Subtract, Multiply, Divide.
    *   Special functions: All Clear (AC), Toggle Sign (+/-), Percentage (%).

*   **Props:** (None)

*   **Stores Used (from `'$lib/stores/pipStores'`):**
    *   `calcDisplay`: (Writable<string>) - The string currently shown on the calculator display.
    *   `calcCurrentInput`: (Writable<string>) - The current number being input.
    *   `calcOperator`: (Writable<string | null>) - The currently selected arithmetic operator.
    *   `calcPreviousValue`: (Writable<number | null>) - The first operand in a calculation.
    *   `calcWaitingForSecondOperand`: (Writable<boolean>) - Flag indicating if the next input should start a new number (after an operator has been pressed).

*   **Functionality:**
    *   `inputDigit(digit: string)`: Appends a digit to the current display/input.
    *   `inputDecimal()`: Adds a decimal point if one isn't already present.
    *   `clearAll()`: Resets all calculator stores to their initial states, clearing the display and any ongoing calculation.
    *   `handleOperator(nextOperator: string)`: Handles operator input. If there's a previous value and operator, it performs the calculation before storing the new operator and waiting for the second operand. If the operator is '=', it just performs the calculation.
    *   `performCalculation(): number`: Executes the arithmetic operation based on `calcPreviousValue`, `calcCurrentInput`, and `calcOperator`.
    *   `toggleSign()`: Changes the sign of the currently displayed number.
    *   `calculatePercentage()`: Converts the displayed number to its percentage value (divides by 100).

*   **Styling:**
    *   Uses Tailwind CSS for a compact, dark-themed UI suitable for a PiP widget.
    *   Operator buttons and special function buttons have distinct colors.

---

## Component Name: PipNotes (pip/PipNotes.svelte)

*   **Purpose:** A quick notes widget for the PiP panel, allowing users to jot down and view short text notes. Notes are persisted using Svelte stores.

*   **Key Features:**
    *   Add new notes with a title (auto-generated from the first line/few words) and content.
    *   Display a list of existing notes, sorted by last updated time.
    *   Delete individual notes.
    *   Uses Svelte transitions (`fade`) and animations (`flip`) for a smoother user experience.

*   **Props:** (None)

*   **Stores Used (from `'$lib/stores/pipStores.js'`):**
    *   `notes`: (Writable<NoteItem[]>) - An array store holding all `NoteItem` objects. Each `NoteItem` has `id`, `title`, `content`, `createdAt`, and `updatedAt`.

*   **Functionality:**
    *   `addNote()`: Creates a new `NoteItem` from `newNoteContent`, generates a simple title, and adds it to the `$notes` store. Clears the input and hides the input form.
    *   `startNewNote()`: Shows the textarea for adding a new note.
    *   `cancelNewNote()`: Hides the new note input area and clears its content.
    *   `deleteNote(id: string)`: Removes a note from the `$notes` store by its ID.

*   **UI Elements:**
    *   A "+ New" button to reveal the new note input area.
    *   A textarea for note content with "Save Note" and "Cancel" buttons.
    *   A list of existing notes, showing their titles. Hovering over a note reveals a delete button.
    *   Displays a message if no notes exist.

*   **Styling:**
    *   Dark theme, compact design for PiP.
    *   Tailwind CSS for styling.

---

## Component Name: PipTodo (pip/PipTodo.svelte)

*   **Purpose:** A simple to-do list widget for the PiP panel, allowing users to add, view, toggle, and delete tasks. Tasks are managed via Svelte stores.

*   **Key Features:**
    *   Add new tasks via an input field.
    *   Display a list of tasks.
    *   Mark tasks as completed/incomplete with checkboxes.
    *   Delete tasks.
    *   Uses Svelte transitions (`fade`) and animations (`flip`).

*   **Props:** (None)

*   **Stores Used (from `'$lib/stores/pipStores.js'`):**
    *   `todos`: (Writable<TodoItem[]>) - An array store holding `TodoItem` objects. Each `TodoItem` has `id`, `text`, `completed`, and `createdAt`.

*   **Functionality:**
    *   `addTodo()`: Adds a new task (from `newTodoText`) to the `$todos` store. Clears the input field.
    *   `toggleTodo(id: string)`: Toggles the `completed` status of a task in the `$todos` store.
    *   `deleteTodo(id: string)`: Removes a task from the `$todos` store by its ID.
    *   `handleKeydown(event: KeyboardEvent)`: Allows adding a task by pressing Enter in the input field.

*   **UI Elements:**
    *   An input field and "Add" button for new tasks.
    *   A list of tasks, each with a checkbox, text, and a delete button (visible on hover).
    *   Completed tasks are visually distinguished (e.g., line-through).
    *   Displays a message if no tasks exist.

*   **Styling:**
    *   Dark theme, compact design for PiP.
    *   Tailwind CSS for styling.

---

## Component Name: PipDictionary (pip/PipDictionary.svelte)

*   **Purpose:** A dictionary widget for the PiP panel that allows users to look up word definitions using the free `dictionaryapi.dev`.

*   **Key Features:**
    *   Input field to enter a word for lookup.
    *   Displays the word, phonetic pronunciation (if available), and meanings (part of speech, definitions, examples).
    *   Shows loading and error states.

*   **Props:** (None)

*   **State Variables:**
    *   `searchTerm`: (string) - The word being searched.
    *   `searching`: (boolean) - Flag indicating if a search is in progress.
    *   `result`: (DictionaryResult | null) - Stores the API response for a successful lookup.
    *   `error`: (string | null) - Stores error messages if the lookup fails.

*   **Functionality:**
    *   `lookupWord(term: string)`: Asynchronously fetches word definition from `https://api.dictionaryapi.dev/api/v2/entries/en/{term}`.
    *   `handleSubmit()`: Triggered on form submission to call `lookupWord`.

*   **UI Elements:**
    *   A form with a text input and a search button.
    *   Displays search results including word, phonetic, part of speech, definitions, and examples.
    *   Shows appropriate messages for loading, errors, or initial state.

*   **Styling:**
    *   Dark theme, compact design for PiP.
    *   Tailwind CSS for styling.
    *   Uses Font Awesome icons for search and spinner.

---

## Component Name: PipFlashcards (pip/PipFlashcards.svelte)

*   **Purpose:** A flashcard review widget for the PiP panel, implementing a simple spaced repetition system. Flashcards are persisted using a Svelte store.

*   **Key Features:**
    *   Add new flashcards with front and back content.
    *   Review flashcards: show front, flip to back.
    *   Mark review as "Good" or "Again" to update spaced repetition level and next review time.
    *   Selects cards for review based on their `nextReview` time.

*   **Props:** (None)

*   **Stores Used:**
    *   `flashcards` (PersistentStore<Flashcard[]>) from `'../../stores/persistentStore'` (persisted under key `'learnflow-flashcards'`): Stores an array of `Flashcard` objects. Each `Flashcard` has `id`, `front`, `back`, `lastReviewed` (timestamp), `nextReview` (timestamp), and `level` (0-5 for spaced repetition).

*   **State Variables:**
    *   `currentCard`: (Flashcard | null) - The flashcard currently being reviewed.
    *   `showingFront`: (boolean) - True if the front of `currentCard` is visible, false for back.
    *   `newCardFront`, `newCardBack`: (string) - Bindings for new card input fields.

*   **Functionality:**
    *   `getNextCard()`: Selects the next card due for review from `$flashcards`. Returns a random card among those due.
    *   `addCard()`: Creates a new `Flashcard` and adds it to the `$flashcards` store.
    *   `flipCard()`: Toggles `showingFront` to show the other side of `currentCard`.
    *   `reviewCard(success: boolean)`: Updates `currentCard`'s level, `lastReviewed`, and `nextReview` time based on whether the review was successful. The `nextReview` time is calculated using predefined intervals based on the new level. Then loads the next card.
    *   A reactive statement (`$: if (!currentCard)`) ensures `currentCard` is populated when the component loads or when the current card is reviewed.

*   **UI Elements:**
    *   If no flashcards exist, shows a form to add the first card.
    *   If flashcards exist:
        *   Displays `currentCard` (front or back). Click to flip.
        *   "Again" and "Good" buttons for reviewing.
        *   If no cards are due, shows a message.
        *   A `<details>` element to reveal a form for adding new flashcards.

*   **Styling:**
    *   Dark theme, compact design for PiP.
    *   Tailwind CSS for styling.

---
