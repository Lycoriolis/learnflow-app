<script lang="ts">
  import { onMount } from 'svelte';
  import { renderMarkdown } from '$lib/utils/markdown';
  import EnhancedMathContent from './EnhancedMathContent.svelte';

  export let content: string = '';
  export let className: string = '';
  export let enableInteractivity: boolean = true;
  export let enableMathRendering: boolean = true;

  let renderedHtml: string = '';
  let containerElement: HTMLElement;
  let isLoading = true;
  let error: string | null = null;

  // To ensure KaTeX and other dynamic elements are re-rendered if content changes significantly
  // we can add a key to EnhancedMathContent or force re-creation if needed.
  // For now, simple re-rendering of HTML string is often sufficient.

  async function renderContent() {
    if (content === undefined || content === null || !content.trim()) { // Added null/undefined check
      renderedHtml = '';
      isLoading = false;
      return;
    }

    try {
      isLoading = true;
      error = null;
      renderedHtml = renderMarkdown(content);
    } catch (err) {
      console.error('Markdown rendering error:', err);
      error = err instanceof Error ? err.message : 'Unknown rendering error';
      renderedHtml = `<div class="error-message">
        <p><strong>Error rendering markdown:</strong></p>
        <pre>${error}</pre>
      </div>`;
    } finally {
      isLoading = false;
    }
  }

  function setupInteractivity() {
    if (!containerElement || !enableInteractivity) return;

    // Enhanced code block interactions
    const codeBlocks = containerElement.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      const pre = block.parentElement;
      if (!pre) return;

      // Add copy button
      const copyButton = document.createElement('button');
      copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 21H8V7h11M19 5H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2M4 15H2V3a2 2 0 0 1 2-2h11v2H4Z"></path></svg>'; // Icon
      copyButton.className = 'copy-button absolute top-2 right-2 p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500';
      copyButton.title = 'Copy code';

      let timeoutId: number | undefined;
      copyButton.onclick = async () => {
        if (timeoutId) clearTimeout(timeoutId);
        try {
          await navigator.clipboard.writeText(block.textContent || '');
          copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4Z"></path></svg>'; // Checkmark icon
          copyButton.classList.add('copied');
          timeoutId = window.setTimeout(() => {
            copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 21H8V7h11M19 5H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2M4 15H2V3a2 2 0 0 1 2-2h11v2H4Z"></path></svg>';
            copyButton.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          // Optionally indicate error in button
        }
      };

      // Make pre relative for absolute positioning
      if (pre.style.position !== 'relative' && pre.style.position !== 'absolute' && pre.style.position !== 'fixed') {
        pre.style.position = 'relative';
      }
      pre.appendChild(copyButton);
    });

    // External links open in new tab
    const externalLinks = containerElement.querySelectorAll('a[href^="http"]');
    externalLinks.forEach((link) => {
      if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Table wrapper for horizontal scrolling
    const tables = containerElement.querySelectorAll('table');
    tables.forEach((table) => {
      if (table.parentElement && !table.parentElement.classList.contains('table-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper'; // Styles for this are in parent/global CSS
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });

    // Note: Custom container interactivity (collapsible) is removed as these containers are not part of test MDX
    // and specific callout styling is handled by parent.
  }

  // Watch for content changes
  $: if (content !== undefined) { // content can be initially undefined
    renderContent();
  }

  // Setup interactivity after rendering
  $: if (renderedHtml && containerElement && !isLoading) { // Ensure not loading
    setTimeout(setupInteractivity, 0); // setTimeout to allow DOM to update
  }
</script>

<div
  bind:this={containerElement}
  class="enhanced-markdown-renderer {className}"
  class:loading={isLoading}
>
  {#if isLoading}
    <div class="loading-indicator flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
      <svg class="animate-spin -ml-1 mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Rendering content...</span>
    </div>
  {:else if error}
    <div class="error-container bg-red-50 dark:bg-red-800/20 border border-red-200 dark:border-red-700/50 rounded-lg p-4 text-red-700 dark:text-red-300">
      <div class="flex items-center mb-2">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <h3 class="font-medium">Rendering Error</h3>
      </div>
      <p class="text-sm">{error}</p>
    </div>
  {:else}
    <!-- The div below will be styled by Tailwind Prose classes from the parent component -->
    <div class="markdown-content"><!-- Styles applied by parent's prose classes -->
      {#if enableMathRendering}
        <!-- EnhancedMathContent handles KaTeX rendering specifically -->
        <EnhancedMathContent html={renderedHtml} />
      {:else}
        {@html renderedHtml}
      {/if}
    </div>
  {/if}
</div>

<!-- Styles for elements NOT covered by Tailwind Prose or parent's global styles -->
<style lang="postcss">
  .enhanced-markdown-renderer {
    /* Base styling for the renderer container itself, if needed */
  }

  .enhanced-markdown-renderer.loading {
    @apply opacity-70;
  }

  .loading-indicator span {
    @apply text-gray-600 dark:text-gray-400;
  }
  .loading-indicator svg circle, .loading-indicator svg path {
    @apply text-sky-500 dark:text-sky-400;
  }

  .error-container h3 {
    @apply text-red-700 dark:text-red-300;
  }
   .error-container p {
    @apply text-red-600 dark:text-red-400;
  }
  .error-container svg {
    @apply text-red-500 dark:text-red-400;
  }


  /* Copy button styling - specific to this component's interactivity */
  /* These styles are applied via JS, so :global might not be needed if they are specific enough */
  :global(pre > .copy-button) { /* Target copy buttons specifically within pre tags generated by this component */
    @apply absolute top-2 right-2 p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md opacity-0 transition-all duration-200 group-hover:opacity-100;
  }
  :global(pre:hover > .copy-button) { /* Show on pre hover */
     @apply opacity-100;
  }
  :global(pre > .copy-button:hover) {
    @apply bg-gray-300 dark:bg-gray-600;
  }
  :global(pre > .copy-button:focus) {
    @apply outline-none ring-2 ring-gray-400 dark:ring-gray-500;
  }
  :global(pre > .copy-button.copied) {
    @apply bg-green-500 dark:bg-green-600 text-white;
  }
  :global(pre > .copy-button.copied:hover) {
    @apply bg-green-600 dark:bg-green-700;
  }


  /* Styling for table wrapper if not handled by prose */
  /* The parent component's prose styles should handle table wrappers if using Tailwind typography plugin */
  /* If not, or for more specific styling: */
  :global(.table-wrapper) {
    @apply overflow-x-auto my-6 border border-gray-200 dark:border-gray-700 rounded-lg;
  }
  /* Ensure tables within the wrapper don't have conflicting margins from prose */
  :global(.table-wrapper table) {
    @apply my-0;
  }

  /* Task list specific styling if not covered by prose */
  :global(.task-list-item) {
    @apply list-none relative pl-6; /* Tailwind class for list-none */
  }
  :global(.task-list-item input[type="checkbox"]) {
    @apply absolute left-0 top-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600;
  }
  :global(.task-list-item.checked > label) { /* Example if you add a label or style the text */
    @apply line-through text-gray-400 dark:text-gray-500;
  }

  /* KaTeX specific font size adjustment if needed, prose might handle it */
  /* The parent prose styles for .katex might be sufficient */
  /*
  :global(.katex) {
    @apply text-base;
  }
  :global(.katex-display > .katex) {
    @apply text-lg;
  }
  */

  /* Ensure pre tags (code blocks) themselves don't have excessive margin if prose handles it */
  /* This is generally handled well by Tailwind Prose plugin */

</style>