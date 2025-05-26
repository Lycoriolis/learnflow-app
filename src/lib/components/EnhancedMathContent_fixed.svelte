<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import katex from 'katex';
  import 'katex/dist/katex.min.css';
  import { fade, scale } from 'svelte/transition';

  export let content: string = '';
  export let displayMode: boolean = false;
  export let interactive: boolean = false;
  export let showSource: boolean = false;
  export let copyable: boolean = true;
  export let className: string = '';
  export let errorFallback: string = '';

  let element: HTMLElement;
  let sourceElement: HTMLElement;
  let isRendered = false;
  let renderError: Error | null = null;
  let showSourceCode = false;
  let isExpanded = false;
  let isVisible = false;

  const katexOptions = {
    displayMode,
    throwOnError: false,
    errorColor: '#dc2626',
    strict: false,
    trust: true,
    macros: {
      // Enhanced macro set
      "\\R": "\\mathbb{R}",
      "\\N": "\\mathbb{N}",
      "\\Z": "\\mathbb{Z}",
      "\\Q": "\\mathbb{Q}",
      "\\C": "\\mathbb{C}",
      "\\P": "\\mathbb{P}",
      "\\E": "\\mathbb{E}",
      "\\Re": "\\operatorname{Re}",
      "\\Im": "\\operatorname{Im}",
      "\\conj": "\\overline",
      "\\abs": "\\left\\lvert #1 \\right\\rvert",
      "\\norm": "\\left\\lVert #1 \\right\\rVert",
      "\\inner": "\\left\\langle #1, #2 \\right\\rangle",
      "\\set": "\\left\\{ #1 \\right\\}",
      "\\seq": "\\left( #1 \\right)",
      "\\floor": "\\left\\lfloor #1 \\right\\rfloor",
      "\\ceil": "\\left\\lceil #1 \\right\\rceil",
      "\\frac": "\\dfrac{#1}{#2}",
      "\\eps": "\\varepsilon",
      "\\phi": "\\varphi",
      "\\theta": "\\vartheta",
      "\\rho": "\\varrho",
      "\\sigma": "\\varsigma",
      "\\deg": "^{\\circ}",
      "\\argmax": "\\operatorname{argmax}",
      "\\argmin": "\\operatorname{argmin}",
      "\\sin": "\\operatorname{sin}",
      "\\cos": "\\operatorname{cos}",
      "\\tan": "\\operatorname{tan}",
      "\\cot": "\\operatorname{cot}",
      "\\sec": "\\operatorname{sec}",
      "\\csc": "\\operatorname{csc}",
      "\\log": "\\operatorname{log}",
      "\\ln": "\\operatorname{ln}",
      "\\exp": "\\operatorname{exp}",
      "\\det": "\\operatorname{det}",
      "\\rank": "\\operatorname{rank}",
      "\\trace": "\\operatorname{tr}",
      "\\diag": "\\operatorname{diag}",
      "\\grad": "\\nabla",
      "\\curl": "\\nabla \\times",
      "\\div": "\\nabla \\cdot",
      "\\laplacian": "\\nabla^2",
      "\\pd": "\\frac{\\partial #1}{\\partial #2}",
      "\\pdd": "\\frac{\\partial^2 #1}{\\partial #2^2}",
      "\\tod": "\\frac{d #1}{d #2}",
      "\\todd": "\\frac{d^2 #1}{d #2^2}",
      "\\limit": "\\lim_{#1 \\to #2}",
      "\\integral": "\\int_{#1}^{#2}",
      "\\sum": "\\sum_{#1}^{#2}",
      "\\prod": "\\prod_{#1}^{#2}",
      "\\union": "\\bigcup_{#1}^{#2}",
      "\\intersection": "\\bigcap_{#1}^{#2}",
      "\\prob": "\\operatorname{P}",
      "\\expectation": "\\operatorname{E}",
      "\\variance": "\\operatorname{Var}",
      "\\covariance": "\\operatorname{Cov}",
      "\\correlation": "\\operatorname{Corr}",
      "\\independent": "\\perp\\!\\!\\!\\perp",
      "\\given": "\\,|\\,",
      "\\normal": "\\mathcal{N}",
      "\\uniform": "\\mathcal{U}",
      "\\exponential": "\\operatorname{Exp}",
      "\\gamma": "\\operatorname{Gamma}",
      "\\beta": "\\operatorname{Beta}",
      "\\poisson": "\\operatorname{Poisson}",
      "\\binomial": "\\operatorname{Binomial}",
      "\\matrix": "\\begin{pmatrix} #1 \\end{pmatrix}",
      "\\vector": "\\begin{pmatrix} #1 \\end{pmatrix}",
      "\\bmatrix": "\\begin{bmatrix} #1 \\end{bmatrix}",
      "\\vmatrix": "\\begin{vmatrix} #1 \\end{vmatrix}",
      "\\Vmatrix": "\\begin{Vmatrix} #1 \\end{Vmatrix}",
      "\\cases": "\\begin{cases} #1 \\end{cases}",
      "\\align": "\\begin{align} #1 \\end{align}",
      "\\eqnarray": "\\begin{eqnarray} #1 \\end{eqnarray}",
      "\\split": "\\begin{split} #1 \\end{split}",
      "\\gather": "\\begin{gather} #1 \\end{gather}",
      "\\multline": "\\begin{multline} #1 \\end{multline}",
      "\\implies": "\\Rightarrow",
      "\\iff": "\\Leftrightarrow",
      "\\forall": "\\forall\\,",
      "\\exists": "\\exists\\,",
      "\\nexists": "\\nexists\\,",
      "\\in": "\\in\\,",
      "\\notin": "\\notin\\,",
      "\\subset": "\\subset\\,",
      "\\supset": "\\supset\\,",
      "\\subseteq": "\\subseteq\\,",
      "\\supseteq": "\\supseteq\\,",
      "\\emptyset": "\\varnothing",
      "\\infinity": "\\infty",
      "\\complex": "\\mathbb{C}",
      "\\real": "\\mathbb{R}",
      "\\rational": "\\mathbb{Q}",
      "\\integer": "\\mathbb{Z}",
      "\\natural": "\\mathbb{N}",
      "\\field": "\\mathbb{F}",
      "\\ring": "\\mathbb{R}",
      "\\group": "\\mathbb{G}",
      "\\transpose": "^{\\mathsf{T}}",
      "\\hermitian": "^{\\mathsf{H}}",
      "\\inverse": "^{-1}",
      "\\dagger": "^{\\dagger}",
      "\\star": "^{\\star}",
      "\\ast": "^{\\ast}",
      "\\bigO": "\\mathcal{O}",
      "\\littleo": "\\mathrm{o}",
      "\\bigTheta": "\\Theta",
      "\\bigOmega": "\\Omega",
      "\\littleomega": "\\omega"
    }
  };

  $: if (content && browser) {
    renderMath();
  }

  onMount(() => {
    if (browser) {
      renderMath();
      // Intersection Observer for performance
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              isVisible = true;
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      if (element) {
        observer.observe(element);
      }

      return () => {
        if (element) {
          observer.unobserve(element);
        }
      };
    }
  });

  function renderMath() {
    if (!element || !content || !browser) return;

    try {
      katex.render(content, element, katexOptions);
      isRendered = true;
      renderError = null;
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      renderError = error as Error;
      isRendered = false;
      
      // Fallback rendering
      if (errorFallback) {
        element.textContent = errorFallback;
      } else {
        element.innerHTML = `<span class="math-error">Error: ${(error as Error).message}</span>`;
      }
    }
  }

  function toggleSourceCode() {
    showSourceCode = !showSourceCode;
  }

  function toggleExpanded() {
    if (!interactive) return;
    isExpanded = !isExpanded;
  }

  async function copyToClipboard() {
    if (!copyable || !browser) return;
    
    try {
      await navigator.clipboard.writeText(content);
      // Show success feedback
      const button = element?.parentElement?.querySelector('.copy-btn');
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✓';
        button.classList.add('copied');
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('copied');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }

  function handleKeydown(event: CustomEvent<KeyboardEvent>) {
    if (!interactive) return;
    const keyboardEvent = event.detail;
    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
      event.preventDefault();
      toggleExpanded();
    }
  }
</script>

<div 
  class="math-container {className}"
  class:inline={!displayMode}
  class:display={displayMode}
  class:interactive
  class:expanded={isExpanded}
  class:error={renderError}
  style={displayMode ? 'display: block; text-align: center;' : 'display: inline-block; vertical-align: middle;'}
>
  {#if interactive}
    <button 
      class="math-content clickable"
      bind:this={element}
      on:click={toggleExpanded}
      on:keydown={handleKeydown}
      aria-label="Click to expand math expression"
      transition:fade={{ duration: 200 }}
    >
      <!-- KaTeX content will be rendered here -->
    </button>
  {:else}
    <div 
      class="math-content"
      bind:this={element}
      transition:fade={{ duration: 200 }}
    >
      <!-- KaTeX content will be rendered here -->
    </div>
  {/if}
</div>

{#if interactive || copyable || showSource}
  <div class="math-controls" class:visible={isVisible}>
    {#if copyable}
      <button
        class="control-btn copy-btn"
        on:click={copyToClipboard}
        title="Copy LaTeX source"
        aria-label="Copy LaTeX source to clipboard"
      >
        📋
      </button>
    {/if}
    
    {#if showSource}
      <button
        class="control-btn source-btn"
        on:click={toggleSourceCode}
        title="Toggle source code"
        aria-label="Toggle LaTeX source code"
        class:active={showSourceCode}
      >
        &lt;/&gt;
      </button>
    {/if}
    
    {#if interactive}
      <button
        class="control-btn expand-btn"
        on:click={toggleExpanded}
        title="Expand/collapse"
        aria-label="Expand or collapse math expression"
        class:active={isExpanded}
      >
        {isExpanded ? '−' : '+'}
      </button>
    {/if}
  </div>
{/if}

{#if showSourceCode && showSource}
  <div class="source-container" transition:fade={{ duration: 200 }}>
    <pre class="source-code" bind:this={sourceElement}><code>{content}</code></pre>
  </div>
{/if}

{#if renderError}
  <div class="error-message" transition:fade>
    <span class="error-text">Math rendering failed: {renderError.message}</span>
  </div>
{/if}

{#if !renderError && isRendered}
  <div class="success-indicator" transition:fade>
    <span class="success-text">✓ Rendered successfully</span>
  </div>
{/if}

<style>
  .math-container {
    position: relative;
    font-family: 'KaTeX_Main', 'Times New Roman', serif;
  }

  .math-container.inline {
    display: inline-block;
    vertical-align: middle;
  }

  .math-container.display {
    display: block;
    margin: 1rem 0;
    text-align: center;
  }

  .math-content {
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .math-content.clickable {
    cursor: pointer;
  }

  .math-content.clickable:hover {
    transform: scale(1.05);
  }

  .math-content.clickable:active {
    transform: scale(1.1);
    z-index: 10;
  }

  .math-container.expanded .math-content {
    text-align: center;
  }

  .math-container.error .math-content {
    background-color: rgb(254 242 242);
    border: 1px solid rgb(252 165 165);
    border-radius: 0.5rem;
    padding: 0.5rem;
  }

  :global(.dark) .math-container.error .math-content {
    background-color: rgb(127 29 29);
    border-color: rgb(185 28 28);
  }

  .math-container.enhanced {
    background: linear-gradient(135deg, rgb(239 246 255) 0%, rgb(238 242 255) 100%);
    border: 1px solid rgb(191 219 254);
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem 0;
  }

  :global(.dark) .math-container.enhanced {
    background: linear-gradient(135deg, rgb(31 41 55) 0%, rgb(30 41 59) 100%);
    border-color: rgb(59 130 246);
  }

  /* Color themes for different math types */
  .math-container.blue { color: rgb(37 99 235); }
  :global(.dark) .math-container.blue { color: rgb(96 165 250); }

  .math-container.green { color: rgb(22 163 74); }
  :global(.dark) .math-container.green { color: rgb(74 222 128); }

  .math-container.purple { color: rgb(147 51 234); }
  :global(.dark) .math-container.purple { color: rgb(196 181 253); }

  .math-container.gray { color: rgb(75 85 99); }
  :global(.dark) .math-container.gray { color: rgb(209 213 219); }

  /* Controls */
  .math-controls {
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .math-container:hover .math-controls.visible {
    opacity: 1;
  }

  .control-btn {
    background-color: white;
    border: 1px solid rgb(209 213 219);
    border-radius: 0.25rem;
    padding: 0.375rem;
    color: rgb(75 85 99);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }

  :global(.dark) .control-btn {
    background-color: rgb(31 41 55);
    border-color: rgb(75 85 99);
    color: rgb(156 163 175);
  }

  .control-btn:hover {
    background-color: rgb(249 250 251);
    color: rgb(17 24 39);
  }

  :global(.dark) .control-btn:hover {
    background-color: rgb(55 65 81);
    color: rgb(243 244 246);
  }

  .control-btn:active {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06);
    transform: scale(1.1);
  }

  .control-btn.active {
    color: rgb(37 99 235);
  }

  :global(.dark) .control-btn.active {
    color: rgb(96 165 250);
  }

  .control-btn.copied {
    color: rgb(22 163 74);
  }

  :global(.dark) .control-btn.copied {
    color: rgb(74 222 128);
  }

  /* Source code display */
  .source-container {
    margin-top: 0.5rem;
    background-color: rgb(243 244 246);
    border-radius: 0.5rem;
    padding: 0.75rem;
  }

  :global(.dark) .source-container {
    background-color: rgb(31 41 55);
  }

  .source-code {
    margin: 0;
    font-size: 0.875rem;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    color: rgb(55 65 81);
  }

  :global(.dark) .source-code {
    color: rgb(229 231 235);
  }

  .source-code code {
    background: transparent;
    padding: 0;
  }

  /* Error and success messages */
  .error-message,
  .success-indicator {
    margin-top: 0.5rem;
  }

  .error-text {
    color: rgb(220 38 38);
    font-size: 0.875rem;
  }

  :global(.dark) .error-text {
    color: rgb(248 113 113);
  }

  .success-text {
    color: rgb(22 163 74);
    font-size: 0.875rem;
    font-weight: 500;
  }

  :global(.dark) .success-text {
    color: rgb(74 222 128);
  }

  /* Additional utility classes for enhanced styling */
  .math-container.monospace {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    background-color: rgb(243 244 246);
    padding: 0.5rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }

  :global(.dark) .math-container.monospace {
    background-color: rgb(31 41 55);
  }

  .math-container.centered {
    display: block;
    text-align: center;
    margin: 1rem 0;
    padding: 1rem;
  }

  .math-container.inline-centered {
    display: inline-block;
  }

  /* Focus styles for accessibility */
  .math-content:focus {
    outline: 2px solid rgb(59 130 246);
    outline-offset: 2px;
  }

  .control-btn:focus {
    outline: 2px solid rgb(59 130 246);
    outline-offset: 1px;
  }

  /* Animation for expanded state */
  .math-container.expanded {
    transition: all 0.3s ease;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .math-controls {
      position: static;
      opacity: 1;
      margin-top: 0.5rem;
      justify-content: center;
    }
    
    .math-container.display {
      font-size: 0.9em;
    }
  }
</style>
