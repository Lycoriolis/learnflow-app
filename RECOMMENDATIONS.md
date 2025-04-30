# Recommendation API Design

This document outlines the structure and logic of the future recommendations API for LearnFlow.

## 1. Endpoint

GET `/api/recommendations?limit={n}`

- **Query Parameters**
  - `limit` (optional, integer): Maximum number of suggestions to return (default: 10).

- **Authentication**
  - Requires a valid session cookie. Returns 401 if unauthenticated.

- **Response** (200 OK)
  ```json
  {
    "recommendations": [
      {
        "type": "next_lesson",
        "referenceId": "lesson-abc123",
        "title": "Continue: Advanced CSS Grid",
        "description": "Finish Module 2, Lesson 3",
        "metadata": { "courseId": "course-xyz", "moduleIndex": 1, "lessonIndex": 2 }
      },
      {
        "type": "review_flashcards",
        "referenceId": "flashcard-789",
        "title": "Review HTML Basics",
        "description": "Flashcards due today",
        "metadata": {}
      }
      // ... up to `limit` items
    ]
  }
  ```

## 2. Data Model

```ts
interface Recommendation {
  type: string;           // e.g., "next_lesson", "review_flashcards"
  referenceId: string;    // ID of the target resource
  title: string;          // Display title
  description: string;    // Brief call-to-action or context
  metadata?: Record<string, any>; // Additional parameters
}
```

## 3. Service Logic (recommendationService)

1. **Fetch** user activity stream from `activities` table: most recent entries.
2. **Identify** user context:
   - Last viewed course/lesson
   - Incomplete lessons in progress
   - Flashcards due for review
   - Frequently used tools
3. **Score** potential recommendations:
   - Prioritize items by recency and completion status
   - Demote already completed lessons
   - Promote review items due soon
4. **Assemble** a sorted list of `Recommendation` objects.
5. **Return** top N items as API response.

## 4. Future Enhancements

- Collaborative filtering using multiple users’ activity patterns
- Machine learning models for personalized suggestions
- A/B testing and user feedback integration
- Support for recommending external content and community events

---
*Prepared for LearnFlow (Linux), 24 April 2025.*