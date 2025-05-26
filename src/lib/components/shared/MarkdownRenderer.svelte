<script lang="ts">
  import { onMount } from 'svelte';
  import { afterUpdate } from 'svelte';
  import { browser } from '$app/environment';
  import { renderMarkdown } from '$lib/utils/markdown';
  import 'katex/dist/katex.min.css';

  // Support both string and Promise<string> content
  export let content: string | Promise<string> = '';
  
  let htmlContent: string = '';
  let resolvedContent: string = '';
  let isLoading = false;
  let hasError = false;
  let errorMessage = '';
  
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
  
  function processMarkdown(content: string): string {
    if (!content) return '';
    return renderMarkdown(content);
  }
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
  .markdown-content {
    color: inherit;
  }

  /* Code blocks and syntax highlighting */
  .markdown-content :global(pre) {
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
    overflow-x: auto;
    background-color: #f8f9fa;
  }

  :global(.dark) .markdown-content :global(pre) {
    background-color: #1f2937;
  }
  
  .markdown-content :global(code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    background-color: #f1f5f9;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
  }

  :global(.dark) .markdown-content :global(code) {
    background-color: #374151;
    color: #e5e7eb;
  }

  .markdown-content :global(pre code) {
    background-color: transparent;
    padding: 0;
  }
  
  /* Typography */
  .markdown-content :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
  }
  
  .markdown-content :global(h1),
  .markdown-content :global(h2),
  .markdown-content :global(h3),
  .markdown-content :global(h4),
  .markdown-content :global(h5),
  .markdown-content :global(h6) {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
    line-height: 1.3;
  }

  .markdown-content :global(h1) { font-size: 2rem; }
  .markdown-content :global(h2) { font-size: 1.5rem; }
  .markdown-content :global(h3) { font-size: 1.25rem; }
  .markdown-content :global(h4) { font-size: 1.125rem; }
  
  /* Lists */
  .markdown-content :global(ul),
  .markdown-content :global(ol) {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }

  .markdown-content :global(li) {
    margin-bottom: 0.5rem;
  }
  
  /* Blockquotes */
  .markdown-content :global(blockquote) {
    border-left: 4px solid #e5e7eb;
    padding-left: 1rem;
    color: #6b7280;
    margin: 1rem 0;
    font-style: italic;
  }

  :global(.dark) .markdown-content :global(blockquote) {
    border-left-color: #4b5563;
    color: #9ca3af;
  }
  
  /* Links */
  .markdown-content :global(a) {
    color: #3b82f6;
    text-decoration: underline;
    transition: color 0.2s;
  }

  .markdown-content :global(a:hover) {
    color: #1d4ed8;
  }

  :global(.dark) .markdown-content :global(a) {
    color: #60a5fa;
  }

  :global(.dark) .markdown-content :global(a:hover) {
    color: #93c5fd;
  }
  
  /* Tables */
  .markdown-content :global(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
    border: 1px solid #e5e7eb;
  }

  :global(.dark) .markdown-content :global(table) {
    border-color: #4b5563;
  }
  
  .markdown-content :global(th), 
  .markdown-content :global(td) {
    border: 1px solid #e5e7eb;
    padding: 0.75rem;
    text-align: left;
  }

  :global(.dark) .markdown-content :global(th),
  :global(.dark) .markdown-content :global(td) {
    border-color: #4b5563;
  }
  
  .markdown-content :global(th) {
    background-color: #f3f4f6;
    font-weight: 600;
  }

  :global(.dark) .markdown-content :global(th) {
    background-color: #374151;
  }

  /* KaTeX Math Rendering */
  .markdown-content :global(.katex) {
    font-size: 1.1em;
  }

  .markdown-content :global(.katex-display) {
    margin: 1.5rem 0;
    text-align: center;
  }

  .markdown-content :global(.katex-display > .katex) {
    display: inline-block;
    white-space: nowrap;
  }

  /* Dark theme support for KaTeX */
  :global(.dark) .markdown-content :global(.katex) {
    color: #e5e7eb;
  }

  :global(.dark) .markdown-content :global(.katex .mord) {
    color: #e5e7eb;
  }

  :global(.dark) .markdown-content :global(.katex .mop) {
    color: #60a5fa;
  }

  :global(.dark) .markdown-content :global(.katex .mbin) {
    color: #fbbf24;
  }

  :global(.dark) .markdown-content :global(.katex .mrel) {
    color: #34d399;
  }

  :global(.dark) .markdown-content :global(.katex .mpunct) {
    color: #9ca3af;
  }

  /* Container elements */
  .markdown-content :global(.info) {
    background-color: #dbeafe;
    border: 1px solid #93c5fd;
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
  }

  :global(.dark) .markdown-content :global(.info) {
    background-color: #1e3a8a;
    border-color: #3b82f6;
    color: #dbeafe;
  }

  /* Horizontal rules */
  .markdown-content :global(hr) {
    border: none;
    border-top: 2px solid #e5e7eb;
    margin: 2rem 0;
  }

  :global(.dark) .markdown-content :global(hr) {
    border-top-color: #4b5563;
  }
  
  /* Loading and error states */
  .loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 0;
    color: #6b7280;
  }

  :global(.dark) .loading-indicator {
    color: #9ca3af;
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

  :global(.dark) .spinner {
    border-color: rgba(255, 255, 255, 0.1);
    border-top-color: #60a5fa;
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

  :global(.dark) .error-message {
    background-color: #7f1d1d;
    border-color: #dc2626;
    color: #fecaca;
  }
</style>