<script lang="ts">
  import { onMount } from 'svelte';
  import { loadCategories } from '$lib/stores/forumStore';
  import CreateTopicForm from '$lib/components/forums/CreateTopicForm.svelte';
  import Icon from '@iconify/svelte';
</script>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-3xl mx-auto">
    <div class="mb-6">
      <a href="/forums" class="inline-flex items-center text-cherry-600 dark:text-cherry-400 hover:underline mb-4">
        <Icon icon="mdi:arrow-left" class="w-5 h-5 mr-1" />
        Back to Forums
      </a>
      
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create New Topic</h1>
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <CreateTopicForm />
    </div>
  </div>
</div>
