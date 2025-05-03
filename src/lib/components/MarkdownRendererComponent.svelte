<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import DOMPurify from 'dompurify';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';
  import { browser } from '$app/environment';
  import { renderMarkdown } from '$lib/utils/markdown';

  export let content: string = '';
  
  let htmlContent: string = '';
  let markdownContainer: HTMLDivElement;
  
  // Process content into HTML with sanitization
  function updateContent() {
    if (!content) {
      htmlContent = '';
      return;
    }
    
    try {
      // Use our updated renderMarkdown function that uses markdown-it
      htmlContent = renderMarkdown(content);
      
      // Additional client-side sanitization for SSR content
      if (browser && DOMPurify && typeof htmlContent === 'string') {
        htmlContent = DOMPurify.sanitize(htmlContent, {
          USE_PROFILES: { html: true },
          ADD_ATTR: ['target', 'rel'],
          ADD_TAGS: ['math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'sub', 'sup']
        });
      }
    } catch (error) {
      console.error('Error rendering markdown:', error);
      htmlContent = `<p>Error rendering content</p>`;
    }
  }
  
  // Watch content for changes and rerender
  $: if (content) {
    updateContent();
  }
  
  onMount(() => {
    updateContent();
    
    if (browser && markdownContainer) {
      applyHighlighting();
    }
  });
  
  afterUpdate(() => {
    if (browser && markdownContainer) {
      applyHighlighting();
    }
  });
  
  // Apply syntax highlighting to code blocks
  function applyHighlighting() {
    if (!markdownContainer) return;
    
    const codeBlocks = markdownContainer.querySelectorAll('pre code:not(.hljs)');
    codeBlocks.forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }
</script>

<div class="markdown-content" bind:this={markdownContainer}>
  {#if browser || htmlContent}
    {@html htmlContent}
  {:else}
    <div class="loading">Loading content...</div>
  {/if}
</div>

<style>
  .loading {
    padding: 1rem;
    color: #6b7280;
    font-style: italic;
  }

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
  
  /* Custom styles for markdown-it containers */
  .markdown-content :global(.info),
  .markdown-content :global(.warning),
  .markdown-content :global(.danger) {
    padding: 1em;
    margin-bottom: 1em;
    border-radius: 0.375rem;
  }
  
  .markdown-content :global(.info) {
    background-color: #eff6ff;
    border-left: 4px solid #3b82f6;
  }
  
  .markdown-content :global(.warning) {
    background-color: #fffbeb;
    border-left: 4px solid #f59e0b;
  }
  
  .markdown-content :global(.danger) {
    background-color: #fee2e2;
    border-left: 4px solid #ef4444;
  }
  
  /* KaTeX math rendering styles */
  .markdown-content :global(.katex-display) {
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.5em 0;
  }
</style>