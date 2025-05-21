<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import DOMPurify from 'dompurify';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';
  import { browser } from '$app/environment';
  import { renderMarkdown } from '$lib/utils/markdown';

  export let content: string = '';
  export let htmlContent: string = '';
  
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

<div class="markdown-render-content" bind:this={markdownContainer}>
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

  .markdown-render-content :global(h1),
  .markdown-render-content :global(h2),
  .markdown-render-content :global(h3),
  .markdown-render-content :global(h4),
  .markdown-render-content :global(h5),
  .markdown-render-content :global(h6) {
    margin-top: 1.5em;
    margin-bottom: 0.75em;
    line-height: 1.3;
    font-weight: 600;
    color: #222; /* Darker headings */
  }
  .markdown-render-content :global(h1) { font-size: 2.2em; }
  .markdown-render-content :global(h2) { font-size: 1.8em; }
  .markdown-render-content :global(h3) { font-size: 1.5em; }

  .markdown-render-content :global(p),
  .markdown-render-content :global(li),
  .markdown-render-content :global(td),
  .markdown-render-content :global(th) {
    margin-bottom: 1.2em;
    line-height: 1.7;
    color: #333; /* Darker paragraph and list text */
  }
  .markdown-render-content :global(ul),
  .markdown-render-content :global(ol) {
    margin-bottom: 1.2em;
    padding-left: 2em;
  }
  .markdown-render-content :global(li) {
    margin-bottom: 0.4em;
  }
  .markdown-render-content :global(blockquote) {
    margin-left: 0;
    margin-right: 0;
    padding: 0.8em 1.5em;
    border-left: 5px solid #007bff;
    background-color: #f1f3f5; /* Slightly darker than article bg for blockquotes */
    color: #454545; /* Ensure text inside blockquote is readable */
    margin-bottom: 1.2em;
  }
  .markdown-render-content :global(code):not(pre > code) {
    background-color: #e9ecef;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
    color: #c2185b; /* More vibrant and readable inline code color */
  }
  .markdown-render-content :global(pre) {
    background-color: #282c34; /* Dark background for code blocks */
    color: #c5c8c6; /* Lighter gray text for code blocks for better contrast */
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
    margin-bottom: 1.2em;
    font-size: 0.9em;
    line-height: 1.5;
  }
  .markdown-render-content :global(pre code) {
    background-color: transparent;
    padding: 0;
    color: inherit; /* Inherit color from pre */
  }
  .markdown-render-content :global(a) {
    color: #0056b3; /* Darker blue for links for better contrast */
    text-decoration: none;
  }
  .markdown-render-content :global(a:hover) {
    text-decoration: underline;
    color: #003d80; /* Even darker on hover */
  }
  .markdown-render-content :global(table) {
    width: 100%;
    margin-bottom: 1.2em;
    border-collapse: collapse;
  }
  .markdown-render-content :global(th),
  .markdown-render-content :global(td) {
    border: 1px solid #d1d5da; /* Slightly darker border for tables */
    padding: 0.75em;
    text-align: left;
  }
  .markdown-render-content :global(th) {
    background-color: #f6f8fa; /* Lighter header for tables */
    font-weight: 600;
    color: #24292e; /* Darker text for table headers */
  }
  .markdown-render-content :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }
  .markdown-render-content :global(hr) {
    border: 0;
    border-top: 1px solid #dee2e6;
    margin: 2em 0;
  }
</style>