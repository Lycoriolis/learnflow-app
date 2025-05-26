<!-- 
  @deprecated This component has been superseded by EnhancedMarkdownRenderer and EnhancedMathContent.
  Please migrate to EnhancedMarkdownRenderer for improved markdown rendering with enhanced math support.
  This component will be removed in a future version.
-->

<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import DOMPurify from 'dompurify';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';
  import { browser } from '$app/environment';
  import { renderMarkdown } from '$lib/utils/markdown';
  import { fade } from 'svelte/transition';

  export let content: string = '';
  export let htmlContent: string = '';
  export let className: string = ''; // Allow custom class addition
  
  let markdownContainer: HTMLDivElement;
  let isLoaded = false;
  
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
      htmlContent = `<p class="error-message">Error rendering content</p>`;
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
      isLoaded = true;
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

{#if browser || htmlContent}
  <div 
    class="markdown-render-content {className}" 
    bind:this={markdownContainer}
    in:fade={{ duration: 300, delay: 150 }}
  >
    {@html htmlContent}
  </div>
{:else}
  <div class="loading">Loading content...</div>
{/if}

<style>
  .loading {
    padding: 1rem;
    color: #6b7280;
    font-style: italic;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
  }

  .error-message {
    color: #ef4444;
    padding: 1rem;
    border-left: 4px solid #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
  }

  .markdown-render-content :global(h1),
  .markdown-render-content :global(h2),
  .markdown-render-content :global(h3),
  .markdown-render-content :global(h4),
  .markdown-render-content :global(h5),
  .markdown-render-content :global(h6) {
    margin-top: 2em;
    margin-bottom: 0.75em;
    line-height: 1.2;
    font-weight: 700;
    color: var(--heading-color, #1a202c);
    letter-spacing: -0.025em;
  }
  
  .markdown-render-content :global(h1) { 
    font-size: 2.25em; 
    border-bottom: 1px solid var(--border-color, #e2e8f0);
    padding-bottom: 0.3em;
  }
  .markdown-render-content :global(h2) { 
    font-size: 1.875em; 
    border-bottom: 1px solid var(--border-color, #e2e8f0);
    padding-bottom: 0.2em;
  }
  .markdown-render-content :global(h3) { font-size: 1.5em; }
  .markdown-render-content :global(h4) { font-size: 1.25em; }
  .markdown-render-content :global(h5) { font-size: 1.1em; }
  .markdown-render-content :global(h6) { font-size: 1em; }

  .markdown-render-content :global(p),
  .markdown-render-content :global(li),
  .markdown-render-content :global(td),
  .markdown-render-content :global(th) {
    margin-bottom: 1.2em;
    line-height: 1.7;
    color: var(--text-color, #2d3748);
    font-size: 1.0625rem;
  }
  
  .markdown-render-content :global(ul),
  .markdown-render-content :global(ol) {
    margin-bottom: 1.5em;
    padding-left: 1.5em;
  }
  
  .markdown-render-content :global(li) {
    margin-bottom: 0.5em;
    position: relative;
  }
  
  .markdown-render-content :global(ul li::before) {
    content: "";
    position: absolute;
    left: -1.5em;
    top: 0.75em;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--accent-color, #4f46e5);
  }
  
  .markdown-render-content :global(blockquote) {
    margin: 1.5em 0;
    padding: 1em 1.5em;
    border-left: 4px solid var(--accent-color, #4f46e5);
    background-color: var(--blockquote-bg, #f8fafc);
    border-radius: 0.375rem;
    color: var(--blockquote-color, #4a5568);
    font-style: italic;
  }
  
  .markdown-render-content :global(blockquote p:last-child) {
    margin-bottom: 0;
  }
  
  .markdown-render-content :global(code):not(:global(pre > code)) {
    background-color: var(--inline-code-bg, #edf2f7);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    color: var(--inline-code-color, #d53f8c);
    white-space: nowrap;
  }
  
  .markdown-render-content :global(pre) {
    background-color: var(--code-block-bg, #2d3748);
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5em 0;
    padding: 1em;
    position: relative;
  }

  .markdown-render-content :global(pre::before) {
    content: attr(data-language);
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.25em 0.5em;
    font-size: 0.75em;
    background: rgba(0, 0, 0, 0.3);
    color: #e2e8f0;
    border-bottom-left-radius: 0.25rem;
  }
  
  .markdown-render-content :global(pre code) {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.9em;
    line-height: 1.5;
    display: block;
    padding: 0;
    color: var(--code-text-color, #e2e8f0);
    background-color: transparent;
    white-space: pre;
    overflow-x: auto;
  }
  
  .markdown-render-content :global(a) {
    color: var(--link-color, #4f46e5);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s ease, color 0.2s ease;
  }
  
  .markdown-render-content :global(a:hover) {
    border-bottom-color: currentColor;
    color: var(--link-hover-color, #6366f1);
  }
  
  .markdown-render-content :global(hr) {
    margin: 2em 0;
    border: 0;
    height: 1px;
    background-color: var(--border-color, #e2e8f0);
  }
  
  .markdown-render-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5em 0;
    font-size: 0.95em;
    overflow-x: auto;
    display: block;
  }
  
  .markdown-render-content :global(th), 
  .markdown-render-content :global(td) {
    border: 1px solid var(--table-border, #e2e8f0);
    padding: 0.75em;
  }
  
  .markdown-render-content :global(th) {
    background-color: var(--table-header-bg, #f7fafc);
    font-weight: 600;
    text-align: left;
  }
  
  .markdown-render-content :global(tr:nth-child(even)) {
    background-color: var(--table-alt-row, #f8fafc);
  }
  
  /* Dark theme */
  :global(.dark) .markdown-render-content {
    --heading-color: #e2e8f0;
    --text-color: #e2e8f0;
    --border-color: #4a5568;
    --accent-color: #8b5cf6;
    --blockquote-bg: rgba(74, 85, 104, 0.2);
    --blockquote-color: #cbd5e0;
    --inline-code-bg: rgba(74, 85, 104, 0.4);
    --inline-code-color: #fc8181;
    --code-block-bg: #1a202c;
    --code-text-color: #e2e8f0;
    --link-color: #8b5cf6;
    --link-hover-color: #a78bfa;
    --table-border: #4a5568;
    --table-header-bg: #2d3748;
    --table-alt-row: rgba(74, 85, 104, 0.1);
  }
  
  /* KaTeX styling */
  .markdown-render-content :global(.katex-display) {
    margin: 1.5em 0;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.5em 0;
  }
  
  .markdown-render-content :global(.katex) {
    font-size: 1.1em;
  }
  
  /* Special containers */
  .markdown-render-content :global(.info),
  .markdown-render-content :global(.warning),
  .markdown-render-content :global(.danger) {
    padding: 1.25em;
    margin: 1.5em 0;
    border-radius: 0.5rem;
    position: relative;
    border-left: 4px solid;
  }
  
  .markdown-render-content :global(.info) {
    background-color: rgba(56, 189, 248, 0.1);
    border-color: #38bdf8;
  }
  
  .markdown-render-content :global(.info::before) {
    content: "INFO";
    display: block;
    font-weight: 700;
    margin-bottom: 0.75em;
    color: #0284c7;
  }
  
  .markdown-render-content :global(.warning) {
    background-color: rgba(251, 191, 36, 0.1);
    border-color: #fbbf24;
  }
  
  .markdown-render-content :global(.warning::before) {
    content: "WARNING";
    display: block;
    font-weight: 700;
    margin-bottom: 0.75em;
    color: #d97706;
  }
  
  .markdown-render-content :global(.danger) {
    background-color: rgba(248, 113, 113, 0.1);
    border-color: #f87171;
  }
  
  .markdown-render-content :global(.danger::before) {
    content: "IMPORTANT";
    display: block;
    font-weight: 700;
    margin-bottom: 0.75em;
    color: #dc2626;
  }

  /* Dark theme for containers */
  :global(.dark) .markdown-render-content :global(.info) {
    background-color: rgba(56, 189, 248, 0.05);
  }
  
  :global(.dark) .markdown-render-content :global(.info::before) {
    color: #38bdf8;
  }
  
  :global(.dark) .markdown-render-content :global(.warning) {
    background-color: rgba(251, 191, 36, 0.05);
  }
  
  :global(.dark) .markdown-render-content :global(.warning::before) {
    color: #fbbf24;
  }
  
  :global(.dark) .markdown-render-content :global(.danger) {
    background-color: rgba(248, 113, 113, 0.05);
  }
  
  :global(.dark) .markdown-render-content :global(.danger::before) {
    color: #f87171;
  }
</style>