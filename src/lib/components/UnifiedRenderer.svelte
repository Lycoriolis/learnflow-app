<script lang="ts">
  import MarkdownRenderer from './MarkdownRendererComponent.svelte';
  import MathContent from './MathContent.svelte';

  export let content: string = '';
  export let type: 'markdown' | 'exercise' | 'math' | 'auto' = 'auto';
  
  // Auto-detect content type if not specified
  $: contentType = type === 'auto' ? detectContentType(content) : type;
  
  function detectContentType(text: string): 'markdown' | 'exercise' | 'math' {
    // Check if content contains math expressions
    if (text.includes('$$') || text.includes('\\begin{') || text.match(/\$[^$]+\$/)) {
      return 'math';
    }
    
    // Check if content looks like an exercise
    if (text.match(/^##\s+(Problem|Exercise|Solution)/mi)) {
      return 'exercise';
    }
    
    // Default to regular markdown
    return 'markdown';
  }
  
  // Pre-process content for special formatting when using exercise type
  $: processedContent = contentType === 'exercise' ? processExerciseContent(content) : content;
  
  function processExerciseContent(text: string): string {
    if (!text) return '';
    
    try {
      // Add special formatting for code exercises
      let processed = text.replace(/```exercise([\s\S]*?)```/g, (match, p1) => {
        return `<div class="code-exercise-container">\n\`\`\`${p1}\`\`\`\n</div>`;
      });
      
      // Add special styling for key concept boxes
      processed = processed.replace(/:::key-concept([\s\S]*?):::/g, (match, content) => {
        return `<div class="key-concept-box">${content}</div>`;
      });
      
      // Add special styling for examples
      processed = processed.replace(/:::example([\s\S]*?):::/g, (match, content) => {
        return `<div class="example-box">${content}</div>`;
      });
      
      return processed;
    } catch (error) {
      console.error('Error processing markdown:', error);
      return text;
    }
  }
</script>

<div class={contentType === 'exercise' ? 'exercise-markdown' : ''}>
  {#if contentType === 'math'}
    <MathContent content={content} />
  {:else}
    <!-- Use MarkdownRenderer for both regular markdown and processed exercise content -->
    <MarkdownRenderer content={processedContent} />
  {/if}
</div>

<style>
  /* Exercise-specific styling */
  .exercise-markdown :global(.code-exercise-container) {
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin: 2rem 0;
    background-color: #f9fafb;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  /* Dark mode */
  :global(.dark) .exercise-markdown :global(.code-exercise-container) {
    background-color: #1f2937;
    border-color: #374151;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  }
  
  .exercise-markdown :global(.key-concept-box) {
    background-color: rgba(79, 70, 229, 0.1);
    border-left: 4px solid #4f46e5;
    padding: 1.5rem;
    margin: 2rem 0;
    border-radius: 0.5rem;
  }
  
  :global(.dark) .exercise-markdown :global(.key-concept-box) {
    background-color: rgba(79, 70, 229, 0.05);
  }
  
  .exercise-markdown :global(.example-box) {
    background-color: rgba(16, 185, 129, 0.1);
    border-left: 4px solid #10b981;
    padding: 1.5rem;
    margin: 2rem 0;
    border-radius: 0.5rem;
  }
  
  :global(.dark) .exercise-markdown :global(.example-box) {
    background-color: rgba(16, 185, 129, 0.05);
  }
  
  /* Improve math rendering */
  .exercise-markdown :global(.katex-display) {
    background-color: rgba(243, 244, 246, 0.5);
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1.5rem 0;
    overflow-x: auto;
  }
  
  :global(.dark) .exercise-markdown :global(.katex-display) {
    background-color: rgba(31, 41, 55, 0.5);
  }
</style>
