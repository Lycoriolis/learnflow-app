/// <reference lib="dom"></reference>
<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { marked, type MarkedOptions } from 'marked';
  import { browser } from '$app/environment';

  // Static import of highlight.js core and styles
  import hljs from 'highlight.js/lib/core';
  import javascript from 'highlight.js/lib/languages/javascript';
  import typescript from 'highlight.js/lib/languages/typescript';
  import python from 'highlight.js/lib/languages/python';
  import java from 'highlight.js/lib/languages/java';
  import cpp from 'highlight.js/lib/languages/cpp';
  import csharp from 'highlight.js/lib/languages/csharp';
  import ruby from 'highlight.js/lib/languages/ruby';
  import go from 'highlight.js/lib/languages/go';
  import rust from 'highlight.js/lib/languages/rust';
  import bash from 'highlight.js/lib/languages/bash';
  import json from 'highlight.js/lib/languages/json';
  import xml from 'highlight.js/lib/languages/xml';
  import css from 'highlight.js/lib/languages/css';
  import markdown from 'highlight.js/lib/languages/markdown';
  import 'highlight.js/styles/github-dark.css';

  // Register languages once
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('typescript', typescript);
  hljs.registerLanguage('python', python);
  hljs.registerLanguage('java', java);
  hljs.registerLanguage('cpp', cpp);
  hljs.registerLanguage('csharp', csharp);
  hljs.registerLanguage('ruby', ruby);
  hljs.registerLanguage('go', go);
  hljs.registerLanguage('rust', rust);
  hljs.registerLanguage('bash', bash);
  hljs.registerLanguage('json', json);
  hljs.registerLanguage('xml', xml);
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('markdown', markdown);

  // Props
  export let content: string = '';
  export let className: string = '';
  
  // Local state
  let renderedContent: string = '';
  let markdownContainer: HTMLElement;

  function processMarkdown() {
    if (!content) {
      renderedContent = '';
      return;
    }
    try {
      // Removed smartLists and smartypants as they are not in MarkedOptions type
      // Cast the result of marked(content) to string
      marked.setOptions({ gfm: true, breaks: true } as MarkedOptions);
      renderedContent = marked(content) as string;
    } catch (e) {
      console.error('Error rendering markdown:', e);
      renderedContent = `<p class="text-red-500">Error rendering markdown content</p>`;
    }
  }

  $: if (browser) processMarkdown();

  afterUpdate(() => {
    if (browser && markdownContainer) {
      // highlight code blocks
      markdownContainer.querySelectorAll('pre code').forEach((block: Element) => {
        if (block instanceof HTMLElement) {
          hljs.highlightElement(block);
        }
      });
      enhanceContent();
    }
  });

  function enhanceContent() {
    if (!markdownContainer) return;
    // external links
    markdownContainer.querySelectorAll('a').forEach((link: Element) => {
      if (link instanceof HTMLAnchorElement && link.hostname !== window.location.hostname) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    });
    // responsive images
    markdownContainer.querySelectorAll('img').forEach((img: Element) => {
      if (img instanceof HTMLImageElement) {
        img.classList.add('max-w-full', 'h-auto', 'rounded-lg', 'my-4');
      }
    });
    // code copy button
    markdownContainer.querySelectorAll('pre').forEach((pre: Element) => {
      if (pre instanceof HTMLElement && !pre.querySelector('.copy-btn')) {
        const btn = document.createElement('button');
        btn.className = 'copy-btn absolute top-2 right-2 p-1 rounded bg-gray-700 text-gray-200 text-xs hover:bg-gray-600';
        btn.innerHTML = '<i class="fas fa-copy"></i>';
        btn.onclick = () => {
          const code = pre.querySelector('code')?.innerText || '';
          navigator.clipboard.writeText(code).then(() => {
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => btn.innerHTML = '<i class="fas fa-copy"></i>', 2000);
          });
        };
        pre.style.position = 'relative';
        pre.appendChild(btn);
      }
    });
  }
</script>

<div bind:this={markdownContainer} class="markdown-content prose prose-lg dark:prose-invert max-w-none {className}">
  {@html renderedContent}
</div>

<style>
  /* Basic markdown content styling */
  :global(.markdown-content) {
    line-height: 1.6;
  }
  
  :global(.markdown-content h1) {
    font-size: 2rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-weight: 700;
    border-bottom: 1px solid rgba(125, 125, 125, 0.3);
    padding-bottom: 0.5rem;
  }
  
  :global(.markdown-content h2) {
    font-size: 1.5rem;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
  }
  
  :global(.markdown-content h3) {
    font-size: 1.25rem;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  :global(.markdown-content pre) {
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
    position: relative;
  }
  
  :global(.markdown-content code) {
    font-family: 'Fira Code', monospace, Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono';
    font-size: 0.9em;
  }
  
  :global(.markdown-content p code),
  :global(.markdown-content li code) {
    background-color: rgba(125, 125, 125, 0.1);
    padding: 0.1rem 0.3rem;
    border-radius: 0.25rem;
  }
  
  :global(.markdown-content blockquote) {
    border-left: 4px solid #4f46e5;
    padding-left: 1rem;
    margin-left: 0;
    font-style: italic;
    color: rgba(107, 114, 128, 1);
  }
  
  :global(.markdown-content table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
  }
  
  :global(.markdown-content th),
  :global(.markdown-content td) {
    padding: 0.5rem;
    border: 1px solid rgba(125, 125, 125, 0.3);
  }
  
  :global(.markdown-content th) {
    background-color: rgba(125, 125, 125, 0.1);
  }
  
  /* Dark mode adjustments */
  :global(.dark .markdown-content pre) {
    background-color: #1e1e1e !important;
  }
  
  :global(.dark .markdown-content p code),
  :global(.dark .markdown-content li code) {
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
  }
</style>