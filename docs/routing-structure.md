# LearnFlow Application Routing Structure

This document outlines the routing structure of the LearnFlow platform, detailing how different routes are organized and the naming conventions used in the SvelteKit application.

## Key Route Patterns

The application follows SvelteKit's file-based routing system:

- Files named `+page.svelte` define pages
- Files named `+layout.svelte` define layouts that wrap pages
- Files named `+page.server.ts` contain server-side logic for pages
- Files named `+layout.server.ts` contain server-side logic for layouts

## Important Naming Conventions

- **SvelteKit Reserved File Prefixes**: Files prefixed with `+` are reserved for SvelteKit's routing system (`+page.svelte`, `+layout.svelte`, etc.)
- **Test Files**: Test files should NOT use the `+` prefix (use `Page.test.ts` instead of `+page.test.ts`)

## Main Routes

- `/` - Home page/Dashboard
- `/courses` - Course catalog
- `/exercises` - Exercise catalog
- `/my-learning` - Personalized user learning dashboard
- `/forums` - Discussion forums
- `/calendar` - User's learning calendar
- `/settings` - User settings
- `/login`, `/register`, `/reset-password` - Authentication routes

## Content Routes

### Courses

The course routes follow a hierarchical structure:

- `/courses/[slug]` - Course overview page
  - Displays course details, modules, and progress
  - Parameters:
    - `slug`: Unique course identifier
  
- `/courses/[slug]/[moduleId]` - Module overview page
  - Displays module details and lessons within the module
  - Parameters:
    - `slug`: Course identifier
    - `moduleId`: Unique module identifier
  
- `/courses/[slug]/[moduleId]/[lessonId]` - Lesson content page
  - Displays lesson content with navigation between lessons
  - Parameters:
    - `slug`: Course identifier
    - `moduleId`: Module identifier
    - `lessonId`: Unique lesson identifier

### Exercises

- `/exercises` - Exercise catalog/hub page
  - Lists available exercises with filtering options
  
- `/exercises/[slug]` - Individual exercise page
  - Displays exercise content and interactive elements
  - Parameters:
    - `slug`: Unique exercise identifier

## Route Implementation Notes

1. **Module-based Lesson Navigation**: 
   - Lessons are always accessed through their parent module (`/courses/[slug]/[moduleId]/[lessonId]`)
   - The direct lesson route (`/courses/[slug]/[lessonId]`) has been removed to avoid routing conflicts

2. **Dynamic Parameters**:
   - `[slug]`: Typically a URL-friendly version of the content name
   - `[moduleId]` and `[lessonId]`: Unique identifiers for modules and lessons

3. **Route Guards**:
   - Protected routes use the authentication guard in `(protected)/+layout.server.ts`
   - Admin routes use the `adminGuard.ts` for authorization checks

## Best Practices

1. **Component Testing**:
   - Test files should be named without the `+` prefix (e.g., `Page.test.ts`)
   - Use the appropriate mocks for components and services

2. **Route Parameters**:
   - Always validate route parameters before using them
   - Handle cases where content for the given parameters doesn't exist

3. **Navigation**:
   - Use SvelteKit's `goto` function for programmatic navigation
   - Use the `<a>` element with `href` for declarative navigation
