# TODO: CommentSection Backend Integration

**Component:** `src/lib/components/CommentSection.svelte`

**Current Status:**
- Implemented with client-side `localStorage` for demonstration.
- Supports adding, viewing comments per `pageId`.
- Basic author name input.

**Future Backend Integration Requirements:**

1.  **Database Schema:**
    *   `comments` table:
        *   `id` (Primary Key, UUID)
        *   `pageId` (String, Indexed - corresponds to content ID)
        *   `userId` (Foreign Key to users table, if authentication is integrated)
        *   `authorName` (String - if anonymous comments allowed or fallback)
        *   `text` (Text, content of the comment)
        *   `createdAt` (Timestamp)
        *   `updatedAt` (Timestamp)
        *   `parentId` (UUID, Nullable - for threaded comments/replies)
        *   `isApproved` (Boolean, for moderation - default true or false based on policy)
        *   `isDeleted` (Boolean, for soft deletes)

2.  **API Endpoints (SvelteKit server routes):**
    *   `POST /api/comments`: Create a new comment.
        *   Request body: `{ pageId, text, authorName (optional), parentId (optional) }`
        *   Requires authentication (get `userId` from session).
        *   Validate input.
        *   Save to database.
        *   Return created comment or success status.
    *   `GET /api/comments?pageId={pageId}`: Fetch comments for a page.
        *   Implement pagination.
        *   Sort by `createdAt` (e.g., newest or oldest first).
        *   Handle fetching replies if threaded.
    *   `PUT /api/comments/{commentId}`: Update a comment (for owner/admin).
    *   `DELETE /api/comments/{commentId}`: Delete a comment (soft delete, for owner/admin).
    *   `POST /api/comments/{commentId}/report`: Report a comment (for moderation).

3.  **Component Updates (`CommentSection.svelte`):**
    *   Replace `localStorage` logic with API calls using `fetch`.
    *   Handle loading states, error states.
    *   Integrate with user authentication to get `userId` and prefill `authorName`.
    *   Implement UI for editing/deleting own comments (if allowed).
    *   Implement UI for replies (if threaded comments are supported).
    *   Consider real-time updates (e.g., via WebSockets or polling if necessary, though likely overkill for simple comments).

4.  **Moderation:**
    *   Admin interface for reviewing/approving/deleting comments.

5.  **Security:**
    *   Sanitize comment text to prevent XSS.
    *   Rate limiting for comment submissions.
    *   CSRF protection for POST/PUT/DELETE endpoints.
