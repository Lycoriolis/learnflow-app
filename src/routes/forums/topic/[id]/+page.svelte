<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import ForumTopic from '$lib/components/forums/ForumTopic.svelte';
  
  const topicId = $page.params.id;
</script>

<div class="container mx-auto px-4 py-8">
  <ForumTopic {topicId} />
</div>

<style>
  /* Add any component-specific styles here */
</style>