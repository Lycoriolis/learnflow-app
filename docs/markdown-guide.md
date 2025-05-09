# Markdown-Based Course and Exercise Implementation Guide

This document provides a comprehensive guide to the markdown-based course and exercise implementation. It covers the organization, file formats, best practices, and the API for accessing the content.

## Content Organization

The content is organized in a hierarchical structure:

```
/static/content/
  /courses/
    /course-slug/
      meta.json           # Course metadata
      README.md           # Course overview
      /modules/
        01-module-slug/
          meta.json       # Module metadata
          /lessons/
            01-lesson-slug.md  # Lesson content with frontmatter
            02-lesson-slug.md
          /resources/     # Optional module resources
        02-module-slug/
          ...
  /exercises/
    /category-1/
      exercise-slug-1.md  # Exercise with frontmatter
      exercise-slug-2.md
    /category-2/
      exercise-slug-3.md
```

## File Formats

### Course Metadata (meta.json)

```json
{
  "id": "javascript-fundamentals",
  "title": "JavaScript Fundamentals",
  "description": "A comprehensive course on JavaScript programming fundamentals",
  "icon": "fa-js",
  "gradient": {
    "from": "yellow-500",
    "to": "yellow-400"
  },
  "tags": ["javascript", "web development", "programming"],
  "difficulty": "beginner",
  "estimatedTime": "8 hours",
  "modules": ["01-intro", "02-variables", "03-functions", "04-objects"]
}
```

### Module Metadata (meta.json)

```json
{
  "id": "01-intro",
  "title": "Introduction to JavaScript",
  "description": "Learn about the history and importance of JavaScript",
  "order": 1,
  "lessons": [
    "01-what-is-javascript.md",
    "02-javascript-in-browsers.md",
    "03-developer-tools.md",
    "04-hello-world.md"
  ]
}
```

### Lesson Content (Markdown with Frontmatter)

```markdown
---
title: "What is JavaScript?"
order: 1
estimatedTime: "15 minutes"
objectives: 
  - Understand what JavaScript is
  - Learn about its history and significance
  - Recognize JavaScript's role in web development
---

# What is JavaScript?

JavaScript is a high-level, interpreted programming language...
```

### Exercise Content (Markdown with Frontmatter)

```markdown
---
title: "JavaScript Array Manipulation"
slug: "js-array-manipulation"
type: "exercise"
difficulty: "intermediate"
tags: ["javascript", "arrays", "methods"]
estimatedTime: "25 minutes"
relatedCourses: ["javascript-fundamentals"]
---

# JavaScript Array Manipulation Exercise

In this exercise, you'll practice using various JavaScript array methods...
```

## API Reference

### Loading Course Content

```typescript
// Load a list of all available courses
const courses = await listCourses();

// Load the structure of a specific course
const courseStructure = await loadCourseStructure('javascript-fundamentals');

// Load a specific lesson
const lesson = await loadLesson(
  'javascript-fundamentals',
  '01-intro',
  '01-what-is-javascript'
);
```

### Loading Exercise Content

```typescript
// Load a list of all exercises
const exercises = await listExercises();

// Load exercises in a specific category
const jsExercises = await listExercises('javascript');

// Load a specific exercise
const exercise = await loadExercise('javascript', 'array-manipulation');
```

## Best Practices

### Naming Conventions

1. **File and Directory Names**: Use kebab-case (e.g., `what-is-javascript.md`)
2. **Numeric Prefixes**: Use numeric prefixes for ordering (e.g., `01-intro/`)
3. **Unique IDs**: Ensure all course, module, and lesson IDs are unique

### Content Organization

1. **Modular Structure**: Keep related content together in modules
2. **Progressive Difficulty**: Organize lessons in increasing order of difficulty
3. **Consistent Metadata**: Use consistent metadata formats across all content

### Writing Content

1. **Clear Headings**: Use hierarchical headings (H1, H2, H3)
2. **Code Samples**: Use fenced code blocks with language specifiers
3. **Media**: Store images in the module's resources directory and reference with relative paths
4. **Interactive Elements**: Use custom markdown extensions for interactive elements

## Extending the System

### Adding Custom Markdown Extensions

The markdown renderer can be extended with custom extensions:

```typescript
// Add a custom syntax for quizzes
marked.use({
  extensions: [{
    name: 'quiz',
    level: 'block',
    start(src) {
      return src.match(/^:::quiz/)?.index;
    },
    tokenizer(src) {
      const rule = /^:::quiz\s+(.+?):::$/s;
      const match = rule.exec(src);
      if (match) {
        return {
          type: 'quiz',
          raw: match[0],
          text: match[1].trim()
        };
      }
      return undefined;
    },
    renderer(token) {
      return `<div class="quiz">${marked.parse(token.text)}</div>`;
    }
  }]
});
```

### Adding New Content Types

To add a new content type:

1. Add a new directory under `/static/content/`
2. Update the `enhancedContentService.ts` to support the new type
3. Create appropriate UI components for the new content type
4. Update the routes to render the new content type following our routing convention:
   - Courses: `/courses/[slug]/[moduleId]/[lessonId]`
   - Exercises: `/exercises/[slug]`
   - Ensure test files follow the naming pattern without the `+` prefix (e.g., `Page.test.ts`)
