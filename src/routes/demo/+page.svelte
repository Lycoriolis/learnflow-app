<script lang="ts">
  import EnhancedMarkdownRenderer from '$lib/components/EnhancedMarkdownRenderer.svelte';
  import EnhancedMathContent from '$lib/components/EnhancedMathContent.svelte';
  import { onMount } from 'svelte';

  let performanceMetrics = {
    renderTime: 0,
    mathExpressions: 0,
    interactiveElements: 0
  };

  const comprehensiveContent = `# 🚀 Enhanced Markdown Rendering System

> **Welcome to the next generation of mathematical content rendering!**  
> This system combines powerful math rendering with modern UI/UX design.

## 🎯 Key Features

### ✨ Auto-Detection & Smart Processing
- **Content Type Detection**: Automatically identifies markdown, math, exercise, or course content
- **Dynamic Enhancement**: Applies appropriate styling and interactions based on content type
- **Performance Optimized**: Lazy loading and efficient DOM manipulation

### 🔬 Advanced Mathematical Rendering

#### Enhanced KaTeX Integration
Our enhanced math renderer supports an extensive macro library:

**Number Sets**: $\\R, \\N, \\Z, \\Q, \\C, \\P, \\E$

**Complex Analysis**: $\\Re(z), \\Im(z), \\conj{z}, |z|$

**Linear Algebra**: $\\tr(A), \\det(A), \\rank(A), \\dim(V)$

**Probability**: $\\E[X], \\Var(X), \\Cov(X,Y), \\Corr(X,Y)$

#### Interactive Math Expressions

$$\\begin{align}
\\text{Euler's Identity: } & e^{i\\pi} + 1 = 0 \\\\
\\text{Golden Ratio: } & \\phi = \\frac{1 + \\sqrt{5}}{2} \\\\
\\text{Euler's Number: } & e = \\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n
\\end{align}$$

**Try clicking on the math expressions above!** 🖱️

### 📚 Exercise & Learning Features

::: exercise
**Advanced Calculus Problem**

Evaluate the following integral using contour integration:

$$\\int_{-\\infty}^{\\infty} \\frac{e^{ix}}{x^2 + 1} dx$$

*Hint: Consider the semicircular contour in the upper half-plane.*
:::

::: solution
We use the residue theorem with a semicircular contour.

**Step 1**: Identify singularities
The function $f(z) = \\frac{e^{iz}}{z^2 + 1}$ has simple poles at $z = \\pm i$.

**Step 2**: Choose contour
We integrate along the real axis and a semicircle in the upper half-plane.

**Step 3**: Apply residue theorem
Only the pole at $z = i$ is inside our contour:

$$\\text{Res}(f, i) = \\lim_{z \\to i} (z - i) \\frac{e^{iz}}{z^2 + 1} = \\frac{e^{-1}}{2i}$$

**Step 4**: Final result
$$\\int_{-\\infty}^{\\infty} \\frac{e^{ix}}{x^2 + 1} dx = 2\\pi i \\cdot \\frac{e^{-1}}{2i} = \\pi e^{-1}$$
:::

::: hint
**Memory Aid**: For contour integration, always:
1. 🎯 Identify all singularities
2. 🔄 Choose an appropriate contour
3. 📊 Calculate residues
4. ✅ Apply the residue theorem
:::

### 🎨 Modern UI/UX Features

#### Interactive Code Blocks

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt
from scipy import integrate

def complex_function(z):
    """Demonstrate complex mathematical operations"""
    return np.exp(1j * z) / (z**2 + 1)

# Create visualization
z = np.linspace(-5, 5, 1000)
y = complex_function(z)

plt.figure(figsize=(12, 8))
plt.subplot(2, 1, 1)
plt.plot(z, np.real(y), 'b-', label='Real part', linewidth=2)
plt.plot(z, np.imag(y), 'r-', label='Imaginary part', linewidth=2)
plt.legend()
plt.grid(True, alpha=0.3)
plt.title('Complex Function Analysis')

plt.subplot(2, 1, 2)
plt.plot(z, np.abs(y), 'g-', label='Magnitude', linewidth=2)
plt.legend()
plt.grid(True, alpha=0.3)
plt.xlabel('z')

plt.tight_layout()
plt.show()

# Numerical integration
result, error = integrate.quad(lambda x: np.real(complex_function(x)), -10, 10)
print(f"Numerical result: {result:.6f} ± {error:.2e}")
print(f"Theoretical result: {np.pi * np.exp(-1):.6f}")
\`\`\`

\`\`\`javascript
class MathematicalRenderer {
  constructor(options = {}) {
    this.katexOptions = {
      throwOnError: false,
      displayMode: false,
      strict: false,
      trust: true,
      macros: this.getEnhancedMacros(),
      ...options
    };
    
    this.performanceMetrics = {
      renderTime: 0,
      expressionsRendered: 0,
      errors: 0
    };
  }

  getEnhancedMacros() {
    return {
      // Number sets
      "\\\\R": "\\\\mathbb{R}",
      "\\\\N": "\\\\mathbb{N}",
      "\\\\Z": "\\\\mathbb{Z}",
      "\\\\Q": "\\\\mathbb{Q}",
      "\\\\C": "\\\\mathbb{C}",
      
      // Operations
      "\\\\tr": "\\\\operatorname{tr}",
      "\\\\det": "\\\\operatorname{det}",
      "\\\\rank": "\\\\operatorname{rank}",
      
      // Probability
      "\\\\E": "\\\\mathbb{E}",
      "\\\\Var": "\\\\operatorname{Var}",
      "\\\\Cov": "\\\\operatorname{Cov}"
    };
  }

  async renderExpression(content, element, options = {}) {
    const startTime = performance.now();
    
    try {
      const mergedOptions = { ...this.katexOptions, ...options };
      katex.render(content, element, mergedOptions);
      
      this.performanceMetrics.expressionsRendered++;
      this.addInteractivity(element, content);
      
      return true;
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      this.performanceMetrics.errors++;
      this.renderFallback(element, content, error);
      return false;
    } finally {
      this.performanceMetrics.renderTime += performance.now() - startTime;
    }
  }

  addInteractivity(element, content) {
    // Add copy-to-clipboard functionality
    element.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(content);
        this.showCopyFeedback(element);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });

    // Add hover effects
    element.addEventListener('mouseenter', () => {
      element.style.transform = 'scale(1.05)';
      element.style.transition = 'transform 0.2s ease';
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = 'scale(1)';
    });
  }

  showCopyFeedback(element) {
    const originalContent = element.innerHTML;
    element.innerHTML = '<span style="color: #10b981;">✓ Copied!</span>';
    
    setTimeout(() => {
      element.innerHTML = originalContent;
    }, 1000);
  }

  renderFallback(element, content, error) {
    element.innerHTML = \`
      <span style="color: #ef4444; font-family: monospace;">
        Error rendering: \${content}
      </span>
    \`;
  }

  getMetrics() {
    return {
      ...this.performanceMetrics,
      averageRenderTime: this.performanceMetrics.renderTime / 
                        this.performanceMetrics.expressionsRendered || 0
    };
  }
}

// Usage example
const renderer = new MathematicalRenderer({
  displayMode: true,
  trust: true
});

// Render mathematical content
document.querySelectorAll('.math-expression').forEach(async (element) => {
  const content = element.textContent;
  await renderer.renderExpression(content, element);
});

// Performance monitoring
setInterval(() => {
  const metrics = renderer.getMetrics();
  console.log('Rendering Performance:', metrics);
}, 5000);
\`\`\`

### 🔍 Advanced Search & Navigation

The enhanced search functionality includes:
- **Real-time highlighting** of search terms
- **Mathematical expression search** (LaTeX-aware)
- **Fuzzy matching** for better results
- **Keyboard shortcuts** (Ctrl+F enhancement)

### 📊 Performance & Accessibility

#### Performance Optimizations
- ⚡ **Lazy loading** of math expressions
- 🎯 **Efficient DOM manipulation**
- 📦 **Bundle optimization** with tree-shaking
- 🔄 **Smart re-rendering** only when needed

#### Accessibility Features
- 🗣️ **Screen reader support** with ARIA labels
- ⌨️ **Keyboard navigation** for interactive elements
- 🎨 **High contrast mode** compatibility
- 📱 **Mobile-responsive** design

### 🌈 Theming & Customization

#### Dark Mode Support
The system automatically adapts to user preferences:

\`\`\`css
@media (prefers-color-scheme: dark) {
  .enhanced-math-content .katex-display {
    background: linear-gradient(135deg, 
      rgba(31, 41, 55, 0.8), 
      rgba(30, 58, 138, 0.3));
    color: #f1f5f9;
  }
}
\`\`\`

#### Custom Themes
Easy theme customization through CSS variables:

\`\`\`css
:root {
  --math-bg: #f0f9ff;
  --math-border: #0ea5e9;
  --math-text: #0c4a6e;
  --accent-color: #3b82f6;
}
\`\`\`

## 🧮 Advanced Mathematics Showcase

### Differential Equations
The heat equation in multiple dimensions:

$$\\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u = \\alpha \\left(\\frac{\\partial^2 u}{\\partial x^2} + \\frac{\\partial^2 u}{\\partial y^2} + \\frac{\\partial^2 u}{\\partial z^2}\\right)$$

### Quantum Mechanics
Schrödinger equation:

$$i\\hbar \\frac{\\partial}{\\partial t} |\\psi\\rangle = \\hat{H} |\\psi\\rangle$$

Where the Hamiltonian operator is:
$$\\hat{H} = \\frac{\\hat{p}^2}{2m} + V(\\hat{x})$$

### Statistical Mechanics
Partition function for a canonical ensemble:

$$Z = \\sum_i e^{-\\beta E_i} = \\tr(e^{-\\beta \\hat{H}})$$

Free energy:
$$F = -k_B T \\ln Z$$

### Machine Learning
Loss function for neural networks:

$$\\mathcal{L}(\\theta) = \\frac{1}{n} \\sum_{i=1}^n \\ell(f(x_i; \\theta), y_i) + \\lambda \\|\\theta\\|_2^2$$

Gradient descent update:
$$\\theta_{t+1} = \\theta_t - \\eta \\nabla_{\\theta} \\mathcal{L}(\\theta_t)$$

## 🔬 Interactive Demonstrations

### Maxwell's Equations
The complete set in differential form:

$$\\begin{align}
\\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\epsilon_0} & \\text{(Gauss's law)} \\\\
\\nabla \\cdot \\mathbf{B} &= 0 & \\text{(No magnetic monopoles)} \\\\
\\nabla \\times \\mathbf{E} &= -\\frac{\\partial \\mathbf{B}}{\\partial t} & \\text{(Faraday's law)} \\\\
\\nabla \\times \\mathbf{B} &= \\mu_0 \\mathbf{J} + \\mu_0 \\epsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t} & \\text{(Ampère-Maxwell law)}
\\end{align}$$

### Fourier Transform
$$\\mathcal{F}\\{f(t)\\} = F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} dt$$

Inverse transform:
$$f(t) = \\frac{1}{2\\pi} \\int_{-\\infty}^{\\infty} F(\\omega) e^{i\\omega t} d\\omega$$

### Topology
Fundamental group of the circle:
$$\\pi_1(S^1) \\cong \\Z$$

Euler characteristic for surfaces:
$$\\chi(M) = V - E + F$$

## 🎓 Educational Features

::: info
**Learning Tip**: Mathematical expressions are interactive! Click on any formula to:
- 📋 Copy the LaTeX source
- 🔍 View the source code  
- 📏 Expand for better visibility
- 🎯 Focus for detailed examination
:::

::: warning
**Browser Compatibility**: This enhanced rendering system requires modern browsers with:
- ES2020+ JavaScript support
- CSS Grid and Flexbox
- Web Clipboard API
- CSS Custom Properties
:::

### Progressive Enhancement
The system gracefully degrades for older browsers while providing enhanced features for modern ones.

## 📈 Future Enhancements

### Planned Features
- 🤖 **AI-powered math explanation** generation
- 🎮 **Interactive math games** and puzzles
- 📱 **Mobile gesture support** for math navigation
- 🔊 **Audio descriptions** for mathematical content
- 🌍 **Multi-language** math notation support
- 💾 **Offline capability** with service workers

### Community Contributions
We welcome contributions! The system is designed to be:
- 🔧 **Extensible** through plugins
- 🎨 **Themeable** with CSS variables
- 📚 **Well-documented** with examples
- 🧪 **Test-driven** for reliability

---

**Built with ❤️ using modern web technologies**`;

  onMount(() => {
    // Simulate performance metrics
    setTimeout(() => {
      performanceMetrics = {
        renderTime: 234.5,
        mathExpressions: 47,
        interactiveElements: 23
      };
    }, 1000);
  });
</script>

<svelte:head>
  <title>Enhanced Markdown Rendering Demo</title>
  <meta name="description" content="Comprehensive demonstration of enhanced markdown rendering with advanced math support and modern UI/UX features">
</svelte:head>

<div class="demo-page">
  <!-- Header Section -->
  <header class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="gradient-text">Enhanced Markdown Rendering</span>
      </h1>
      <p class="hero-subtitle">
        Next-generation mathematical content rendering with modern UI/UX
      </p>
      
      <!-- Performance Metrics -->
      <div class="metrics-card">
        <div class="metric">
          <span class="metric-value">{performanceMetrics.renderTime}ms</span>
          <span class="metric-label">Render Time</span>
        </div>
        <div class="metric">
          <span class="metric-value">{performanceMetrics.mathExpressions}</span>
          <span class="metric-label">Math Expressions</span>
        </div>
        <div class="metric">
          <span class="metric-value">{performanceMetrics.interactiveElements}</span>
          <span class="metric-label">Interactive Elements</span>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="main-content">
    <div class="feature-showcase">
      <!-- Enhanced Renderer with all features enabled -->
      <section class="demo-section">
        <div class="section-header">
          <h2>🚀 Complete Feature Showcase</h2>
          <p>All enhanced features enabled: TOC, search, copy functionality, and auto-detection</p>
        </div>
        
        <div class="renderer-container">
          <EnhancedMarkdownRenderer 
            content={comprehensiveContent}
            type="auto"
            showToc={true}
            enableSearch={true}
            enableCopy={true}
            maxWidth="100%"
            className="showcase-content"
          />
        </div>
      </section>

      <!-- Individual Math Component Demos -->
      <section class="demo-section">
        <div class="section-header">
          <h2>🧮 Interactive Math Components</h2>
          <p>Standalone enhanced math components with full interactivity</p>
        </div>

        <div class="math-grid">
          <div class="math-card">
            <h3>Euler's Identity</h3>
            <EnhancedMathContent 
              html={`<div class="math-display">$$e^{i\\pi} + 1 = 0$$</div>`}
            />
            <p class="math-description">The most beautiful equation in mathematics</p>
          </div>

          <div class="math-card">
            <h3>Riemann Zeta Function</h3>
            <EnhancedMathContent 
              html={`<div class="math-display">$$\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\prod_p \\frac{1}{1-p^{-s}}$$</div>`}
            />
            <p class="math-description">Connects prime numbers and complex analysis</p>
          </div>

          <div class="math-card">
            <h3>Schrödinger Equation</h3>
            <EnhancedMathContent 
              html={`<div class="math-display">$$i\\hbar \\frac{\\partial}{\\partial t} |\\psi\\rangle = \\hat{H} |\\psi\\rangle$$</div>`}
            />
            <p class="math-description">Fundamental equation of quantum mechanics</p>
          </div>

          <div class="math-card">
            <h3>Machine Learning Loss</h3>
            <EnhancedMathContent 
              html={`<div class="math-display">$$\\mathcal{L}(\\theta) = \\frac{1}{n} \\sum_{i=1}^n \\ell(f(x_i; \\theta), y_i) + \\lambda \\|\\theta\\|_2^2$$</div>`}
            />
            <p class="math-description">Neural network training objective</p>
          </div>
        </div>
      </section>

      <!-- Content Type Demonstrations -->
      <section class="demo-section">
        <div class="section-header">
          <h2>📚 Content Type Specializations</h2>
          <p>Different rendering optimizations for various content types</p>
        </div>

        <div class="content-types-grid">
          <div class="content-type-demo">
            <h3>Exercise Type</h3>
            <EnhancedMarkdownRenderer 
              content={`## Complex Analysis Problem

::: exercise
Find the Laurent series expansion of $f(z) = \\frac{1}{z(z-1)}$ around $z = 0$.
:::

::: solution
We use partial fractions: $\\frac{1}{z(z-1)} = \\frac{A}{z} + \\frac{B}{z-1}$

Solving: $A = -1, B = 1$, so $f(z) = -\\frac{1}{z} + \\frac{1}{z-1}$

For $|z| < 1$: $\\frac{1}{z-1} = -\\frac{1}{1-z} = -\\sum_{n=0}^{\\infty} z^n$

Therefore: $f(z) = -\\frac{1}{z} - \\sum_{n=0}^{\\infty} z^n$
:::

::: hint
Use partial fraction decomposition first.
:::`}
              type="exercise"
              showToc={false}
              enableCopy={true}
              className="exercise-demo"
            />
          </div>

          <div class="content-type-demo">
            <h3>Math Type</h3>
            <EnhancedMarkdownRenderer 
              content={`# Calculus Theorems

## Mean Value Theorem
If $f$ is continuous on $[a,b]$ and differentiable on $(a,b)$, then:
$$\\exists c \\in (a,b): f'(c) = \\frac{f(b) - f(a)}{b - a}$$

## Fundamental Theorem
$$\\int_a^b f'(x) dx = f(b) - f(a)$$`}
              type="math"
              showToc={false}
              enableCopy={true}
              className="math-demo"
            />
          </div>
        </div>
      </section>

      <!-- Performance & Features -->
      <section class="demo-section">
        <div class="section-header">
          <h2>⚡ Performance & Accessibility</h2>
          <p>Built for speed, accessibility, and modern web standards</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h4>High Performance</h4>
            <ul>
              <li>Lazy loading of math expressions</li>
              <li>Efficient DOM manipulation</li>
              <li>Bundle optimization</li>
              <li>Smart re-rendering</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">♿</div>
            <h4>Accessibility</h4>
            <ul>
              <li>Screen reader support</li>
              <li>Keyboard navigation</li>
              <li>ARIA labels</li>
              <li>High contrast mode</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h4>Modern UI/UX</h4>
            <ul>
              <li>Dark mode support</li>
              <li>Responsive design</li>
              <li>Smooth animations</li>
              <li>Interactive elements</li>
            </ul>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🔧</div>
            <h4>Developer Experience</h4>
            <ul>
              <li>TypeScript support</li>
              <li>Component-based</li>
              <li>Extensive documentation</li>
              <li>Test coverage</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </main>
</div>

<style>
  /* Global Styles */
  .demo-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  /* Hero Section */
  .hero-section {
    padding: 4rem 2rem;
    text-align: center;
    color: white;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }

  .gradient-text {
    background: linear-gradient(135deg, #fff 0%, #f0f9ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    line-height: 1.6;
  }

  /* Metrics Card */
  .metrics-card {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .metric {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    min-width: 120px;
  }

  .metric-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #fbbf24;
  }

  .metric-label {
    font-size: 0.875rem;
    opacity: 0.8;
    margin-top: 0.25rem;
  }

  /* Main Content */
  .main-content {
    background: white;
    border-radius: 2rem 2rem 0 0;
    min-height: 100vh;
    margin-top: -1rem;
    position: relative;
    z-index: 1;
  }

  .feature-showcase {
    padding: 3rem 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Demo Sections */
  .demo-section {
    margin-bottom: 4rem;
  }

  .section-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .section-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .section-header p {
    font-size: 1.1rem;
    color: #6b7280;
    max-width: 600px;
    margin: 0 auto;
  }

  /* Renderer Container */
  .renderer-container {
    background: #f9fafb;
    border-radius: 1rem;
    padding: 2rem;
    border: 2px solid #e5e7eb;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  /* Math Grid */
  .math-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .math-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .math-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }

  .math-card h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #1f2937;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .math-description {
    margin-top: 1rem;
    color: #6b7280;
    font-style: italic;
    text-align: center;
  }

  /* Content Types Grid */
  .content-types-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 2rem;
  }

  .content-type-demo {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }

  .content-type-demo h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #1f2937;
    font-size: 1.2rem;
    font-weight: 600;
    text-align: center;
  }

  /* Features Grid */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .feature-card {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    transition: transform 0.2s ease;
  }

  .feature-card:hover {
    transform: translateY(-2px);
  }

  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .feature-card h4 {
    margin-bottom: 1rem;
    color: #1f2937;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .feature-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .feature-card li {
    padding: 0.25rem 0;
    color: #6b7280;
  }

  .feature-card li::before {
    content: "✓";
    color: #10b981;
    font-weight: bold;
    margin-right: 0.5rem;
  }

  /* Custom Styling for Demo Components */
  :global(.showcase-content) {
    border-left: 4px solid #3b82f6;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  }

  :global(.exercise-demo) {
    border-left: 4px solid #10b981;
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  }

  :global(.math-demo) {
    border-left: 4px solid #8b5cf6;
    background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  }

  :global(.demo-math) {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  /* Dark Mode Support */
  @media (prefers-color-scheme: dark) {
    .demo-page {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
    }

    .main-content {
      background: #0f172a;
      color: #f1f5f9;
    }

    .section-header h2 {
      color: #f1f5f9;
    }

    .section-header p {
      color: #94a3b8;
    }

    .renderer-container,
    .math-card,
    .content-type-demo,
    .feature-card {
      background: #1e293b;
      border-color: #334155;
      color: #f1f5f9;
    }

    .math-card h3,
    .content-type-demo h3,
    .feature-card h4 {
      color: #f1f5f9;
    }

    .math-description {
      color: #94a3b8;
    }

    .feature-card li {
      color: #94a3b8;
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .hero-section {
      padding: 2rem 1rem;
    }

    .feature-showcase {
      padding: 2rem 1rem;
    }

    .metrics-card {
      gap: 1rem;
    }

    .metric {
      min-width: 100px;
      padding: 0.75rem;
    }

    .renderer-container {
      padding: 1rem;
    }

    .math-grid,
    .content-types-grid {
      grid-template-columns: 1fr;
    }

    .math-card,
    .content-type-demo {
      padding: 1rem;
    }
  }

  /* Animation for performance metrics */
  .metric-value {
    animation: countUp 1s ease-out forwards;
  }

  @keyframes countUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Print Styles */
  @media print {
    .hero-section,
    .metrics-card,
    .feature-card {
      display: none;
    }

    .main-content {
      background: white;
      color: black;
    }

    .demo-section {
      break-inside: avoid;
    }
  }
</style>
