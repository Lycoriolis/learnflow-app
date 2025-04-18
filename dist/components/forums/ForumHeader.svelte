<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  function onNewTopic() {
    dispatch('newTopic');
  }
  function onToggleSubscriptions() {
    dispatch('toggleSubscriptions');
  }
</script>

<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
  <div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Community Forums</h1>
    <p class="text-gray-600 dark:text-gray-400">Discuss courses, ask questions, and connect with other learners</p>
  </div>
  <div class="mt-4 md:mt-0 flex space-x-2">
    <button
      class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium flex items-center"
      on:click={onNewTopic}
    >
      <i class="fas fa-plus mr-2"></i>
      New Topic
    </button>
    <button
      class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm font-medium flex items-center"
      on:click={onToggleSubscriptions}
    >
      <i class="fas fa-bell mr-2"></i>
      My Subscriptions
    </button>
  </div>
</div>  <!-- Close outer wrapper div -->