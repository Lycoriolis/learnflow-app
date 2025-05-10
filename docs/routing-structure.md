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
    - `slug`: Unique exercise identifier (can be a simple ID or a category/id pattern)
  - Note: The previously used `/exercises/[id]` route has been removed to avoid routing conflicts

## Route Implementation Notes

1. **Module-based Lesson Navigation**: 
   - Lessons are always accessed through their parent module (`/courses/[slug]/[moduleId]/[lessonId]`)
   - The direct lesson route (`/courses/[slug]/[lessonId]`) has been removed to avoid routing conflicts

2. **Dynamic Parameters**:
   - `[slug]`: Typically a URL-friendly version of the content name
   
3. **Exercise Routing**:
   - All exercises are accessed via the `/exercises/[slug]` route
   - The route handler supports both simple IDs and slug patterns
   - Components linking to exercises should use `exercise.slug || exercise.id` to ensure proper navigation
