<script lang="ts">
  import ForumTopic from '$lib/components/forums/ForumTopic.svelte';
  export let data: any;  // data.topic, data.posts loaded by +page.server.ts
  let topic = data.topic;
  // let posts = data.posts; // Removed as ForumTopic fetches its own posts
</script>

<!-- Render topic detail and replies via ForumTopic component -->
<ForumTopic {topic} />

<style>
  /* Add any component-specific styles here */
  :global(.loader) {
    border: 4px solid #f3f3f3; /* Light grey */
    border-top: 4px solid #4f46e5; /* Indigo */
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>