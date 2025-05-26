<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { browser } from '$app/environment';
  import { renderMarkdown } from '$lib/utils/markdown';
  import { fade, slide } from 'svelte/transition';
  import katex from 'katex';
  import 'katex/dist/katex.min.css';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';

  export let content: string = '';
  export let type: 'markdown' | 'exercise' | 'math' | 'course' | 'auto' = 'auto';
  export let className: string = '';
  export let showToc: boolean = false;
  export let enableCopy: boolean = true;
  export let enableSearch: boolean = false;
  export let maxWidth: string = '';

  let containerEl: HTMLDivElement;
  let htmlContent: string = '';
  let isLoading = false;
  let hasError = false;
  let errorMessage = '';
  let searchTerm = '';
  let tocItems: Array<{id: string, text: string, level: number}> = [];
  let contentType = type;

  // Auto-detect content type
  $: if (type === 'auto') {
    contentType = detectContentType(content);
  } else {
    contentType = type;
  }

  // Process content when it changes
  $: if (content) {
    processContent();
  }

  onMount(() => {
    if (browser) {
      processContent();
    }
  });

  afterUpdate(() => {
    if (browser && containerEl) {
      enhanceContent();
    }
  });

  function detectContentType(text: string): 'markdown' | 'exercise' | 'math' | 'course' {
    if (!text) return 'markdown';
    
    // Check for math-heavy content
    const mathIndicators = [
      /\$\$[\s\S]*?\$\$/g,
      /\$[^$\n]+\$/g,
      /\\begin\{[^}]+\}/g,
      /\\frac\{/g,
      /\\sum[\s_^]/g,
      /\\int[\s_^]/g,
      /\\mathbb\{/g,
      /\\operatorname\{/g
    ];
    
    const mathMatches = mathIndicators.reduce((count, pattern) => {
      return count + (text.match(pattern) || []).length;
    }, 0);
    
    if (mathMatches > 2) return 'math';
    
    // Check for exercise patterns
    if (text.match(/^##\s+(Problem|Exercise|Solution|Exercice|Question)/mi) ||
        text.includes('```exercise') ||
        text.includes(':::solution') ||
        text.includes(':::hint')) {
      return 'exercise';
    }
    
    // Check for course patterns
    if (text.includes('## Learning Objectives') ||
        text.includes('## Prerequisites') ||
        text.includes(':::info') ||
        text.includes(':::warning')) {
      return 'course';
    }
    
    return 'markdown';
  }

  function processContent() {
    if (!content) {
      htmlContent = '';
      return;
    }

    isLoading = true;
    hasError = false;

    try {
      // Pre-process content based on type
      let processedContent = content;
      
      if (contentType === 'exercise') {
        processedContent = processExerciseContent(content);
      } else if (contentType === 'math') {
        processedContent = processMathContent(content);
      } else if (contentType === 'course') {
        processedContent = processCourseContent(content);
      }

      // Render markdown
      htmlContent = renderMarkdown(processedContent);
      
      // Extract TOC if needed
      if (showToc) {
        extractToc();
      }

    } catch (error) {
      hasError = true;
      errorMessage = error instanceof Error ? error.message : 'Failed to render content';
      console.error('Markdown rendering error:', error);
    } finally {
      isLoading = false;
    }
  }

  function processExerciseContent(text: string): string {
    let processed = text;
    
    // Enhanced exercise containers
    processed = processed.replace(/```exercise\s*([\s\S]*?)```/g, (match, content) => {
      return `\n::: exercise
${content.trim()}
:::\n`;
    });
    
    processed = processed.replace(/```solution\s*([\s\S]*?)```/g, (match, content) => {
      return `\n::: solution
${content.trim()}
:::\n`;
    });
    
    processed = processed.replace(/```hint\s*([\s\S]*?)```/g, (match, content) => {
      return `\n::: hint
${content.trim()}
:::\n`;
    });
    
    // Add exercise numbering
    let exerciseCounter = 0;
    processed = processed.replace(/^##\s+(Exercise|Exercice|Problem)\s*(.*)/gmi, (match, type, title) => {
      exerciseCounter++;
      return `## ${type} ${exerciseCounter}${title ? ': ' + title : ''}`;
    });
    
    return processed;
  }

  function processMathContent(text: string): string {
    let processed = text;
    
    // Enhance math expressions with proper spacing
    processed = processed.replace(/\$\$([^$]+)\$\$/g, (match, math) => {
      return `\n$$${math.trim()}$$\n`;
    });
    
    // Add theorem environments
    processed = processed.replace(/:::theorem\s*(.*?)\s*\n([\s\S]*?):::/g, (match, title, content) => {
      return `\n::: theorem
**Theorem${title ? ': ' + title : ''}**

${content.trim()}
:::\n`;
    });
    
    processed = processed.replace(/:::definition\s*(.*?)\s*\n([\s\S]*?):::/g, (match, title, content) => {
      return `\n::: definition
**Definition${title ? ': ' + title : ''}**

${content.trim()}
:::\n`;
    });
    
    return processed;
  }

  function processCourseContent(text: string): string {
    let processed = text;
    
    // Add progress indicators
    processed = processed.replace(/^- \[ \]\s*(.*)/gm, '<div class="progress-item incomplete">$1</div>');
    processed = processed.replace(/^- \[x\]\s*(.*)/gm, '<div class="progress-item complete">$1</div>');
    
    return processed;
  }

  function extractToc() {
    const headings = htmlContent.match(/<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/g) || [];
    tocItems = headings.map(heading => {
      const match = heading.match(/<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/);
      if (match) {
        return {
          level: parseInt(match[1]),
          id: match[2],
          text: match[3].replace(/<[^>]*>/g, '') // Strip HTML tags
        };
      }
      return null;
    }).filter(Boolean) as Array<{id: string, text: string, level: number}>;
  }

  function enhanceContent() {
    if (!containerEl) return;

    // Enhanced code block interactions
    enhanceCodeBlocks();
    
    // Enhanced math rendering
    enhanceMathRendering();
    
    // Add copy buttons
    if (enableCopy) {
      addCopyButtons();
    }
    
    // Apply search highlighting
    if (searchTerm) {
      highlightSearchTerm();
    }
  }

  function enhanceCodeBlocks() {
    const codeBlocks = containerEl.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
      // Re-apply syntax highlighting if not already applied
      if (!block.classList.contains('hljs')) {
        hljs.highlightElement(block as HTMLElement);
      }
      
      // Add language label
      const lang = Array.from(block.classList).find(cls => cls.startsWith('language-'));
      if (lang) {
        const langName = lang.replace('language-', '');
        const pre = block.parentElement;
        if (pre && !pre.querySelector('.code-lang-label')) {
          const label = document.createElement('div');
          label.className = 'code-lang-label';
          label.textContent = langName;
          pre.appendChild(label);
        }
      }
    });
  }

  function enhanceMathRendering() {
    const mathElements = containerEl.querySelectorAll('.katex-display, .katex');
    mathElements.forEach(element => {
      // Add hover effects and interaction
      element.addEventListener('click', () => {
        element.classList.toggle('math-expanded');
      });
    });
  }

  function addCopyButtons() {
    const codeBlocks = containerEl.querySelectorAll('pre');
    codeBlocks.forEach(pre => {
      if (!pre.querySelector('.copy-button')) {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
          </svg>
        `;
        button.title = 'Copy code';
        
        button.onclick = async () => {
          const code = pre.querySelector('code')?.textContent || '';
          try {
            await navigator.clipboard.writeText(code);
            button.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
              </svg>
            `;
            setTimeout(() => {
              button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
                </svg>
              `;
            }, 2000);
          } catch (err) {
            console.error('Failed to copy code:', err);
          }
        };
        
        pre.appendChild(button);
      }
    });
  }

  function highlightSearchTerm() {
    if (!searchTerm || !containerEl) return;
    
    const walker = document.createTreeWalker(
      containerEl,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
      const parent = textNode.parentNode as HTMLElement;
      if (parent && !parent.closest('.copy-button, .code-lang-label')) {
        const text = textNode.textContent || '';
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        if (regex.test(text)) {
          const highlighted = text.replace(regex, '<mark class="search-highlight">$1</mark>');
          const span = document.createElement('span');
          span.innerHTML = highlighted;
          parent.replaceChild(span, textNode);
        }
      }
    });
  }

  function scrollToHeading(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
</script>

<div class="enhanced-markdown-renderer {className}" style={maxWidth ? `max-width: ${maxWidth}` : ''}>
  {#if showToc && tocItems.length > 0}
    <div class="table-of-contents" transition:slide={{ duration: 300 }}>
      <h3>Table of Contents</h3>
      <ul>
        {#each tocItems as item}
          <li class="toc-level-{item.level}">
            <button on:click={() => scrollToHeading(item.id)}>
              {item.text}
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  {#if enableSearch}
    <div class="search-container">
      <input
        type="text"
        placeholder="Search in content..."
        bind:value={searchTerm}
        class="search-input"
      />
    </div>
  {/if}

  <div class="content-wrapper">
    {#if isLoading}
      <div class="loading-container" transition:fade>
        <div class="loading-spinner"></div>
        <p>Rendering content...</p>
      </div>
    {:else if hasError}
      <div class="error-container" transition:fade>
        <div class="error-icon">⚠️</div>
        <h3>Rendering Error</h3>
        <p>{errorMessage}</p>
      </div>
    {:else}
      <div 
        class="markdown-content content-type-{contentType}" 
        bind:this={containerEl}
        transition:fade={{ duration: 400 }}
      >
        {@html htmlContent}
      </div>
    {/if}
  </div>
</div>

<style>
  .enhanced-markdown-renderer {
    width: 100%;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  /* Table of Contents */
  .table-of-contents {
    background-color: rgb(249 250 251);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border: 1px solid rgb(229 231 235);
  }

  :global(.dark) .table-of-contents {
    background-color: rgb(31 41 55);
    border-color: rgb(75 85 99);
  }

  .table-of-contents h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: rgb(17 24 39);
  }

  :global(.dark) .table-of-contents h3 {
    color: rgb(243 244 246);
  }

  .table-of-contents ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .table-of-contents li {
    margin-bottom: 0.25rem;
  }

  .table-of-contents button {
    width: 100%;
    text-align: left;
    padding: 0.5rem;
    border-radius: 0.25rem;
    color: rgb(55 65 81);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }

  :global(.dark) .table-of-contents button {
    color: rgb(209 213 219);
  }

  .table-of-contents button:hover {
    background-color: rgb(243 244 246);
  }

  :global(.dark) .table-of-contents button:hover {
    background-color: rgb(55 65 81);
  }

  .toc-level-1 button { font-weight: 600; }
  .toc-level-2 button { margin-left: 1rem; }
  .toc-level-3 button { margin-left: 2rem; }
  .toc-level-4 button { margin-left: 3rem; }
  .toc-level-5 button { margin-left: 4rem; }
  .toc-level-6 button { margin-left: 5rem; }

  /* Search */
  .search-container {
    margin-bottom: 1rem;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid rgb(209 213 219);
    border-radius: 0.5rem;
    background-color: white;
    color: rgb(17 24 39);
  }

  :global(.dark) .search-input {
    border-color: rgb(75 85 99);
    background-color: rgb(31 41 55);
    color: rgb(243 244 246);
  }

  .search-input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgb(59 130 246);
    border-color: transparent;
  }

  /* Loading and Error States */
  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
  }

  .loading-spinner {
    width: 2rem;
    height: 2rem;
    border: 4px solid rgb(229 231 235);
    border-top-color: rgb(59 130 246);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-icon {
    font-size: 2.25rem;
    margin-bottom: 1rem;
  }

  /* Content Wrapper */
  .content-wrapper {
    position: relative;
  }

  /* Enhanced Markdown Content */
  .markdown-content {
    color: rgb(17 24 39);
    line-height: 1.7;
  }

  :global(.dark) .markdown-content {
    color: rgb(243 244 246);
  }

  /* Typography Enhancements */
  .markdown-content :global(h1),
  .markdown-content :global(h2),
  .markdown-content :global(h3),
  .markdown-content :global(h4),
  .markdown-content :global(h5),
  .markdown-content :global(h6) {
    font-weight: 600;
    color: rgb(17 24 39);
    line-height: 1.25;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  :global(.dark) .markdown-content :global(h1),
  :global(.dark) .markdown-content :global(h2),
  :global(.dark) .markdown-content :global(h3),
  :global(.dark) .markdown-content :global(h4),
  :global(.dark) .markdown-content :global(h5),
  :global(.dark) .markdown-content :global(h6) {
    color: rgb(243 244 246);
  }

  .markdown-content :global(h1) { 
    font-size: 1.875rem; 
    border-bottom: 2px solid rgb(229 231 235); 
    padding-bottom: 0.5rem; 
  }
  
  .markdown-content :global(h2) { 
    font-size: 1.5rem; 
    border-bottom: 1px solid rgb(229 231 235); 
    padding-bottom: 0.25rem; 
  }
  
  .markdown-content :global(h3) { font-size: 1.25rem; }
  .markdown-content :global(h4) { font-size: 1.125rem; }

  :global(.dark) .markdown-content :global(h1),
  :global(.dark) .markdown-content :global(h2) {
    border-bottom-color: rgb(55 65 81);
  }

  .markdown-content :global(p) {
    margin-bottom: 1rem;
  }

  .markdown-content :global(a) {
    color: rgb(37 99 235);
    text-decoration: underline;
    text-decoration-color: rgb(191 219 254);
    transition: all 0.2s ease;
  }

  .markdown-content :global(a:hover) {
    color: rgb(29 78 216);
    text-decoration-color: rgb(147 197 253);
  }

  :global(.dark) .markdown-content :global(a) {
    color: rgb(96 165 250);
    text-decoration-color: rgb(30 64 175);
  }

  :global(.dark) .markdown-content :global(a:hover) {
    color: rgb(147 197 253);
    text-decoration-color: rgb(96 165 250);
  }

  /* Enhanced Code Blocks */
  .markdown-content :global(pre) {
    position: relative;
    background-color: rgb(17 24 39);
    border-radius: 0.5rem;
    overflow: hidden;
    margin-bottom: 1rem;
    border: 1px solid rgb(55 65 81);
  }

  .markdown-content :global(pre code) {
    display: block;
    padding: 1rem;
    font-size: 0.875rem;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    color: rgb(243 244 246);
    background: transparent !important;
  }

  .markdown-content :global(.copy-button) {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.5rem;
    background-color: rgb(55 65 81);
    border-radius: 0.25rem;
    color: rgb(209 213 219);
    border: none;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }

  .markdown-content :global(.copy-button:hover) {
    background-color: rgb(75 85 99);
    color: white;
  }

  .markdown-content :global(.code-lang-label) {
    position: absolute;
    top: 0.5rem;
    left: 1rem;
    font-size: 0.75rem;
    color: rgb(156 163 175);
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    text-transform: uppercase;
  }

  .markdown-content :global(code):not(:global(pre code)) {
    background-color: rgb(243 244 246);
    color: rgb(55 65 81);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  }

  :global(.dark) .markdown-content :global(code):not(:global(pre code)) {
    background-color: rgb(31 41 55);
    color: rgb(229 231 235);
  }

  /* Enhanced Math */
  .markdown-content :global(.katex-display) {
    margin: 1.5rem 0;
    padding: 1rem;
    background-color: rgb(249 250 251);
    border-radius: 0.5rem;
    border: 1px solid rgb(229 231 235);
    overflow-x: auto;
    transition: all 0.3s ease;
  }

  :global(.dark) .markdown-content :global(.katex-display) {
    background-color: rgb(31 41 55);
    border-color: rgb(75 85 99);
  }

  .markdown-content :global(.katex-display.math-expanded) {
    transform: scale(1.1);
    box-shadow: 0 10px 25px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05);
    z-index: 10;
  }

  .markdown-content :global(.katex) {
    font-size: 1.1em;
    color: inherit;
  }

  /* Content Type Specific Styles */
  .content-type-exercise {
    background: linear-gradient(135deg, rgb(239 246 255) 0%, rgb(238 242 255) 100%);
    padding: 1.5rem;
    border-radius: 0.5rem;
  }

  :global(.dark) .content-type-exercise {
    background: linear-gradient(135deg, rgb(17 24 39) 0%, rgb(30 41 59) 100%);
  }

  .content-type-exercise :global(.exercise) {
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    border-left: 4px solid rgb(59 130 246);
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }

  :global(.dark) .content-type-exercise :global(.exercise) {
    background-color: rgb(31 41 55);
  }

  .content-type-exercise :global(.solution) {
    background-color: rgb(240 253 244);
    padding: 1.5rem;
    border-radius: 0.5rem;
    border-left: 4px solid rgb(34 197 94);
    margin-bottom: 1.5rem;
  }

  :global(.dark) .content-type-exercise :global(.solution) {
    background-color: rgb(20 83 45);
  }

  .content-type-exercise :global(.hint) {
    background-color: rgb(254 249 195);
    padding: 1.5rem;
    border-radius: 0.5rem;
    border-left: 4px solid rgb(234 179 8);
    margin-bottom: 1.5rem;
  }

  :global(.dark) .content-type-exercise :global(.hint) {
    background-color: rgb(133 77 14);
  }

  .content-type-math :global(.theorem) {
    background-color: rgb(250 245 255);
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid rgb(196 181 253);
    margin-bottom: 1.5rem;
  }

  :global(.dark) .content-type-math :global(.theorem) {
    background-color: rgb(76 29 149);
    border-color: rgb(124 58 237);
  }

  .content-type-math :global(.definition) {
    background-color: rgb(239 246 255);
    padding: 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid rgb(191 219 254);
    margin-bottom: 1.5rem;
  }

  :global(.dark) .content-type-math :global(.definition) {
    background-color: rgb(30 64 175);
    border-color: rgb(59 130 246);
  }

  .content-type-course :global(.progress-item) {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    border-radius: 0.5rem;
  }

  .content-type-course :global(.progress-item.complete) {
    background-color: rgb(240 253 244);
    color: rgb(22 101 52);
  }

  :global(.dark) .content-type-course :global(.progress-item.complete) {
    background-color: rgb(20 83 45);
    color: rgb(187 247 208);
  }

  .content-type-course :global(.progress-item.incomplete) {
    background-color: rgb(243 244 246);
    color: rgb(75 85 99);
  }

  :global(.dark) .content-type-course :global(.progress-item.incomplete) {
    background-color: rgb(31 41 55);
    color: rgb(156 163 175);
  }

  .content-type-course :global(.progress-item::before) {
    content: "✓";
    margin-right: 0.75rem;
    font-weight: 700;
  }

  .content-type-course :global(.progress-item.incomplete::before) {
    content: "○";
  }

  /* Lists */
  .markdown-content :global(ul),
  .markdown-content :global(ol) {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  .markdown-content :global(li) {
    margin-bottom: 0.5rem;
  }

  /* Tables */
  .markdown-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid rgb(209 213 219);
    border-radius: 0.5rem;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  :global(.dark) .markdown-content :global(table) {
    border-color: rgb(75 85 99);
  }

  .markdown-content :global(th),
  .markdown-content :global(td) {
    border: 1px solid rgb(209 213 219);
    padding: 0.75rem;
  }

  :global(.dark) .markdown-content :global(th),
  :global(.dark) .markdown-content :global(td) {
    border-color: rgb(75 85 99);
  }

  .markdown-content :global(th) {
    background-color: rgb(243 244 246);
    font-weight: 600;
  }

  :global(.dark) .markdown-content :global(th) {
    background-color: rgb(55 65 81);
  }

  .markdown-content :global(tr:nth-child(even)) {
    background-color: rgb(249 250 251);
  }

  :global(.dark) .markdown-content :global(tr:nth-child(even)) {
    background-color: rgb(31 41 55);
  }

  /* Blockquotes */
  .markdown-content :global(blockquote) {
    border-left: 4px solid rgb(209 213 219);
    padding-left: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin: 1rem 0;
    font-style: italic;
    color: rgb(55 65 81);
  }

  :global(.dark) .markdown-content :global(blockquote) {
    border-left-color: rgb(75 85 99);
    color: rgb(209 213 219);
  }

  /* Search Highlighting */
  .markdown-content :global(.search-highlight) {
    background-color: rgb(254 240 138);
    color: rgb(17 24 39);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
  }

  :global(.dark) .markdown-content :global(.search-highlight) {
    background-color: rgb(161 98 7);
    color: rgb(243 244 246);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .enhanced-markdown-renderer {
      font-size: 0.875rem;
    }

    .table-of-contents {
      font-size: 0.875rem;
    }

    .markdown-content :global(h1) { font-size: 1.5rem; }
    .markdown-content :global(h2) { font-size: 1.25rem; }
    .markdown-content :global(h3) { font-size: 1.125rem; }
  }

  /* Accessibility */
  .markdown-content :global(.header-anchor) {
    opacity: 0;
    margin-left: 0.5rem;
    color: rgb(156 163 175);
    transition: opacity 0.2s;
  }

  .markdown-content :global(.header-anchor:hover) {
    color: rgb(75 85 99);
  }

  :global(.dark) .markdown-content :global(.header-anchor:hover) {
    color: rgb(209 213 219);
  }

  .markdown-content :global(h1:hover .header-anchor),
  .markdown-content :global(h2:hover .header-anchor),
  .markdown-content :global(h3:hover .header-anchor),
  .markdown-content :global(h4:hover .header-anchor),
  .markdown-content :global(h5:hover .header-anchor),
  .markdown-content :global(h6:hover .header-anchor) {
    opacity: 1;
  }

  /* Print Styles */
  @media print {
    .table-of-contents,
    .search-container,
    .markdown-content :global(.copy-button),
    .markdown-content :global(.code-lang-label) {
      display: none;
    }
    
    .markdown-content {
      color: black;
    }
  }
</style>
