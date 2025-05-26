<!-- Optimized Exercise Renderer for Mathematical Content -->
<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import { browser } from '$app/environment';
    import { optimizeExerciseMarkdown } from '$lib/utils/markdownOptimizer';
    
    export let content: string = '';
    export let className: string = '';
    export let enableMathRendering: boolean = true;
    export let enableInteractivity: boolean = true;
    
    let containerElement: HTMLElement;
    let renderedHtml: string = '';
    let isLoading = true;
    let error: string | null = null;
    let isKaTeXLoaded = false;
    
    // Load KaTeX dynamically for math rendering
    async function loadKaTeX() {
        if (typeof window !== 'undefined' && !window.katex && enableMathRendering) {
            try {
                // Load KaTeX CSS
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
                document.head.appendChild(link);
                
                // Load KaTeX JS
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js';
                script.onload = () => {
                    // Load auto-render extension
                    const autoRenderScript = document.createElement('script');
                    autoRenderScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js';
                    autoRenderScript.onload = () => {
                        isKaTeXLoaded = true;
                        renderContent();
                    };
                    document.head.appendChild(autoRenderScript);
                };
                document.head.appendChild(script);
            } catch (err) {
                console.error('Failed to load KaTeX:', err);
                isKaTeXLoaded = false;
                renderContent();
            }
        } else {
            isKaTeXLoaded = !!window.katex || !enableMathRendering;
            renderContent();
        }
    }
    
    function renderMarkdown(text: string): string {
        if (!text) return '';
        
        return text
            // Handle headers with proper spacing
            .replace(/^### (.*$)/gm, '<h3 class="exercise-h3">$1</h3>')
            .replace(/^## (.*$)/gm, '<h2 class="exercise-h2">$1</h2>')
            .replace(/^# (.*$)/gm, '<h1 class="exercise-h1">$1</h1>')
            
            // Handle numbered lists with proper spacing
            .replace(/^\d+\.\s+(.*)$/gm, '<div class="exercise-item"><span class="item-number">$&</span></div>')
            
            // Handle math blocks with better formatting
            .replace(/\$\$([\s\S]*?)\$\$/g, '<div class="math-block">$$1$$</div>')
            .replace(/\$(.*?)\$/g, '<span class="math-inline">$1</span>')
            
            // Handle code blocks
            .replace(/```(\w*)\n([\s\S]*?)```/gm, '<pre class="code-block language-$1"><code>$2</code></pre>')
            .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
            
            // Handle emphasis and strong
            .replace(/\*\*(.*?)\*\*/g, '<strong class="exercise-strong">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="exercise-em">$1</em>')
            
            // Handle links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="exercise-link" target="_blank" rel="noopener noreferrer">$1</a>')
            
            // Handle system of equations
            .replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, '<div class="equation-system">\\begin{cases}$1\\end{cases}</div>')
            
            // Handle paragraphs with proper spacing
            .replace(/\n\n/g, '</p><p class="exercise-paragraph">')
            .replace(/^(?!<[h1-6]|<div|<pre|<ul|<ol|<blockquote)(.+)$/gm, '<p class="exercise-paragraph">$1</p>')
            
            // Clean up empty paragraphs
            .replace(/<p class="exercise-paragraph"><\/p>/g, '')
            .replace(/<p class="exercise-paragraph">(<[^>]+>)/g, '$1');
    }
    
    async function renderContent() {
        if (!content.trim()) {
            renderedHtml = '';
            isLoading = false;
            return;
        }
        
        try {
            isLoading = true;
            error = null;
            
            // First optimize the content to fix spacing and formatting issues
            const optimizedContent = optimizeExerciseMarkdown(content, {
                fixSpacing: true,
                optimizeHeaders: true,
                enhanceMath: true,
                improveCodeBlocks: true,
                structureExercises: true
            });
            
            // Then render markdown
            renderedHtml = renderMarkdown(optimizedContent);
            
            // Process exercise items after markdown rendering
            renderedHtml = processExerciseItems(renderedHtml);
            
            isLoading = false;
            
            // Render math after DOM update
            if (enableMathRendering && isKaTeXLoaded && browser) {
                await new Promise(resolve => setTimeout(resolve, 100));
                renderMath();
            }
        } catch (err) {
            console.error('Content rendering error:', err);
            error = err instanceof Error ? err.message : 'Unknown rendering error';
            renderedHtml = `<div class="error-message">
                <p><strong>Error rendering content:</strong></p>
                <pre>${error}</pre>
            </div>`;
            isLoading = false;
        }
    }
    
    function processExerciseItems(html: string): string {
        // Convert numbered exercise items to proper structure
        return html.replace(
            /<div class="exercise-item"><span class="item-number">(\d+)\.\s+(.*?)<\/span><\/div>/g,
            '<div class="exercise-item"><div class="item-header"><span class="item-number">$1.</span></div><div class="item-content">$2</div></div>'
        );
    }
    
    function renderMath() {
        if (!containerElement || !window.katex || !window.renderMathInElement) return;
        
        try {
            window.renderMathInElement(containerElement, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false,
                errorColor: '#cc0000',
                strict: false,
                trust: true,
                macros: {
                    "\\mathbb": "\\mathbb",
                    "\\llbracket": "\\llbracket",
                    "\\rrbracket": "\\rrbracket",
                    "\\pmod": "\\pmod",
                    "\\equiv": "\\equiv",
                    "\\begin": "\\begin",
                    "\\end": "\\end",
                    "\\cases": "\\cases"
                }
            });
        } catch (err) {
            console.error('Math rendering error:', err);
        }
    }
    
    function setupInteractivity() {
        if (!containerElement || !enableInteractivity) return;
        
        // Add copy buttons to code blocks
        const codeBlocks = containerElement.querySelectorAll('pre.code-block');
        codeBlocks.forEach((block) => {
            const copyButton = document.createElement('button');
            copyButton.innerHTML = `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
            `;
            copyButton.className = 'copy-button';
            copyButton.title = 'Copy code';
            copyButton.onclick = async () => {
                const code = block.querySelector('code');
                if (code) {
                    try {
                        await navigator.clipboard.writeText(code.textContent || '');
                        copyButton.innerHTML = `
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        `;
                        setTimeout(() => {
                            copyButton.innerHTML = `
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                            `;
                        }, 2000);
                    } catch (err) {
                        console.error('Failed to copy:', err);
                    }
                }
            };
            block.appendChild(copyButton);
        });
        
        // Make exercise items interactive
        const exerciseItems = containerElement.querySelectorAll('.exercise-item');
        exerciseItems.forEach((item, index) => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `Exercise item ${index + 1}`);
            
            // Add focus styles
            item.addEventListener('focus', () => {
                item.classList.add('focused');
            });
            
            item.addEventListener('blur', () => {
                item.classList.remove('focused');
            });
        });
    }
    
    onMount(() => {
        if (browser) {
            loadKaTeX();
        }
    });
    
    afterUpdate(() => {
        if (browser && containerElement && renderedHtml) {
            setTimeout(() => {
                renderMath();
                setupInteractivity();
            }, 100);
        }
    });
    
    // Watch for content changes
    $: if (content && browser) {
        renderContent();
    }
</script>

<div 
    bind:this={containerElement}
    class="optimized-exercise-renderer {className}"
    class:loading={isLoading}
>
    {#if isLoading}
        <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <span class="loading-text">Rendering exercise content...</span>
        </div>
    {:else if error}
        <div class="error-container">
            <div class="error-icon">⚠️</div>
            <div>
                <h3 class="error-title">Rendering Error</h3>
                <p class="error-message">{error}</p>
            </div>
        </div>
    {:else}
        <div class="exercise-content">
            {@html renderedHtml}
        </div>
    {/if}
</div>

<style>
    .optimized-exercise-renderer {
        /* Base typography optimized for mathematical content */
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        width: 100%;
        max-width: 100%;
        line-height: 1.6;
        color: #1f2937;
        word-wrap: break-word;
    }
    
    /* Ensure full width content */
    .exercise-content {
        width: 100%;
        max-width: none;
        line-height: 1.7;
    }
    
    .optimized-exercise-renderer.loading {
        opacity: 0.6;
    }
    
    /* Loading indicator */
    .loading-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3rem 1rem;
        flex-direction: column;
        gap: 1rem;
    }
    
    .loading-spinner {
        width: 2rem;
        height: 2rem;
        border: 3px solid #e2e8f0;
        border-top: 3px solid #3182ce;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    .loading-text {
        color: #4a5568;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Error styling */
    .error-container {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem;
        background-color: #fed7d7;
        border: 1px solid #fc8181;
        border-radius: 0.5rem;
        color: #742a2a;
    }
    
    .error-icon {
        font-size: 1.25rem;
        flex-shrink: 0;
    }
    
    .error-title {
        font-weight: 600;
        margin: 0 0 0.25rem 0;
        font-size: 0.875rem;
    }
    
    .error-message {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.8;
    }
    
    /* Exercise content styling */
    .exercise-content {
        padding: 0;
    }
    
    /* Headers with optimized spacing */
    .exercise-content :global(.exercise-h1) {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 1.5rem 0;
        padding-bottom: 0.75rem;
        border-bottom: 2px solid #e2e8f0;
        color: #1a202c;
        line-height: 1.2;
    }
    
    .exercise-content :global(.exercise-h2) {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 2rem 0 1rem 0;
        color: #2d3748;
        line-height: 1.3;
        position: relative;
        padding-left: 0.75rem;
    }
    
    .exercise-content :global(.exercise-h2::before) {
        content: '';
        position: absolute;
        left: 0;
        top: 0.125rem;
        width: 4px;
        height: 1.25rem;
        background: linear-gradient(135deg, #3182ce, #2b6cb0);
        border-radius: 2px;
    }
    
    .exercise-content :global(.exercise-h3) {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 1.5rem 0 0.75rem 0;
        color: #4a5568;
        line-height: 1.4;
    }
    
    /* Paragraphs with proper spacing */
    .exercise-content :global(.exercise-paragraph) {
        margin: 0 0 1rem 0;
        line-height: 1.7;
        color: #2d3748;
    }
    
    /* Exercise items with enhanced styling */
    .exercise-content :global(.exercise-item) {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        margin: 1rem 0;
        padding: 1rem;
        background-color: #f7fafc;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        transition: all 0.2s ease;
        position: relative;
    }
    
    .exercise-content :global(.exercise-item:hover) {
        background-color: #edf2f7;
        border-color: #cbd5e0;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .exercise-content :global(.exercise-item.focused) {
        outline: 2px solid #3182ce;
        outline-offset: 2px;
    }
    
    .exercise-content :global(.item-header) {
        flex-shrink: 0;
    }
    
    .exercise-content :global(.item-number) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 2rem;
        height: 2rem;
        background: linear-gradient(135deg, #3182ce, #2b6cb0);
        color: white;
        font-weight: 600;
        font-size: 0.875rem;
        border-radius: 50%;
        margin-right: 0.5rem;
    }
    
    .exercise-content :global(.item-content) {
        flex: 1;
        line-height: 1.6;
        color: #2d3748;
    }
    
    /* Math content styling */
    .exercise-content :global(.math-block) {
        margin: 1.5rem 0;
        padding: 1rem;
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        text-align: center;
        overflow-x: auto;
    }
    
    .exercise-content :global(.math-inline) {
        background-color: rgba(226, 232, 240, 0.3);
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        font-family: 'KaTeX_Math', 'Times New Roman', serif;
    }
    
    .exercise-content :global(.equation-system) {
        margin: 1.5rem 0;
        padding: 1.5rem;
        background-color: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 0.75rem;
        text-align: center;
        position: relative;
    }
    
    .exercise-content :global(.equation-system::before) {
        content: 'System of Equations';
        position: absolute;
        top: -0.5rem;
        left: 1rem;
        background-color: white;
        padding: 0 0.5rem;
        font-size: 0.75rem;
        font-weight: 600;
        color: #4a5568;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    /* Code styling */
    .exercise-content :global(.code-block) {
        position: relative;
        background-color: #1a202c;
        color: #e2e8f0;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
        overflow-x: auto;
        font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
        font-size: 0.875rem;
        line-height: 1.5;
    }
    
    .exercise-content :global(.inline-code) {
        background-color: #edf2f7;
        color: #2d3748;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .exercise-content :global(.copy-button) {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background-color: #4a5568;
        color: white;
        border: none;
        border-radius: 0.25rem;
        padding: 0.25rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .exercise-content :global(.code-block:hover .copy-button) {
        opacity: 1;
    }
    
    .exercise-content :global(.copy-button:hover) {
        background-color: #2d3748;
    }
    
    /* Text styling */
    .exercise-content :global(.exercise-strong) {
        font-weight: 600;
        color: #1a202c;
    }
    
    .exercise-content :global(.exercise-em) {
        font-style: italic;
        color: #4a5568;
    }
    
    .exercise-content :global(.exercise-link) {
        color: #3182ce;
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: all 0.2s ease;
    }
    
    .exercise-content :global(.exercise-link:hover) {
        color: #2c5282;
        border-bottom-color: #3182ce;
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
        .optimized-exercise-renderer {
            color: #e2e8f0;
        }
        
        .exercise-content :global(.exercise-h1),
        .exercise-content :global(.exercise-h2) {
            color: #f7fafc;
        }
        
        .exercise-content :global(.exercise-h3) {
            color: #e2e8f0;
        }
        
        .exercise-content :global(.exercise-paragraph),
        .exercise-content :global(.item-content) {
            color: #cbd5e0;
        }
        
        .exercise-content :global(.exercise-item) {
            background-color: #2d3748;
            border-color: #4a5568;
        }
        
        .exercise-content :global(.exercise-item:hover) {
            background-color: #374151;
            border-color: #6b7280;
        }
        
        .exercise-content :global(.math-block),
        .exercise-content :global(.equation-system) {
            background-color: #2d3748;
            border-color: #4a5568;
        }
        
        .exercise-content :global(.math-inline) {
            background-color: rgba(74, 85, 104, 0.3);
        }
        
        .exercise-content :global(.inline-code) {
            background-color: #374151;
            color: #e2e8f0;
        }
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .exercise-content :global(.exercise-h1) {
            font-size: 1.75rem;
        }
        
        .exercise-content :global(.exercise-h2) {
            font-size: 1.375rem;
        }
        
        .exercise-content :global(.exercise-h3) {
            font-size: 1.125rem;
        }
        
        .exercise-content :global(.exercise-item) {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .exercise-content :global(.item-header) {
            align-self: flex-start;
        }
        
        .exercise-content :global(.math-block),
        .exercise-content :global(.equation-system) {
            padding: 0.75rem;
            font-size: 0.875rem;
        }
        
        .exercise-content :global(.code-block) {
            padding: 0.75rem;
            font-size: 0.8rem;
        }
    }
    
    /* Print styles */
    @media print {
        .exercise-content :global(.copy-button) {
            display: none !important;
        }
        
        .exercise-content :global(.exercise-item) {
            background-color: transparent !important;
            border: 1px solid #ccc !important;
            break-inside: avoid;
        }
        
        .exercise-content :global(.math-block),
        .exercise-content :global(.equation-system) {
            background-color: transparent !important;
            border: 1px solid #ccc !important;
        }
    }
</style>
