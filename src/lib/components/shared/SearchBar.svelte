<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';

  export let placeholder = 'Search...';
  export let value = '';
  export let className = '';

  const dispatch = createEventDispatcher<{ search: string }>();

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    dispatch('search', value);
  }
</script>

<div class="relative {className}">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <Icon icon="mdi:magnify" class="h-5 w-5 text-gray-400" />
  </div>
  <input
    type="text"
    {value}
    {placeholder}
    on:input={handleInput}
    class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm"
  />
</div> 