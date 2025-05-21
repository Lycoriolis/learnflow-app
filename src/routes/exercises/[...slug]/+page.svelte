<script lang="ts">
  import { page } from '$app/stores';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import UnifiedRenderer from '$lib/components/UnifiedRenderer.svelte';

  export let data;

  let exerciseTitle = '';
  let exerciseDescription = '';
  let breadcrumbItems = [];
  let errorMessage = null;
  let isLoading = true;

  $: {
    if ($page.data.error) {
      errorMessage = $page.data.error.message || 'Failed to load exercise.';
      isLoading = false;
    } else if (data && data.exercise) {
      exerciseTitle = data.exercise.frontmatter?.title || data.exercise.title || 'Exercise';
      exerciseDescription = data.exercise.frontmatter?.description || '';
      isLoading = false;
      errorMessage = null;
    } else {
      isLoading = true; 
      errorMessage = null;
    }

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
      {#if data.exercise.rawMdxContent}
        <UnifiedRenderer content={data.exercise.rawMdxContent} type="exercise" />
      {:else}
        <p><em>No content available for this exercise.</em></p>
      {/if}
    </article>
  {:else}
    <div>
      <p>Exercise not found or an unexpected error occurred.</p>
      <p>Slug: {$page.params.slug}</p>
    </div>
  {/if}
</div>
