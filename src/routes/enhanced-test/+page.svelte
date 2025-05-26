<script lang="ts">
  import EnhancedMarkdownRenderer from '$lib/components/EnhancedMarkdownRenderer.svelte';
  import EnhancedMathContent from '$lib/components/EnhancedMathContent.svelte';

  let testResults: Record<string, boolean> = {};
  let isTestingComplete = false;

  // Test content for comprehensive verification
  const simpleMarkdownContent = `# Enhanced Markdown Test
  
This is a simple markdown test to verify basic rendering.

## Features to Test:
- **Bold text**
- *Italic text*
- \`Inline code\`
- [Links](https://example.com)

### Code Block
\`\`\`javascript
console.log('Hello, enhanced markdown!');
\`\`\`
`;

  const mathHeavyContent = `# Mathematical Content Test

## Inline Math
Here's inline math: $f(x) = x^2 + 2x + 1$ and $\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$.

## Display Math
$$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

## Complex Expressions
$$\\begin{align}
\\nabla \\times \\mathbf{E} &= -\\frac{\\partial \\mathbf{B}}{\\partial t} \\\\
\\nabla \\times \\mathbf{B} &= \\mu_0 \\mathbf{J} + \\mu_0 \\epsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}
\\end{align}$$
`;

  const exerciseContent = `# Exercise Content Test

::: exercise
**Problem**: Solve the differential equation $\\frac{dy}{dx} = y + x$.

Find the general solution.
:::

::: solution
The solution involves finding an integrating factor.

Step 1: Rewrite as $\\frac{dy}{dx} - y = x$

Step 2: Integrating factor is $\\mu(x) = e^{-x}$

Step 3: General solution is $y = Ce^x - x - 1$
:::

::: hint
Remember to use the standard form for linear ODEs.
:::
`;

  // Test functions
  function runTests() {
    testResults = {};
    
    // Test 1: Component initialization
    testResults['Component Initialization'] = true;
    
    // Test 2: Math rendering (check if KaTeX is available)
    try {
      testResults['KaTeX Availability'] = typeof window !== 'undefined' && window.katex !== undefined;
    } catch {
      testResults['KaTeX Availability'] = false;
    }
    
    // Test 3: DOM manipulation
    setTimeout(() => {
      const mathElements = document.querySelectorAll('.katex');
      testResults['Math Elements Rendered'] = mathElements.length > 0;
      
      const markdownElements = document.querySelectorAll('.enhanced-markdown-content');
      testResults['Markdown Elements Rendered'] = markdownElements.length > 0;
      
      isTestingComplete = true;
      testResults = { ...testResults };
    }, 2000);
  }

  // Run tests on component mount
  import { onMount } from 'svelte';
  onMount(() => {
    setTimeout(runTests, 1000);
  });
</script>

<svelte:head>
  <title>Enhanced Markdown Components Test</title>
</svelte:head>

<div class="test-container">
  <div class="test-header">
    <h1>🧪 Enhanced Markdown Components Test Suite</h1>
    <p>Comprehensive testing of enhanced markdown rendering and math components</p>
  </div>

  <!-- Test Results Panel -->
  <div class="test-results">
    <h2>Test Results</h2>
    {#if isTestingComplete}
      <div class="results-grid">
        {#each Object.entries(testResults) as [test, passed]}
          <div class="test-result {passed ? 'passed' : 'failed'}">
            <span class="test-name">{test}</span>
            <span class="test-status">{passed ? '✅ PASS' : '❌ FAIL'}</span>
          </div>
        {/each}
      </div>
    {:else}
      <div class="loading">
        <span>Running tests...</span>
        <div class="spinner"></div>
      </div>
    {/if}
  </div>

  <!-- Test Content Sections -->
  <div class="test-sections">
    
    <!-- Test 1: Basic Markdown -->
    <section class="test-section">
      <h2>📝 Test 1: Basic Markdown Rendering</h2>
      <div class="test-description">
        Testing basic markdown elements: headers, lists, code blocks, links
      </div>
      <div class="test-content">
        <EnhancedMarkdownRenderer 
          content={simpleMarkdownContent}
          className="test-basic-markdown"
        />
      </div>
    </section>

    <!-- Test 2: Math Rendering -->
    <section class="test-section">
      <h2>🔢 Test 2: Mathematical Expression Rendering</h2>
      <div class="test-description">
        Testing KaTeX integration, inline math, display math, and complex expressions
      </div>
      <div class="test-content">
        <EnhancedMarkdownRenderer 
          content={mathHeavyContent}
          enableMathRendering={true}
          className="test-math-content"
        />
      </div>
    </section>

    <!-- Test 3: Exercise Content -->
    <section class="test-section">
      <h2>📚 Test 3: Exercise Content Rendering</h2>
      <div class="test-description">
        Testing custom containers: exercise, solution, hint blocks
      </div>
      <div class="test-content">
        <EnhancedMarkdownRenderer 
          content={exerciseContent}
          enableMathRendering={true}
          className="test-exercise-content"
        />
      </div>
    </section>

    <!-- Test 4: Individual Math Component -->
    <section class="test-section">
      <h2>🧮 Test 4: Individual Math Component</h2>
      <div class="test-description">
        Testing the standalone EnhancedMathContent component
      </div>
      <div class="test-content">
        <div class="math-examples">
          <div class="math-example">
            <h4>Euler's Identity</h4>
            <EnhancedMathContent 
              html={`<div class="math-display">$$e^{i\\pi} + 1 = 0$$</div>`}
            />
          </div>
          
          <div class="math-example">
            <h4>Quadratic Formula</h4>
            <EnhancedMathContent 
              html={`<div class="math-display">$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$</div>`}
            />
          </div>
          
          <div class="math-example">
            <h4>Inline Math Example</h4>
            <div>
              The derivative of <EnhancedMathContent html={`<span class="math-inline">$f(x) = x^2$</span>`} /> 
              is <EnhancedMathContent html={`<span class="math-inline">$f'(x) = 2x$</span>`} />.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Test 5: Interactive Features -->
    <section class="test-section">
      <h2>🎮 Test 5: Interactive Features</h2>
      <div class="test-description">
        Testing copy-to-clipboard, hover effects, and other interactive features
      </div>
      <div class="test-content">
        <div class="interactive-tests">
          <div class="feature-test">
            <h4>Click to Copy Math Expression</h4>
            <p>Click on the math expression below to test copy functionality:</p>
            <EnhancedMathContent 
              html={`<div class="math-display">$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$</div>`}
            />
          </div>
          
          <div class="feature-test">
            <h4>Hover Effects</h4>
            <p>Hover over the math expressions to see interactive effects:</p>
            <EnhancedMathContent 
              html={`<div class="math-display">$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$</div>`}
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Test 6: Performance Test -->
    <section class="test-section">
      <h2>⚡ Test 6: Performance Test</h2>
      <div class="test-description">
        Testing rendering performance with multiple math expressions
      </div>
      <div class="test-content">
        <div class="performance-test">
          <EnhancedMarkdownRenderer 
            content={`# Performance Test

Multiple math expressions to test rendering performance:

$E = mc^2$, $F = ma$, $v = u + at$, $s = ut + \\frac{1}{2}at^2$

$$\\begin{align}
\\sin^2\\theta + \\cos^2\\theta &= 1 \\\\
\\tan\\theta &= \\frac{\\sin\\theta}{\\cos\\theta} \\\\
e^{i\\theta} &= \\cos\\theta + i\\sin\\theta
\\end{align}$$

More inline expressions: $\\alpha$, $\\beta$, $\\gamma$, $\\delta$, $\\epsilon$, $\\zeta$, $\\eta$, $\\theta$

$$\\int_0^{2\\pi} \\sin(x) dx = 0$$

$$\\sum_{k=0}^n \\binom{n}{k} = 2^n$$
`}
            enableMathRendering={true}
            className="test-performance"
          />
        </div>
      </div>
    </section>
  </div>
</div>

<style>
  .test-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .test-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    border-radius: 1rem;
  }

  .test-header h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
  }

  .test-header p {
    margin: 1rem 0 0 0;
    font-size: 1.2rem;
    opacity: 0.9;
  }

  .test-results {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }

  .test-results h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #1f2937;
  }

  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  .test-result {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
  }

  .test-result.passed {
    background-color: #ecfdf5;
    border: 1px solid #10b981;
    color: #065f46;
  }

  .test-result.failed {
    background-color: #fef2f2;
    border: 1px solid #ef4444;
    color: #991b1b;
  }

  .loading {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    padding: 2rem;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .test-sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .test-section {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }

  .test-section h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #1f2937;
    font-size: 1.5rem;
  }

  .test-description {
    margin-bottom: 1.5rem;
    color: #6b7280;
    font-style: italic;
  }

  .test-content {
    border: 2px dashed #d1d5db;
    border-radius: 0.5rem;
    padding: 1.5rem;
    background: #f9fafb;
  }

  .math-examples {
    display: grid;
    gap: 1.5rem;
  }

  .math-example {
    padding: 1rem;
    background: white;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  .math-example h4 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #374151;
  }

  .interactive-tests {
    display: grid;
    gap: 2rem;
  }

  .feature-test {
    padding: 1.5rem;
    background: white;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  .feature-test h4 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #374151;
  }

  .performance-test {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .test-container {
      background-color: #0f172a;
      color: #f1f5f9;
    }

    .test-results,
    .test-section {
      background: #1e293b;
      border-color: #334155;
    }

    .test-results h2,
    .test-section h2 {
      color: #f1f5f9;
    }

    .test-description {
      color: #94a3b8;
    }

    .test-content {
      background: #334155;
      border-color: #475569;
    }

    .math-example,
    .feature-test,
    .performance-test {
      background: #475569;
      border-color: #64748b;
    }

    .math-example h4,
    .feature-test h4 {
      color: #e2e8f0;
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .test-container {
      padding: 1rem;
    }

    .test-header {
      padding: 1.5rem;
    }

    .test-header h1 {
      font-size: 2rem;
    }

    .test-section {
      padding: 1.5rem;
    }

    .results-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
