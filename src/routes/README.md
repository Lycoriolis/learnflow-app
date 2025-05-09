# LearnFlow Routes Structure

This directory contains the SvelteKit routes for the LearnFlow application. The routing structure follows SvelteKit's file-based routing system.

## Important Naming Conventions

- Files prefixed with `+` are reserved for SvelteKit's routing system:
  - `+page.svelte` - Page components
  - `+layout.svelte` - Layout components
  - `+page.server.ts` - Server-side logic for pages
  - `+layout.server.ts` - Server-side logic for layouts
  - `+error.svelte` - Error pages

- Test files should NOT use the `+` prefix:
  - Use `Page.test.ts` instead of `+page.test.ts`
  - Use `Layout.test.ts` instead of `+layout.test.ts`

## Main Route Structure

- `(protected)/` - Protected routes requiring authentication
- `admin/` - Admin panel routes
- `api/` - API endpoints
- `courses/` - Course-related routes
  - `courses/[slug]/` - Individual course page
  - `courses/[slug]/[moduleId]/` - Module page
  - `courses/[slug]/[moduleId]/[lessonId]/` - Lesson page
- `exercises/` - Exercise-related routes
  - `exercises/[slug]/` - Individual exercise page
- Other utility and feature routes (calendar, forums, tools, etc.)

## Route Guards

- `adminGuard.ts` - Guards routes for administrative access
- `(protected)/+layout.server.ts` - Guards routes requiring authentication

For more detailed documentation on routing, see `/docs/routing-structure.md`.
