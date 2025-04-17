# Courses Page Documentation

## Overview
The Courses page displays a list of available courses to authenticated users. It dynamically loads course data and presents it in a responsive grid layout.

## Data Loading
- The page uses the `listContent('course')` function from `src/lib/services/contentService.ts` to fetch course metadata.
- Data is loaded asynchronously on component mount using Svelte's `onMount` lifecycle function.
- While loading, a spinner is shown. If an error occurs, an error message is displayed.

## Display Logic
- Only authenticated users can view the list of courses. Unauthenticated users are prompted to log in.
- Each course is displayed as a card showing its title, description, tags, and estimated time (if available).
- Clicking a course card navigates to the course details page (`/courses/[courseId]`).

## Customization
- The color scheme for course cards uses a Tailwind color map for gradients and hover effects.
- The page is fully responsive and adapts to different screen sizes.

## File Location
- Main implementation: `src/routes/courses/+page.svelte`
- Data service: `src/lib/services/contentService.ts`

---
For further customization, you can modify the card layout or extend the course metadata in the content service or markdown files under `static/content/courses/`.
