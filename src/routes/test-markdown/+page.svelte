<script lang="ts">
  import EnhancedMarkdownRenderer from '$lib/components/EnhancedMarkdownRenderer.svelte';
  import EnhancedMathContent from '$lib/components/EnhancedMathContent.svelte';

  const sampleMathContent = `# Enhanced Markdown Rendering Test

This page demonstrates the enhanced markdown rendering system with improved math support and modern UI/UX.

## Mathematical Expressions

### Inline Math
Here's some inline math: $f(x) = x^2 + 2x + 1$ and $\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$.

### Block Math
Complex mathematical expressions with enhanced rendering:

$$\\begin{align}
\\int_{-\\infty}^{\\infty} e^{-x^2} dx &= \\sqrt{\\pi} \\\\
\\sum_{n=0}^{\\infty} \\frac{x^n}{n!} &= e^x \\\\
\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n &= e
\\end{align}$$

### Advanced Math with Macros
Using enhanced macros: $\\R$, $\\N$, $\\Z$, $\\Q$, $\\C$ for number sets.

Linear algebra: $\\det(A)$, $\\tr(A)$, $\\rank(A)$, $\\dim(V)$.

Probability: $\\E[X]$, $\\Var(X)$, $\\Cov(X,Y)$.

## Exercise Content

::: exercise
**Problem 1**: Solve the differential equation $\\frac{dy}{dx} = y + x$.

Show that the general solution is $y = Ce^x - x - 1$.
:::

::: solution
We have the first-order linear ODE: $\\frac{dy}{dx} - y = x$

The integrating factor is $\\mu(x) = e^{\\int -1 dx} = e^{-x}$

Multiplying both sides by $e^{-x}$:
$$e^{-x}\\frac{dy}{dx} - e^{-x}y = xe^{-x}$$

This gives us:
$$\\frac{d}{dx}(ye^{-x}) = xe^{-x}$$

Integrating both sides using integration by parts:
$$ye^{-x} = -xe^{-x} - e^{-x} + C$$

Therefore: $y = Ce^x - x - 1$
:::

::: hint
Try using an integrating factor method for this linear differential equation.
:::

## Course Content Features

::: info
**Learning Objective**: Understand advanced mathematical rendering and interactive features.
:::

::: warning
**Prerequisites**: Basic knowledge of calculus and linear algebra is recommended.
:::

### Table of Contents
The enhanced renderer automatically generates a table of contents for easy navigation.

### Interactive Features
- **Copy-to-clipboard** functionality for code blocks and math expressions
- **Expandable math** expressions on click
- **Search highlighting** within content
- **Dark mode** support

## Code Examples

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

def plot_function(f, domain=(-5, 5), num_points=1000):
    """Plot a mathematical function"""
    x = np.linspace(domain[0], domain[1], num_points)
    y = f(x)
    
    plt.figure(figsize=(10, 6))
    plt.plot(x, y, 'b-', linewidth=2)
    plt.grid(True, alpha=0.3)
    plt.xlabel('x')
    plt.ylabel('f(x)')
    plt.title('Function Plot')
    plt.show()

# Example: Plot quadratic function
plot_function(lambda x: x**2 - 4*x + 3)
\`\`\`

\`\`\`javascript
class MathRenderer {
  constructor(options = {}) {
    this.katexOptions = {
      throwOnError: false,
      displayMode: options.displayMode || false,
      ...options
    };
  }

  render(expression, element) {
    try {
      katex.render(expression, element, this.katexOptions);
      return true;
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      return false;
    }
  }
}
\`\`\`

## Advanced Math Examples

### Matrix Operations
$$\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
\\begin{pmatrix}
x \\\\
y
\\end{pmatrix} = 
\\begin{pmatrix}
ax + by \\\\
cx + dy
\\end{pmatrix}$$

### Complex Analysis
$$f(z) = \\sum_{n=0}^{\\infty} a_n z^n, \\quad |z| < R$$

Where the radius of convergence is:
$$R = \\frac{1}{\\limsup_{n \\to \\infty} \\sqrt[n]{|a_n|}}$$

### Probability Theory
For a continuous random variable $X$ with density $f(x)$:

$$\\E[X] = \\int_{-\\infty}^{\\infty} x f(x) dx$$

$$\\Var(X) = \\E[X^2] - (\\E[X])^2$$

## Interactive Math Component Test

Below we test the individual enhanced math component:`;

  const standaloneFormula = "\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}";
  
  const complexFormula = `\\begin{align}
  \\nabla \\times \\mathbf{E} &= -\\frac{\\partial \\mathbf{B}}{\\partial t} \\\\
  \\nabla \\times \\mathbf{B} &= \\mu_0 \\mathbf{J} + \\mu_0 \\epsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t} \\\\
  \\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\epsilon_0} \\\\
  \\nabla \\cdot \\mathbf{B} &= 0
  \\end{align}`;
</script>

<div class="test-page">
  <div class="page-header">
    <h1>Enhanced Markdown Rendering Test</h1>
    <p class="subtitle">Testing enhanced math support and modern UI/UX features</p>
  </div>

  <div class="content-sections">
    <!-- Full Enhanced Markdown Renderer -->
    <section class="renderer-section">
      <h2>Full Enhanced Markdown Renderer</h2>
      <p>Auto-detection, TOC generation, search, and enhanced styling:</p>
      
      <EnhancedMarkdownRenderer 
        content={sampleMathContent}
        className="test-content"
      />
    </section>

    <!-- Individual Math Components -->
    <section class="math-components-section">
      <h2>Individual Enhanced Math Components</h2>
      
      <div class="math-examples">
        <div class="math-example">
          <h3>Interactive Display Math</h3>
          <EnhancedMathContent 
            html={`<div class="math-display">$$${standaloneFormula}$$</div>`}
          />
        </div>

        <div class="math-example">
          <h3>Maxwell's Equations (Complex Example)</h3>
          <EnhancedMathContent 
            html={`<div class="math-display">$$${complexFormula}$$</div>`}
          />
        </div>

        <div class="math-example">
          <h3>Inline Math Examples</h3>
          <div>
            <span>Here's some inline math: </span>
            <EnhancedMathContent 
              html={`<span class="math-inline">$f(x) = x^2 + 2x + 1$</span>`}
            />
            <span> and another: </span>
            <EnhancedMathContent 
              html={`<span class="math-inline">$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$</span>`}
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Exercise-specific content -->
    <section class="exercise-section">
      <h2>Exercise Content Type</h2>
      <EnhancedMarkdownRenderer 
        content={`## Exercise 1: Complex Analysis

::: exercise
Let $f(z) = z^2 + iz + 1$ where $z \\in \\C$. 

1. Find all roots of $f(z) = 0$
2. Determine the domain where $|f(z)| < 1$
3. Compute $\\int_{|z|=2} \\frac{dz}{f(z)}$ using residue theorem
:::

::: solution
**Part 1**: Solving $z^2 + iz + 1 = 0$

Using the quadratic formula:
$$z = \\frac{-i \\pm \\sqrt{i^2 - 4}}{2} = \\frac{-i \\pm \\sqrt{-1 - 4}}{2} = \\frac{-i \\pm \\sqrt{-5}}{2}$$

Since $\\sqrt{-5} = i\\sqrt{5}$:
$$z = \\frac{-i \\pm i\\sqrt{5}}{2} = \\frac{i(-1 \\pm \\sqrt{5})}{2}$$

**Part 2**: For $|f(z)| < 1$, we need to analyze the modulus...

**Part 3**: The residue calculation involves...
:::

::: hint
For part 1, remember that $\\sqrt{-a} = i\\sqrt{a}$ for positive real $a$.
:::
`}
      />
    </section>

    <!-- Math-heavy content -->
    <section class="math-section">
      <h2>Math Content Type</h2>
      <EnhancedMarkdownRenderer 
        content={`# Advanced Calculus Theorems

## Fundamental Theorem of Calculus

If $f$ is continuous on $[a,b]$ and $F(x) = \\int_a^x f(t) dt$, then:

$$F'(x) = f(x)$$

And furthermore:
$$\\int_a^b f(x) dx = F(b) - F(a)$$

## Green's Theorem

For a positively oriented, piecewise-smooth, simple closed curve $C$ and region $D$ bounded by $C$:

$$\\oint_C (P dx + Q dy) = \\iint_D \\left(\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}\\right) dA$$

## Stokes' Theorem

$$\\oint_C \\mathbf{F} \\cdot d\\mathbf{r} = \\iint_S (\\nabla \\times \\mathbf{F}) \\cdot \\mathbf{n} \\, dS$$

Where $S$ is a surface bounded by curve $C$.
`}
      />
    </section>
  </div>
</div>

<style>
  .test-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 1rem;
  }

  .page-header h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
  }

  .subtitle {
    margin: 1rem 0 0 0;
    font-size: 1.2rem;
    opacity: 0.9;
  }

  .content-sections {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .renderer-section,
  .math-components-section,
  .exercise-section,
  .math-section {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }

  .renderer-section h2,
  .math-components-section h2,
  .exercise-section h2,
  .math-section h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #1f2937;
    font-size: 1.8rem;
    font-weight: 600;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  .math-examples {
    display: grid;
    gap: 2rem;
  }

  .math-example {
    padding: 1.5rem;
    background: #f9fafb;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  .math-example h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #374151;
    font-size: 1.2rem;
    font-weight: 600;
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .test-page {
      background-color: #0f172a;
      color: #f1f5f9;
    }

    .renderer-section,
    .math-components-section,
    .exercise-section,
    .math-section {
      background: #1e293b;
      border-color: #334155;
    }

    .renderer-section h2,
    .math-components-section h2,
    .exercise-section h2,
    .math-section h2 {
      color: #f1f5f9;
      border-color: #334155;
    }

    .math-example {
      background: #334155;
      border-color: #475569;
    }

    .math-example h3 {
      color: #e2e8f0;
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .test-page {
      padding: 1rem;
    }

    .page-header {
      padding: 1.5rem;
    }

    .page-header h1 {
      font-size: 2rem;
    }

    .renderer-section,
    .math-components-section,
    .exercise-section,
    .math-section {
      padding: 1.5rem;
    }
  }

  /* Test content specific styling */
  :global(.test-content) {
    border: 2px solid #3b82f6;
    border-radius: 0.75rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  }

  :global(.dark .test-content) {
    background: linear-gradient(135deg, #0c4a6e 0%, #075985 100%);
    border-color: #0ea5e9;
  }
</style>
