<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Icon from '@iconify/svelte';

  export let options: string[] = [];
  export let selected: string | null = null;
  export let placeholder = 'Select...';
  export let className = '';

  const dispatch = createEventDispatcher<{ change: string | null }>();

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value === '' ? null : target.value;
    dispatch('change', value);
  }
</script>

<div class="relative {className}">
  <select
    value={selected || ''}
    on:change={handleChange}
    class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
  >
    <option value="">{placeholder}</option>
    {#each options as option}
      <option value={option}>{option}</option>
    {/each}
  </select>
  <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
    <Icon icon="mdi:chevron-down" class="h-5 w-5 text-gray-400" />
  </div>
</div> 