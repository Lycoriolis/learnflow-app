<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import katex from 'katex';

  export let html: string = '';
  
  let containerElement: HTMLElement;
  let mathElements: Array<{ element: HTMLElement; tex: string; displayMode: boolean }> = [];
  let isProcessing = false;
  let processedHtml = '';
  let error: string | null = null;

  const htmlEntityMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' '
  };

  function decodeHtmlEntities(value: string) {
    return value.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (match) => htmlEntityMap[match] ?? match);
  }

  function sanitizeTexContent(tex: string, preserveLineBreaks = false) {
    if (!tex) return '';

    let normalized = tex
      .replace(/<\/?p[^>]*>/gi, preserveLineBreaks ? '\n' : ' ')
      .replace(/<\/?div[^>]*>/gi, ' ')
      .replace(/<\/?span[^>]*>/gi, ' ')
      .replace(/<br\s*\/?\s*>/gi, preserveLineBreaks ? '\n' : ' ');

    if (preserveLineBreaks) {
      normalized = normalized
        .replace(/\r?\n\s*/g, '\n')
        .replace(/\n{3,}/g, '\n\n');
    } else {
      normalized = normalized.replace(/\s+/g, ' ');
    }

    normalized = decodeHtmlEntities(normalized);

    if (preserveLineBreaks) {
      return normalized.trim();
    }

    return normalized.trim();
  }

  // Enhanced math processing with better error handling
  async function processMathContent() {
    if (!html || isProcessing) return;
    
    try {
      isProcessing = true;
      error = null;
      
      // Start with the original HTML
      let workingHtml = html;
      mathElements = [];
      
      // Process display math ($$...$$)
      workingHtml = workingHtml.replace(/\$\$([\s\S]*?)\$\$/g, (match, tex) => {
        const cleanTex = sanitizeTexContent(tex, true);
        if (!cleanTex) return match;
        
        try {
          const rendered = katex.renderToString(cleanTex, {
            displayMode: true,
            throwOnError: false,
            errorColor: '#cc0000',
            strict: false,
            trust: true,
            fleqn: false,
            leqno: false,
            macros: {
              "\\f": "#1f(#2)",
              "\\RR": "\\mathbb{R}",
              "\\ZZ": "\\mathbb{Z}",
              "\\QQ": "\\mathbb{Q}",
              "\\CC": "\\mathbb{C}",
              "\\NN": "\\mathbb{N}",
              "\\vec": "\\overrightarrow{#1}",
              "\\norm": "\\left\\|#1\\right\\|",
              "\\abs": "\\left|#1\\right|"
            }
          });
          return `<div class="math-display">${rendered}</div>`;
        } catch (err) {
          console.warn('Display math rendering error:', err);
          return `<div class="math-error">Error rendering: ${cleanTex}</div>`;
        }
      });
      
      // Process inline math ($...$)
      workingHtml = workingHtml.replace(/\$([^$\n]+?)\$/g, (match, tex) => {
        const cleanTex = sanitizeTexContent(tex);
        if (!cleanTex) return match;
        
        try {
          const rendered = katex.renderToString(cleanTex, {
            displayMode: false,
            throwOnError: false,
            errorColor: '#cc0000',
            strict: false,
            trust: true,
            macros: {
              "\\f": "#1f(#2)",
              "\\RR": "\\mathbb{R}",
              "\\ZZ": "\\mathbb{Z}",
              "\\QQ": "\\mathbb{Q}",
              "\\CC": "\\mathbb{C}",
              "\\NN": "\\mathbb{N}",
              "\\vec": "\\overrightarrow{#1}",
              "\\norm": "\\left\\|#1\\right\\|",
              "\\abs": "\\left|#1\\right|"
            }
          });
          return `<span class="math-inline">${rendered}</span>`;
        } catch (err) {
          console.warn('Inline math rendering error:', err);
          return `<span class="math-error">Error: ${cleanTex}</span>`;
        }
      });
      
      // Remove empty paragraphs and unwrap block math injected inside paragraph tags
      workingHtml = workingHtml
        .replace(/<p>(\s*<div class="math-display">[\s\S]*?<\/div>)\s*<\/p>/g, '$1')
        .replace(/<p>(?:\s|<br\s*\/?\s*>)*<\/p>/g, '');

      processedHtml = workingHtml;
    } catch (err) {
      console.error('Math processing error:', err);
      error = err instanceof Error ? err.message : 'Unknown math processing error';
      processedHtml = html; // Fallback to original HTML
    } finally {
      isProcessing = false;
    }
  }

  function enhanceMathInteractivity() {
    if (!containerElement) return;

    // Add hover effects and copy functionality to math elements
    const mathElements = containerElement.querySelectorAll('.katex');
    mathElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const isInline = Boolean(htmlElement.closest('.math-inline'));
      
      // Add copy functionality
      htmlElement.addEventListener('click', async (e) => {
        e.preventDefault();
        const annotation = element.querySelector('annotation[encoding="application/x-tex"]');
        if (annotation && annotation.textContent) {
          try {
            await navigator.clipboard.writeText(annotation.textContent);
            
            // Visual feedback
            const originalOpacity = htmlElement.style.opacity;
            htmlElement.style.opacity = '0.5';
            setTimeout(() => {
              htmlElement.style.opacity = originalOpacity;
            }, 200);
            
            // Show tooltip
            showTooltip(htmlElement, 'LaTeX copied!');
          } catch (err) {
            console.error('Failed to copy LaTeX:', err);
            showTooltip(htmlElement, 'Copy failed');
          }
        }
      });

      // Add hover effect
      htmlElement.addEventListener('mouseenter', () => {
        htmlElement.style.cursor = 'pointer';
        htmlElement.style.transition = 'all 0.2s ease';
        if (!isInline) {
          htmlElement.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
          htmlElement.style.borderRadius = '4px';
        }
      });

      htmlElement.addEventListener('mouseleave', () => {
        if (!isInline) {
          htmlElement.style.backgroundColor = 'transparent';
        }
      });
    });

    // Remove stray block elements that KaTeX may emit inside the hidden HTML span
    const katexHtmlFragments = containerElement.querySelectorAll('.katex-html');
    katexHtmlFragments.forEach((fragment) => {
      const breakRuns = fragment.querySelectorAll('p, br');
      breakRuns.forEach((node) => {
        if (node.nodeName === 'BR') {
          node.remove();
          return;
        }
        if (node instanceof HTMLParagraphElement) {
          const isEmpty = !node.textContent?.trim() && node.children.length === 0;
          if (isEmpty) {
            node.remove();
            return;
          }
        }
      });

      const paragraphs = fragment.querySelectorAll('p');
      paragraphs.forEach((paragraph) => {
        const replacement = document.createDocumentFragment();
        while (paragraph.firstChild) {
          replacement.appendChild(paragraph.firstChild);
        }
        paragraph.replaceWith(replacement);
      });
      fragment.normalize();
    });

    // Handle display math centering and spacing
    const displayMath = containerElement.querySelectorAll('.math-display');
    displayMath.forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.margin = '1.5rem 0';
      htmlElement.style.textAlign = 'center';
      htmlElement.style.overflow = 'auto';
    });

    // Handle inline math alignment
    const inlineMath = containerElement.querySelectorAll('.math-inline');
    inlineMath.forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.verticalAlign = 'baseline';
      htmlElement.style.margin = '0 0.1rem';
    });
  }

  function showTooltip(element: HTMLElement, message: string) {
    const tooltip = document.createElement('div');
    tooltip.textContent = message;
    tooltip.className = 'math-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#1f2937';
    tooltip.style.color = 'white';
    tooltip.style.padding = '0.5rem';
    tooltip.style.borderRadius = '0.25rem';
    tooltip.style.fontSize = '0.875rem';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.whiteSpace = 'nowrap';
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.bottom + 5}px`;
    tooltip.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(tooltip);
    
    setTimeout(() => {
      tooltip.remove();
    }, 2000);
  }

  // Process math when HTML changes
  $: if (html) {
    processMathContent();
  }

  // Enhance interactivity after rendering
  afterUpdate(() => {
    if (processedHtml && containerElement) {
      setTimeout(enhanceMathInteractivity, 0);
    }
  });
</script>

<div bind:this={containerElement} class="enhanced-math-content">
  {#if isProcessing}
    <div class="math-loading flex items-center justify-center p-4">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
      <span class="ml-2 text-gray-600 text-sm">Processing math...</span>
    </div>
  {:else if error}
    <div class="math-error-container bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center mb-2">
        <svg class="w-4 h-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <h4 class="text-red-800 font-medium text-sm">Math Processing Error</h4>
      </div>
      <p class="text-red-700 text-xs">{error}</p>
      <div class="mt-2">
        {@html html}
      </div>
    </div>
  {:else}
    {@html processedHtml}
  {/if}
</div>

<style>
  .enhanced-math-content {
    /* Base container styling */
    line-height: 1.6;
  }

  /* Math display styling */
  .enhanced-math-content :global(.math-display) {
    margin: 1.5rem 0;
    text-align: center;
    overflow-x: auto;
    padding: 0.5rem;
  }

  .enhanced-math-content :global(.math-inline) {
    vertical-align: baseline;
    margin: 0 0.1rem;
  }

  /* Error styling */
  .enhanced-math-content :global(.math-error) {
    color: #dc2626;
    background-color: #fef2f2;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: monospace;
    font-size: 0.875rem;
    border: 1px solid #fecaca;
  }

  /* KaTeX overrides for better appearance */
  .enhanced-math-content :global(.katex) {
    font-size: 1.1em;
    line-height: 1.2;
  }

  .enhanced-math-content :global(.katex-display) {
    margin: 1.5rem 0;
    text-align: center;
  }

  .enhanced-math-content :global(.katex-display > .katex) {
    display: inline-block;
    white-space: nowrap;
    max-width: 100%;
    overflow-x: auto;
    text-align: initial;
  }

  /* Responsive math */
  @media (max-width: 768px) {
    .enhanced-math-content :global(.katex-display) {
      font-size: 0.9em;
      margin: 1rem 0;
    }
    
    .enhanced-math-content :global(.math-display) {
      padding: 0.25rem;
      margin: 1rem 0;
    }

    .enhanced-math-content :global(.katex) {
      font-size: 1em;
    }
  }

  /* Hover effects */
  .enhanced-math-content :global(.math-display .katex:hover) {
    background-color: rgba(59, 130, 246, 0.05);
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .enhanced-math-content :global(.math-inline .katex) {
    background-color: transparent !important;
    border-radius: 0;
  }

  /* Selection styling */
  .enhanced-math-content :global(.katex::selection) {
    background-color: rgba(59, 130, 246, 0.2);
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .enhanced-math-content :global(.katex) {
      color: #e5e7eb;
    }
    
    .enhanced-math-content :global(.katex:hover) {
      background-color: rgba(59, 130, 246, 0.1);
    }
    
    .enhanced-math-content :global(.math-error) {
      color: #fca5a5;
      background-color: #7f1d1d;
      border-color: #991b1b;
    }
  }

  /* Loading animation */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .math-loading .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* Accessibility improvements */
  .enhanced-math-content :global(.katex[role="img"]) {
    cursor: pointer;
  }

  .enhanced-math-content :global(.katex[role="img"]:focus) {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Improved spacing for math in lists and other contexts */
  .enhanced-math-content :global(li .katex),
  .enhanced-math-content :global(p .katex) {
    vertical-align: baseline;
  }

  .enhanced-math-content :global(blockquote .katex) {
    color: inherit;
  }

  /* Ensure math doesn't break layout */
  .enhanced-math-content :global(.katex-html) {
    overflow: hidden;
  }
</style>