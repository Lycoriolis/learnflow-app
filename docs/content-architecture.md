# LearnFlow Content Architecture

This document describes the structure and conventions for organizing course and exercise content in the LearnFlow platform.

## 1. Directory Structure

All content is stored under the `static/content` directory, with the following main branches:

```
static/content/
  courses/
    <theme>/
      _index.mdx                # Theme overview (e.g., maths/_index.mdx)
      <course>/
        _index.mdx              # Course overview (e.g., mpsi-maths/_index.mdx)
        <module>/
          _index.mdx            # Module overview (optional, for grouping lessons)
          <lesson>.mdx          # Individual lesson files
        <lesson>.mdx            # Or lessons directly under the course
  exercises/
    <category>/
      _index.mdx                # Category overview (optional)
      <exercise-set>/
        _index.mdx              # Exercise set overview
        <problem>.mdx           # Individual exercise/problem files
      <problem>.mdx             # Or problems directly under the category
```

## 2. File Types and `contentType`

Each `.mdx` file must have a `contentType` in its frontmatter to indicate its role:

- `theme_overview`: Top-level theme (e.g., Mathematics)
- `course_overview`: Course overview (e.g., MPSI - Mathématiques)
- `lesson_module_overview`: Overview for a group of related lessons (optional, for large modules)
- `lesson_content`: Individual lesson file
- `exercise_module_overview`: Overview for a set of exercises (optional)
- `exercise_problem`: Individual exercise/problem file

## 3. Frontmatter Conventions

All content files should use the following fields as appropriate:

```yaml
---
title: "Title of the content"
description: "Short description"
id: "<unique-id>"                # Must be unique within the content tree
order: <number>                  # For ordering in lists
contentType: "<see above>"
childContentType: "<type>"       # For overview files, type of children (e.g., lesson_content)
children:
  - id: "<child-id>"
    title: "Child Title"
    description: "Child Description"
    # ...other optional fields...
tags: ["tag1", "tag2"]
difficulty: "beginner|intermediate|advanced"
estimatedTime: "e.g., 2 hours"
thumbnail: "/images/path.png"
---
```

- **Overview files** (`_index.mdx`) should use `children` to explicitly list their child items, or children will be auto-discovered from the directory.
- **Lesson and problem files** should use `id` that matches the filename (without `.mdx`) or is explicitly set.

## 4. Progressive Discovery

- **Theme pages** list all child courses using the `children` array or by scanning subdirectories.
- **Course overview pages** list all modules or lessons, with navigation to each.
- **Module overviews** (optional) group related lessons for large topics.
- **Lesson pages** show content and provide next/previous navigation within their module or course.
- **Exercise set overviews** list all problems in the set.

## 5. Example

**Course Structure Example:**

```
courses/
  maths/
    _index.mdx                  # Mathematics theme overview
    mpsi-maths/
      _index.mdx                # MPSI - Mathématiques course overview
      equations-differentielles-premier-ordre/
        _index.mdx              # Module overview (optional)
        generalites.mdx         # Lesson
        methodes.mdx            # Lesson
      ...other lessons...
```

**Frontmatter for a lesson:**

```yaml
---
title: "Généralités sur les Équations Différentielles du Premier Ordre"
id: "eqdiff-premier-ordre-generalites"
order: 1
contentType: "lesson_content"
difficulty: "advanced"
estimatedTime: "2 heures"
tags: ["équations différentielles", "premier ordre"]
---
```

## 6. Naming and IDs

- Use lowercase, hyphen-separated IDs and filenames.
- The `id` in frontmatter should match the filename (without `.mdx`) unless a custom ID is needed.
- For overview files, use `<directory>_index` as the ID by convention.

## 7. Content Discovery

- The backend scans directories and parses frontmatter to build navigation and content trees.
- The `children` array in overview files allows explicit ordering and labeling of child items.
- If `children` is not set, all `.mdx` files (except `_index.mdx`) in the directory are auto-listed.

---

**This architecture ensures clarity, modularity, and scalability for both course and exercise content in LearnFlow.**
