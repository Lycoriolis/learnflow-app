<script lang="ts">
  import MarkdownRenderer from './MarkdownRenderer.svelte';
  
  export let content: string = '';
</script>

<MarkdownRenderer {content} className="content-component" />

<style>
  /* Additional styles specific to this implementation */
  :global(.content-component) {
    padding: 1rem 0;
  }
</style>