<script lang="ts">
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';
  import { afterUpdate } from 'svelte';
  import { browser } from '$app/environment';

  // Support both string and Promise<string> content
  export let content: string | Promise<string> = '';
  
  let htmlContent: string = '';
  let resolvedContent: string = '';
  let isLoading = false;
  let hasError = false;
  let errorMessage = '';
  
  // Process markdown and sanitize HTML
  function processMarkdown(markdownContent: string): string {
    if (!markdownContent) return '';
    
    try {
      return DOMPurify.sanitize(marked.parse(markdownContent, {
        breaks: true,
        gfm: true
      }));
    } catch (err) {
      console.error('Error processing markdown:', err);
      hasError = true;
      errorMessage = err instanceof Error ? err.message : 'Unknown error processing markdown';
      return '';
    }
  }
  
  // Handle content updates, including Promise resolution
  $: {
    if (content) {
      if (typeof content === 'string') {
        resolvedContent = content;
        htmlContent = processMarkdown(content);
      } else {
        // It's a Promise
        isLoading = true;
        hasError = false;
        
        content
          .then(result => {
            resolvedContent = result;
            htmlContent = processMarkdown(result);
          })
          .catch(err => {
            console.error('Error resolving content:', err);
            hasError = true;
            errorMessage = err instanceof Error ? err.message : 'Failed to load content';
          })
          .finally(() => {
            isLoading = false;
          });
      }
    } else {
      resolvedContent = '';
      htmlContent = '';
    }
  }
  
  // Apply syntax highlighting only in the browser environment
  function applySyntaxHighlighting() {
    if (!browser) return;
    
    // Use setTimeout to ensure this runs after the DOM has been updated
    setTimeout(() => {
      const codeBlocks = document.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }, 0);
  }
  
  // Apply highlighting after content updates
  $: if (htmlContent && browser) {
    applySyntaxHighlighting();
  }
  
  // Also apply on mount and updates
  onMount(() => {
    if (htmlContent) {
      applySyntaxHighlighting();
    }
  });
  
  afterUpdate(() => {
    if (htmlContent) {
      applySyntaxHighlighting();
    }
  });
</script>

<div class="markdown-content">
  {#if isLoading}
    <div class="loading-indicator">
      <div class="spinner"></div>
      <p>Loading content...</p>
    </div>
  {:else if hasError}
    <div class="error-message">
      <p>Error: {errorMessage}</p>
    </div>
  {:else}
    {@html htmlContent}
  {/if}
</div>

<style>
  .markdown-content :global(pre) {
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
    overflow-x: auto;
  }
  
  .markdown-content :global(code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
  
  .markdown-content :global(p) {
    margin-bottom: 1rem;
  }
  
  .markdown-content :global(h1),
  .markdown-content :global(h2),
  .markdown-content :global(h3),
  .markdown-content :global(h4),
  .markdown-content :global(h5) {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
  }
  
  .markdown-content :global(ul),
  .markdown-content :global(ol) {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .markdown-content :global(blockquote) {
    border-left: 4px solid #e5e7eb;
    padding-left: 1rem;
    color: #6b7280;
    margin: 1rem 0;
  }
  
  .markdown-content :global(a) {
    color: #3b82f6;
    text-decoration: underline;
  }
  
  .markdown-content :global(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
  }
  
  .markdown-content :global(th), 
  .markdown-content :global(td) {
    border: 1px solid #e5e7eb;
    padding: 0.5rem;
  }
  
  .markdown-content :global(th) {
    background-color: #f3f4f6;
  }
  
  .loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 0;
  }
  
  .spinner {
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 3px solid #3498db;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
    margin-bottom: 0.5rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-message {
    padding: 1rem;
    background-color: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    color: #b91c1c;
  }
</style>