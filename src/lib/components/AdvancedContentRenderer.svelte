<script lang="ts">
  import { onMount } from 'svelte';
  import DOMPurify from 'dompurify';
  import marked from 'marked';
  import hljs from 'highlight.js';
  import katex from 'katex';
  import 'katex/dist/katex.min.css';
  import 'highlight.js/styles/github-dark.css';

  export let content: string = '';
  export let type: 'markdown' | 'exercise' | 'math' | 'auto' = 'auto';
  
  let rendered = '';
  let containerEl: HTMLElement;

  onMount(() => {
    configureParsers();
    render();
    
    return () => {
      // Cleanup if needed
    };
  });

  $: if (content) {
    if (containerEl) render();
  }

  function configureParsers() {
    // Configure marked for markdown parsing
    marked.setOptions({
      highlight: (code: string, lang: string): string => {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      },
      breaks: true,
      gfm: true
    });

    // Configure DOMPurify for HTML sanitization
    DOMPurify.addHook('afterSanitizeAttributes', function(node) {
      if (node.tagName === 'A' && node.getAttribute('href')) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  function render() {
    // Determine content type if set to auto
    const contentType = type === 'auto' ? detectContentType(content) : type;
    
    // Process based on content type
    if (contentType === 'math') {
      rendered = processMathContent(content);
    } else if (contentType === 'exercise') {
      rendered = processExerciseContent(content);
    } else {
      rendered = processMarkdown(content);
    }
    
    // Set the rendered HTML
    containerEl.innerHTML = DOMPurify.sanitize(rendered);
    
    // Process math expressions after rendering
    renderMathExpressions();
  }

  function detectContentType(text: string): 'markdown' | 'exercise' | 'math' {
    if (text.includes('$$') || text.includes('\\begin{') || text.match(/\$[^$]+\$/)) {
      return 'math';
    }
    
    if (text.match(/^##\s+(Problem|Exercise|Solution)/mi)) {
      return 'exercise';
    }
    
    return 'markdown';
  }

  function processMarkdown(text: string): string {
    // Basic markdown processing
    return marked.parse(text);
  }

  function processMathContent(text: string): string {
    // Mark math expressions for later processing
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, '<div class="katex-block">$$$1$$</div>');
    text = text.replace(/\$([^\$]+?)\$/g, '<span class="katex-inline">$1</span>');
    
    return marked.parse(text);
  }

  function processExerciseContent(text: string): string {
    // Add any special processing for exercise content
    return marked.parse(text);
  }

  function renderMathExpressions() {
    if (!containerEl) return;
    
    // Process block math expressions
    const blockMath = containerEl.querySelectorAll('.katex-block');
    blockMath.forEach((element) => {
      try {
        const tex = element.textContent?.replace(/\$\$([\s\S]*)\$\$/, '$1') || '';
        katex.render(tex, element as HTMLElement, { 
          displayMode: true,
          throwOnError: false 
        });
      } catch (e) {
        console.error('KaTeX error:', e);
      }
    });
    
    // Process inline math expressions
    const inlineMath = containerEl.querySelectorAll('.katex-inline');
    inlineMath.forEach((element) => {
      try {
        const tex = element.textContent || '';
        katex.render(tex, element as HTMLElement, { 
          displayMode: false,
          throwOnError: false 
        });
      } catch (e) {
        console.error('KaTeX error:', e);
      }
    });
  }
</script>

<div bind:this={containerEl} class="markdown-body"></div>

<style>
  .markdown-body {
    width: 100%;
  }
  
  :global(.markdown-body h1) {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
  
  :global(.markdown-body h2) {
    font-size: 1.5rem;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  :global(.markdown-body h3) {
    font-size: 1.25rem;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
  }
  
  :global(.markdown-body pre) {
    padding: 1rem;
    border-radius: 0.375rem;
    overflow-x: auto;
  }
  
  :global(.markdown-body code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 0.875em;
  }
  
  :global(.markdown-body p) {
    margin-bottom: 1rem;
  }
  
  :global(.markdown-body a) {
    color: #f43f5e;
    text-decoration: underline;
  }
  
  :global(.markdown-body a:hover) {
    text-decoration: none;
  }
  
  :global(.markdown-body blockquote) {
    border-left: 4px solid #f43f5e;
    padding-left: 1rem;
    margin-left: 0;
    color: rgba(107, 114, 128, 1);
  }
  
  :global(.katex-display) {
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.5rem 0;
  }
</style>
