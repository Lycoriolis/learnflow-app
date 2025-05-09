<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { logStart, logEnd, logEvent } from '$lib/services/activityService';

  const tools = [
    { name: 'Pomodoro Timer', path: '/tools/pomodoro', icon: 'fa-clock' },
    { name: 'Notepad', path: '/tools/notepad', icon: 'fa-sticky-note' },
    { name: 'Tasks', path: '/tools/tasks', icon: 'fa-list-check' },
    { name: 'AI Study Chat', path: '/tools/chat', icon: 'fa-robot' },
    { name: 'Flashcards', path: '/tools/flashcards', icon: 'fa-layer-group' },
    { name: 'Calculator', path: '/tools/calculator', icon: 'fa-calculator' },
    { name: 'Dictionary', path: '/tools/dictionary', icon: 'fa-book' }
  ];

  let toolsViewId: string | null = null;

  onMount(async () => {
    toolsViewId = await logStart('view_tools', 'toolsOverview');
  });
  onDestroy(() => {
    if (toolsViewId) logEnd(toolsViewId);
  });

  function selectTool(path: string) {
    logEvent('view_tool', path);
  }
</script>

<svelte:head>
  <title>Productivity Tools | LearnFlow</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-10">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Productivity & Focus Tools</h1>
  <p class="text-gray-600 dark:text-gray-300 mb-8">Boost your study sessions with these integrated tools.</p>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {#each tools as tool}
      <a href={tool.path} on:click={() => selectTool(tool.path)} class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center space-x-4 hover:shadow-lg transition">
        <i class={`fas ${tool.icon} text-3xl text-indigo-500`}></i>
        <span class="text-lg font-medium text-gray-900 dark:text-white">{tool.name}</span>
      </a>
    {/each}
  </div>
</div>
