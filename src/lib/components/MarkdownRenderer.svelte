<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { marked } from 'marked';
  import { browser } from '$app/environment';
  
  // Props
  export let content: string = '';
  export let className: string = '';
  
  // Local state
  let renderedContent: string = '';
  let markdownContainer: HTMLElement;
  
  // Initialize highlightjs for code highlighting
  async function initHighlightJS() {
    if (!browser) return;
    
    try {
      // Dynamically load highlight.js and a theme
      const hljs = await import('https://cdn.skypack.dev/highlight.js/lib/core');
      
      // Import common languages
      const languages = [
        'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 
        'ruby', 'go', 'rust', 'bash', 'json', 'html', 'css', 'markdown'
      ];
      
      for (const lang of languages) {
        try {
          const module = await import(`https://cdn.skypack.dev/highlight.js/lib/languages/${lang}`);
          hljs.default.registerLanguage(lang, module.default);
        } catch (e) {
          console.warn(`Failed to load highlight.js language: ${lang}`, e);
        }
      }
      
      // Apply highlighting to all code blocks
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.default.highlightElement(block as HTMLElement);
      });
      
      // Add the highlight.js stylesheet
      if (!document.getElementById('highlightjs-theme')) {
        const link = document.createElement('link');
        link.id = 'highlightjs-theme';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/highlight.js@11.7.0/styles/github-dark.css';
        document.head.appendChild(link);
      }
    } catch (e) {
      console.error('Failed to initialize syntax highlighting', e);
    }
  }
  
  // Process markdown content
  function processMarkdown() {
    if (!content) {
      renderedContent = '';
      return;
    }
    
    try {
      // Configure marked options
      marked.setOptions({
        gfm: true, // GitHub Flavored Markdown
        breaks: true, // Convert \n to <br>
        smartLists: true,
        smartypants: true, // Better typography
        highlight: function(code, lang) {
          // This will be further processed by highlight.js after rendering
          return code;
        }
      });
      
      renderedContent = marked(content);
    } catch (e) {
      console.error('Error rendering markdown:', e);
      renderedContent = `<p class="text-red-500">Error rendering markdown content</p>`;
    }
  }
  
  // Process on mount and when content changes
  $: if (browser && content) {
    processMarkdown();
  }
  
  // Apply syntax highlighting after content renders
  afterUpdate(() => {
    if (browser && markdownContainer) {
      initHighlightJS();
      enhanceContent();
    }
  });
  
  // Handle additional content enhancements
  function enhanceContent() {
    if (!markdownContainer) return;
    
    // Make external links open in new tabs
    markdownContainer.querySelectorAll('a').forEach(link => {
      if (link.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
    
    // Add responsive classes to images
    markdownContainer.querySelectorAll('img').forEach(img => {
      img.classList.add('max-w-full', 'h-auto', 'rounded-lg', 'my-4');
    });
    
    // Add click-to-copy for code blocks
    markdownContainer.querySelectorAll('pre').forEach(pre => {
      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'absolute top-2 right-2 p-1 rounded bg-gray-700 text-gray-200 text-xs hover:bg-gray-600 focus:outline-none transition-colors';
      copyButton.innerHTML = '<i class="fas fa-copy"></i>';
      copyButton.addEventListener('click', () => {
        const code = pre.querySelector('code')?.innerText || '';
        navigator.clipboard.writeText(code).then(() => {
          copyButton.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => {
            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
          }, 2000);
        });
      });
      
      // Position the pre relatively if not already
      if (pre.style.position !== 'relative') {
        pre.style.position = 'relative';
      }
      
      pre.appendChild(copyButton);
    });
  }
</script>

<div 
  bind:this={markdownContainer}
  class="markdown-content prose prose-lg dark:prose-invert max-w-none {className}"
>
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