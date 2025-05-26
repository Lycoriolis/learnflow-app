<!-- 
  @deprecated This component has been superseded by EnhancedMathContent.
  Please migrate to EnhancedMathContent for improved math rendering and error handling.
  This component will be removed in a future version.
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import katex from 'katex';
  import 'katex/dist/katex.min.css';
  import { browser } from '$app/environment';
  import { fade } from 'svelte/transition';

  export let content: string = '';
  export let displayMode: boolean = false;
  export let errorColor: string = '';
  export let fallback: string = '';
  export let className: string = '';

  let element: HTMLElement;
  let isRendered = false;
  let renderError: Error | null = null;
  let isVisible = false;

  onMount(() => {
    if (browser) {
      setTimeout(() => {
        renderMath();
        isVisible = true;
      }, 10); // Small delay to ensure DOM is ready
    }
  });

  // Watch for content changes and re-render
  $: if (browser && content && element) {
    renderMath();
  }

  function renderMath() {
    if (!browser || !element) return;
    
    try {
      katex.render(content, element, {
        displayMode,
        throwOnError: false,
        errorColor: errorColor || '#cc0000',
        trust: true,
        strict: false,
        macros: {
          "\\R": "\\mathbb{R}",
          "\\N": "\\mathbb{N}",
          "\\Z": "\\mathbb{Z}",
          "\\Q": "\\mathbb{Q}",
          "\\C": "\\mathbb{C}"
        }
      });
      isRendered = true;
      renderError = null;
    } catch (e) {
      console.error('KaTeX rendering error:', e);
      renderError = e instanceof Error ? e : new Error('Unknown KaTeX error');
      
      // Fallback to plain text or provided fallback
      if (fallback) {
        element.innerHTML = fallback;
      } else {
        element.textContent = content;
      }
    }
  }
</script>

{#if browser}
  <span 
    bind:this={element} 
    class={`math-content ${displayMode ? 'math-block' : 'math-inline'} ${className}`}
    aria-label={displayMode ? 'Math equation, block display' : 'Math equation, inline display'}
    in:fade={{ duration: 200, delay: 50 }}
  ></span>
{:else}
  <!-- Server-side placeholder -->
  <span class={`math-content ${displayMode ? 'math-block math-placeholder' : 'math-inline math-placeholder'}`}>
    {content}
  </span>
{/if}

<style>
  .math-content {
    font-size: 1.05em;
  }

  .math-block {
    display: block;
    margin: 1.5em 0;
    padding: 0.75em;
    background-color: rgba(245, 247, 250, 0.7);
    border-radius: 0.5rem;
    overflow-x: auto;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .math-inline {
    display: inline-block;
    vertical-align: middle;
    padding: 0 0.2em;
  }
  
  .math-placeholder {
    font-family: monospace;
    color: #666;
    background-color: #f5f5f5;
    padding: 0.25em 0.5em;
    border-radius: 0.25rem;
  }
  
  /* Dark mode styles */
  :global(.dark) .math-block {
    background-color: rgba(30, 41, 59, 0.7);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  :global(.dark) .math-placeholder {
    color: #ccc;
    background-color: #2d3748;
  }
</style>