<script lang="ts">
  import MarkdownRenderer from '../../shared/MarkdownRenderer.svelte';
  import MathContent from '../../shared/MathContent.svelte';
  
  export let markdown: string = '';
  
  // Process any special exercise-specific markdown features
  let processedMarkdown = markdown;
  
  // Look for code exercise placeholders and format them
  $: processedMarkdown = processMathAndCode(markdown);
  
  function processMathAndCode(text: string): string {
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
  }
</script>

<div class="exercise-markdown">
  <MarkdownRenderer content={processedMarkdown} />
</div>

<style>
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