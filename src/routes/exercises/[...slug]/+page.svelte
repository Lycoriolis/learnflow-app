<script lang="ts">
  import { page } from '$app/stores';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import { marked } from 'marked';
  import markedKatexExtension from 'marked-katex-extension'; // Changed import

  export let data;

  let exerciseTitle = '';
  let exerciseDescription = '';
  let contentHtml = '';
  let breadcrumbItems = [];
  let errorMessage = null;
  let isLoading = true;

  // Initialize marked with KaTeX extension
  marked.use(markedKatexExtension({ throwOnError: false, output: 'html' })); // Changed usage

  // Reactive block to update variables when `data` or `page` store changes
  $: {
    if ($page.data.error) {
      errorMessage = $page.data.error.message || 'Failed to load exercise.';
      isLoading = false;
    } else if (data && data.exercise) {
      exerciseTitle = data.exercise.frontmatter?.title || data.exercise.title || 'Exercise';
      exerciseDescription = data.exercise.frontmatter?.description || '';
      
      if (data.exercise.rawMdxContent) {
        try {
          contentHtml = marked.parse(data.exercise.rawMdxContent) as string;
        } catch (e) {
          console.error("Error parsing markdown for exercise:", e);
          contentHtml = "<p>Error rendering content.</p>";
        }
      } else {
        contentHtml = "<p><em>No content available for this exercise.</em></p>";
      }
      isLoading = false;
      errorMessage = null;
    } else {
      // Still loading or data.exercise is null without an error explicitly set in $page.data.error
      isLoading = true; 
      errorMessage = null; // Clear previous errors if any
    }

    // Update breadcrumbs reactively
    const baseBreadcrumbs = [
      { label: 'Accueil', href: '/' },
      { label: 'Exercices', href: '/exercises' },
    ];
    if (exerciseTitle && !isLoading && !errorMessage) {
      breadcrumbItems = [...baseBreadcrumbs, { label: exerciseTitle, href: $page.url.pathname, active: true }];
    } else {
      breadcrumbItems = [...baseBreadcrumbs, { label: 'Exercice', href: $page.url.pathname, active: true }];
    }
  }
</script>

<div>
  <Breadcrumbs items={breadcrumbItems} />

  {#if isLoading}
    <div>
      <p>Loading exercise...</p>
    </div>
  {:else if errorMessage}
    <div>
      <p><strong>Error:</strong> {errorMessage}</p>
    </div>
  {:else if data && data.exercise}
    <article>
      <h1>{exerciseTitle}</h1>
      {#if exerciseDescription}
        <p>{exerciseDescription}</p>
      {/if}
      {@html contentHtml}
    </article>
  {:else}
    <div>
      <p>Exercise not found or an unexpected error occurred.</p>
       <p>Slug: {$page.params.slug}</p>
    </div>
  {/if}
</div>

<!-- Styles removed for debugging -->
