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

  async function renderContent() {
    if (!content.trim()) {
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
      copyButton.innerHTML = '📋';
      copyButton.className = 'copy-button absolute top-2 right-2 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition-colors';
      copyButton.title = 'Copy code';
      copyButton.onclick = async () => {
        try {
          await navigator.clipboard.writeText(block.textContent || '');
          copyButton.innerHTML = '✓';
          copyButton.className = copyButton.className.replace('bg-gray-700', 'bg-green-600');
          setTimeout(() => {
            copyButton.innerHTML = '📋';
            copyButton.className = copyButton.className.replace('bg-green-600', 'bg-gray-700');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      };

      // Make pre relative for absolute positioning
      pre.style.position = 'relative';
      pre.appendChild(copyButton);
    });

    // Enhanced link behavior
    const links = containerElement.querySelectorAll('a[href^="http"]');
    links.forEach((link) => {
      if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Enhanced table functionality
    const tables = containerElement.querySelectorAll('table');
    tables.forEach((table) => {
      // Wrap tables for horizontal scrolling
      if (!table.parentElement?.classList.contains('table-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper overflow-x-auto border rounded-lg';
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });

    // Enhanced container interactions
    const containers = containerElement.querySelectorAll('.custom-container');
    containers.forEach((container) => {
      const title = container.querySelector('.container-title') as HTMLElement;
      const content = container.querySelector('.container-content') as HTMLElement;
      
      if (title && content && container.classList.contains('collapsible')) {
        title.style.cursor = 'pointer';
        title.addEventListener('click', () => {
          const isCollapsed = content.style.display === 'none';
          content.style.display = isCollapsed ? 'block' : 'none';
          const icon = title.querySelector('.collapse-icon');
          if (icon) {
            icon.textContent = isCollapsed ? '▼' : '▶';
          }
        });
      }
    });
  }

  // Watch for content changes
  $: if (content !== undefined) {
    renderContent();
  }

  // Setup interactivity after rendering
  $: if (renderedHtml && containerElement) {
    setTimeout(setupInteractivity, 0);
  }
</script>

<div 
  bind:this={containerElement}
  class="enhanced-markdown-renderer {className}"
  class:loading={isLoading}
>
  {#if isLoading}
    <div class="loading-indicator flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span class="ml-3 text-gray-600">Rendering content...</span>
    </div>
  {:else if error}
    <div class="error-container bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center mb-2">
        <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <h3 class="text-red-800 font-medium">Rendering Error</h3>
      </div>
      <p class="text-red-700 text-sm">{error}</p>
    </div>
  {:else}
    <div class="markdown-content">
      {#if enableMathRendering}
        <EnhancedMathContent html={renderedHtml} />
      {:else}
        {@html renderedHtml}
      {/if}
    </div>
  {/if}
</div>

<style>
  .enhanced-markdown-renderer {
    /* Base styling */
    line-height: 1.6;
    color: #374151;
  }

  .enhanced-markdown-renderer.loading {
    opacity: 0.7;
  }

  /* Enhanced markdown content styling */
  .enhanced-markdown-renderer :global(.markdown-content) {
    max-width: 100%;
  }

  .enhanced-markdown-renderer :global(h1) {
    font-size: 2.25rem;
    font-weight: 700;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #1f2937;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  .enhanced-markdown-renderer :global(h2) {
    font-size: 1.875rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: #1f2937;
  }

  .enhanced-markdown-renderer :global(h3) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
    color: #374151;
  }

  .enhanced-markdown-renderer :global(h4) {
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  .enhanced-markdown-renderer :global(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
  }

  .enhanced-markdown-renderer :global(ul),
  .enhanced-markdown-renderer :global(ol) {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  .enhanced-markdown-renderer :global(li) {
    margin-bottom: 0.25rem;
  }

  .enhanced-markdown-renderer :global(blockquote) {
    border-left: 4px solid #3b82f6;
    padding-left: 1rem;
    margin: 1rem 0;
    font-style: italic;
    background-color: #f8fafc;
    padding: 1rem;
    border-radius: 0.375rem;
  }

  /* Code styling */
  .enhanced-markdown-renderer :global(code) {
    background-color: #f1f5f9;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
    font-size: 0.875rem;
  }

  .enhanced-markdown-renderer :global(pre) {
    background-color: #1e293b;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
    position: relative;
  }

  .enhanced-markdown-renderer :global(pre code) {
    background-color: transparent;
    padding: 0;
    color: inherit;
  }

  /* Enhanced tables */
  .enhanced-markdown-renderer :global(.table-wrapper) {
    margin: 1rem 0;
  }

  .enhanced-markdown-renderer :global(table) {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
  }

  .enhanced-markdown-renderer :global(th),
  .enhanced-markdown-renderer :global(td) {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  .enhanced-markdown-renderer :global(th) {
    background-color: #f9fafb;
    font-weight: 600;
    color: #374151;
  }

  .enhanced-markdown-renderer :global(tr:hover) {
    background-color: #f9fafb;
  }

  /* Enhanced links */
  .enhanced-markdown-renderer :global(a) {
    color: #3b82f6;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all 0.2s ease;
  }

  .enhanced-markdown-renderer :global(a:hover) {
    color: #1d4ed8;
    border-bottom-color: #3b82f6;
  }

  /* Custom containers */
  .enhanced-markdown-renderer :global(.custom-container) {
    margin: 1rem 0;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .enhanced-markdown-renderer :global(.container-title) {
    padding: 0.75rem 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
  }

  .enhanced-markdown-renderer :global(.container-content) {
    padding: 1rem;
  }

  .enhanced-markdown-renderer :global(.container-info) {
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;
  }

  .enhanced-markdown-renderer :global(.container-info .container-title) {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .enhanced-markdown-renderer :global(.container-warning) {
    background-color: #fffbeb;
    border: 1px solid #fed7aa;
  }

  .enhanced-markdown-renderer :global(.container-warning .container-title) {
    background-color: #fef3c7;
    color: #92400e;
  }

  .enhanced-markdown-renderer :global(.container-error) {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
  }

  .enhanced-markdown-renderer :global(.container-error .container-title) {
    background-color: #fee2e2;
    color: #dc2626;
  }

  .enhanced-markdown-renderer :global(.container-success) {
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
  }

  .enhanced-markdown-renderer :global(.container-success .container-title) {
    background-color: #dcfce7;
    color: #166534;
  }

  /* Task lists */
  .enhanced-markdown-renderer :global(.task-list-item) {
    list-style: none;
    position: relative;
    padding-left: 1.5rem;
  }

  .enhanced-markdown-renderer :global(.task-list-item input) {
    position: absolute;
    left: 0;
    top: 0.125rem;
  }

  /* Math content */
  .enhanced-markdown-renderer :global(.katex) {
    font-size: 1.1em;
  }

  .enhanced-markdown-renderer :global(.katex-display) {
    margin: 1rem 0;
    text-align: center;
  }

  /* Copy button styling */
  .enhanced-markdown-renderer :global(.copy-button) {
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .enhanced-markdown-renderer :global(pre:hover .copy-button) {
    opacity: 1;
  }

  /* Loading animation */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-indicator .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .enhanced-markdown-renderer :global(h1) {
      font-size: 1.875rem;
    }

    .enhanced-markdown-renderer :global(h2) {
      font-size: 1.5rem;
    }

    .enhanced-markdown-renderer :global(h3) {
      font-size: 1.25rem;
    }

    .enhanced-markdown-renderer :global(pre) {
      padding: 0.75rem;
      font-size: 0.875rem;
    }
  }
</style>