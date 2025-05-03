<script lang="ts">
  import { onMount } from 'svelte';
  import katex from 'katex';
  import 'katex/dist/katex.min.css';

  export let content: string = '';
  export let displayMode: boolean = false;

  let element: HTMLElement;

  onMount(() => {
    renderMath();
  });

  $: if (content) {
    if (element) {
      renderMath();
    }
  }

  function renderMath() {
    try {
      katex.render(content, element, {
        displayMode: displayMode,
        throwOnError: false,
        trust: true
      });
    } catch (e) {
      console.error('KaTeX rendering error:', e);
      element.textContent = content;
    }
  }
</script>

<span bind:this={element} class={displayMode ? 'math-block' : 'math-inline'}></span>

<style>
  .math-block {
    display: block;
    margin: 1em 0;
    text-align: center;
  }

  .math-inline {
    display: inline-block;
    vertical-align: middle;
  }
</style>
