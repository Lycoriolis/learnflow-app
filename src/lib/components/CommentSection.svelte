<script lang="ts">
    import { onMount } from 'svelte';

    export let pageId: string; // Unique identifier for the page/content

    interface Comment {
        id: string;
        author: string;
        text: string;
        date: string;
    }

    let comments: Comment[] = [];
    let newCommentText: string = '';
    let newCommentAuthor: string = 'Anonymous'; // Or get from auth user

    const getStorageKey = () => `comments_${pageId}`;

    onMount(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedComments = localStorage.getItem(getStorageKey());
            if (storedComments) {
                comments = JSON.parse(storedComments);
            }
        }
    });

    function saveComments() {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(getStorageKey(), JSON.stringify(comments));
        }
    }

    function handleSubmitComment() {
        if (!newCommentText.trim()) {
            alert('Comment cannot be empty.');
            return;
        }
        const newComment: Comment = {
            id: crypto.randomUUID(),
            author: newCommentAuthor.trim() || 'Anonymous',
            text: newCommentText.trim(),
            date: new Date().toLocaleString(),
        };
        comments = [newComment, ...comments]; // Add new comment to the top
        saveComments();
        newCommentText = ''; // Clear textarea
        // newCommentAuthor = 'Anonymous'; // Reset author if needed
    }
</script>

<div class="comment-section">
    <h4>Comments</h4>
    
    <div class="comment-form">
        <div class="form-group">
            <label for="comment-author-{pageId}">Name:</label>
            <input 
                type="text" 
                id="comment-author-{pageId}" 
                class="comment-author-input" 
                bind:value={newCommentAuthor} 
                placeholder="Your name (optional)"
            />
        </div>
        <div class="form-group">
            <label for="comment-text-{pageId}">Comment:</label>
            <textarea 
                id="comment-text-{pageId}"
                class="comment-textarea"
                bind:value={newCommentText}
                placeholder="Write a comment..." 
                rows="4" 
                aria-label="Write a comment"
            ></textarea>
        </div>
        <button 
            type="button" 
            class="comment-submit-button"
            on:click={handleSubmitComment}
            disabled={!newCommentText.trim()}
        >Submit Comment</button>
    </div>

    <div class="comments-list">
        {#if comments.length > 0}
            {#each comments as comment (comment.id)}
                <div class="comment-item">
                    <p class="comment-author">{comment.author} <span class="comment-date">- {comment.date}</span></p>
                    <p class="comment-text">{comment.text}</p>
                </div>
            {/each}
        {:else}
            <p class="no-comments">No comments yet. Be the first to comment!</p>
        {/if}
    </div>
</div>

<style>
    .comment-section {
        margin-top: 40px;
        padding: 25px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background-color: #f9fafb;
    }
    .comment-section h4 {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 1.4em;
        color: #333;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 10px;
    }

    .comment-form {
        margin-bottom: 30px;
    }
    .form-group {
        margin-bottom: 15px;
    }
    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
        font-size: 0.9em;
        color: #454545;
    }

    .comment-author-input,
    .comment-textarea {
        width: 100%;
        padding: 10px 12px; /* Adjusted padding */
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1em;
        line-height: 1.5;
        box-sizing: border-box;
    }
    .comment-textarea {
        resize: vertical;
    }

    .comment-author-input:focus,
    .comment-textarea:focus {
        border-color: #007bff;
        box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
        outline: none;
    }

    .comment-submit-button {
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1em;
        font-weight: 500;
        transition: background-color 0.2s ease;
    }
    .comment-submit-button:hover:not(:disabled) {
        background-color: #0056b3;
    }
    .comment-submit-button:disabled {
        background-color: #a0cfff; /* Lighter blue when disabled */
        cursor: not-allowed;
    }

    .comments-list {
        margin-top: 20px;
    }
    .comment-item {
        background-color: #fff;
        border: 1px solid #e7e7e7;
        padding: 15px;
        border-radius: 6px;
        margin-bottom: 15px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .comment-author {
        font-weight: bold;
        margin: 0 0 5px 0;
        color: #2c3e50;
        font-size: 0.95em;
    }
    .comment-date {
        font-weight: normal;
        color: #7f8c8d;
        font-size: 0.85em;
        margin-left: 5px;
    }
    .comment-text {
        margin: 0;
        line-height: 1.6;
        color: #34495e;
        font-size: 0.9em;
        white-space: pre-wrap; /* Preserve line breaks in comments */
    }
    .no-comments {
        color: #777;
        font-style: italic;
        padding: 10px 0;
    }
</style>
