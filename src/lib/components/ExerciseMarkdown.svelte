<script lang="ts">
  import MarkdownRenderer from './MarkdownRendererComponent.svelte';
  import MathContent from './MathContent.svelte';
  import { browser } from '$app/environment';
  
  export let content: string = '';
  export let markdown: string = '';
  
  // Use content prop if provided, otherwise use markdown prop (for compatibility)
  $: sourceContent = content || markdown;
  
  // Process any special exercise-specific markdown features
  $: processedMarkdown = processMathAndCode(sourceContent);
  
  function processMathAndCode(text: string): string {
    if (!text) return '';
    
    try {
      // Process math expressions
      let processed = text.replace(/\$\$(.*?)\$\$/g, (match, p1) => {
        return `<div class="math-block">${p1}</div>`;
      });
      
      processed = processed.replace(/\$(.*?)\$/g, (match, p1) => {
        return `<span class="math-inline">${p1}</span>`;
      });
      
      // Add special formatting for code exercises
      processed = processed.replace(/```exercise([\s\S]*?)```/g, (match, p1) => {
        return `<div class="code-exercise-container">\n\`\`\`${p1}\`\`\`\n</div>`;
      });
      
      return processed;
    } catch (error) {
      console.error('Error processing markdown:', error);
      return text; // Return original text if processing fails
    }
  }
</script>

<div class="exercise-markdown">
  {#if browser || processedMarkdown}
    <MarkdownRenderer content={processedMarkdown} />
  {:else}
    <div class="loading">Loading exercise content...</div>
  {/if}
</div>

<style>
  .loading {
    padding: 1rem;
    color: #6b7280;
    font-style: italic;
  }

  .exercise-markdown :global(.code-exercise-container) {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1.5rem 0;
    background-color: #f9fafb;
  }
  
  /* Dark mode */
  :global(.dark) .exercise-markdown :global(.code-exercise-container) {
    background-color: #1f2937;
    border-color: #374151;
  }
  
  .exercise-markdown :global(.math-block),
  .exercise-markdown :global(.math-inline) {
    font-family: 'Cambria Math', 'STIX Two Math', serif;
  }
</style>