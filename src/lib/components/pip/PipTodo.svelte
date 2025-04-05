<script lang="ts">
  import { todos } from '$lib/stores/pipStores';
  // TODO: Implement todo logic
</script>

<div class="text-sm">
  <p>Todo Component</p>
  <input type="text" placeholder="New todo..." class="w-full p-1 border rounded text-xs mb-2">
  <ul class="list-disc pl-4">
    {#each $todos as todo (todo.id)}
      <li>{todo.text}</li>
    {/each}
  </ul>
  {#if $todos.length === 0}
    <p class="text-gray-500 text-xs italic">No todos yet.</p>
  {/if}
</div>
