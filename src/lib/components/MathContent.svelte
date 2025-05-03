<script lang="ts">
  import { onMount } from 'svelte';
  import katex from 'katex';
  import 'katex/dist/katex.min.css';
  import { browser } from '$app/environment';

  export let content: string = '';
  export let displayMode: boolean = false;
  export let errorColor: string = '';
  export let fallback: string = '';

  let element: HTMLElement;
  let isRendered = false;
  let renderError: Error | null = null;

  onMount(() => {
    if (browser) {
      renderMath();
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
        strict: false
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
    class={displayMode ? 'math-block' : 'math-inline'}
    aria-label={displayMode ? 'Math equation, block display' : 'Math equation, inline display'}
  ></span>
{:else}
  <!-- Server-side placeholder -->
  <span class={displayMode ? 'math-block math-placeholder' : 'math-inline math-placeholder'}>
    {content}
  </span>
{/if}

<style>
  .math-block {
    display: block;
    margin: 1em 0;
    text-align: center;
  }

  .math-inline {
    display: inline-block;
    vertical-align: middle;
  }
  
  .math-placeholder {
    font-family: monospace;
    color: #666;
    background-color: #f5f5f5;
    padding: 0.25em 0.5em;
    border-radius: 4px;
  }
</style>